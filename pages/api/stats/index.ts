import type { NextApiHandler } from "next";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TAuthSession } from "@/lib/authentication/types";
import { type Collection, type Db, Filter, ObjectId } from "mongodb";
import type { TProject } from "@/utils/schemas/projects";
import { getFirstDayOfMonth } from "@/utils/methods/dates";
import type { TDashboardStats } from "@/utils/schemas/stats";
import dayjs from "dayjs";

function getQueryByVisualization(session: TAuthSession) {
	const visualization = session.user.visualizacao.tipo;
	const seller = session.user.visualizacao.referencia;

	if (visualization === "VENDAS") return { "vendedor.nome": seller };
	return {};
}

async function getStats({ session }: { session: TAuthSession }) {
	const periodStart = dayjs().startOf("month").toISOString();
	const periodEnd = dayjs().endOf("month").toISOString();
	const previousPeriodStart = dayjs().subtract(1, "month").startOf("month").toISOString();
	const previousPeriodEnd = dayjs().subtract(1, "month").endOf("month").toISOString();

	const db: Db = await connectToDatabase();
	const collection: Collection<TProject> = db.collection("dados");

	const commercialStats = await getCommercialStats({
		collection: collection,
		currentPeriodStart: periodStart,
		currentPeriodEnd: periodEnd,
		previousPeriodStart: previousPeriodStart,
		previousPeriodEnd: previousPeriodEnd,
	});
	console.log("COMMERCIAL STATS", commercialStats);
	const supplyStats = await getSupplyStats({
		collection: collection,
		currentPeriodStart: periodStart,
		currentPeriodEnd: periodEnd,
		previousPeriodStart: previousPeriodStart,
		previousPeriodEnd: previousPeriodEnd,
	});
	console.log("SUPPLY STATS", supplyStats);
	const executionStats = await getExecutionStats({
		collection: collection,
		currentPeriodStart: periodStart,
		currentPeriodEnd: periodEnd,
		previousPeriodStart: previousPeriodStart,
		previousPeriodEnd: previousPeriodEnd,
	});
	console.log("EXECUTION STATS", executionStats);
	// const installationStats = await getInstallationStats({ collection: collection, partialQuery: partialQuery })
	const homologationStats = await getHomologationStats({
		collection: collection,
		currentPeriodStart: periodStart,
		currentPeriodEnd: periodEnd,
		previousPeriodStart: previousPeriodStart,
		previousPeriodEnd: previousPeriodEnd,
	});
	console.log("HOMOLOGATION STATS", homologationStats);
	// const salesRanking = await getSalesRanking({ collection: collection, partialQuery: partialQuery })
	const nps = await getNPS({ collection: collection });
	console.log("NPS", nps);
	// const goals = await getCompanyGoalsStats({ collection, partialQuery: {} })
	const stats = {
		comercial: commercialStats,
		suprimentos: supplyStats,
		execucao: executionStats,
		homologacao: homologationStats,
		nps: nps,
	};
	return {
		data: stats,
	};
}
export type TGetDashboardStatsOutput = Awaited<ReturnType<typeof getStats>>;

const getStatsHandler: NextApiHandler<TGetDashboardStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const stats = await getStats({ session });
	res.status(200).json(stats);
};

