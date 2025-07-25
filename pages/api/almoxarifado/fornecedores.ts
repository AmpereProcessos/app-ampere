import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { MaterialSupplierSchema, type TMaterialSupplier } from "@/utils/schemas/materials";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import createHttpError from "http-errors";
import { type Db, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
	data: TMaterialSupplier | TMaterialSupplier[];
};

const getMaterialSupplierRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	const db: Db = await connectToWarehouseDatabase();
	const collection = db.collection<TMaterialSupplier>("fornecedores-materiais");

	if (id) {
		if (typeof id !== "string") throw new createHttpError.BadRequest("ID inválido.");
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (!result) throw new createHttpError.NotFound("Fornecedor não encontrado.");
		return res.status(200).json({ data: result });
	}

	const suppliers = await collection.find({}).toArray();
	return res.status(200).json({ data: suppliers });
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createMaterialSupplierRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	console.log(req.body);
	const supplier = MaterialSupplierSchema.parse(req.body);

	const db: Db = await connectToWarehouseDatabase();
	const collection = db.collection<TMaterialSupplier>("fornecedores-materiais");

	const insertResponse = await collection.insertOne(supplier);
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar fornecedor.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Fornecedor criado com sucesso !" });
};

type PutResponse = {
	message: string;
};
const updateMaterialSupplierRoute: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;

	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const changes = MaterialSupplierSchema.partial().parse(req.body);

	const db: Db = await connectToWarehouseDatabase();
	const collection = db.collection<TMaterialSupplier>("fornecedores-materiais");

	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });
	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar fornecedor.");

	return res.status(201).json({ message: "Fornecedor atualizado com sucesso !" });
};

export default apiHandler({
	GET: getMaterialSupplierRoute,
	POST: createMaterialSupplierRoute,
	PUT: updateMaterialSupplierRoute,
});
