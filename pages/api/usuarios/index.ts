import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertUserSchema, type TUser } from "@/utils/schemas/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { type Collection, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

type GetResponse = {
	data: TUser | TUser[];
};

const projection = {
	acessoAtivo: 1,
	nome: 1,
	usuario: 1,
	email: 1,
	telefone: 1,
	avatar_url: 1,
	visualizacao: 1,
	permissoes: 1,
	empresaVinculada: 1,
	cargos: 1,
	dataInsercao: 1,
	autor: 1,
};

const GetUsersInputSchema = z.object({
	id: z.string({ invalid_type_error: "Tipo não válido para ID." }).optional().nullable(),

	search: z.string({ invalid_type_error: "Tipo não válido para filtro de pesquisa." }).optional().nullable(),
	activeOnly: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de usuários ativos.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
	activeEmployeesOnly: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de colaboradores ativos.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
});
export type TGetUsersInput = z.infer<typeof GetUsersInputSchema>;
export type TGetUsersDefaultInput = Omit<TGetUsersInput, "id">;
export type TGetUsersByIdInput = Pick<TGetUsersInput, "id">;

async function getUsers({ session, input }: { session: TAuthSession; input: TGetUsersInput }) {
	if (!session.user.permissoes.usuarios.visualizar) throw new createHttpError.Unauthorized("Usuário não possui permissão para essa requisição.");

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TUser> = db.collection("colaboradores");

	if ("id" in input) {
		if (typeof input.id !== "string" || !ObjectId.isValid(input.id)) throw new createHttpError.BadRequest("ID inválido.");

		const user = await usersCollection.findOne({ _id: new ObjectId(input.id) }, { projection: projection });
		if (!user) throw new createHttpError.NotFound("Usuário não encontrado.");
		return {
			data: {
				byId: {
					_id: user._id.toString(),
					acessoAtivo: user.acessoAtivo,
					nome: user.nome,
					usuario: user.usuario,
					email: user.email,
					telefone: user.telefone,
					avatar_url: user.avatar_url,
					visualizacao: user.visualizacao,
					permissoes: user.permissoes,
					empresaVinculada: user.empresaVinculada,
					cargos: user.cargos,
					dataInsercao: user.dataInsercao,
					autor: user.autor,
				},
				default: undefined,
			},
		};
	}

	const activeOnlyQuery: Filter<TUser> = input.activeOnly ? { acessoAtivo: true } : {};
	const activeEmployeesOnlyQuery: Filter<TUser> = input.activeEmployeesOnly ? { colaboradorAtivo: true } : {};
	const searchQuery: Filter<TUser> = input.search
		? {
				$or: [
					{
						nome: { $regex: input.search, $options: "i" },
					},
					{
						nome: input.search,
					},
					{
						cpf: { $regex: input.search, $options: "i" },
					},
					{
						cpf: input.search,
					},
					{
						email: { $regex: input.search, $options: "i" },
					},
					{
						email: input.search,
					},
				],
			}
		: {};
	const query: Filter<TUser> = { ...activeOnlyQuery, ...activeEmployeesOnlyQuery, ...searchQuery };
	const users = await usersCollection.find(query, { sort: { nome: 1 } }).toArray();
	const usersFormatted = users.map((user) => ({
		_id: user._id.toString(),
		acessoAtivo: user.acessoAtivo,
		nome: user.nome,
		usuario: user.usuario,
		email: user.email,
		telefone: user.telefone,
		avatar_url: user.avatar_url,
		visualizacao: user.visualizacao,
		permissoes: user.permissoes,
		empresaVinculada: user.empresaVinculada,
		cargos: user.cargos,
		dataInsercao: user.dataInsercao,
		autor: user.autor,
	}));
	return {
		data: {
			default: usersFormatted,
			byId: undefined,
		},
	};
}
export type TGetUsersOutput = Awaited<ReturnType<typeof getUsers>>;
export type TGetUsersOutputById = Exclude<Awaited<ReturnType<typeof getUsers>>["data"]["byId"], undefined>;
export type TGetUsersOutputDefault = Exclude<Awaited<ReturnType<typeof getUsers>>["data"]["default"], undefined>;

const getUsersHandler: NextApiHandler<TGetUsersOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetUsersInputSchema.parse(req.query);
	const response = await getUsers({ session, input });
	return res.status(200).json(response);
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};

const createUser: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id, nome, avatar_url } = session.user;
	if (!session.user.permissoes.usuarios.criar) throw new createHttpError.Unauthorized("Você não possui permissão para criação de usuários.");
	const user = InsertUserSchema.parse(req.body);

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TUser> = db.collection("colaboradores");

	const insertResponse = await usersCollection.insertOne({ ...user, autor: { id, nome, avatar_url } });

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido na criação de um novo usuário.");
	const insertedId = insertResponse.insertedId.toString();
	return res.status(200).json({ data: { insertedId }, message: "Usuário criado com sucesso !" });
};

type PutResponse = {
	data: string;
	message: string;
};

const editUser: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const user = InsertUserSchema.partial().parse(req.body);

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TUser> = db.collection("colaboradores");

	const updateResponse = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...user } });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar usuário.");
	if (updateResponse.matchedCount === 0) throw new createHttpError.NotFound("Usuário não encontrado.");

	return res.status(201).json({ data: "Usuário atualizado com sucesso !", message: "Usuário atualizado com sucesso !" });
};

export default apiHandler({
	GET: getUsersHandler,
	POST: createUser,
	PUT: editUser,
});
