import type { TProject } from "@/utils/schemas/projects";
import type { Collection, Filter } from "mongodb";

const UFV_SERVICES_QUERY = { tipoDeServico: { $in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] } };

/**
 * UFV SALE STATS
 */
type GetUFVSaleStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getUFVSaleStats({ collection, partialQuery }: GetUFVSaleStatsParam) {
	const stats = await collection
		.aggregate([
			{
				$match: {
					...UFV_SERVICES_QUERY,
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {},
					qtdeVendida: {
						$count: {},
					},
					potenciaVendida: {
						$sum: "$sistema.potPico",
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
		potenciaVendida: (saleStats.potenciaVendida ?? 0) as number,
		valorVendido: totalSold,
		valorProjetoVendido: (saleStats.valorProjetoVendido ?? 0) as number,
		valorOeMVendido: (saleStats.valorOeMVendido ?? 0) as number,
		valorPadraoVendido: (saleStats.valorPadraoVendido ?? 0) as number,
		valorEstruturaPersonalizadaVendido: (saleStats.valorEstruturaPersonalizadaVendido ?? 0) as number,
		valorSeguroVendido: (saleStats.valorSeguroVendido ?? 0) as number,
	};
}
export type TUFVSaleStats = Awaited<ReturnType<typeof getUFVSaleStats>>;

/**
 * UFV INSTALLATION STATS
 */
type TUFVInstallationStatsReduced = {
	qtdeInstalada: number;
	potenciaInstalada: number;
	numeroPaineisInstalados: number;
	porCidade: Record<
		string,
		{
			qtdeInstalada: number;
			potenciaInstalada: number;
			numeroPaineisInstalados: number;
		}
	>;
	porEstado: Record<
		string,
		{
			qtdeInstalada: number;
			potenciaInstalada: number;
			numeroPaineisInstalados: number;
		}
	>;
};
type GetUFVInstallationStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getUFVInstallationStats({ collection, partialQuery }: GetUFVInstallationStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{
				$match: {
					...UFV_SERVICES_QUERY,
					...partialQuery,
				},
			},
			{
				$group: {
					_id: {
						cidade: "$cidade",
						estado: "$uf",
					},
					qtdeInstalada: {
						$count: {},
					},
					potenciaInstalada: {
						$sum: "$sistema.potPico",
					},
					numeroPaineisInstalados: {
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
		qtdeInstalada: number;
		potenciaInstalada: number;
		numeroPaineisInstalados: number;
	}[];

	// Reduzir para o modelo do tipo
	const reduced: TUFVInstallationStatsReduced = {
		qtdeInstalada: 0,
		potenciaInstalada: 0,
		numeroPaineisInstalados: 0,
		porCidade: {},
		porEstado: {},
	};

	statsByCityState.reduce((acc, stat) => {
		// Totais gerais
		acc.qtdeInstalada += stat.qtdeInstalada ?? 0;
		acc.potenciaInstalada += stat.potenciaInstalada ?? 0;
		acc.numeroPaineisInstalados += stat.numeroPaineisInstalados ?? 0;

		// Por cidade
		const cidade = stat._id.cidade || "NÃO INFORMADO";
		if (!acc.porCidade[cidade]) {
			acc.porCidade[cidade] = {
				qtdeInstalada: 0,
				potenciaInstalada: 0,
				numeroPaineisInstalados: 0,
			};
		}
		acc.porCidade[cidade].qtdeInstalada += stat.qtdeInstalada ?? 0;
		acc.porCidade[cidade].potenciaInstalada += stat.potenciaInstalada ?? 0;
		acc.porCidade[cidade].numeroPaineisInstalados += stat.numeroPaineisInstalados ?? 0;

		// Por estado
		const estado = stat._id.estado || "NÃO INFORMADO";
		if (!acc.porEstado[estado]) {
			acc.porEstado[estado] = {
				qtdeInstalada: 0,
				potenciaInstalada: 0,
				numeroPaineisInstalados: 0,
			};
		}
		acc.porEstado[estado].qtdeInstalada += stat.qtdeInstalada ?? 0;
		acc.porEstado[estado].potenciaInstalada += stat.potenciaInstalada ?? 0;
		acc.porEstado[estado].numeroPaineisInstalados += stat.numeroPaineisInstalados ?? 0;

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
		qtdeInstalada: reduced.qtdeInstalada,
		potenciaInstalada: reduced.potenciaInstalada,
		numeroPaineisInstalados: reduced.numeroPaineisInstalados,
		numeroCidadesInstaladas: Object.keys(reduced.porCidade).length,
		numeroEstadosInstalados: Object.keys(reduced.porEstado).length,
		porCidade: porCidadeArray,
		porEstado: porEstadoArray,
	};
}
export type TUFVInstallationStats = Awaited<ReturnType<typeof getUFVInstallationStats>>;

/**
 * UFV HOMOLOGATION STATS
 */
type TUFVHomologationStatsReduced = {
	qtdeHomologada: number;
	potenciaHomologada: number;
	numeroPaineisHomologados: number;
	porCidade: Record<
		string,
		{
			qtdeHomologada: number;
			potenciaHomologada: number;
			numeroPaineisHomologados: number;
		}
	>;
	porEstado: Record<
		string,
		{
			qtdeHomologada: number;
			potenciaHomologada: number;
			numeroPaineisHomologados: number;
		}
	>;
};
type GetUFVHomologationStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
export async function getUFVHomologationStats({ collection, partialQuery }: GetUFVHomologationStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{
				$match: {
					...UFV_SERVICES_QUERY,
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
		numeroPaineisHomologados: number;
	}[];

	// Reduzir para o modelo do tipo
	const reduced: TUFVHomologationStatsReduced = {
		qtdeHomologada: 0,
		potenciaHomologada: 0,
		numeroPaineisHomologados: 0,
		porCidade: {},
		porEstado: {},
	};

	statsByCityState.reduce((acc, stat) => {
		// Totais gerais
		acc.qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.potenciaHomologada += stat.potenciaHomologada ?? 0;
		acc.numeroPaineisHomologados += stat.numeroPaineisHomologados ?? 0;

		// Por cidade
		const cidade = stat._id.cidade || "NÃO INFORMADO";
		if (!acc.porCidade[cidade]) {
			acc.porCidade[cidade] = {
				qtdeHomologada: 0,
				potenciaHomologada: 0,
				numeroPaineisHomologados: 0,
			};
		}
		acc.porCidade[cidade].qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.porCidade[cidade].potenciaHomologada += stat.potenciaHomologada ?? 0;
		acc.porCidade[cidade].numeroPaineisHomologados += stat.numeroPaineisHomologados ?? 0;

		// Por estado
		const estado = stat._id.estado || "NÃO INFORMADO";
		if (!acc.porEstado[estado]) {
			acc.porEstado[estado] = {
				qtdeHomologada: 0,
				potenciaHomologada: 0,
				numeroPaineisHomologados: 0,
			};
		}
		acc.porEstado[estado].qtdeHomologada += stat.qtdeHomologada ?? 0;
		acc.porEstado[estado].potenciaHomologada += stat.potenciaHomologada ?? 0;
		acc.porEstado[estado].numeroPaineisHomologados += stat.numeroPaineisHomologados ?? 0;

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
		numeroPaineisHomologados: reduced.numeroPaineisHomologados,
		numeroCidadesHomologadas: Object.keys(reduced.porCidade).length,
		numeroEstadosHomologados: Object.keys(reduced.porEstado).length,
		porCidade: porCidadeArray,
		porEstado: porEstadoArray,
	};
}
export type TUFVHomologationStats = Awaited<ReturnType<typeof getUFVHomologationStats>>;