type TGetCommercialStatsParams = {
	collection: Collection<TProject>;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	previousPeriodStart: string;
	previousPeriodEnd: string;
};
async function getCommercialStats({
	collection,
	currentPeriodStart,
	currentPeriodEnd,
	previousPeriodStart,
	previousPeriodEnd,
}: TGetCommercialStatsParams) {
	const statsResult = await collection
		.aggregate([
			{
				$match: {
					"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
				},
			},
			{
				$group: {
					_id: {},
					qtdeVendidaAtual: {
						$sum: {
							$cond: [
								{
									$and: [{ $gte: ["$contrato.dataAssinatura", currentPeriodStart] }, { $lte: ["$contrato.dataAssinatura", currentPeriodEnd] }],
								},
								1,
								0,
							],
						},
					},
					qtdeVendidaAnterior: {
						$sum: {
							$cond: [
								{ $and: [{ $gte: ["$contrato.dataAssinatura", previousPeriodStart] }, { $lte: ["$contrato.dataAssinatura", previousPeriodEnd] }] },
								1,
								0,
							],
						},
					},
					potenciaVendidaUFVAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
										{
											$in: ["$tipoDeServico", ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"]],
										},
									],
								},
								"$sistema.potPico",
								0,
							],
						},
					},
					potenciaVendidaUFVAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
										{
											$in: ["$tipoDeServico", ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"]],
										},
									],
								},
								"$sistema.potPico",
								0,
							],
						},
					},
					valorProjetoVendidoAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
									],
								},
								"$sistema.valorProjeto",
								0,
							],
						},
					},
					valorProjetoVendidoAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
									],
								},
								"$sistema.valorProjeto",
								0,
							],
						},
					},
					valorOeMVendidoAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
									],
								},
								"$oem.valor",
								0,
							],
						},
					},
					valorOeMVendidoAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
									],
								},
								"$oem.valor",
								0,
							],
						},
					},
					valorPadraoVendidoAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
									],
								},
								"$padrao.valor",
								0,
							],
						},
					},
					valorPadraoVendidoAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
									],
								},
								"$padrao.valor",
								0,
							],
						},
					},
					valorEstruturaPersonalizadaVendidoAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
									],
								},
								"$estruturaPersonalizada.valor",
								0,
							],
						},
					},
					valorEstruturaPersonalizadaVendidoAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
									],
								},
								"$estruturaPersonalizada.valor",
								0,
							],
						},
					},
					valorSeguroVendidoAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", currentPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", currentPeriodEnd],
										},
									],
								},
								"$seguro.valor",
								0,
							],
						},
					},
					valorSeguroVendidoAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ["$contrato.dataAssinatura", previousPeriodStart],
										},
										{
											$lte: ["$contrato.dataAssinatura", previousPeriodEnd],
										},
									],
								},
								"$seguro.valor",
								0,
							],
						},
					},
				},
			},
		])
		.toArray();

	const [stats] = statsResult;

	const currentPeriodTotalSold =
		stats.valorProjetoVendidoAtual +
		stats.valorOeMVendidoAtual +
		stats.valorPadraoVendidoAtual +
		stats.valorEstruturaPersonalizadaVendidoAtual +
		stats.valorSeguroVendidoAtual;

	const previousPeriodTotalSold =
		stats.valorProjetoVendidoAnterior +
		stats.valorOeMVendidoAnterior +
		stats.valorPadraoVendidoAnterior +
		stats.valorEstruturaPersonalizadaVendidoAnterior +
		stats.valorSeguroVendidoAnterior;

	return {
		qtdeVendida: {
			atual: Number(stats.qtdeVendidaAtual),
			anterior: Number(stats.qtdeVendidaAnterior),
		},
		potenciaVendidaUFV: {
			atual: Number(stats.potenciaVendidaUFVAtual ?? 0),
			anterior: Number(stats.potenciaVendidaUFVAnterior ?? 0),
		},
		valorVendido: {
			atual: Number(currentPeriodTotalSold),
			anterior: Number(previousPeriodTotalSold),
		},
	};
}

