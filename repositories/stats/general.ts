import type { Collection, Filter } from "mongodb";
import type { TProject } from "@/utils/schemas/projects";

type TGeneralNPSParams = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getGeneralNPS({ collection, partialQuery }: TGeneralNPSParams) {
	const stats = (await collection
		.aggregate([
			{
				$match: {
					"contrato.status": "ASSINADO",
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {},
					promotores: {
						$sum: {
							$cond: [
								{
									$and: [{ $ne: ["$nps", null] }, { $in: ["$nps", [9, 10]] }],
								},
								1,
								0,
							],
						},
					},
					detratores: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $ne: ["$nps", null] },
										{
											$in: ["$nps", [0, 1, 2, 3, 4, 5, 6]],
										},
									],
								},
								1,
								0,
							],
						},
					},
					consultas: {
						$sum: {
							$cond: [
								{
									$and: [{ $ne: ["$nps", null] }, { $gte: ["$nps", 0] }, { $lte: ["$nps", 10] }],
								},
								1,
								0,
							],
						},
					},
				},
			},
		])
		.toArray()) as {
		promotores: number;
		detratores: number;
		consultas: number;
	}[];
	const [npsStats] = stats;
	const nps = ((npsStats.promotores - npsStats.detratores) * 100) / npsStats.consultas;
	return nps;
}
type GetGeneralSalesStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getGeneralSalesStats({ collection, partialQuery }: GetGeneralSalesStatsParam) {
	const stats = await collection
		.aggregate([
			{
				$match: {
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {},
					qtdeVendida: {
						$count: {},
					},
					valorProjetoVendido: {
						$sum: "$sistema.valorProjeto",
					},
					valorOeMVendido: {
						$sum: "$oem.valor",
					},
					valorPadraoVendido: {
						$sum: "$padrao.valor",
					},
					valorEstruturaPersonalizadaVendido: {
						$sum: "$estruturaPersonalizada.valor",
					},
					valorSeguroVendido: {
						$sum: "$seguro.valor",
					},
				},
			},
		])
		.toArray();

	const [saleStats] = stats;

	const totalSold =
		saleStats.valorProjetoVendido +
		saleStats.valorOeMVendido +
		saleStats.valorPadraoVendido +
		saleStats.valorEstruturaPersonalizadaVendido +
		saleStats.valorSeguroVendido;
	return {
		qtdeVendida: (saleStats.qtdeVendida ?? 0) as number,
		valorVendido: totalSold as number,
		valorProjetoVendido: (saleStats.valorProjetoVendido ?? 0) as number,
		valorOeMVendido: (saleStats.valorOeMVendido ?? 0) as number,
		valorPadraoVendido: (saleStats.valorPadraoVendido ?? 0) as number,
		valorEstruturaPersonalizadaVendido: (saleStats.valorEstruturaPersonalizadaVendido ?? 0) as number,
		valorSeguroVendido: (saleStats.valorSeguroVendido ?? 0) as number,
	};
}
export type TGeneralSalesStats = Awaited<ReturnType<typeof getGeneralSalesStats>>;

type TServiceExecutionStatsReduced = {
	qtdeExecutada: number;
	porCidade: Record<
		string,
		{
			qtdeExecutada: number;
		}
	>;
	porEstado: Record<
		string,
		{
			qtdeExecutada: number;
		}
	>;
};

type TGetGeneralServiceExecutionStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getGeneralServiceExecutionStats({ collection, partialQuery }: TGetGeneralServiceExecutionStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{
				$match: {
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {
						cidade: "$cidade",
						estado: "$uf",
					},
					qtdeExecutada: {
						$count: {},
					},
				},
			},
		])
		.toArray()) as {
		_id: {
			cidade: string;
			estado: string;
		};
		qtdeExecutada: number;
	}[];

	// Reduzir para o modelo do tipo
	const reduced: TServiceExecutionStatsReduced = {
		qtdeExecutada: 0,
		porCidade: {},
		porEstado: {},
	};

	statsByCityState.reduce((acc, stat) => {
		// Totais gerais
		acc.qtdeExecutada += stat.qtdeExecutada ?? 0;

		// Por cidade
		const cidade = stat._id.cidade || "NÃO INFORMADO";
		if (!acc.porCidade[cidade]) {
			acc.porCidade[cidade] = {
				qtdeExecutada: 0,
			};
		}
		acc.porCidade[cidade].qtdeExecutada += stat.qtdeExecutada ?? 0;

		// Por estado
		const estado = stat._id.estado || "NÃO INFORMADO";
		if (!acc.porEstado[estado]) {
			acc.porEstado[estado] = {
				qtdeExecutada: 0,
			};
		}
		acc.porEstado[estado].qtdeExecutada += stat.qtdeExecutada ?? 0;

		return acc;
	}, reduced);

	// Transformar porCidade e porEstado em arrays com campo "title"
	const porCidadeArray = Object.entries(reduced.porCidade).map(([cidade, obj]) => ({
		titulo: cidade,
		...obj,
	}));
	const porEstadoArray = Object.entries(reduced.porEstado).map(([estado, obj]) => ({
		titulo: estado,
		...obj,
	}));

	return {
		qtdeExecutada: reduced.qtdeExecutada,
		numeroCidadesExecutadas: Object.keys(reduced.porCidade).length,
		numeroEstadosExecutados: Object.keys(reduced.porEstado).length,
		porCidade: porCidadeArray.sort((a, b) => b.qtdeExecutada - a.qtdeExecutada),
		porEstado: porEstadoArray.sort((a, b) => b.qtdeExecutada - a.qtdeExecutada),
	};
}

/**
 * HOMOLOGATION STATS
 */
type THomologationStatsReduced = {
	qtdeHomologada: number;
	potenciaHomologada: number;
	porCidade: Record<
		string,
		{
			qtdeHomologada: number;
			potenciaHomologada: number;
		}
	>;
	porEstado: Record<
		string,
		{
			qtdeHomologada: number;
			potenciaHomologada: number;
		}
	>;
};
type TGetGeneralHomologationStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getGeneralHomologationStats({ collection, partialQuery }: TGetGeneralHomologationStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{
				$match: {
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {
						cidade: "$cidade",
						estado: "$uf",
					},
					qtdeHomologada: {
						$count: {},
					},
					potenciaHomologada: {
						$sum: "$sistema.potPico",
					},
					numeroPaineisHomologados: {
						$sum: "$sistema.qtdeModulos",
					},
				},
			},
		])
		.toArray()) as {
		_id: {
			cidade: string;
			estado: string;
		};
		qtdeHomologada: number;
		potenciaHomologada: number;
	}[];

	// Reduzir para o modelo do tipo
	const reduced: THomologationStatsReduced = {
		qtdeHomologada: 0,
		potenciaHomologada: 0,
		porCidade: {},
		porEstado: {},
	};

	statsByCityState.reduce((acc, stat) => {
		// Totais gerais
		acc.qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.potenciaHomologada += stat.potenciaHomologada ?? 0;

		// Por cidade
		const cidade = stat._id.cidade || "NÃO INFORMADO";
		if (!acc.porCidade[cidade]) {
			acc.porCidade[cidade] = {
				qtdeHomologada: 0,
				potenciaHomologada: 0,
			};
		}
		acc.porCidade[cidade].qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.porCidade[cidade].potenciaHomologada += stat.potenciaHomologada ?? 0;

		// Por estado
		const estado = stat._id.estado || "NÃO INFORMADO";
		if (!acc.porEstado[estado]) {
			acc.porEstado[estado] = {
				qtdeHomologada: 0,
				potenciaHomologada: 0,
			};
		}
		acc.porEstado[estado].qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.porEstado[estado].potenciaHomologada += stat.potenciaHomologada ?? 0;

		return acc;
	}, reduced);

	// Transformar porCidade e porEstado em arrays com campo "title"
	const porCidadeArray = Object.entries(reduced.porCidade).map(([cidade, obj]) => ({
		titulo: cidade,
		...obj,
	}));
	const porEstadoArray = Object.entries(reduced.porEstado).map(([estado, obj]) => ({
		titulo: estado,
		...obj,
	}));

	return {
		qtdeHomologada: reduced.qtdeHomologada,
		potenciaHomologada: reduced.potenciaHomologada,
		numeroCidadesHomologadas: Object.keys(reduced.porCidade).length,
		numeroEstadosHomologados: Object.keys(reduced.porEstado).length,
		porCidade: porCidadeArray.sort((a, b) => b.qtdeHomologada - a.qtdeHomologada),
		porEstado: porEstadoArray.sort((a, b) => b.qtdeHomologada - a.qtdeHomologada),
	};
}

