import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { getPeriodUtils } from "@/utils/methods/dates";
import { getContractValue } from "@/utils/methods/util/projects";
import { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { NextApiHandler } from "next";
import { z } from "zod";

const GetGraphStatsInput = z.object({
	metric: z.enum(["SALE_VALUE", "SALE_QUANTITY", "SALE_UFV_POWER"]),
	periodStart: z
		.string({
			required_error: "Período de início é obrigatório",
		})
		.datetime({
			message: "Período de início deve ser uma data válida",
		}),
	periodEnd: z
		.string({
			required_error: "Período de fim é obrigatório",
		})
		.datetime({
			message: "Período de fim deve ser uma data válida",
		}),
	previousPeriodStart: z
		.string({
			required_error: "Período de início do período anterior é obrigatório",
		})
		.datetime({
			message: "Período de início do período anterior deve ser uma data válida",
		}),
	previousPeriodEnd: z
		.string({
			required_error: "Período de fim do período anterior é obrigatório",
		})
		.datetime({
			message: "Período de fim do período anterior deve ser uma data válida",
		}),
});
export type TGetGraphStatsInput = z.infer<typeof GetGraphStatsInput>;

async function getGraphStats({ session, params }: { session: TAuthSession; params: TGetGraphStatsInput }) {
	const { metric, periodStart, periodEnd, previousPeriodStart, previousPeriodEnd } = params;

	const periodUtils = getPeriodUtils({ startDate: new Date(periodStart), endDate: new Date(periodEnd) });
	const previousPeriodUtils = getPeriodUtils({ startDate: new Date(previousPeriodStart), endDate: new Date(previousPeriodEnd) });
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const periodStartDate = new Date(periodStart);
	const periodEndDate = new Date(periodEnd);
	const previousPeriodStartDate = new Date(previousPeriodStart);
	const previousPeriodEndDate = new Date(previousPeriodEnd);

	if (metric === "SALE_VALUE") {
		const data = (await projectsCollection
			.find(
				{
					"contrato.status": { $eq: "ASSINADO" },
					"contrato.dataAssinatura": {
						$gte: previousPeriodStart,
						$lte: periodEnd,
					},
				},
				{
					projection: {
						"contrato.dataAssinatura": 1,
						"sistema.valorProjeto": 1,
						"oem.valor": 1,
						"padrao.valor": 1,
						"estruturaPersonalizada.valor": 1,
						"seguro.valor": 1,
					},
				},
			)
			.toArray()) as unknown as {
			contrato: {
				dataAssinatura: TProject["contrato"]["dataAssinatura"];
			};
			sistema: {
				valorProjeto: TProject["sistema"]["valorProjeto"];
			};
			oem: {
				valor: TProject["oem"]["valor"];
			};
			padrao: {
				valor: TProject["padrao"]["valor"];
			};
			estruturaPersonalizada: {
				valor: TProject["estruturaPersonalizada"]["valor"];
			};
			seguro: {
				valor: TProject["seguro"]["valor"];
			};
		}[];

		const graphReduced = data.reduce(
			(acc, curr) => {
				const signatureDate = dayjs(curr.contrato.dataAssinatura).toDate();
				const orderTime = signatureDate.getTime();

				const value = getContractValue({
					projectValue: curr.sistema.valorProjeto ?? 0,
					oemValue: curr.oem.valor ?? 0,
					paValue: curr.padrao.valor ?? 0,
					structureValue: curr.estruturaPersonalizada.valor ?? 0,
					insuranceValue: curr.seguro.valor ?? 0,
				});
				const isWithinPeriod = signatureDate >= periodStartDate && signatureDate <= periodEndDate;
				const isWithinPreviousPeriod = signatureDate >= previousPeriodStartDate && signatureDate <= previousPeriodEndDate;

				if (isWithinPeriod) {
					const bucket = periodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(periodUtils.format);
					acc.ATUAL[bucketKey].valor += value;
				}
				if (isWithinPreviousPeriod) {
					const bucket = previousPeriodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(previousPeriodUtils.format);
					acc.ANTERIOR[bucketKey].valor += value;
				}
				return acc;
			},
			{
				ATUAL: Object.fromEntries(
					periodUtils.spacedDates.map((date) => [
						dayjs(date).format(periodUtils.format),
						{
							identificador: dayjs(date).format(periodUtils.format),
							valor: 0,
						},
					]),
				),
				ANTERIOR: Object.fromEntries(
					previousPeriodUtils.spacedDates.map((date) => [
						dayjs(date).format(previousPeriodUtils.format),
						{
							identificador: dayjs(date).format(previousPeriodUtils.format),
							valor: 0,
						},
					]),
				),
			},
		);

		return {
			data: {
				ATUAL: Object.values(graphReduced.ATUAL),
				ANTERIOR: Object.values(graphReduced.ANTERIOR),
			},
		};
	}
	if (metric === "SALE_QUANTITY") {
		const data = (await projectsCollection
			.find(
				{
					"contrato.status": { $eq: "ASSINADO" },
					"contrato.dataAssinatura": {
						$gte: previousPeriodStart,
						$lte: periodEnd,
					},
				},
				{
					projection: {
						"contrato.dataAssinatura": 1,
					},
				},
			)
			.toArray()) as unknown as {
			contrato: {
				dataAssinatura: TProject["contrato"]["dataAssinatura"];
			};
		}[];

		const graphReduced = data.reduce(
			(acc, curr) => {
				const signatureDate = dayjs(curr.contrato.dataAssinatura).toDate();
				const orderTime = signatureDate.getTime();

				const isWithinPeriod = signatureDate >= periodStartDate && signatureDate <= periodEndDate;
				const isWithinPreviousPeriod = signatureDate >= previousPeriodStartDate && signatureDate <= previousPeriodEndDate;

				if (isWithinPeriod) {
					const bucket = periodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(periodUtils.format);
					acc.ATUAL[bucketKey].valor += 1;
				}
				if (isWithinPreviousPeriod) {
					const bucket = previousPeriodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(previousPeriodUtils.format);
					acc.ANTERIOR[bucketKey].valor += 1;
				}
				return acc;
			},
			{
				ATUAL: Object.fromEntries(
					periodUtils.spacedDates.map((date) => [
						dayjs(date).format(periodUtils.format),
						{
							identificador: dayjs(date).format(periodUtils.format),
							valor: 0,
						},
					]),
				),
				ANTERIOR: Object.fromEntries(
					previousPeriodUtils.spacedDates.map((date) => [
						dayjs(date).format(previousPeriodUtils.format),
						{
							identificador: dayjs(date).format(previousPeriodUtils.format),
							valor: 0,
						},
					]),
				),
			},
		);

		return {
			data: {
				ATUAL: Object.values(graphReduced.ATUAL),
				ANTERIOR: Object.values(graphReduced.ANTERIOR),
			},
		};
	}
	if (metric === "SALE_UFV_POWER") {
		const data = (await projectsCollection
			.find(
				{
					tipoDeServico: { $in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] },
					"contrato.status": { $eq: "ASSINADO" },
					"contrato.dataAssinatura": {
						$gte: previousPeriodStart,
						$lte: periodEnd,
					},
				},
				{
					projection: {
						"contrato.dataAssinatura": 1,
						"sistema.potPico": 1,
					},
				},
			)
			.toArray()) as unknown as {
			contrato: {
				dataAssinatura: TProject["contrato"]["dataAssinatura"];
			};
			sistema: {
				potPico: TProject["sistema"]["potPico"];
			};
		}[];

		const graphReduced = data.reduce(
			(acc, curr) => {
				const signatureDate = dayjs(curr.contrato.dataAssinatura).toDate();
				const orderTime = signatureDate.getTime();

				const value = curr.sistema.potPico ?? 0;
				const isWithinPeriod = signatureDate >= periodStartDate && signatureDate <= periodEndDate;
				const isWithinPreviousPeriod = signatureDate >= previousPeriodStartDate && signatureDate <= previousPeriodEndDate;

				if (isWithinPeriod) {
					const bucket = periodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(periodUtils.format);
					acc.ATUAL[bucketKey].valor += value;
				}
				if (isWithinPreviousPeriod) {
					const bucket = previousPeriodUtils.buckets.find((b) => orderTime >= b.start && orderTime <= b.end);
					if (!bucket) return acc;
					const bucketKey = dayjs(bucket.key).format(previousPeriodUtils.format);
					acc.ANTERIOR[bucketKey].valor += value;
				}
				return acc;
			},
			{
				ATUAL: Object.fromEntries(
					periodUtils.spacedDates.map((date) => [
						dayjs(date).format(periodUtils.format),
						{
							identificador: dayjs(date).format(periodUtils.format),
							valor: 0,
						},
					]),
				),
				ANTERIOR: Object.fromEntries(
					previousPeriodUtils.spacedDates.map((date) => [
						dayjs(date).format(previousPeriodUtils.format),
						{
							identificador: dayjs(date).format(previousPeriodUtils.format),
							valor: 0,
						},
					]),
				),
			},
		);

		return {
			data: {
				ATUAL: Object.values(graphReduced.ATUAL),
				ANTERIOR: Object.values(graphReduced.ANTERIOR),
			},
		};
	}

	throw createHttpError.BadRequest("Métrica inválida");
}

export type TGetGraphsStatsOutput = Awaited<ReturnType<typeof getGraphStats>>;

const getGraphsStatsHandler: NextApiHandler<TGetGraphsStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const params = GetGraphStatsInput.parse(req.query);
	const data = await getGraphStats({ session, params });
	res.status(200).json(data);
};

export default apiHandler({
	GET: getGraphsStatsHandler,
});
