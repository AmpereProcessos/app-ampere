import { getContaAzulFinancialEventV2ById, getContaAzulSaleV2ById } from "@/lib/integrations/conta-azul-v2";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TRevenue } from "@/utils/schemas/revenues";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import type { AnyBulkWriteOperation } from "mongodb";
import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";

const RATE_LIMITS = {
	perSecond: 8,
	perMinute: 480,
	concurrency: 3,
};

const BATCH_SIZE = 25;

type FinancialEvent = Awaited<ReturnType<typeof getContaAzulFinancialEventV2ById>>[number];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createRateLimiter({ perSecond, perMinute, concurrency }: typeof RATE_LIMITS) {
	let active = 0;
	let secondWindow: number[] = [];
	let minuteWindow: number[] = [];

	const cleanup = (now: number) => {
		secondWindow = secondWindow.filter((t) => now - t < 1000);
		minuteWindow = minuteWindow.filter((t) => now - t < 60000);
	};

	const waitForSlot = async () => {
		while (true) {
			const now = Date.now();
			cleanup(now);

			const canStart = active < concurrency && secondWindow.length < perSecond && minuteWindow.length < perMinute;
			if (canStart) {
				active += 1;
				secondWindow.push(now);
				minuteWindow.push(now);
				return;
			}

			const waits: number[] = [];
			if (secondWindow.length >= perSecond) {
				waits.push(1000 - (now - secondWindow[0]));
			}
			if (minuteWindow.length >= perMinute) {
				waits.push(60000 - (now - minuteWindow[0]));
			}
			if (active >= concurrency) {
				waits.push(50);
			}

			const waitMs = Math.max(10, Math.min(...waits.filter((w) => w > 0)));
			await sleep(waitMs);
		}
	};

	return async function schedule<T>(task: () => Promise<T>) {
		await waitForSlot();
		try {
			return await task();
		} finally {
			active = Math.max(0, active - 1);
		}
	};
}

function getRetryAfterMs(error: unknown) {
	const retryAfterHeader = (error as { response?: { headers?: Record<string, string> } })?.response?.headers?.["retry-after"];
	const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : Number.NaN;
	return Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : null;
}

async function withRetry<T>(task: () => Promise<T>, label: string, maxRetries = 4) {
	let attempt = 0;

	while (true) {
		try {
			return await task();
		} catch (error) {
			const status = (error as { response?: { status?: number } })?.response?.status;
			const shouldRetry = status === 429 && attempt < maxRetries;
			if (!shouldRetry) {
				throw error;
			}

			const retryAfterMs = getRetryAfterMs(error);
			const baseDelay = retryAfterMs ?? 500 * 2 ** attempt;
			const jitter = Math.floor(Math.random() * 250);
			const delay = Math.min(30000, baseDelay + jitter);

			console.warn("[WARN] [CONTA AZUL V2] Rate limit atingido, reintentando...", {
				label,
				attempt: attempt + 1,
				delayMs: delay,
			});

			await sleep(delay);
			attempt += 1;
		}
	}
}

function getEventValue(event: FinancialEvent) {
	if (typeof event.valor_composicao?.valor_bruto === "number") return event.valor_composicao.valor_bruto;
	if (typeof event.valor_composicao?.valor_liquido === "number") return event.valor_composicao.valor_liquido;
	const paid = typeof event.valor_pago === "number" ? event.valor_pago : 0;
	const unpaid = typeof event.nao_pago === "number" ? event.nao_pago : 0;
	const loss = typeof event.perda?.valor === "number" ? event.perda.valor : 0;
	return paid + unpaid + loss;
}

function getPaymentDate(event: FinancialEvent) {
	const paymentDates = event.baixas?.map((baixa) => baixa.data_pagamento).filter((date): date is string => Boolean(date)) ?? [];

	if (paymentDates.length === 0) return null;
	return paymentDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[paymentDates.length - 1] ?? null;
}

