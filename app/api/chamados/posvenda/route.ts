import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { type Db, ObjectId, type Collection, type Filter, type WithId } from "mongodb";
import createHttpError from "http-errors";
import dayjs from "dayjs";
import { appRouterApiHandler, type UnwrapAppRouterNextResponse } from "@/utils/api-app-router";
import { PosVendaCallSchema, type TPosVendaCall, type TPosVendaCallDTO } from "@/utils/schemas/pos-venda-calls";
import connectToCallsDatabase from "@/utils/services/mongodb/calls";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// GET Query Params Schemas
const GetAllPosVendaCallsQueryParamsSchema = z.object({
	search: z
		.string({
			required_error: "Pesquisa é obrigatória",
			invalid_type_error: "Pesquisa deve ser uma string",
		})
		.optional()
		.nullable(),
	periodAfter: z
		.string({
			required_error: "Data de início é obrigatória",
			invalid_type_error: "Data de início deve ser uma string",
		})
		.datetime({ message: "Data de início deve ser uma data válida" })
		.optional()
		.nullable(),
	periodBefore: z
		.string({
			required_error: "Data de fim é obrigatória",
			invalid_type_error: "Data de fim deve ser uma string",
		})
		.datetime({ message: "Data de fim deve ser uma data válida" })
		.optional()
		.nullable(),
	periodField: z
		.enum(["dataInsercao", "dataEfetivacao"], {
			required_error: "Campo de período é obrigatório",
			invalid_type_error: "Campo de período deve ser uma string",
		})
		.optional()
		.nullable(),
	ongoingOnly: z
		.enum(["true", "false"], {
			required_error: "Campo de período é obrigatório",
			invalid_type_error: "Campo de período deve ser uma string",
		})
		.optional()
		.nullable(),
});

const GetPosVendaCallByIdQueryParamsSchema = z.object({
	id: z.string({
		required_error: "ID do chamado é obrigatório",
		invalid_type_error: "ID do chamado deve ser uma string",
	}),
});

export type TGetAllPosVendaCallsInput = z.infer<typeof GetAllPosVendaCallsQueryParamsSchema>;
export type TGetPosVendaCallByIdInput = z.infer<typeof GetPosVendaCallByIdQueryParamsSchema>;

// POST Input Schema
const CreatePosVendaCallInputSchema = z.object({
	call: PosVendaCallSchema.omit({
		dataInsercao: true,
		dataUltimaAtualizacao: true,
	}),
});

export type TCreatePosVendaCallInput = z.infer<typeof CreatePosVendaCallInputSchema>;

// PUT Input Schema
const UpdatePosVendaCallInputSchema = z.object({
	id: z.string({
		required_error: "ID do chamado é obrigatório",
		invalid_type_error: "ID do chamado deve ser uma string",
	}),
	call: PosVendaCallSchema.omit({
		dataInsercao: true,
		dataUltimaAtualizacao: true,
	}).partial(),
});

export type TUpdatePosVendaCallInput = z.infer<typeof UpdatePosVendaCallInputSchema>;

// DELETE Input Schema
const DeletePosVendaCallInputSchema = z.object({
	id: z.string({
		required_error: "ID do chamado é obrigatório",
		invalid_type_error: "ID do chamado deve ser uma string",
	}),
});

export type TDeletePosVendaCallInput = z.infer<typeof DeletePosVendaCallInputSchema>;

// GET - Buscar todos os chamados ou por ID
async function getPosVendaCalls(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new createHttpError.Unauthorized("Usuário não autenticado");
	}

	const searchParams = request.nextUrl.searchParams;
	const searchParamsEntries = Object.fromEntries(searchParams);

	// Se tem ID, busca por ID específico
	if (searchParams.get("id")) {
		const params = GetPosVendaCallByIdQueryParamsSchema.parse(searchParamsEntries);
		const { id } = params;

		// Validating the ID
		if (!ObjectId.isValid(id)) {
			throw new createHttpError.BadRequest("ID do chamado inválido.");
		}

		const db: Db = await connectToCallsDatabase();
		const collection = db.collection<TPosVendaCall>("posvenda");

		// Finding the call
		const call = await collection.findOne({ _id: new ObjectId(id) });
		if (!call) {
			throw new createHttpError.NotFound("Chamado não encontrado.");
		}

		// Returning the call with the ID
		const callWithId: TPosVendaCallDTO = {
			...call,
			_id: call._id.toString(),
		};

		return NextResponse.json(
			{
				data: {
					default: undefined,
					byId: callWithId,
				},
				message: "Chamado obtido com sucesso.",
			},
			{ status: 200 },
		);
	}

	// Getting the params for the general query
	const params = GetAllPosVendaCallsQueryParamsSchema.parse(searchParamsEntries);
	const { search, periodAfter, periodBefore, periodField, ongoingOnly } = params;

	const db: Db = await connectToCallsDatabase();
	const collection = db.collection<TPosVendaCall>("posvenda");

	const searchQuery: Filter<TPosVendaCall> =
		search && search?.trim().length > 0
			? {
					$or: [{ titulo: { $regex: search, $options: "i" } }, { descricao: { $regex: search, $options: "i" } }],
				}
			: {};

	const periodQuery: Filter<TPosVendaCall> =
		periodAfter && periodBefore && periodField
			? {
					[periodField]: {
						$gte: periodAfter,
						$lte: periodBefore,
					},
				}
			: {};

	const ongoingOnlyQuery: Filter<TPosVendaCall> = ongoingOnly === "true" ? { dataEfetivacao: null } : {};
	const query: Filter<TPosVendaCall> = {
		...searchQuery,
		...periodQuery,
		...ongoingOnlyQuery,
	};

	const calls = await collection.find(query).toArray();

	return NextResponse.json(
		{
			data: {
				default: calls.map((call) => ({
					...call,
					_id: call._id.toString(),
				})),
				byId: undefined,
			},
			message: "Chamados obtidos com sucesso.",
		},
		{ status: 200 },
	);
}

