import {
	getGeneralHomologationStats,
	getGeneralNPS,
	getGeneralSalesStats,
	getGeneralServiceExecutionStats,
	getGeneralSupplyStats,
} from "@/repositories/stats/general";
import { getSegmentedProjectIds } from "@/repositories/stats/client-profile";
import { getUFVHomologationStats, getUFVInstallationStats, getUFVSaleStats } from "@/repositories/stats/ufv-stats";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ReportFilterInputSchema, hasActiveSegment } from "@/utils/schemas/report-filter.schema";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";

export const OverallReportSchema = ReportFilterInputSchema;
export type TOverallReportInput = z.infer<typeof OverallReportSchema>;

async function getOverallReport(payload: TOverallReportInput) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	// Recorte de segmento do Perfil aplicado às demais abas: quando há uma
	// dimensão ativa (sexo, faixa etária, valor, profissão ou pagamento),
	// restringimos todas as estatísticas aos projetos compatíveis. A base
	// ignora o período para preservar a semântica de data de cada métrica.
	let segmentIdFilter: Filter<TProject> = {};
	if (hasActiveSegment(payload.segment)) {
		const crmDb = await connectToCRMDatabase();
		const clientsCollection = crmDb.collection<TClient>("clients");
		const ids = await getSegmentedProjectIds({
			projectsCollection,
			clientsCollection,
			baseQuery: {
				"contrato.status": "ASSINADO",
				"contrato.dataAssinatura": { $ne: null },
				...(payload.projectTypes.length > 0 ? { tipoDeServico: { $in: payload.projectTypes } } : {}),
				...(payload.location.estado ? { uf: payload.location.estado } : {}),
				...(payload.location.cidade ? { cidade: payload.location.cidade } : {}),
			},
			segment: payload.segment,
		});
		segmentIdFilter = { _id: { $in: ids } };
	}

	const genericQuery: Filter<TProject> = {
		...(payload.projectTypes.length > 0 ? { tipoDeServico: { $in: payload.projectTypes } } : {}),
		...(payload.location.estado ? { uf: payload.location.estado } : {}),
		...(payload.location.cidade ? { cidade: payload.location.cidade } : {}),
		...segmentIdFilter,
	};
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
		partialQuery: { ...genericQuery },
	});
	const generalSaleStats = await getGeneralSalesStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...signingPeriodQuery },
	});

	const generalServiceExecutionStats = await getGeneralServiceExecutionStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...installationPeriodQuery },
	});

	const generalHomologationStats = await getGeneralHomologationStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...homologationPeriodQuery },
	});
	const generalSupplyStats = await getGeneralSupplyStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...supplyPeriodQuery },
		orderCondition,
		deliveryCondition,
	});

	// UFV STATS (também respondem à localidade e ao recorte de segmento)
	const ufvSaleStats = await getUFVSaleStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...signingPeriodQuery },
	});

	const ufvInstallationStats = await getUFVInstallationStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...installationPeriodQuery },
	});

	const ufvHomologationStats = await getUFVHomologationStats({
		collection: projectsCollection,
		partialQuery: { ...genericQuery, ...homologationPeriodQuery },
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