type TGetSupplyStatsParams = {
	collection: Collection<TProject>;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	previousPeriodStart: string;
	previousPeriodEnd: string;
};
async function getSupplyStats({ collection, currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd }: TGetSupplyStatsParams) {
	const statsResult = await collection
		.aggregate([
			{
				$match: {
					"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
				},
			},
			{
				$group: {
					_id: {},
					qtdePedidosAtual: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$compra.dataPedido", currentPeriodStart] }, { $lte: ["$compra.dataPedido", currentPeriodEnd] }] }, 1, 0],
						},
					},
					qtdePedidosAnterior: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$compra.dataPedido", previousPeriodStart] }, { $lte: ["$compra.dataPedido", previousPeriodEnd] }] }, 1, 0],
						},
					},
					qtdeEntregasAtual: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$compra.dataEntrega", currentPeriodStart] }, { $lte: ["$compra.dataEntrega", currentPeriodEnd] }] }, 1, 0],
						},
					},
					qtdeEntregasAnterior: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$compra.dataEntrega", previousPeriodStart] }, { $lte: ["$compra.dataEntrega", previousPeriodEnd] }] }, 1, 0],
						},
					},
					tempoMedioEntregaAtual: {
						$avg: {
							$cond: [
								{
									$and: [{ $gte: ["$compra.dataEntrega", currentPeriodStart] }, { $lte: ["$compra.dataEntrega", currentPeriodEnd] }],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$compra.dataEntrega",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$compra.dataPedido",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
					tempoMedioEntregaAnterior: {
						$avg: {
							$cond: [
								{
									$and: [{ $gte: ["$compra.dataEntrega", previousPeriodStart] }, { $lte: ["$compra.dataEntrega", previousPeriodEnd] }],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$compra.dataEntrega",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$compra.dataPedido",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
				},
			},
		])
		.toArray();

	const [stats] = statsResult;

	return {
		qtdePedidos: {
			atual: Number(stats.qtdePedidosAtual),
			anterior: Number(stats.qtdePedidosAnterior),
		},
		qtdeEntregas: {
			atual: Number(stats.qtdeEntregasAtual),
			anterior: Number(stats.qtdeEntregasAnterior),
		},
		tempoMedioEntrega: {
			atual: Number(stats.tempoMedioEntregaAtual),
			anterior: Number(stats.tempoMedioEntregaAnterior),
		},
	};
}

type TExecutionStats = {
	collection: Collection<TProject>;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	previousPeriodStart: string;
	previousPeriodEnd: string;
};
async function getExecutionStats({ collection, currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd }: TExecutionStats) {
	const statsResult = await collection
		.aggregate([
			{
				$match: {
					"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
				},
			},
			{
				$group: {
					_id: {},
					qtdeIniciadosAtual: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$obra.entrada", currentPeriodStart] }, { $lte: ["$obra.entrada", currentPeriodEnd] }] }, 1, 0],
						},
					},
					qtdeIniciadosAnterior: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$obra.entrada", previousPeriodStart] }, { $lte: ["$obra.entrada", previousPeriodEnd] }] }, 1, 0],
						},
					},
					qtdeConcluidosAtual: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$obra.saida", currentPeriodStart] }, { $lte: ["$obra.saida", currentPeriodEnd] }] }, 1, 0],
						},
					},
					qtdeConcluidosAnterior: {
						$sum: {
							$cond: [{ $and: [{ $gte: ["$obra.saida", previousPeriodStart] }, { $lte: ["$obra.saida", previousPeriodEnd] }] }, 1, 0],
						},
					},
					tempoMedioExecucaoAtual: {
						$avg: {
							$cond: [
								{
									$and: [{ $gte: ["$obra.saida", currentPeriodStart] }, { $lte: ["$obra.saida", currentPeriodEnd] }],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$obra.entrada",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$obra.saida",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
					tempoMedioExecucaoAnterior: {
						$avg: {
							$cond: [
								{
									$and: [{ $gte: ["$obra.saida", previousPeriodStart] }, { $lte: ["$obra.saida", previousPeriodEnd] }],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$obra.entrada",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$obra.saida",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
				},
			},
		])
		.toArray();
	const [stats] = statsResult;

	return {
		qtdeIniciados: {
			atual: Number(stats.qtdeIniciadosAtual),
			anterior: Number(stats.qtdeIniciadosAnterior),
		},
		qtdeConcluidos: {
			atual: Number(stats.qtdeConcluidosAtual),
			anterior: Number(stats.qtdeConcluidosAnterior),
		},
		tempoMedioExecucao: {
			atual: Number(stats.tempoMedioExecucaoAtual),
			anterior: Number(stats.tempoMedioExecucaoAnterior),
		},
	};
}

type TGetHomologationStatsParams = {
	collection: Collection<TProject>;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	previousPeriodStart: string;
	previousPeriodEnd: string;
};
async function getHomologationStats({
	collection,
	currentPeriodStart,
	currentPeriodEnd,
	previousPeriodStart,
	previousPeriodEnd,
}: TGetHomologationStatsParams) {
	const statsResult = await collection
		.aggregate([
			{
				$match: {
					"contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
				},
			},
			{
				$group: {
					_id: {},
					qtdeSolicitacoesFeitasAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $gte: ["$homologacao.acesso.dataSolicitacao", currentPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataSolicitacao", currentPeriodEnd] },
									],
								},
								1,
								0,
							],
						},
					},
					qtdeSolicitacoesFeitasAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $gte: ["$homologacao.acesso.dataSolicitacao", previousPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataSolicitacao", previousPeriodEnd] },
									],
								},
								1,
								0,
							],
						},
					},
					qtdeSolicitacoesAprovadasAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", currentPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", currentPeriodEnd] },
									],
								},
								1,
								0,
							],
						},
					},
					qtdeSolicitacoesAprovadasAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", previousPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", previousPeriodEnd] },
									],
								},
								1,
								0,
							],
						},
					},
					potenciaSolicitacoesAprovadasAtual: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", currentPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", currentPeriodEnd] },
									],
								},
								"$homologacao.acesso.potencia",
								0,
							],
						},
					},
					potenciaSolicitacoesAprovadasAnterior: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", previousPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", previousPeriodEnd] },
									],
								},
								"$homologacao.acesso.potencia",
								0,
							],
						},
					},
					tempoMedioAprovacaoAtual: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", currentPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", currentPeriodEnd] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$homologacao.acesso.dataSolicitacao",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$homologacao.acesso.dataResposta",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
					tempoMedioAprovacaoAnterior: {
						$avg: {
							$cond: [
								{
									$and: [
										{ $eq: ["$homologacao.acesso.status", "APROVADO"] },
										{ $gte: ["$homologacao.acesso.dataResposta", previousPeriodStart] },
										{ $lte: ["$homologacao.acesso.dataResposta", previousPeriodEnd] },
									],
								},
								{
									$dateDiff: {
										startDate: {
											$dateFromString: {
												dateString: "$homologacao.acesso.dataSolicitacao",
											},
										},
										endDate: {
											$dateFromString: {
												dateString: "$homologacao.acesso.dataResposta",
											},
										},
										unit: "day",
									},
								},
								"-", // non-numerical to force avg to ignore
							],
						},
					},
				},
			},
		])
		.toArray();
	const [stats] = statsResult;
	return {
		qtdeSolicitacoesFeitas: {
			atual: Number(stats.qtdeSolicitacoesFeitasAtual),
			anterior: Number(stats.qtdeSolicitacoesFeitasAnterior),
		},
		qtdeSolicitacoesAprovadas: {
			atual: Number(stats.qtdeSolicitacoesAprovadasAtual),
			anterior: Number(stats.qtdeSolicitacoesAprovadasAnterior),
		},
		potenciaSolicitacoesAprovadas: {
			atual: Number(stats.potenciaSolicitacoesAprovadasAtual),
			anterior: Number(stats.potenciaSolicitacoesAprovadasAnterior),
		},
		tempoMedioAprovacao: {
			atual: Number(stats.tempoMedioAprovacaoAtual),
			anterior: Number(stats.tempoMedioAprovacaoAnterior),
		},
	};
}

