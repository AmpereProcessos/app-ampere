import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { AllocatorSchema, TAllocator } from "@/utils/schemas/allocators";
import { NextApiHandler } from "next";
import connectToDatabase from "@/utils/services/mongodb/warehouse";
import { Collection, Db, ObjectId } from "mongodb";
import createHttpError from "http-errors";

type GetResponse = {
	data: TAllocator | TAllocator[];
};
const getAllocatorsRoute: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection: Collection<TAllocator> = db.collection("alocadores");

	if (id) {
		if (typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const allocator = await collection.findOne({ _id: new ObjectId(id) });
		if (!allocator) throw new createHttpError.NotFound("Alocador não encontrado.");
		return res.status(200).json({ data: allocator });
	}

	const allocators = await collection.find({}).toArray();
	return res.status(200).json({ data: allocators });
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};
const createAllocatorRoute: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const allocator = AllocatorSchema.parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection: Collection<TAllocator> = db.collection("alocadores");
	const insertResponse = await collection.insertOne(allocator);

	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao inserir o alocador.");
	const insertedId = insertResponse.insertedId.toString();
	return res.status(201).json({ data: { insertedId }, message: "Alocador criado com sucesso !" });
};

type PutResponse = {
	data: string;
	message: string;
};
const updateAllocatorRoute: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const allocator = AllocatorSchema.partial().parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const collection: Collection<TAllocator> = db.collection("alocadores");
	const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: allocator });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o alocador.");
	return res.status(200).json({ data: id, message: "Alocador atualizado com sucesso !" });
};

export default apiHandler({
	GET: getAllocatorsRoute,
	POST: createAllocatorRoute,
	PUT: updateAllocatorRoute,
});
