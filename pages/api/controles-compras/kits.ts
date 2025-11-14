import { apiHandler } from "@/utils/api";
import {
	PurchaseControlCompositionKitSchema,
	type TPurchaseControlCompositionKit,
	type TPurchaseControlCompositionKitDTO,
} from "@/utils/schemas/purchases";
import { MongoDbIdSchema } from "@/utils/schemas/useful-server";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";

export type TGetPurchaseControlCompositionKitsOutput = {
	data: TPurchaseControlCompositionKitDTO | TPurchaseControlCompositionKitDTO[];
};
const getPurchaseControlCompositionKits: NextApiHandler<TGetPurchaseControlCompositionKitsOutput> = async (req, res) => {
	const db = await connectToDatabase();
	const purchaseControlsCompositionKitsCollection = db.collection<TPurchaseControlCompositionKit>("controles-compras-kits-composicao");

	const { id } = req.query;

	if (id) {
		const purchaseControlCompositionKitId = MongoDbIdSchema.parse(id);

		const purchaseControlCompositionKit = await purchaseControlsCompositionKitsCollection.findOne({ _id: purchaseControlCompositionKitId });

		if (!purchaseControlCompositionKit) throw new createHttpError.NotFound("Kit de composição de compra não encontrado.");
		return res.status(200).json({ data: { ...purchaseControlCompositionKit, _id: purchaseControlCompositionKit?._id.toString() } });
	}

	const purchaseControlCompositionKits = await purchaseControlsCompositionKitsCollection.find({}).toArray();

	return res.status(200).json({
		data: purchaseControlCompositionKits.map((p) => ({ ...p, _id: p._id.toString() })),
	});
};

export type TCreatePurchaseControlCompositionKitOutput = {
	data: { insertedId: string };
	message: string;
};

export type TCreatePurchaseControlCompositionKitInput = z.infer<typeof PurchaseControlCompositionKitSchema>;
const createPurchaseControlCompositionKit: NextApiHandler<TCreatePurchaseControlCompositionKitOutput> = async (req, res) => {
	const payload = PurchaseControlCompositionKitSchema.parse(req.body);

	const db = await connectToDatabase();
	const purchaseControlsCompositionKitsCollection = db.collection<TPurchaseControlCompositionKit>("controles-compras-kits-composicao");

	const insertPurchaseControlCompositionKitResponse = await purchaseControlsCompositionKitsCollection.insertOne(payload);

	if (!insertPurchaseControlCompositionKitResponse.acknowledged)
		throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar kit de composição de compra.");

	const insertedPurchaseControlCompositionKitId = insertPurchaseControlCompositionKitResponse.insertedId.toString();

	return res
		.status(201)
		.json({ data: { insertedId: insertedPurchaseControlCompositionKitId }, message: "Kit de composição de compra criado com sucesso !" });
};

export default apiHandler({ GET: getPurchaseControlCompositionKits, POST: createPurchaseControlCompositionKit });