// async function getSalesRanking({ collection, partialQuery }: GetStats) {
//   const firstDayString = getFirstDayOfMonth({})
//   console.log(firstDayString)
//   try {
//     const ranking = await collection
//       .aggregate([
//         {
//           $match: {
//             'contrato.dataAssinatura': { $gte: firstDayString },
//             tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
//           },
//         },
//         {
//           $group: {
//             _id: '$vendedor.nome',
//             potencia: {
//               $sum: '$sistema.potPico',
//             },
//           },
//         },
//         {
//           $sort: {
//             potencia: -1,
//           },
//         },
//         {
//           $limit: 5,
//         },
//       ])
//       .toArray()
//     return {
//       primeiro: {
//         nome: ranking[0]?._id as string,
//         potencia: ranking[0]?.potencia as number,
//       },
//       segundo: {
//         nome: ranking[1]?._id as string,
//         potencia: ranking[1]?.potencia as number,
//       },
//       terceiro: {
//         nome: ranking[2]?._id as string,
//         potencia: ranking[2]?.potencia as number,
//       },
//       quarto: {
//         nome: ranking[3]?._id as string,
//         potencia: ranking[3]?.potencia as number,
//       },
//       quinto: {
//         nome: ranking[4]?._id as string,
//         potencia: ranking[4]?.potencia as number,
//       },
//     }
//   } catch (error) {
//     throw error
//   }
// }

