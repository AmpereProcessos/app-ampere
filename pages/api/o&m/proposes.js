// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/auxiliaries";

export default async function handler(req, res) {
	if (req.method === "POST") {
		/*const {
    clientName,
    city,
    attendant,
    modulesQty,
    modulesPot,
    currentEfficience,
    distance,
    price,
  } = req.body;*/

		try {
			const db = await connectToDatabase(process.env.DB_KEY, "projetos");
			const collection = db.collection("propostas");
			const dbRes = await collection.insertOne(req.body);
			res.json(dbRes);
		} catch (error) {
			res.status(500).send("Houve um erro, por favor tente novamente.");
		}
	} else if (req.method === "GET") {
		const db = await connectToDatabase(process.env.DB_KEY, "projetos");
		const collection = db.collection("propostas");
		const { id, seller } = req.query;
		var dbResp;
		if (id) {
			dbResp = await collection.find({ _id: ObjectId(id) }).toArray();
		} else if (seller) {
			dbResp = await collection.find({ vendedor: seller }).toArray();
		} else {
			dbResp = await collection.find({}).toArray();
		}
		return res.status(201).json(dbResp);
	}
}
