import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/warehouse";
export default async function handler(req, res) {
	if (req.method == "GET") {
		try {
			const db = await connectToDatabase(process.env.DB_KEY);
			const collection = db.collection("formularios");
			const id = req.query;
			let obj = await collection.findOne({ _id: ObjectId(id) });
			res.json(obj);
		} catch (error) {
			res.status(400).send(error);
		}
	}
}
