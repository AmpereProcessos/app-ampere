import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { SupportCallSchema, TSupportCall } from "@/utils/schemas/support-calls";
import connectToCallsDatabase from "@/utils/services/mongodb/calls";
import createHttpError from "http-errors";
import { Db, Filter, ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import z from "zod";

const GetManySupportCallsInputSchema = z.object({
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
});
export type TGetManySupportCallsInput = z.infer<typeof GetManySupportCallsInputSchema>;

const GetSupportCallByIdInputSchema = z.object({
	id: z.string({
		required_error: "ID não informado",
		invalid_type_error: "Tipo não válido para ID",
	}),
});
export type TGetSupportCallByIdInput = z.infer<typeof GetSupportCallByIdInputSchema>;

const GetSupportCallsInputSchema = z.union([GetManySupportCallsInputSchema, GetSupportCallByIdInputSchema]);

export type TGetSupportCallsInput = z.infer<typeof GetSupportCallsInputSchema>;

async function getSupportCalls({ session, input }: { session: TAuthSession; input: TGetSupportCallsInput }) {
	const PAGE_SIZE = 100;
	const callsDb: Db = await connectToCallsDatabase();
	const supportCallsCollection = callsDb.collection<TSupportCall>("suporte");

	if ("id" in input) {
		const call = await supportCallsCollection.findOne({ _id: new ObjectId(input.id) });

		if (!call) throw createHttpError.BadRequest("Chamado não encontrado");

		return {
			data: {
				default: undefined,
				byId: { ...call, _id: call._id.toString() },
			},
		};
	}

	const { periodField, periodAfter, periodBefore, status, search, page } = input;

	const statusQuery: Filter<TSupportCall> = status.length > 0 ? { statusChamado: { $in: status } } : {};

	const searchQuery: Filter<TSupportCall> =
		search && search.trim().length > 0
			? {
					$or: [
						// By client name
						{ nomeCliente: search },
						{ nomeCliente: { $regex: search, $options: "i" } },
						// By usina name
						{ nomeUsina: search },
						{ nomeUsina: { $regex: search, $options: "i" } },
						// By description
						{ descricaoProblema: search },
						{ descricaoProblema: { $regex: search, $options: "i" } },
					],
				}
			: {};

	const periodQuery: Filter<TSupportCall> =
		periodField && periodAfter && periodBefore
			? {
					[periodField]: { $gte: periodAfter, $lte: periodBefore },
				}
			: {};

	const query: Filter<TSupportCall> = {
		...statusQuery,
		...searchQuery,
		...periodQuery,
	};

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;

	const callsMatched = await supportCallsCollection.countDocuments(query);
	const totalPages = Math.ceil(callsMatched / PAGE_SIZE);

	console.log("QUERY", JSON.stringify(query, null, 2));
	const calls = await supportCallsCollection
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
export type TGetSupportCallsOutput = Awaited<ReturnType<typeof getSupportCalls>>;
export type TGetSupportCallsOutputDefault = Exclude<TGetSupportCallsOutput["data"]["default"], undefined>;
export type TGetSupportCallsOutputById = Exclude<TGetSupportCallsOutput["data"]["byId"], undefined>;

const getSupportCallsHandler: NextApiHandler<TGetSupportCallsOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = GetSupportCallsInputSchema.parse(req.query);

	const data = await getSupportCalls({ session, input });

	return res.status(200).json(data);
};

const CreateSupportCallInputSchema = SupportCallSchema;
export type TCreateSupportCallInput = z.infer<typeof CreateSupportCallInputSchema>;

async function createSupportCall({ session, input }: { session: TAuthSession; input: TCreateSupportCallInput }) {
	const callsDb: Db = await connectToCallsDatabase();
	const supportCallsCollection = callsDb.collection<TSupportCall>("suporte");

	const insertedCallResponse = await supportCallsCollection.insertOne(input);
	if (!insertedCallResponse.acknowledged) throw createHttpError.InternalServerError("Erro ao criar chamado");

	const insertedId = insertedCallResponse.insertedId.toString();

	return {
		data: {
			insertedId,
		},
		message: "Chamado criado com sucesso",
	};
}
export type TCreateSupportCallOutput = Awaited<ReturnType<typeof createSupportCall>>;
const createSupportCallHandler: NextApiHandler<TCreateSupportCallOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = CreateSupportCallInputSchema.parse(req.body);

	const data = await createSupportCall({ session, input });

	return res.status(200).json(data);
};

const UpdateSupportCallInputSchema = z.object({
	id: z.string({
		required_error: "ID não informado",
		invalid_type_error: "Tipo não válido para ID",
	}),
	changes: SupportCallSchema.partial(),
});
export type TUpdateSupportCallInput = z.infer<typeof UpdateSupportCallInputSchema>;

async function updateSupportCall({ session, input }: { session: TAuthSession; input: TUpdateSupportCallInput }) {
	const callsDb: Db = await connectToCallsDatabase();
	const supportCallsCollection = callsDb.collection<TSupportCall>("suporte");

	const { id, changes } = input;

	const updatedCallResponse = await supportCallsCollection.updateOne({ _id: new ObjectId(id) }, { $set: changes });

	if (!updatedCallResponse.acknowledged) throw createHttpError.InternalServerError("Erro ao atualizar chamado");

	return {
		data: {
			updatedId: id,
		},
		message: "Chamado atualizado com sucesso",
	};
}
export type TUpdateSupportCallOutput = Awaited<ReturnType<typeof updateSupportCall>>;

const updateSupportCallHandler: NextApiHandler<TUpdateSupportCallOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const input = UpdateSupportCallInputSchema.parse(req.body);

	const data = await updateSupportCall({ session, input });

	return res.status(200).json(data);
};

export default apiHandler({
	POST: createSupportCallHandler,
	GET: getSupportCallsHandler,
	PUT: updateSupportCallHandler,
});
