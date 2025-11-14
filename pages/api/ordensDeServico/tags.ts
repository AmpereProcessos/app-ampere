import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ServiceOrderTagSchema, TServiceOrderTag } from "@/utils/schemas/service-order";
import connectToDatabase from "@/utils/services/mongodb/auxiliaries";
import createHttpError from "http-errors";
import { Db, ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type GetResponse = {
	data: TServiceOrderTag | TServiceOrderTag[];
};

const getServiceOrderTagsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TServiceOrderTag>("etiquetas-ordens-servico");

	if (id) {
		if (typeof id !== "string") throw new createHttpError.BadRequest("ID inválido.");
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (!result) throw new createHttpError.NotFound("Etiqueta não encontrada.");
		return res.status(200).json({ data: result });
	}

	const tags = await collection.find({}).toArray();
	return res.status(200).json({ data: tags });
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createServiceOrderTagRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	console.log(req.body);
	const tag = ServiceOrderTagSchema.parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TServiceOrderTag>("etiquetas-ordens-servico");

	const insertResponse = await collection.insertOne(tag);
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar tag.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Tag criada com sucesso !" });
};

type PutResponse = {
	message: string;
};
const updateServiceOrderTagRoute: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;

	if (!id || typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const changes = ServiceOrderTagSchema.partial().parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TServiceOrderTag>("etiquetas-ordens-servico");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar tag.");

	return res.status(201).json({ message: "Etiqueta atualizada com sucesso !" });
};

export default apiHandler({
	GET: getServiceOrderTagsRoute,
	POST: createServiceOrderTagRoute,
	PUT: updateServiceOrderTagRoute,
});
