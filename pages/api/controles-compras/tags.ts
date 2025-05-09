import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { PurchaseTagSchema, type TPurchaseControlTag } from "@/utils/schemas/purchases";
import connectToDatabase from "@/utils/services/mongodb/auxiliaries";
import createHttpError from "http-errors";
import { type Db, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
	data: TPurchaseControlTag | TPurchaseControlTag[];
};
const getPurchasesControlsTagsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TPurchaseControlTag>("etiquetas-compras");

	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const purchaseControl = await collection.findOne({ _id: new ObjectId(id) });
		if (!purchaseControl) throw new createHttpError.NotFound("Controle de compra não encontrado.");
		return res.status(200).json({ data: purchaseControl });
	}

	const purchaseControlsTags = await collection.find({}).toArray();

	return res.status(200).json({ data: purchaseControlsTags });
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createPurchaseControlTagRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const purchaseControl = PurchaseTagSchema.parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TPurchaseControlTag>("etiquetas-compras");

	const insertResponse = await collection.insertOne(purchaseControl);
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao inserir etiqueta de controle de compra.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(200).json({ data: { insertedId }, message: "Etiqueta de controle de compra criado com sucesso !" });
};

type PutResponse = {
	message: string;
};
const updatePurchaseControlTagRoute: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const changes = PurchaseTagSchema.partial().parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection = db.collection<TPurchaseControlTag>("etiquetas-compras");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar etiqueta de controle de compra.");
};

export default apiHandler({ GET: getPurchasesControlsTagsRoute, POST: createPurchaseControlTagRoute, PUT: updatePurchaseControlTagRoute });
