import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { NextApiHandler } from "next";
import { z } from "zod";

const ServiceOrderStatsQueryFiltersSchema = z.object({
	period: z.object(
		{
			after: z
				.string({
					required_error: "Período de tempo é obrigatório",
					invalid_type_error: "Período de tempo deve ser uma string",
				})
				.datetime({
					message: "Período de tempo deve ser uma data válida",
				}),
			before: z
				.string({
					required_error: "Período de tempo é obrigatório",
					invalid_type_error: "Período de tempo deve ser uma string",
				})
				.datetime({
					message: "Período de tempo deve ser uma data válida",
				}),
		},
		{
			required_error: "Parâmetros de período de tempo são obrigatórios",
			invalid_type_error: "Parâmetros de período de tempo deve ser um objeto",
		},
	),
});

type TServiceOrderStatsReduced = {
	iniciadas: number;
	concluidas: number;
	emAndamento: number;
	// porCidade: {
	// 	[key: string]: {
	// 		concluidas: number;
	// 		emAndamento: number;
	// 	};
	// };
	// porResponsavel: {
	// 	[key: string]: {
	// 		concluidas: number;
	// 		emAndamento: number;
	// 	};
	// };
};

export type TServiceOrderStatsInput = z.infer<typeof ServiceOrderStatsQueryFiltersSchema>;
export type TServiceOrderStatsOutput = {
	data: {
		iniciadas: number;
		concluidas: number;
		emAndamento: number;
		// porCidade: {
		// 	nome: string;
		// 	concluidas: number;
		// 	emAndamento: number;
		// }[];
		// porResponsavel: {
		// 	nome: string;
		// 	concluidas: number;
		// 	emAndamento: number;
		// }[];
	};
};
const handleGetServiceOrdersStats: NextApiHandler<TServiceOrderStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const db = await connectToDatabase();
	const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");

	const { period } = ServiceOrderStatsQueryFiltersSchema.parse(req.body);

	const filterPeriodStart = new Date(period.after);
	const filterPeriodEnd = new Date(period.before);
	const serviceOrders = await serviceOrdersCollection
		.find({
			$or: [
				// Getting all service orders started within the period
				{ "periodo.inicio": { $gte: period.after, $lte: period.before } },
				// Getting all service orders finished within the period
				{ "periodo.fim": { $gte: period.after, $lte: period.before } },
				// Getting all ongoing service orders
				{ $and: [{ "periodo.inicio": { $ne: null } }, { "periodo.fim": null }] },
				// Getting all service orders "observacoes" array with length 0
				{ observacoes: { $size: 0 } },
			],
		})
		.toArray();

	const serviceOrderStats = serviceOrders.reduce(
		(acc: TServiceOrderStatsReduced, serviceOrder) => {
			const serviceOrderStart = serviceOrder.periodo.inicio ? new Date(serviceOrder.periodo.inicio) : null;
			const serviceOrderEnd = serviceOrder.periodo.fim ? new Date(serviceOrder.periodo.fim) : null;
			const serviceOrderCity = serviceOrder.localizacao.cidade;
			const serviceOrderResponsible = serviceOrder.responsavel.nome;
			// Adding up "iniciadas" for started within the period
			if (serviceOrderStart && serviceOrderStart >= filterPeriodStart && serviceOrderStart <= filterPeriodEnd) {
				acc.iniciadas++;
			}
			// Adding up "concluidas" for finished within the period
			if (serviceOrderEnd && serviceOrderEnd >= filterPeriodStart && serviceOrderEnd <= filterPeriodEnd) {
				acc.concluidas++;
			}

			// Adding up "emAndamento" for ongoing service orders
			if (serviceOrderStart && !serviceOrderEnd) {
				acc.emAndamento++;
			}
			// if (!acc.porCidade[serviceOrderCity]) {
			// 	acc.porCidade[serviceOrderCity] = {
			// 		concluidas: 0,
			// 		emAndamento: 0,
			// 	};
			// }
			// if (!acc.porResponsavel[serviceOrderResponsible]) {
			// 	acc.porResponsavel[serviceOrderResponsible] = {
			// 		concluidas: 0,
			// 		emAndamento: 0,
			// 	};
			// }
			// // Adding up "concluidas" for finished within the period
			// if (serviceOrderEnd && serviceOrderEnd >= filterPeriodStart && serviceOrderEnd <= filterPeriodEnd) {
			// 	acc.porCidade[serviceOrderCity].concluidas++;
			// 	acc.porResponsavel[serviceOrderResponsible].concluidas++;
			// }
			// // Adding up "emAndamento" for ongoing service orders
			// if (serviceOrderStart && !serviceOrderEnd) {
			// 	acc.porCidade[serviceOrderCity].emAndamento++;
			// 	acc.porResponsavel[serviceOrderResponsible].emAndamento++;
			// }

			return acc;
		},
		{
			iniciadas: 0,
			concluidas: 0,
			emAndamento: 0,
			// porCidade: {},
			// porResponsavel: {},
		},
	);

	return res.status(200).json({
		data: {
			...serviceOrderStats,
			// porCidade: Object.entries(serviceOrderStats.porCidade)
			// 	.map(([key, value]) => ({
			// 		nome: key,
			// 		concluidas: value.concluidas,
			// 		emAndamento: value.emAndamento,
			// 	}))
			// 	.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
			// porResponsavel: Object.entries(serviceOrderStats.porResponsavel)
			// 	.map(([key, value]) => ({
			// 		nome: key,
			// 		concluidas: value.concluidas,
			// 		emAndamento: value.emAndamento,
			// 	}))
			// 	.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
		},
	});
};

export default apiHandler({
	POST: handleGetServiceOrdersStats,
});
