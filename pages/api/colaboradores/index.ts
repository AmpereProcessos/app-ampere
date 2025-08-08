import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertUserSchema, type TEmployee } from "@/utils/schemas/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import { novu } from "@/utils/services/novu";
import { getNovuSubscriberId } from "@/utils/services/novu/config";
import createHttpError from "http-errors";
import { type Collection, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
	data: TEmployee | TEmployee[];
};

const getEmployees: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	if (!session?.user.permissoes.recursosHumanos.visualizar) throw new createHttpError.Unauthorized("Usuário não possui permissão para essa requisição.");

	const { id, active } = req.query;
	const activeParam = active === "true";
	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");
	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const colaborator = await usersCollection.findOne({ _id: new ObjectId(id) });
		if (!colaborator) throw new createHttpError.NotFound("Colaborador não encontrado.");
		return res.status(200).json({ data: colaborator });
	}
	const colaborators = await usersCollection.find({ colaboradorAtivo: activeParam }, { sort: { nome: 1 } }).toArray();

	return res.status(200).json({ data: colaborators });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};

const createColaborator: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	if (!session?.user.permissoes.recursosHumanos.visualizar) throw new createHttpError.Unauthorized("Usuário não possui permissão para essa requisição.");

	const colaborator = InsertUserSchema.parse(req.body);

	const db = await connectToAdministrationDatabase();
	const usersCollection: Collection<TEmployee> = db.collection("colaboradores");
	const insertResponse = await usersCollection.insertOne({ ...colaborator });
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao inserir colaborador.");
	const insertedId = insertResponse.insertedId.toString();

	// Inserting subscriber in novu
	await novu.subscribers.create({
		subscriberId: getNovuSubscriberId(insertedId),
		email: colaborator.email,
		phone: colaborator.telefone,
		firstName: colaborator.nome,
		avatar: colaborator.avatar_url,
		locale: "pt-BR",
	});
	return res.status(201).json({ data: { insertedId }, message: "Colaborador criado com sucesso !" });
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
	GET: getEmployees,
	POST: createColaborator,
	PUT: editColaborator,
});