/**
 * SUPPLY STATS
 */
type TSupplyStatsReduced = {
	qtdePedidos: number;
	qtdeEntregas: number;
	porCidade: Record<
		string,
		{
			qtdePedidos: number;
			qtdeEntregas: number;
		}
	>;
	porEstado: Record<
		string,
		{
			qtdePedidos: number;
			qtdeEntregas: number;
		}
	>;
};
type TGetGeneralSupplyStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
	orderCondition: Filter<TProject>;
	deliveryCondition: Filter<TProject>;
};
export async function getGeneralSupplyStats({ collection, partialQuery, orderCondition, deliveryCondition }: TGetGeneralSupplyStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{
				$match: {
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {
						cidade: "$cidade",
						estado: "$uf",
					},
					qtdePedidos: {
						$sum: {
							$cond: [orderCondition, 1, 0],
						},
					},
					qtdeEntregas: {
						$sum: {
							$cond: [deliveryCondition, 1, 0],
						},
					},
				},
			},
		])
		.toArray()) as {
		_id: {
			cidade: string;
			estado: string;
		};
		qtdePedidos: number;
		qtdeEntregas: number;
	}[];

	// Reduzir para o modelo do tipo
	const reduced: TSupplyStatsReduced = {
		qtdePedidos: 0,
		qtdeEntregas: 0,
		porCidade: {},
		porEstado: {},
	};

	statsByCityState.reduce((acc, stat) => {
		// Totais gerais
		acc.qtdePedidos += stat.qtdePedidos ?? 0;
		acc.qtdeEntregas += stat.qtdeEntregas ?? 0;

		// Por cidade
		const cidade = stat._id.cidade || "NÃO INFORMADO";
		if (!acc.porCidade[cidade]) {
			acc.porCidade[cidade] = {
				qtdePedidos: 0,
				qtdeEntregas: 0,
			};
		}
		acc.porCidade[cidade].qtdePedidos += stat.qtdePedidos ?? 0;
		acc.porCidade[cidade].qtdeEntregas += stat.qtdeEntregas ?? 0;

		// Por estado
		const estado = stat._id.estado || "NÃO INFORMADO";
		if (!acc.porEstado[estado]) {
			acc.porEstado[estado] = {
				qtdePedidos: 0,
				qtdeEntregas: 0,
			};
		}
		acc.porEstado[estado].qtdePedidos += stat.qtdePedidos ?? 0;
		acc.porEstado[estado].qtdeEntregas += stat.qtdeEntregas ?? 0;

		return acc;
	}, reduced);

	// Transformar porCidade e porEstado em arrays com campo "title"
	const porCidadeArray = Object.entries(reduced.porCidade).map(([cidade, obj]) => ({
		titulo: cidade,
		...obj,
	}));
	const porEstadoArray = Object.entries(reduced.porEstado).map(([estado, obj]) => ({
		titulo: estado,
		...obj,
	}));

	return {
		qtdePedidos: reduced.qtdePedidos,
		qtdeEntregas: reduced.qtdeEntregas,
		numeroCidadesPedidos: Object.keys(reduced.porCidade).length,
		numeroEstadosPedidos: Object.keys(reduced.porEstado).length,
		porCidade: porCidadeArray.sort((a, b) => b.qtdePedidos - a.qtdePedidos),
		porEstado: porEstadoArray.sort((a, b) => b.qtdePedidos - a.qtdePedidos),
	};
}