function getDueDate(event: FinancialEvent) {
	return event.data_vencimento ?? event.data_pagamento_previsto ?? getPaymentDate(event) ?? new Date().toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Método não permitido." });
	}

	const projectsDb = await connectToDatabase();
	const revenuesCollection = projectsDb.collection<TRevenue>("receitas");
	const revenues = await revenuesCollection.find({ idContaAzulVenda: { $ne: null }, dataEfetivacao: null }).toArray();

	if (revenues.length === 0) {
		return res.status(200).json({ message: "Nenhuma receita pendente encontrada.", summary: { total: 0 } });
	}

	const limiter = createRateLimiter(RATE_LIMITS);
	const summary = {
		total: revenues.length,
		updated: 0,
		skippedNoEvent: 0,
		skippedNoInstallments: 0,
		failed: 0,
	};

	const allBulkOpsDebug = [];
	for (let i = 0; i < revenues.length; i += BATCH_SIZE) {
		console.log(
			`[INFO] [FIX] [${formatDateAsLocale(new Date(), true)}] Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(revenues.length / BATCH_SIZE)}...`,
		);
		const batch = revenues.slice(i, i + BATCH_SIZE);
		const batchResults = await Promise.all(
			batch.map(async (revenue) => {
				const revenueId = revenue._id?.toString?.() ?? "unknown";
				const contaAzulSaleId = revenue.idContaAzulVenda as string;

				try {
					const sale = await withRetry(() => limiter(() => getContaAzulSaleV2ById({ id: contaAzulSaleId })), "getSale");
					const financialEventId = sale.evento_financeiro?.id ?? null;

					if (!financialEventId) {
						summary.skippedNoEvent += 1;
						return null;
					}

					const events = await withRetry(() => limiter(() => getContaAzulFinancialEventV2ById(financialEventId)), "getFinancialEvent");

					if (!events || events.length === 0) {
						summary.skippedNoInstallments += 1;
						return null;
					}

					const installments = [...events].sort((a, b) => {
						if (typeof a.indice === "number" && typeof b.indice === "number") {
							return a.indice - b.indice;
						}
						const dateA = a.data_vencimento ?? a.data_pagamento_previsto ?? "";
						const dateB = b.data_vencimento ?? b.data_pagamento_previsto ?? "";
						return new Date(dateA).getTime() - new Date(dateB).getTime();
					});

					const total = revenue.total || 0;
					const fracionamento = installments.map((event, installmentIndex) => {
						const value = getEventValue(event);
						const percentage = total > 0 ? (value / total) * 100 : 0;
						const title = event.descricao?.trim() || `RECEBIMENTO DE ${formatDecimalPlaces(percentage)}%`;
						const paymentDate = event.status === "QUITADO" ? getPaymentDate(event) : null;
						const dueDate = getDueDate(event);
						return {
							titulo: `(${installmentIndex + 1}/${installments.length}) - ${title}`,
							valor: value,
							porcentagem: percentage,
							dataPrevisaoRecebimento: dueDate ? dayjs(new Date(dueDate)).add(3, "hours").toISOString() : null,
							dataRecebimento: paymentDate ? dayjs(new Date(paymentDate)).add(3, "hours").toISOString() : null,
						};
					});

					const allPaid = installments.every((event) => event.status === "QUITADO");
					const paymentDates = installments
						.map((event) => (event.status === "QUITADO" ? getPaymentDate(event) : null))
						.filter((date): date is string => Boolean(date));

					const dataEfetivacao =
						allPaid && paymentDates.length > 0 ? paymentDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[paymentDates.length - 1] : null;

					return {
						updateOne: {
							filter: { _id: revenue._id },
							update: {
								$set: {
									fracionamento,
									dataEfetivacao: dataEfetivacao ? dayjs(new Date(dataEfetivacao)).add(3, "hours").toISOString() : null,
									idContaAzulEventoFinanceiro: financialEventId,
									dataUltimaAtualizacaoContaAzul: new Date().toISOString(),
								},
							},
						},
					};
				} catch (error) {
					console.error("[ERROR] [CONTA AZUL V2] Erro ao sincronizar receita", {
						revenueId,
						contaAzulSaleId,
						message: error instanceof Error ? error.message : String(error),
					});
					summary.failed += 1;
					return null;
				}
			}),
		);

		console.log(
			`[INFO] [FIX] [${formatDateAsLocale(new Date(), true)}] Batch ${i / BATCH_SIZE + 1} of ${Math.ceil(revenues.length / BATCH_SIZE)} processed.`,
		);
		const bulkOps = batchResults.filter(Boolean) as AnyBulkWriteOperation<TRevenue>[];
		if (bulkOps.length > 0) {
			// Commeting for now, to avoid updating the database
			const bulkResponse = await revenuesCollection.bulkWrite(bulkOps);
			if (bulkResponse) {
				summary.updated += bulkResponse.modifiedCount;
			}
			allBulkOpsDebug.push(...bulkOps);
		}
	}

	return res.status(200).json({
		message: "Sincronização concluída.",
		summary,
		allBulkOpsDebug,
	});
}
