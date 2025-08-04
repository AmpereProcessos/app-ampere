import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { NextApiHandler } from "next";
import type { Collection, Filter } from "mongodb";
import { z } from "zod";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { getGeneralSalesStats, getGeneralServiceExecutionStats, getGeneralHomologationStats, getGeneralSupplyStats, getGeneralNPS } from "@/repositories/stats/general";
import { getUFVSaleStats, getUFVInstallationStats, getUFVHomologationStats } from "@/repositories/stats/ufv-stats";

export const OverallReportSchema = z.object({
	period: z.object({
		after: z
			.string({
				required_error: "Data de início é obrigatória",
			})
			.datetime({
				message: "Data de início deve ser uma data válida",
			})
			.optional()
			.nullable(),
		before: z
			.string({
				required_error: "Data de fim é obrigatória",
			})
			.datetime({
				message: "Data de fim deve ser uma data válida",
			})
			.optional()
			.nullable(),
	}),
});
export type TOverallReportInput = z.infer<typeof OverallReportSchema>;

async function getOverallReport(payload: z.infer<typeof OverallReportSchema>) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const signingPeriodQuery: Filter<TProject> = {
		"contrato.status": "ASSINADO",
		"contrato.dataAssinatura":
			payload.period.after && payload.period.before
				? {
						$gte: payload.period.after,
						$lte: payload.period.before,
					}
				: {
						$ne: null,
					},
	};

	const installationPeriodQuery: Filter<TProject> = {
		"contrato.status": "ASSINADO",
		"contrato.dataAssinatura": { $ne: null },
		"obra.saida":
			payload.period.after && payload.period.before
				? {
						$gte: payload.period.after,
						$lte: payload.period.before,
					}
				: {
						$ne: null,
					},
	};

	const homologationPeriodQuery: Filter<TProject> = {
		"contrato.status": "ASSINADO",
		"contrato.dataAssinatura": { $ne: null },
		"homologacao.acesso.dataResposta":
			payload.period.after && payload.period.before
				? {
						$gte: payload.period.after,
						$lte: payload.period.before,
					}
				: {
						$ne: null,
					},
	};

	const supplyPeriodQuery: Filter<TProject> = {
		"contrato.status": "ASSINADO",
		"contrato.dataAssinatura": { $ne: null },
		"compra.dataLiberacao": { $ne: null },
		$or: [
			{
				"compra.dataPedido":
					payload.period.after && payload.period.before
						? {
								$gte: payload.period.after,
								$lte: payload.period.before,
							}
						: {
								$ne: null,
							},
			},
			{
				"compra.dataEntrega":
					payload.period.after && payload.period.before
						? {
								$gte: payload.period.after,
								$lte: payload.period.before,
							}
						: {
								$ne: null,
							},
			},
		],
	};
	const orderCondition: Filter<TProject> =
		payload.period.after && payload.period.before
			? {
					$and: [{ $gte: ["$compra.dataPedido", payload.period.after] }, { $lte: ["$compra.dataPedido", payload.period.before] }],
				}
			: { $ne: ["$compra.dataPedido", null] };

	const deliveryCondition: Filter<TProject> =
		payload.period.after && payload.period.before
			? {
					$and: [{ $gte: ["$compra.dataEntrega", payload.period.after] }, { $lte: ["$compra.dataEntrega", payload.period.before] }],
				}
			: { $ne: ["$compra.dataEntrega", null] };

	// GENERAL STATS
	const generalNPS = await getGeneralNPS({
		collection: projectsCollection,
		partialQuery: {},
	});
	const generalSaleStats = await getGeneralSalesStats({
		collection: projectsCollection,
		partialQuery: signingPeriodQuery,
	});

	const generalServiceExecutionStats = await getGeneralServiceExecutionStats({
		collection: projectsCollection,
		partialQuery: installationPeriodQuery,
	});

	const generalHomologationStats = await getGeneralHomologationStats({
		collection: projectsCollection,
		partialQuery: homologationPeriodQuery,
	});
	const generalSupplyStats = await getGeneralSupplyStats({
		collection: projectsCollection,
		partialQuery: supplyPeriodQuery,
		orderCondition,
		deliveryCondition,
	});

	// UFV STATS
	const ufvSaleStats = await getUFVSaleStats({
		collection: projectsCollection,
		partialQuery: signingPeriodQuery,
	});

	const ufvInstallationStats = await getUFVInstallationStats({
		collection: projectsCollection,
		partialQuery: installationPeriodQuery,
	});

	const ufvHomologationStats = await getUFVHomologationStats({
		collection: projectsCollection,
		partialQuery: homologationPeriodQuery,
	});

	return {
		data: {
			geral: {
				nps: generalNPS,
				qtdeProjetos: generalSaleStats.qtdeVendida,
				vendas: generalSaleStats,
				instalacoes: generalServiceExecutionStats,
				homologacoes: generalHomologationStats,
				suprimentos: generalSupplyStats,
			},
			ufv: {
				vendas: ufvSaleStats,
				instalacoes: ufvInstallationStats,
				homologacoes: ufvHomologationStats,
			},
		},
	};
}
export type TOverallReportOutput = Awaited<ReturnType<typeof getOverallReport>>;
const getOverallReportHandler: NextApiHandler<TOverallReportOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	console.log("[INFO] [GET_OVERALL_REPORT] Requested by user", {
		name: session.user.nome,
		email: session.user.email,
	});
	const payload = await OverallReportSchema.parse(req.body);
	console.log("[INFO] [GET_OVERALL_REPORT] Payload", payload);
	const report = await getOverallReport(payload);
	res.status(200).json(report);
};

export default apiHandler({
	POST: getOverallReportHandler,
});