type TGetNPSParams = {
	collection: Collection<TProject>;
};
async function getNPS({ collection }: TGetNPSParams) {
	try {
		const promotores = await collection
			.aggregate([
				{
					$match: {
						nps: { $gte: 9 },
					},
				},
				{
					$count: "nps",
				},
			])
			.toArray();

		const detratores = await collection
			.aggregate([
				{
					$match: {
						nps: { $lte: 6 },
					},
				},
				{
					$count: "nps",
				},
			])
			.toArray();
		const consultasTotais = await collection
			.aggregate([
				{
					$match: {
						$and: [{ nps: { $gte: 0 } }, { nps: { $lte: 10 } }],
					},
				},
				{
					$count: "nps",
				},
			])
			.toArray();
		const nps = ((promotores[0].nps - detratores[0].nps) * 100) / consultasTotais[0].nps;
		return nps as number;
	} catch (error) {
		throw error;
	}
}
// async function getAchievedPowerSale({ collection, partialQuery }: GetStats) {
//   const firstDayString = getFirstDayOfMonth({})
//   const powerAccumutated = await collection
//     .aggregate([
//       {
//         $match: {
//           'contrato.dataAssinatura': { $gte: firstDayString },
//           tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
//         },
//       },
//       {
//         $group: {
//           _id: {},
//           sum: {
//             $sum: '$sistema.potPico',
//           },
//         },
//       },
//     ])
//     .toArray()
//   const power = powerAccumutated[0]?.sum || 0
//   return power
// }

// export async function getCompanyGoalsStats({ collection, partialQuery }: GetStats) {
//   const GOAL_INITIAL_DATE_PARAM = '2025-01-01T00:00:00.000Z'
//   const GOAL_END_DATE_PARAM = '2025-06-30T23:59:59.999Z'
//   // Define queries for all company goals
//   // 1 - Sistema Fotovoltaico + Aumento - R$ 5.000.000,00 geral /  R$ 833.333,33/mes (contando a partir de 01/07 )
//   // 2 - O&M + Montagem e Desmontagem - R$ 90.000,00 geral /  R$ 15.000,00/mes (contando a partir de 01/07 )
//   // 3 - Inside Sales (somente OUTBOUND) - R$ 700.000,00 geral / R$ 83.333,33/mes (contando a partir de 01/07)
//   // 4 - Seguro Solar - R$ 12.000,00 geral / R$ 2.000,00/mes (contando a partir de 01/07)
//   // 4 - Consórcio de Energia - R$ 150.000,00 geral / R$ 25.000,00/mes (contando a partir de 01/07)

//   // SISTEMA FOTOVOLTAICO
//   const solarPowerPlants = await collection
//     .aggregate([
//       {
//         $match: {
//           'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: GOAL_END_DATE_PARAM },
//           tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
//         },
//       },
//       {
//         $group: {
//           _id: '$vendedor.nome',
//           valorProjeto: {
//             $sum: '$sistema.valorProjeto',
//           },
//           valorPadrao: {
//             $sum: '$padrao.valor',
//           },
//           valorEstrutura: {
//             $sum: '$estruturaPersonalizada.valor',
//           },
//         },
//       },
//     ])
//     .toArray()
//   const SISTEMA_FOTOVOLTAICO = solarPowerPlants.reduce(
//     (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
//       const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
//       const currentSeller = current._id as string
//       if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

