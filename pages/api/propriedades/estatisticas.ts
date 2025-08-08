import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProperty, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { NextApiHandler } from "next";
import { z } from "zod";

const StatsQueryParamsInputSchema = z.object({
	after: z.string({
		invalid_type_error: "Tipo não válido para o after.",
	}),
	before: z.string({
		invalid_type_error: "Tipo não válido para o before.",
	}),
});

export type TStatsQueryParamsInput = z.infer<typeof StatsQueryParamsInputSchema>;

async function getStats(payload: TStatsQueryParamsInput) {
	const db = await connectToAdministrationDatabase();
	const propertiesCollection = db.collection<TProperty>("propriedades");
	const propertiesUsageCollection = db.collection<TPropertyTemporaryUsage>("propriedades-uso-temporario");
	const totalPropertiesCount = await propertiesCollection.countDocuments();

	const vehiclesPendingRevision = await propertiesCollection.countDocuments({
		"metadados.tipo": "VEÍCULO",
		$expr: {
			$and: [{ $lte: [{ $subtract: ["$metadados.kmProximaRevisao", "$metadados.kmAcumulado"] }, 200] }],
		},
	});
	const vehiclesDueRevision = await propertiesCollection.countDocuments({
		$expr: {
			$lte: [{ $subtract: ["$metadados.kmProximaRevisao", "$metadados.kmAcumulado"] }, 0],
		},
	});

	const temporaryUsagesOpenedWithinPeriod = await propertiesUsageCollection.countDocuments({
		dataInicio: { $gte: payload.after, $lte: payload.before },
	});
	const temporaryUsagesClosedWithinPeriod = await propertiesUsageCollection.countDocuments({
		dataFim: { $gte: payload.after, $lte: payload.before },
	});
	const openTemporaryUsages = await propertiesUsageCollection.countDocuments({
		dataFim: null,
	});
	return {
		data: {
			totalPropriedades: totalPropertiesCount,
			veiculosRevisaoPendente: vehiclesPendingRevision,
			veiculosRevisaoAtrasada: vehiclesDueRevision,
			usosTemporariosAbertos: openTemporaryUsages,
			usosTemporariosFinalizados: temporaryUsagesClosedWithinPeriod,
			usosTemporariosIniciados: temporaryUsagesOpenedWithinPeriod,
		},
	};
}

export type TPropertiesStatsOutput = Awaited<ReturnType<typeof getStats>>;

const getStatsHandler: NextApiHandler<TPropertiesStatsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const payload = StatsQueryParamsInputSchema.parse(req.query);
	const stats = await getStats(payload);
	res.status(200).json(stats);
};

export default apiHandler({
	GET: getStatsHandler,
});
