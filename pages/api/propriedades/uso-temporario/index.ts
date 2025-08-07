import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { PropertyTemporaryUsageSchema, type TProperty, type TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import clientPromise from "@/utils/services/mongodb/mongo-client";
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

export type TCreateTemporaryUsageInput = TPropertyTemporaryUsage;
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

const UpdatePropertyTemporaryUsageSchema = z.object({
	id: z.string({
		required_error: "ID da propriedade não informado.",
		invalid_type_error: "Tipo não válido para o ID da propriedade.",
	}),
	changes: PropertyTemporaryUsageSchema,
});
export type TUpdatePropertyTemporaryUsageInput = z.infer<typeof UpdatePropertyTemporaryUsageSchema>;

async function updateTemporaryUsageRoute({ payload }: { payload: TUpdatePropertyTemporaryUsageInput }) {
	console.log("[INFO] [UPDATE TEMPORARY USAGE] Updating temporary usage", {
		propertyId: payload.changes.propriedade.id,
		propertyUsageType: payload.changes.metadados.tipo,
	});
	const dbClient = await clientPromise;
	const dbSession = dbClient.startSession();

	try {
		const transactionResult = await dbSession.withTransaction(async () => {
			console.log("[INFO] [UPDATE TEMPORARY USAGE] Starting transaction");

			const db = dbClient.db("administracao");
			const propertiesCollection = db.collection<TProperty>("propriedades");
			const temporaryUsagesCollection = db.collection<TPropertyTemporaryUsage>("propriedades-uso-temporario");
			if (payload.changes.metadados.kmFinal && payload.changes.metadados.kmInicial > payload.changes.metadados.kmFinal) {
				console.log("[ERROR] [UPDATE TEMPORARY USAGE] Kilometers inconsistency detected");
				// Checking for possible inconsistency in vehicle usage kilometers
				throw new createHttpError.BadRequest("Kilometragem inicial não pode ser maior que a kilometragem final.");
			}

			const updatedTemporaryUsageResponse = await temporaryUsagesCollection.updateOne({ _id: new ObjectId(payload.id) }, { $set: payload.changes }, { session: dbSession });

			if (!updatedTemporaryUsageResponse.acknowledged) throw new createHttpError.InternalServerError("Erro ao atualizar uso temporário.");

			// Getting updated property usage
			const updatedPropertyUsage = await temporaryUsagesCollection.findOne({ _id: new ObjectId(payload.id) }, { session: dbSession });
			if (!updatedPropertyUsage) throw new createHttpError.NotFound("Uso temporário não encontrado.");

			if (updatedPropertyUsage.metadados.tipo === "USO DE VEÍCULO" && updatedPropertyUsage.metadados.kmFinal) {
				console.log("[INFO] [UPDATE TEMPORARY USAGE] Updating property cumulative kilometers");
				const initialKilometers = payload.changes.metadados.kmInicial;
				const finalKilometers = payload.changes.metadados.kmFinal;

				const differenceKilometers = (finalKilometers || 0) - initialKilometers;

				const updatedProperty = await propertiesCollection.updateOne(
					{ _id: new ObjectId(updatedPropertyUsage.propriedade.id) },
					{ $inc: { "metadados.kmAcumulado": differenceKilometers } },
					{ session: dbSession },
				);
				if (!updatedProperty.acknowledged) throw new createHttpError.InternalServerError("Erro ao atualizar quilometragem acumulada da propriedade.");
				console.log(`[INFO] [UPDATE TEMPORARY USAGE] Property cumulative kilometers updated with ${differenceKilometers} kilometers`);
			}
			console.log("[SUCCESS] [UPDATE TEMPORARY USAGE] Transaction completed successfully");
			return {
				data: { updatedId: updatedTemporaryUsageResponse.upsertedId?.toString() },
				message: "Uso temporário atualizado com sucesso.",
			};
		});
		return transactionResult as { data: { updatedId: string }; message: string };
	} catch (error) {
		console.log("[ERROR] [UPDATE TEMPORARY USAGE] Transaction failed", { error });
		throw error;
	} finally {
		console.log("[INFO] [UPDATE TEMPORARY USAGE] Ending transaction");
		await dbSession.endSession();
	}
}
export type TUpdatePropertyTemporaryUsageOutput = Awaited<ReturnType<typeof updateTemporaryUsageRoute>>;

const updateTemporaryUsageHandler: NextApiHandler<TUpdatePropertyTemporaryUsageOutput> = async (req, res) => {
	const payload = UpdatePropertyTemporaryUsageSchema.parse(req.body);
	const temporaryUsage = await updateTemporaryUsageRoute({ payload });
	res.status(200).json(temporaryUsage);
};

export default apiHandler({
	GET: getTemporaryUsagesHandler,
	POST: createTemporaryUsageHandler,
	PUT: updateTemporaryUsageHandler,
});
