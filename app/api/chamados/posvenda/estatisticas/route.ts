import connectToCallsDatabase from "@/utils/services/mongodb/calls";
import type { TPosVendaCall } from "@/utils/schemas/pos-venda-calls";
import type { Db, Filter, WithId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getHoursDiff } from "@/utils/methods/dates";
import { appRouterApiHandler, type UnwrapAppRouterNextResponse } from "@/utils/api-app-router";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import createHttpError from "http-errors";
export const dynamic = "force-dynamic";

const GetPosVendaCallsStatisticsQueryParamsSchema = z.object({
	periodAfter: z
		.string({
			required_error: "Data de início é obrigatória",
			invalid_type_error: "Data de início deve ser uma string",
		})
		.datetime({ message: "Data de início deve ser uma data válida" }),
	periodBefore: z
		.string({
			required_error: "Data de fim é obrigatória",
			invalid_type_error: "Data de fim deve ser uma string",
		})
		.datetime({ message: "Data de fim deve ser uma data válida" }),
});

export type TGetPosVendaCallsStatisticsInput = z.infer<typeof GetPosVendaCallsStatisticsQueryParamsSchema>;

async function getPosVendaCallsStatistics(request: NextRequest) {
	const session = await getValidCurrentSessionUncached();
	if (!session) {
		throw new createHttpError.Unauthorized("Usuário não autenticado");
	}

	const searchParams = request.nextUrl.searchParams;
	const searchParamsEntries = Object.fromEntries(searchParams);

	const params = GetPosVendaCallsStatisticsQueryParamsSchema.parse(searchParamsEntries);
	const { periodAfter, periodBefore } = params;

	const periodAfterDate = new Date(periodAfter);
	const periodBeforeDate = new Date(periodBefore);
	const db: Db = await connectToCallsDatabase();
	const collection = db.collection<TPosVendaCall>("posvenda");

	const insertionQuery: Filter<TPosVendaCall> = {
		dataInsercao: {
			$gte: periodAfter,
			$lte: periodBefore,
		},
	};
	const conclusionQuery: Filter<TPosVendaCall> = {
		dataEfetivacao: {
			$gte: periodAfter,
			$lte: periodBefore,
		},
	};
	const calls = (await collection
		.find(
			{
				$or: [insertionQuery, conclusionQuery],
			},
			{
				projection: {
					_id: 0,
					metadados: 1,
					dataInsercao: 1,
					dataEfetivacao: 1,
				},
			},
		)
		.toArray()) as WithId<Pick<TPosVendaCall, "metadados" | "dataInsercao" | "dataEfetivacao">>[];

	const stats = calls.reduce(
		(acc: { createdQty: number; concludedQty: number; totalTimeToConclusion: number; totalValue: number }, call) => {
			const insertionDate = new Date(call.dataInsercao);
			const conclusionDate = call.dataEfetivacao ? new Date(call.dataEfetivacao) : null;
			const insertedWithinPeriod = insertionDate.getTime() >= periodAfterDate.getTime() && insertionDate.getTime() <= periodBeforeDate.getTime();
			const concludedWithinPeriod =
				conclusionDate && conclusionDate.getTime() >= periodAfterDate.getTime() && conclusionDate.getTime() <= periodBeforeDate.getTime();

			if (insertedWithinPeriod) {
				acc.createdQty++;
			}
			if (concludedWithinPeriod) {
				acc.concludedQty++;
			}
			if (concludedWithinPeriod) {
				acc.totalTimeToConclusion += getHoursDiff({ start: insertionDate, finish: conclusionDate });
			}
			if (call.metadados) {
				const paymentDate = call.metadados.dataPagamento ? new Date(call.metadados.dataPagamento) : null;
				const paymentWithinPeriod =
					paymentDate && paymentDate.getTime() >= periodAfterDate.getTime() && paymentDate.getTime() <= periodBeforeDate.getTime();
				if (paymentWithinPeriod) {
					acc.totalValue += call.metadados.valor || 0;
				}
			}
			return acc;
		},
		{
			createdQty: 0,
			concludedQty: 0,
			totalTimeToConclusion: 0,
			totalValue: 0,
		},
	);

	return NextResponse.json({
		data: {
			criadas: stats.createdQty,
			concluidas: stats.concludedQty,
			valorTotal: stats.totalValue,
			mediaTempoConclusao: stats.totalTimeToConclusion / stats.concludedQty,
		},
	});
}

export type TGetPosVendaCallsStatisticsOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof getPosVendaCallsStatistics>>>;

export const GET = appRouterApiHandler({
	GET: getPosVendaCallsStatistics,
});
