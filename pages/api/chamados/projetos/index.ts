import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { EngineeringCallsSchema, TEngineeringCall } from "@/utils/schemas/engineering-calls";
import connectToCallsDatabase from "@/utils/services/mongodb/calls";
import createHttpError from "http-errors";
import { Db, Filter, ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import z from "zod";

const GetManyEngineeringCallsInputSchema = z.object({
	page: z
		.string({
			required_error: "Página não informada",
			invalid_type_error: "Tipo não válido para página",
		})
		.transform((s) => Number(s)),
	periodField: z.enum(["abertura", "fechamento"]).optional().nullable(),
	periodAfter: z
		.string({
			required_error: "Período depois não informado",
			invalid_type_error: "Tipo não válido para período depois",
		})
		.optional()
		.nullable(),
	periodBefore: z
		.string({
			required_error: "Período antes não informado",
			invalid_type_error: "Tipo não válido para período antes",
		})
		.optional()
		.nullable(),
	status: z
		.string({
			required_error: "Status não informado",
			invalid_type_error: "Tipo não válido para status",
		})
		.transform((s) => s.split(",").filter((s) => s.trim().length > 0)),
	search: z
		.string({
			required_error: "Busca não informada",
			invalid_type_error: "Tipo não válido para busca",
		})
		.optional()
		.nullable(),
	callTypes: z
		.string({
			required_error: "Tipo do chamado não informado",
			invalid_type_error: "Tipo não válido para tipo do chamado",
		})
		.transform((s) => s.split(",").filter((s) => s.trim().length > 0))
		.optional()
		.nullable(),
});
export type TGetManyEngineeringCallsInput = z.infer<typeof GetManyEngineeringCallsInputSchema>;

const GetEngineeringCallByIdInputSchema = z.object({
	id: z.string({
		required_error: "ID não informado",
		invalid_type_error: "Tipo não válido para ID",
	}),
});
export type TGetEngineeringCallByIdInput = z.infer<typeof GetEngineeringCallByIdInputSchema>;

const GetEngineeringCallsInputSchema = z.union([GetManyEngineeringCallsInputSchema, GetEngineeringCallByIdInputSchema]);

export type TGetEngineeringCallsInput = z.infer<typeof GetEngineeringCallsInputSchema>;

async function getEngineeringCalls({ session, input }: { session: TAuthSession; input: TGetEngineeringCallsInput }) {
	const PAGE_SIZE = 100;
	const callsDb: Db = await connectToCallsDatabase();
	const engineeringCallsCollection = callsDb.collection<TEngineeringCall>("projetos");

	if ("id" in input) {
		const call = await engineeringCallsCollection.findOne({ _id: new ObjectId(input.id) });

		if (!call) throw createHttpError.BadRequest("Chamado não encontrado");

		return {
			data: {
				default: undefined,
				byId: { ...call, _id: call._id.toString() },
			},
		};
	}

	const { periodField, periodAfter, periodBefore, status, search, page, callTypes } = input;

	const statusQuery: Filter<TEngineeringCall> = status.length > 0 ? { status: { $in: status } } : {};

	const searchQuery: Filter<TEngineeringCall> =
		search && search.trim().length > 0
			? {
					$or: [
						// By project name
						{ projeto: search },
						{ projeto: { $regex: search, $options: "i" } },
						// By responsible
						{ responsavel: search },
						{ responsavel: { $regex: search, $options: "i" } },
						// By observations
						{ observacoes: search },
						{ observacoes: { $regex: search, $options: "i" } },
						// By annotations
						{ anotacoes: search },
						{ anotacoes: { $regex: search, $options: "i" } },
					],
				}
			: {};

	const callTypesQuery: Filter<TEngineeringCall> = callTypes && callTypes.length > 0 ? { tipoDoChamado: { $in: callTypes } } : {};

	const periodQuery: Filter<TEngineeringCall> =
		periodField && periodAfter && periodBefore
			? {
					[periodField]: { $gte: periodAfter, $lte: periodBefore },
				}
			: {};

	const query: Filter<TEngineeringCall> = {
		...statusQuery,
		...searchQuery,
		...callTypesQuery,
		...periodQuery,
	};

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;

	const callsMatched = await engineeringCallsCollection.countDocuments(query);
	const totalPages = Math.ceil(callsMatched / PAGE_SIZE);

	console.log("QUERY", JSON.stringify(query, null, 2));
	const calls = await engineeringCallsCollection
		.find(
			{
				...query,
			},
			{
				sort: {
					abertura: -1,
				},
				skip,
				limit,
			},
		)
		.toArray();

	return {
		data: {
			default: {
				calls: calls.map((c) => ({ ...c, _id: c._id.toString() })),
				callsMatched: callsMatched,
				totalPages,
			},
			byId: undefined,
		},
	};
}
export type TGetEngineeringCallsOutput = Awaited<ReturnType<typeof getEngineeringCalls>>;
export type TGetEngineeringCallsOutputDefault = Exclude<TGetEngineeringCallsOutput["data"]["default"], undefined>;
export type TGetEngineeringCallsOutputById = Exclude<TGetEngineeringCallsOutput["data"]["byId"], undefined>;

const getEngineeringCallsHandler: NextApiHandler<TGetEngineeringCallsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = GetEngineeringCallsInputSchema.parse(req.query);

	const data = await getEngineeringCalls({ session, input });

	return res.status(200).json(data);
};

