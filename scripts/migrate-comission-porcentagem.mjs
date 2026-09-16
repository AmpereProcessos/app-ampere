/**
 * Migra `comissoes.comissionados[].porcentagem` de fração decimal (0.04 = 4%)
 * para pontos percentuais (4 = 4%), padrão do restante do app.
 *
 * Uso:
 *   node scripts/migrate-comission-porcentagem.mjs           # dry-run (padrão)
 *   node scripts/migrate-comission-porcentagem.mjs --apply
 *   node scripts/migrate-comission-porcentagem.mjs --verbose --limit 20
 *   node scripts/migrate-comission-porcentagem.mjs --apply --heuristic-no-base
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const VERBOSE = args.has("--verbose");
const HEURISTIC_NO_BASE = args.has("--heuristic-no-base");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : null;

const VALUE_TOLERANCE = 1;
const PERCENT_TOLERANCE = 0.05;

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

/**
 * @returns {{ action: 'migrate' | 'skip', reason: string, nextPorcentagem?: number }}
 */
function planRowMigration(row, base, options) {
	const p = Number(row.porcentagem);
	if (Number.isNaN(p) || p <= 0 || p >= 1) {
		return { action: "skip", reason: p >= 1 ? "already_percent_points" : "zero_or_invalid" };
	}

	const v = row.valor != null && !Number.isNaN(Number(row.valor)) ? Number(row.valor) : null;
	const hasBase = base > 0;

	if (hasBase && v != null) {
		const matchesFraction = Math.abs(p * base - v) <= VALUE_TOLERANCE;
		const impliedPercent = (v / base) * 100;
		const matchesPercentPoints = Math.abs(p - impliedPercent) <= PERCENT_TOLERANCE;

		if (matchesFraction && !matchesPercentPoints) {
			return { action: "migrate", reason: "valor_matches_decimal_fraction", nextPorcentagem: p * 100 };
		}
		if (matchesPercentPoints) {
			return { action: "skip", reason: "already_coherent_percent_points" };
		}
		return { action: "skip", reason: "ambiguous_vs_valor_and_base" };
	}

	if (hasBase && v == null) {
		if (options.heuristicNoBase) {
			return { action: "migrate", reason: "fraction_without_valor_heuristic_crm", nextPorcentagem: p * 100 };
		}
		return { action: "skip", reason: "fraction_without_valor_needs_heuristic_flag" };
	}

	if (!hasBase && v == null) {
		if (options.heuristicNoBase) {
			return { action: "migrate", reason: "fraction_no_base_heuristic_crm", nextPorcentagem: p * 100 };
		}
		return { action: "skip", reason: "fraction_no_base_needs_heuristic_flag" };
	}

	if (!hasBase && v != null) {
		return { action: "skip", reason: "fraction_with_valor_no_base_manual_review" };
	}

	return { action: "skip", reason: "unhandled" };
}

function roundPercent(n) {
	return Math.round(n * 1e6) / 1e6;
}

const client = new MongoClient(uri);
await client.connect();
const collection = client.db("projetos").collection("dados");

const cursor = collection.find(
	{ "comissoes.comissionados.porcentagem": { $gt: 0, $lt: 1 } },
	{
		projection: {
			_id: 1,
			identificadorApp: 1,
			nome: 1,
			"comissoes.valorComissionavel": 1,
			"comissoes.comissionados": 1,
		},
	},
);

const summary = {
	mode: APPLY ? "apply" : "dry-run",
	heuristicNoBase: HEURISTIC_NO_BASE,
	projectsScanned: 0,
	projectsToUpdate: 0,
	rowsMigrated: 0,
	rowsSkipped: 0,
	skipReasons: {},
	migrateReasons: {},
};

const changes = [];
let projectsToUpdate = 0;

for await (const project of cursor) {
	if (LIMIT != null && summary.projectsScanned >= LIMIT) break;
	summary.projectsScanned += 1;

	const base = project.comissoes?.valorComissionavel ?? 0;
	const comissionados = project.comissoes?.comissionados ?? [];
	const nextComissionados = comissionados.map((row) => ({ ...row }));
	let projectChanged = false;
	const rowChanges = [];

	for (let index = 0; index < nextComissionados.length; index += 1) {
		const row = nextComissionados[index];
		const plan = planRowMigration(row, base, { heuristicNoBase: HEURISTIC_NO_BASE });
		if (plan.action === "skip") {
			summary.rowsSkipped += 1;
			summary.skipReasons[plan.reason] = (summary.skipReasons[plan.reason] || 0) + 1;
			continue;
		}

		const nextPorcentagem = roundPercent(plan.nextPorcentagem);
		summary.rowsMigrated += 1;
		summary.migrateReasons[plan.reason] = (summary.migrateReasons[plan.reason] || 0) + 1;
		projectChanged = true;

		rowChanges.push({
			index,
			nome: row.nome,
			papel: row.papel,
			before: { porcentagem: row.porcentagem, valor: row.valor },
			after: { porcentagem: nextPorcentagem, valor: row.valor },
			reason: plan.reason,
		});

		nextComissionados[index] = {
			...row,
			porcentagem: nextPorcentagem,
		};
	}

	if (!projectChanged) continue;

	projectsToUpdate += 1;
	summary.projectsToUpdate = projectsToUpdate;

	const changeRecord = {
		projectId: String(project._id),
		label: project.identificadorApp ?? project.nome,
		base,
		rows: rowChanges,
	};

	if (VERBOSE || changes.length < 30) {
		changes.push(changeRecord);
	}

	if (APPLY) {
		await collection.updateOne(
			{ _id: project._id },
			{ $set: { "comissoes.comissionados": nextComissionados } },
		);
	}
}

await client.close();

const reportPath = resolve(root, "scripts", `.migrate-comission-porcentagem-${APPLY ? "applied" : "dry-run"}.json`);
writeFileSync(
	reportPath,
	JSON.stringify({ summary, changes: VERBOSE ? changes : changes.slice(0, 30) }, null, 2),
	"utf8",
);

console.log(JSON.stringify({ summary, reportPath, sampleChanges: changes.slice(0, 5) }, null, 2));

if (!APPLY) {
	console.error("\nNenhum documento alterado (dry-run). Para aplicar: node scripts/migrate-comission-porcentagem.mjs --apply");
}
