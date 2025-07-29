import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import type { NextApiHandler } from "next";
import { z } from "zod";

const EngineeringSectorStatsQueryParams = z.object({
	after: z.string({ required_error: "A data de início é obrigatória." }).datetime({ message: "A data de início deve ser uma data válida." }),
	before: z.string({ required_error: "A data de término é obrigatória." }).datetime({ message: "A data de término deve ser uma data válida." }),
});

type TEngineeringSectorStatsOutput = {
	data: {
		homologacoesSolicitadas: {
			qtde: number;
			potencia: number;
			tempoMedio: number;
		};
		homologacoesEfetivadas: {
			qtde: number;
			potencia: number;
			tempoMedio: number;
		};
		homologacoesReprovadas: {
			qtde: number;
			potencia: number;
		};
		vistoriasSolicitadas: {
			qtde: number;
			potencia: number;
			tempoMedio: number;
		};
		vistoriasEfetivadas: {
			qtde: number;
			potencia: number;
			tempoMedio: number;
		};
		desenhosExecutivosFeitos: number;
		diagramasExecutivosFeitos: number;
	};
};

const getEngineeringSectorStatsRoute: NextApiHandler<TEngineeringSectorStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const isAuthorized = !!session?.user.permissoes.engenharia.visualizar;
	if (!isAuthorized) throw new createHttpError.Unauthorized("Oops, seu usuário não possui acesso a esse módulo.");

	const { after, before } = EngineeringSectorStatsQueryParams.parse(req.query);

	console.log(after, before);
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const HOMOLOGATION_FIELDS_MAP = {
		LIBERATION_DATE: "$homologacao.dataLiberacao",
		POWER: "$homologacao.potencia",
		ACCESS_STATUS: "$homologacao.acesso.status",
		ACCESS_REQUEST_DATE: "$homologacao.acesso.dataSolicitacao",
		ACCESS_RESPONSE_DATE: "$homologacao.acesso.dataResposta",
		INSPECTION_REQUEST_DATE: "$homologacao.vistoria.dataSolicitacao",
		INSPECTION_RESPONSE_DATE: "$homologacao.vistoria.dataResposta",
	};
	const aggregatedStatsResults = await projectsCollection
		.aggregate([
			{
				$group: {
					_id: {},
					homologationsRequestedCount: {
						$sum: {
							$cond: [{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, before] }] }, 1, 0],
						},
					},
					homologationsRequestedPower: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, after],
										},
										{
											$lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, before],
										},
									],
								},
								HOMOLOGATION_FIELDS_MAP.POWER,
								0,
							],
						},
					},
					homologationsRequestedAverageTime: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE, before] },
										{ $ne: [HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE, null] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE,
											},
										},
										endDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.ACCESS_REQUEST_DATE,
											},
										},
										unit: "hour",
									},
								},
								0,
							],
						},
					},
					homologationsApprovedCount: {
						$sum: {
							$cond: [{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, before] }] }, 1, 0],
						},
					},
					homologationsApprovedPower: {
						$sum: {
							$cond: [
								{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, before] }] },
								HOMOLOGATION_FIELDS_MAP.POWER,
								0,
							],
						},
					},
					homologationsApprovedAverageTime: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, before] },
										{ $ne: [HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE, null] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE,
											},
										},
										endDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE,
											},
										},
										unit: "hour",
									},
								},
								0,
							],
						},
					},

					homologationsRejectedCount: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, before] },
										{ $eq: [HOMOLOGATION_FIELDS_MAP.ACCESS_STATUS, "REPROVADO"] },
									],
								},
								1,
								0,
							],
						},
					},
					homologationsRejectedPower: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.ACCESS_RESPONSE_DATE, before] },
										{ $eq: [HOMOLOGATION_FIELDS_MAP.ACCESS_STATUS, "REPROVADO"] },
									],
								},
								HOMOLOGATION_FIELDS_MAP.POWER,
								0,
							],
						},
					},
					inspectionsRequestedCount: {
						$sum: {
							$cond: [{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, before] }] }, 1, 0],
						},
					},
					inspectionsRequestedPower: {
						$sum: {
							$cond: [
								{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, before] }] },
								HOMOLOGATION_FIELDS_MAP.POWER,
								0,
							],
						},
					},
					inspectionsRequestedAverageTime: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE, before] },
										{ $ne: [HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE, null] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE,
											},
										},
										endDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.INSPECTION_REQUEST_DATE,
											},
										},
										unit: "hour",
									},
								},
								0,
							],
						},
					},
					inspectionsApprovedCount: {
						$sum: {
							$cond: [{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, before] }] }, 1, 0],
						},
					},
					inspectionsApprovedPower: {
						$sum: {
							$cond: [
								{ $and: [{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, after] }, { $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, before] }] },
								HOMOLOGATION_FIELDS_MAP.POWER,
								0,
							],
						},
					},
					inspectionsApprovedAverageTime: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $gte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, after] },
										{ $lte: [HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE, before] },
										{ $ne: [HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE, null] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.LIBERATION_DATE,
											},
										},
										endDate: {
											$dateFromString: {
												dateString: HOMOLOGATION_FIELDS_MAP.INSPECTION_RESPONSE_DATE,
											},
										},
										unit: "hour",
									},
								},
								0,
							],
						},
					},
				},
			},
		])
		.toArray();

	const aggregatedStats = aggregatedStatsResults[0];

	return res.status(200).json({
		// data: {
		// 	homologacoesSolicitadas: {
		// 		qtde: aggregatedStats.homologationsRequestedCount || 0,
		// 		potencia: aggregatedStats.homologationsRequestedPower || 0,
		// 		tempoMedio: aggregatedStats.homologationsRequestedAverageTime || 0,
		// 	},
		// 	homologacoesEfetivadas: {
		// 		qtde: aggregatedStats.homologationsApprovedCount || 0,
		// 		potencia: aggregatedStats.homologationsApprovedPower || 0,
		// 		tempoMedio: aggregatedStats.homologationsApprovedAverageTime || 0,
		// 	},
		// 	homologacoesReprovadas: {
		// 		qtde: aggregatedStats.homologationsRejectedCount || 0,
		// 		potencia: aggregatedStats.homologationsRejectedPower || 0,
		// 	},
		// 	vistoriasSolicitadas: {
		// 		qtde: aggregatedStats.inspectionsRequestedCount || 0,
		// 		potencia: aggregatedStats.inspectionsRequestedPower || 0,
		// 		tempoMedio: aggregatedStats.inspectionsRequestedAverageTime || 0,
		// 	},
		// 	vistoriasEfetivadas: {
		// 		qtde: aggregatedStats.inspectionsApprovedCount || 0,
		// 		potencia: aggregatedStats.inspectionsApprovedPower || 0,
		// 		tempoMedio: aggregatedStats.inspectionsApprovedAverageTime || 0,
		// 	},
		// 	desenhosExecutivosFeitos: 0, // TODO: Implementar lógica para desenhos executivos
		// 	diagramasExecutivosFeitos: 0, // TODO: Implementar lógica para diagramas executivos
		// },
		aggregatedStats,
	});
};

export default apiHandler({
	GET: getEngineeringSectorStatsRoute,
});