const CreateEngineeringCallInputSchema = EngineeringCallsSchema;
export type TCreateEngineeringCallInput = z.infer<typeof CreateEngineeringCallInputSchema>;

async function createEngineeringCall({ session, input }: { session: TAuthSession; input: TCreateEngineeringCallInput }) {
	const callsDb: Db = await connectToCallsDatabase();
	const engineeringCallsCollection = callsDb.collection<TEngineeringCall>("projetos");

	const insertedCallResponse = await engineeringCallsCollection.insertOne(input);
	if (!insertedCallResponse.acknowledged) throw createHttpError.InternalServerError("Erro ao criar chamado");

	const insertedId = insertedCallResponse.insertedId.toString();

	return {
		data: {
			insertedId,
		},
		message: "Chamado criado com sucesso",
	};
}
export type TCreateEngineeringCallOutput = Awaited<ReturnType<typeof createEngineeringCall>>;
const createEngineeringCallHandler: NextApiHandler<TCreateEngineeringCallOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = CreateEngineeringCallInputSchema.parse(req.body);

	const data = await createEngineeringCall({ session, input });

	return res.status(200).json(data);
};

const UpdateEngineeringCallInputSchema = z.object({
	id: z.string({
		required_error: "ID não informado",
		invalid_type_error: "Tipo não válido para ID",
	}),
	changes: EngineeringCallsSchema.partial(),
});
export type TUpdateEngineeringCallInput = z.infer<typeof UpdateEngineeringCallInputSchema>;

async function updateEngineeringCall({ session, input }: { session: TAuthSession; input: TUpdateEngineeringCallInput }) {
	const callsDb: Db = await connectToCallsDatabase();
	const engineeringCallsCollection = callsDb.collection<TEngineeringCall>("projetos");

	const { id, changes } = input;

	const updatedCallResponse = await engineeringCallsCollection.updateOne({ _id: new ObjectId(id) }, { $set: changes });

	if (!updatedCallResponse.acknowledged) throw createHttpError.InternalServerError("Erro ao atualizar chamado");

	return {
		data: {
			updatedId: id,
		},
		message: "Chamado atualizado com sucesso",
	};
}
export type TUpdateEngineeringCallOutput = Awaited<ReturnType<typeof updateEngineeringCall>>;

const updateEngineeringCallHandler: NextApiHandler<TUpdateEngineeringCallOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = UpdateEngineeringCallInputSchema.parse(req.body);

	const data = await updateEngineeringCall({ session, input });

	return res.status(200).json(data);
};

export default apiHandler({
	POST: createEngineeringCallHandler,
	GET: getEngineeringCallsHandler,
	PUT: updateEngineeringCallHandler,
});
