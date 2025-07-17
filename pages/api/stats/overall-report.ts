import type { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { NextApiHandler } from "next";
import type { Collection, Filter } from "mongodb";
import { z } from "zod";
import { apiHandler } from "@/utils/api";

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
type GetSaleStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
async function getSaleStats({ collection, partialQuery }: GetSaleStatsParam) {
	const stats = await collection
		.aggregate([
			{
				$match: {
					tipoDeServico: { $in: ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"] },
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
		saleStats.valorProjetoVendido + saleStats.valorOeMVendido + saleStats.valorPadraoVendido + saleStats.valorEstruturaPersonalizadaVendido + saleStats.valorSeguroVendido;
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

type TInstallationStatsReduced = {
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

type GetInstallationStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};

async function getInstallationStats({ collection, partialQuery }: GetInstallationStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{ $match: { ...partialQuery } },
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
	const reduced: TInstallationStatsReduced = {
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
		porCidade: porCidadeArray,
		porEstado: porEstadoArray,
	};
}
type TInstallationStats = Awaited<ReturnType<typeof getInstallationStats>>;

type THomologationStatsReduced = {
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

type GetHomologationStatsParam = {
	collection: Collection<TProject>;
	partialQuery: Filter<TProject>;
};
async function getHomologationStats({ collection, partialQuery }: GetHomologationStatsParam) {
	const statsByCityState = (await collection
		.aggregate([
			{ $match: { ...partialQuery } },
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
	const reduced: THomologationStatsReduced = {
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
		porCidade: porCidadeArray,
		porEstado: porEstadoArray,
	};
}
type THomologationStats = Awaited<ReturnType<typeof getHomologationStats>>;

async function getOverallReport(payload: z.infer<typeof OverallReportSchema>) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const signingPeriodQuery: Filter<TProject> = {
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

	const saleStats = await getSaleStats({
		collection: projectsCollection,
		partialQuery: signingPeriodQuery,
	});

	const installationStats = await getInstallationStats({
		collection: projectsCollection,
		partialQuery: installationPeriodQuery,
	});

	const homologationStats = await getHomologationStats({
		collection: projectsCollection,
		partialQuery: homologationPeriodQuery,
	});

	return {
		data: {
			vendas: saleStats,
			instalacoes: installationStats,
			homologacoes: homologationStats,
		},
	};
}
export type TOverallReportOutput = Awaited<ReturnType<typeof getOverallReport>>;
const getOverallReportHandler: NextApiHandler<TOverallReportOutput> = async (req, res) => {
	const payload = await OverallReportSchema.parse(req.body);
	const report = await getOverallReport(payload);
	res.status(200).json(report);
};

export default apiHandler({
	POST: getOverallReportHandler,
});
