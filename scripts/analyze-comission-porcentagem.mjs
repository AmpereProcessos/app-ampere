/**
 * Analisa como `comissoes.comissionados[].porcentagem` está gravado no Mongo.
 * Uso: node scripts/analyze-comission-porcentagem.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
	const envPath = resolve(root, ".env");
	if (!existsSync(envPath)) return;
	for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) process.env[key] = value;
	}
}

loadEnv();

const uri = process.env.DB_KEY;
if (!uri) {
	console.error("DB_KEY não encontrada no .env");
	process.exit(1);
}

const TOLERANCE = 0.05;

function classifyPorcentagem(porcentagem, valor, base) {
	if (porcentagem == null || Number.isNaN(Number(porcentagem))) return "invalid";
	const p = Number(porcentagem);
	if (p === 0) return "zero";

	if (!base || base <= 0) {
		if (p > 0 && p < 1) return "likely_fraction_no_base";
		if (p >= 1) return "likely_percent_points_no_base";
		return "unknown_no_base";
	}

	const v = valor != null && !Number.isNaN(Number(valor)) ? Number(valor) : null;
	const impliedPercent = v != null ? (v / base) * 100 : null;

	if (impliedPercent != null) {
		if (Math.abs(p - impliedPercent) <= TOLERANCE) return "percent_points";
		if (Math.abs(p * 100 - impliedPercent) <= TOLERANCE) return "decimal_fraction";
		if (Math.abs(p * base - v) <= 1) return "decimal_fraction";
		if (Math.abs((p / 100) * base - v) <= 1) return "percent_points";
	}

	if (p > 0 && p < 1) return "heuristic_fraction";
	if (p >= 1 && p <= 100) return "heuristic_percent_points";
	if (p > 100) return "heuristic_over_100";
	return "ambiguous";
}

function bucketRaw(p) {
	if (p == null || Number.isNaN(Number(p))) return "null";
	const n = Number(p);
	if (n === 0) return "0";
	if (n > 0 && n < 1) return "0 < p < 1";
	if (n >= 1 && n <= 100) return "1 <= p <= 100";
	if (n > 100) return "p > 100";
	if (n < 0) return "p < 0";
	return "other";
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db("projetos");
const collection = db.collection("dados");

const cursor = collection.find(
	{ "comissoes.comissionados.0": { $exists: true } },
	{
		projection: {
			_id: 1,
			nome: 1,
			identificadorApp: 1,
			"comissoes.valorComissionavel": 1,
			"comissoes.comissionados": 1,
		},
	},
);

const counts = {};
const rawBuckets = {};
const mismatchExamples = [];
let projectCount = 0;
let rowCount = 0;
let rowsWithBase = 0;
let inconsistentRows = 0;
let nonZeroRows = 0;
let nonZeroRawLt1 = 0;
let nonZeroRawGte1 = 0;
let matchesPercentPoints = 0;
let matchesDecimalFraction = 0;
let comparableWithBaseAndValor = 0;

for await (const project of cursor) {
	projectCount += 1;
	const base = project.comissoes?.valorComissionavel ?? 0;
	const comissionados = project.comissoes?.comissionados ?? [];

	for (const row of comissionados) {
		rowCount += 1;
		const kind = classifyPorcentagem(row.porcentagem, row.valor, base);
		counts[kind] = (counts[kind] || 0) + 1;

		const bucket = bucketRaw(row.porcentagem);
		rawBuckets[bucket] = (rawBuckets[bucket] || 0) + 1;

		const pForNonZero = Number(row.porcentagem);
		if (pForNonZero > 0) {
			nonZeroRows += 1;
			if (pForNonZero < 1) nonZeroRawLt1 += 1;
			else if (pForNonZero <= 100) nonZeroRawGte1 += 1;
			if (base > 0 && row.valor != null && !Number.isNaN(Number(row.valor))) {
				comparableWithBaseAndValor += 1;
				const v = Number(row.valor);
				const implied = (v / base) * 100;
				if (Math.abs(pForNonZero - implied) <= TOLERANCE) matchesPercentPoints += 1;
				else if (Math.abs(pForNonZero * 100 - implied) <= TOLERANCE) matchesDecimalFraction += 1;
			}
		}

		if (base > 0) {
			rowsWithBase += 1;
			const p = Number(row.porcentagem);
			const v = row.valor != null ? Number(row.valor) : null;
			if (v != null && p > 0) {
				const asPoints = Math.abs((p / 100) * base - v) <= 1;
				const asFraction = Math.abs(p * base - v) <= 1;
				if (!asPoints && !asFraction && mismatchExamples.length < 8) {
					inconsistentRows += 1;
					mismatchExamples.push({
						projectId: String(project._id),
						label: project.identificadorApp ?? project.nome,
						porcentagem: p,
						valor: v,
						base,
						impliedPercent: ((v / base) * 100).toFixed(4),
					});
				}
			}
		}
	}
}

await client.close();

function pct(n, total) {
	if (!total) return "0%";
	return `${((n / total) * 100).toFixed(2)}%`;
}

const percentPointsLike =
	(counts.percent_points || 0) +
	(counts.heuristic_percent_points || 0) +
	(counts.likely_percent_points_no_base || 0);
const fractionLike =
	(counts.decimal_fraction || 0) +
	(counts.heuristic_fraction || 0) +
	(counts.likely_fraction_no_base || 0);

console.log(JSON.stringify({
	summary: {
		projectsWithComissionados: projectCount,
		comissionadoRows: rowCount,
		rowsWithValorComissionavel: rowsWithBase,
		recommendedConvention: "percent_points (ex.: 4 = 4%, 5 = 5%)",
		majoritySignal:
			percentPointsLike >= fractionLike
				? "percent_points"
				: "decimal_fraction",
	},
	classification: Object.fromEntries(
		Object.entries(counts).sort((a, b) => b[1] - a[1]),
	),
	classificationPercent: Object.fromEntries(
		Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.map(([k, v]) => [k, pct(v, rowCount)]),
	),
	rawPorcentagemBuckets: rawBuckets,
	rawPorcentagemBucketsPercent: Object.fromEntries(
		Object.entries(rawBuckets).map(([k, v]) => [k, pct(v, rowCount)]),
	),
	totals: {
		percentPointsLike,
		fractionLike,
		percentPointsLikeShare: pct(percentPointsLike, rowCount),
		fractionLikeShare: pct(fractionLike, rowCount),
	},
	inconsistentWithBothFormulas: inconsistentRows,
	sampleInconsistent: mismatchExamples,
	nonZeroOnly: {
		rows: nonZeroRows,
		raw_lt_1: nonZeroRawLt1,
		raw_1_to_100: nonZeroRawGte1,
		raw_lt_1_share: pct(nonZeroRawLt1, nonZeroRows),
		comparableWithBaseAndValor: comparableWithBaseAndValor,
		matchesPercentPoints,
		matchesDecimalFraction,
		matchesPercentPointsShare: pct(matchesPercentPoints, comparableWithBaseAndValor),
		matchesDecimalFractionShare: pct(matchesDecimalFraction, comparableWithBaseAndValor),
	},
}, null, 2));