//       acc.porVendedor[currentSeller] += currentTotal
//       acc.total += currentTotal
//       return acc
//     },
//     { total: 0, porVendedor: {} }
//   )
//   // O&M + MONTAGEM DESMONTAGEM
//   const maintenance = await collection
//     .aggregate([
//       {
//         $match: {
//           _id: { $ne: new ObjectId('66981e5340f27828dd49a6cb') },
//           'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: GOAL_END_DATE_PARAM },
//           tipoDeServico: {
//             $in: [
//               'OPERAÇÃO E MANUTENÇÃO',
//               'MONTAGEM E DESMONTAGEM',
//               'PRODUTOS',
//               'MANUTENÇÃO CORRETIVA',
//               'PRODUTOS E SERVIÇOS AVULSOS',
//               'MONITORAMENTO',
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: '$vendedor.nome',
//           valorProjeto: {
//             $sum: '$sistema.valorProjeto',
//           },
//           valorPadrao: {
//             $sum: '$padrao.valor',
//           },
//           valorEstrutura: {
//             $sum: '$estruturaPersonalizada.valor',
//           },
//         },
//       },
//     ])
//     .toArray()
//   const OEM_MONTAGEM_DESMONTAGEM = maintenance.reduce(
//     (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
//       const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
//       const currentSeller = current._id as string
//       if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

//       acc.porVendedor[currentSeller] += currentTotal
//       acc.total += currentTotal
//       return acc
//     },
//     { total: 0, porVendedor: {} }
//   )

//   // INSIDE SALES
//   // TODO: utilizar dos responsáveis do CRM para atualizar o campo de INSIDER dos projetos
//   // TODO: utilizar do campo de idOportunidade do CRM para demarcar vendas por INBOUND marketing
//   const insiderNames = [
//     'ALESSANDER IDALECIO',
//     'YASMIM ARAUJO',
//     'LAYANE FERNANDA',
//     'AMANDA SANTOS',
//     'DANDARA LINA',
//     'LEONARDO VITAL',
//     'ANDY CALAZANS',
//     'HALINA OLIVEIRA',
//     'MARCONI ÁTILA',
//     'SHIRLEY VANESSA',
//     'VITOR FERNANDES',
//     'SARAH AZEVEDO',
//     'SOLANGE MEDEIROS',
//     'JOÃO VICTOR',
//   ]
//   const insideSales = await collection
//     .aggregate([
//       {
//         $match: {
//           idMarketing: null,
//           'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: GOAL_END_DATE_PARAM },
//           $or: [{ insider: { $nin: [null, 'NÃO DEFINIDO'] } }, { 'vendedor.nome': { $in: insiderNames } }],
//           tipoDeServico: { $ne: 'CONSÓRCIO DE ENERGIA' },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             vendedor: '$vendedor.nome',
//             insider: '$insider',
//           },
//           valorProjeto: {
//             $sum: '$sistema.valorProjeto',
//           },
//           valorPadrao: {
//             $sum: '$padrao.valor',
//           },
//           valorEstrutura: {
//             $sum: '$estruturaPersonalizada.valor',
//           },
//         },
//       },
//     ])
//     .toArray()
//   const INSIDE_SALES = insideSales.reduce(
//     (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
//       const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
//       const currentInsider = current._id.insider as string
//       const currentSeller = current._id.vendedor as string
//       const currentReference = currentInsider || currentSeller
//       if (!acc.porVendedor[currentReference]) acc.porVendedor[currentReference] = 0

//       acc.porVendedor[currentReference] += currentTotal
//       acc.total += currentTotal
//       return acc
//     },
//     { total: 0, porVendedor: {} }
//   )