// POST - Criar novo chamado
async function createPosVendaCall(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new createHttpError.Unauthorized("Usuário não autenticado");
	}

	const body = await request.json();
	const validatedData = CreatePosVendaCallInputSchema.parse(body);
	const { call } = validatedData;

	const now = dayjs().toISOString();
	const newCall: TPosVendaCall = {
		...call,
		dataInsercao: now,
		dataUltimaAtualizacao: now,
	};

	const db: Db = await connectToCallsDatabase();
	const collection = db.collection<TPosVendaCall>("posvenda");

	const result = await collection.insertOne({ ...newCall, autor: { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url } });

	const insertedId = result.insertedId.toString();
	if (!insertedId) {
		throw new createHttpError.InternalServerError("Erro ao criar chamado.");
	}

	return NextResponse.json(
		{
			data: {
				insertedId: result.insertedId.toString(),
			},
			message: "Chamado criado com sucesso.",
		},
		{ status: 201 },
	);
}

// PUT - Atualizar chamado
async function updatePosVendaCall(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new createHttpError.Unauthorized("Usuário não autenticado");
	}

	const body = await request.json();
	const validatedData = UpdatePosVendaCallInputSchema.parse(body);
	const { id, call } = validatedData;

	// Validating the ID
	if (!ObjectId.isValid(id)) {
		throw new createHttpError.BadRequest("ID do chamado inválido.");
	}

	const db: Db = await connectToCallsDatabase();
	const collection = db.collection<TPosVendaCall>("posvenda");

	// Preparing the data for the update
	const updateData = {
		...call,
		dataUltimaAtualizacao: dayjs().toISOString(),
	};

	const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

	if (result.matchedCount === 0) {
		throw new createHttpError.NotFound("Chamado não encontrado.");
	}

	return NextResponse.json(
		{
			data: {
				updatedId: id,
			},
			message: "Chamado atualizado com sucesso.",
		},
		{ status: 200 },
	);
}

// DELETE - Deletar chamado
async function deletePosVendaCall(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new createHttpError.Unauthorized("Usuário não autenticado");
	}

	const body = await request.json();
	const validatedData = DeletePosVendaCallInputSchema.parse(body);
	const { id } = validatedData;

	const db: Db = await connectToCallsDatabase();
	const collection = db.collection<TPosVendaCall>("posvenda");

	const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });

	if (!result) {
		throw new createHttpError.NotFound("Chamado não encontrado.");
	}

	return NextResponse.json(
		{
			data: { deletedId: id },
			message: "Chamado deletado com sucesso.",
		},
		{ status: 200 },
	);
}

// Export types for outputs
export type TGetPosVendaCallsOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof getPosVendaCalls>>>;
export type TGetAllPosVendaCallsOutput = Exclude<UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof getPosVendaCalls>>>["data"]["default"], undefined>;
export type TGetPosVendaCallByIdOutput = Exclude<UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof getPosVendaCalls>>>["data"]["byId"], undefined>;
export type TCreatePosVendaCallOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof createPosVendaCall>>>;
export type TUpdatePosVendaCallOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof updatePosVendaCall>>>;
export type TDeletePosVendaCallOutput = UnwrapAppRouterNextResponse<Awaited<ReturnType<typeof deletePosVendaCall>>>;

// Export handlers
export const GET = appRouterApiHandler({
	GET: getPosVendaCalls,
});

export const POST = appRouterApiHandler({
	POST: createPosVendaCall,
});

export const PUT = appRouterApiHandler({
	PUT: updatePosVendaCall,
});

export const DELETE = appRouterApiHandler({
	DELETE: deletePosVendaCall,
});
