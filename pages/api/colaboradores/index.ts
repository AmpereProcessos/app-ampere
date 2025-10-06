import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertUserSchema, type TEmployee } from "@/utils/schemas/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import { novu } from "@/utils/services/novu";
import { getNovuSubscriberId } from "@/utils/services/novu/config";
import createHttpError from "http-errors";
import { type Collection, type Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

const GetEmployeesInputSchema = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo não válido para ID.",
		})
		.optional(),
	search: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de pesquisa.",
		})
		.optional()
		.nullable(),
	activeOnly: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de usuários ativos.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
	accessActiveOnly: z
		.string({
			invalid_type_error: "Tipo não válido para filtro de usuários com acesso ativo.",
		})
		.optional()
		.nullable()
		.transform((val) => val === "true"),
});
export type TGetEmployeesInput = z.infer<typeof GetEmployeesInputSchema>;
export type TGetEmployeesDefaultInput = Omit<TGetEmployeesInput, "id">;
export type TGetEmployeesByIdInput = Pick<TGetEmployeesInput, "id">;

async function getEmployees({ session, input }: { session: TAuthSession; input: TGetEmployeesInput }) {
	if (!session?.user.permissoes.recursosHumanos.visualizar)
		throw new createHttpError.Unauthorized("Usuário não possui permissão para essa requisição.");

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");

	console.log("INFO [GET EMPLOYEES] Input:", input);

	if ("id" in input) {
		if (typeof input.id !== "string" || !ObjectId.isValid(input.id)) throw new createHttpError.BadRequest("ID inválido.");

		const colaborator = await usersCollection.findOne({ _id: new ObjectId(input.id) });
		if (!colaborator) throw new createHttpError.NotFound("Colaborador não encontrado.");
		return {
			data: {
				byId: { ...colaborator, _id: colaborator._id.toString() },
				default: undefined,
			},
		};
	}

	const activeOnlyQuery: Filter<TEmployee> = input.activeOnly ? { colaboradorAtivo: true } : {};
	const accessActiveOnlyQuery: Filter<TEmployee> = input.accessActiveOnly ? { acessoAtivo: true } : {};
	const searchQuery: Filter<TEmployee> = input.search
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
	const query: Filter<TEmployee> = { ...activeOnlyQuery, ...accessActiveOnlyQuery, ...searchQuery };
	const colaborators = await usersCollection.find(query, { sort: { nome: 1 } }).toArray();
	const colaboratorsFormatted = colaborators.map((colaborator) => ({ ...colaborator, _id: colaborator._id.toString() }));
	return {
		data: {
			default: colaboratorsFormatted,
			byId: undefined,
		},
	};
}
export type TGetEmployeesOutput = Awaited<ReturnType<typeof getEmployees>>;
export type TGetEmployeesOutputById = Exclude<Awaited<ReturnType<typeof getEmployees>>["data"]["byId"], undefined>;
export type TGetEmployeesOutputDefault = Exclude<Awaited<ReturnType<typeof getEmployees>>["data"]["default"], undefined>;

const getEmployeesHandler: NextApiHandler<TGetEmployeesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	console.log("INFO [GET EMPLOYEES] Query params:", req.query);
	const input = GetEmployeesInputSchema.parse(req.query);
	const data = await getEmployees({ session, input });
	return res.status(200).json(data);
};

const CreateColaboratorInputSchema = InsertUserSchema;
export type TCreateColaboratorInput = z.infer<typeof CreateColaboratorInputSchema>;

async function createColaborator({ session, input }: { session: TAuthSession; input: TCreateColaboratorInput }) {
	if (!session?.user.permissoes.recursosHumanos.visualizar)
		throw new createHttpError.Unauthorized("Usuário não possui permissão para essa requisição.");

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");
	const insertResponse = await usersCollection.insertOne({ ...input });
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao inserir colaborador.");
	const insertedId = insertResponse.insertedId.toString();

	// Inserting subscriber in novu
	await novu.subscribers.create({
		subscriberId: getNovuSubscriberId(insertedId),
		email: input.email,
		phone: input.telefone,
		firstName: input.nome,
		avatar: input.avatar_url,
		locale: "pt-BR",
	});
	return {
		data: { insertedId },
		message: "Colaborador criado com sucesso !",
	};
}
export type TCreateColaboratorOutput = Awaited<ReturnType<typeof createColaborator>>;
const createColaboratorHandler: NextApiHandler<TCreateColaboratorOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateColaboratorInputSchema.parse(req.body);
	const data = await createColaborator({ session, input });
	return res.status(201).json(data);
};

type PutResponse = {
	data: string;
	message: string;
};
const editColaborator: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const changes = InsertUserSchema.partial().parse(req.body);

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");
	const updateResponse = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar colaborador.");
	if (updateResponse.matchedCount === 0) throw new createHttpError.NotFound("Colaborador não encontrado.");
	// Updating subscriber in novu
	if (changes.email || changes.telefone || changes.nome || changes.avatar_url) {
		const updates: Record<string, string> = {};
		if (changes.email) updates.email = changes.email;
		if (changes.telefone) updates.phone = changes.telefone;
		if (changes.nome) updates.firstName = changes.nome;
		if (changes.avatar_url) updates.avatar = changes.avatar_url;
		if (Object.keys(updates).length > 0) await novu.subscribers.patch(updates, getNovuSubscriberId(id));
	}
	return res.status(201).json({ data: "Colaborador atualizado com sucesso !", message: "Colaborador atualizado com sucesso !" });
};
export default apiHandler({
	GET: getEmployeesHandler,
	POST: createColaboratorHandler,
	PUT: editColaborator,
});
