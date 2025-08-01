import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { PropertyTemporaryUsageSchema, type TProperty, type TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { Session } from "next-auth";
import { z } from "zod";

const PropertyTemporaryUsagesByPeriodQueryParams = z.object({
	periodAfter: z
		.string({
			required_error: "Data de início não informada.",
			invalid_type_error: "Tipo não válido para a data de início.",
		})
		.datetime({ message: "Tipo inválido para a data de início." }),
	periodBefore: z
		.string({ required_error: "Data de término não informada.", invalid_type_error: "Tipo não válido para a data de término." })
		.datetime({ message: "Tipo inválido para a data de término." }),
	periodType: z.enum(["dataInicio", "dataFim"]),
});
export type TPropertyTemporaryUsagesByPeriodInput = z.infer<typeof PropertyTemporaryUsagesByPeriodQueryParams>;

const PropertyTemporaryUsageByIdQueryParams = z.object({
	id: z.string({
		required_error: "ID da propriedade não informado.",
		invalid_type_error: "Tipo não válido para o ID da propriedade.",
	}),
});
export type TPropertyTemporaryUsageByIdInput = z.infer<typeof PropertyTemporaryUsageByIdQueryParams>;

const TemporaryUsagesQueryParams = z.union([PropertyTemporaryUsagesByPeriodQueryParams, PropertyTemporaryUsageByIdQueryParams]);
export type TPropertyTemporaryUsagesInput = z.infer<typeof TemporaryUsagesQueryParams>;

async function getTemporaryUsagesRoute({ params, session }: { params: TPropertyTemporaryUsagesInput; session: Session }) {
	const db = await connectToAdministrationDatabase();
	const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>("propriedades-uso-temporario");
	const propertiesCollection = db.collection<TProperty>("propriedades");

	if ("id" in params) {
		if (!ObjectId.isValid(params.id)) throw new createHttpError.BadRequest("ID da propriedade inválido.");

		const temporaryUsageRecord = await temporaryUsagesCollection.findOne({
			_id: new ObjectId(params.id),
		});
		if (!temporaryUsageRecord) throw new createHttpError.NotFound("Uso temporário não encontrado.");

		return {
			data: {
				byId: { ...temporaryUsageRecord, _id: temporaryUsageRecord._id.toString() },
				default: undefined,
			},
		};
	}

	const { periodAfter, periodBefore, periodType } = params;

	const periodQuery: Filter<TPropertyTemporaryUsage> = {
		[periodType]: {
			$gte: periodAfter,
			$lte: periodBefore,
		},
	};

	const temporaryUsages = await temporaryUsagesCollection.find(periodQuery).toArray();

	return {
		data: {
			byId: undefined,
			default: temporaryUsages.map((usage) => ({ ...usage, _id: usage._id.toString() })),
		},
	};
}
export type TGetPropertyTemporaryUsagesOutput = Awaited<ReturnType<typeof getTemporaryUsagesRoute>>;

const getTemporaryUsagesHandler: NextApiHandler<TGetPropertyTemporaryUsagesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const params = TemporaryUsagesQueryParams.parse(req.query);
	const temporaryUsages = await getTemporaryUsagesRoute({ params, session });
	res.status(200).json(temporaryUsages);
};

async function createTemporaryUsageRoute({ payload, session }: { payload: TPropertyTemporaryUsage; session: Session }) {
	const db = await connectToAdministrationDatabase();
	const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>("propriedades-uso-temporario");

	const insertedTemporaryUseageResponse = await temporaryUsagesCollection.insertOne(payload);

	if (!insertedTemporaryUseageResponse.acknowledged) throw new createHttpError.InternalServerError("Erro ao inserir uso temporário.");

	const insertedTemporaryUsageId = insertedTemporaryUseageResponse.insertedId.toString();
	return {
		data: {
			insertedId: insertedTemporaryUsageId,
		},
		message: "Uso temporário inserido com sucesso.",
	};
}
export type TCreateTemporaryUsageOutput = Awaited<ReturnType<typeof createTemporaryUsageRoute>>;

const createTemporaryUsageHandler: NextApiHandler<TCreateTemporaryUsageOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const payload = PropertyTemporaryUsageSchema.parse(req.body);
	const temporaryUsage = await createTemporaryUsageRoute({ payload, session });
	res.status(200).json(temporaryUsage);
};

export default apiHandler({
	GET: getTemporaryUsagesHandler,
	POST: createTemporaryUsageHandler,
});