//   // SEGURO
//   const insurance = await collection
//     .aggregate([
//       {
//         $match: {
//           'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: GOAL_END_DATE_PARAM },
//           tipoDeServico: 'SEGURO DE SISTEMA FOTOVOLTAICO',
//         },
//       },
//       {
//         $group: {
//           _id: '$vendedor.nome',
//           valorProjeto: {
//             $sum: '$sistema.valorProjeto',
//           },
//           valorPadrao: {
//             $sum: '$padrao.valor',
//           },
//           valorEstrutura: {
//             $sum: '$estruturaPersonalizada.valor',
//           },
//         },
//       },
//     ])
//     .toArray()
//   const SEGURO_FOTOVOLTAICO = insurance.reduce(
//     (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
//       const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
//       const currentSeller = current._id as string
//       if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0

//       acc.porVendedor[currentSeller] += currentTotal
//       acc.total += currentTotal
//       return acc
//     },
//     { total: 0, porVendedor: {} }
//   )
//   // CONSÓRCIO DE ENERGIA
//   const energyConsortium = await collection
//     .aggregate([
//       {
//         $match: {
//           'contrato.dataAssinatura': { $gte: GOAL_INITIAL_DATE_PARAM, $lte: GOAL_END_DATE_PARAM },
//           tipoDeServico: 'CONSÓRCIO DE ENERGIA',
//         },
//       },
//       {
//         $group: {
//           _id: '$vendedor.nome',
//           valorProjeto: {
//             $sum: '$sistema.valorProjeto',
//           },
//           valorPadrao: {
//             $sum: '$padrao.valor',
//           },
//           valorEstrutura: {
//             $sum: '$estruturaPersonalizada.valor',
//           },
//         },
//       },
//     ])
//     .toArray()

//   const CONSORCIO_ENERGIA = energyConsortium.reduce(
//     (acc: { total: number; porVendedor: { [key: string]: number } }, current) => {
//       const currentTotal = current.valorProjeto + current.valorPadrao + current.valorEstrutura
//       const currentSeller = current._id as string

//       if (!acc.porVendedor[currentSeller]) acc.porVendedor[currentSeller] = 0
//       acc.porVendedor[currentSeller] += currentTotal
//       acc.total += currentTotal
//       return acc
//     },
//     {
//       total: 0,
//       porVendedor: {},
//     }
//   )
//   console.log(GOAL_INITIAL_DATE_PARAM, GOAL_END_DATE_PARAM)
//   return {
//     'SISTEMA FOTOVOLTAICO': {
//       TOTAL: SISTEMA_FOTOVOLTAICO.total,
//       RANKING: Object.entries(SISTEMA_FOTOVOLTAICO.porVendedor)
//         .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
//         .sort((a, b) => b.TOTAL - a.TOTAL),
//     },
//     'OPERAÇÃO E MANUTENÇÃO': {
//       TOTAL: OEM_MONTAGEM_DESMONTAGEM.total,
//       RANKING: Object.entries(OEM_MONTAGEM_DESMONTAGEM.porVendedor)
//         .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
//         .sort((a, b) => b.TOTAL - a.TOTAL),
//     },
//     'INSIDE SALES': {
//       TOTAL: INSIDE_SALES.total,
//       RANKING: Object.entries(INSIDE_SALES.porVendedor)
//         .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
//         .sort((a, b) => b.TOTAL - a.TOTAL),
//     },
//     'SEGURO DE SISTEMA FOTOVOLTAICO': {
//       TOTAL: SEGURO_FOTOVOLTAICO.total,
//       RANKING: Object.entries(SEGURO_FOTOVOLTAICO.porVendedor)
//         .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
//         .sort((a, b) => b.TOTAL - a.TOTAL),
//     },
//     'CONSÓRCIO DE ENERGIA': {
//       TOTAL: CONSORCIO_ENERGIA.total,
//       RANKING: Object.entries(CONSORCIO_ENERGIA.porVendedor)
//         .map(([seller, total]) => ({ RESPONSAVEL: seller, TOTAL: total }))
//         .sort((a, b) => b.TOTAL - a.TOTAL),
//     },
//   }
// }
export default apiHandler({
	GET: getStatsHandler,
});
