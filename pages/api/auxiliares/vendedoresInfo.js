import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/auxiliaries";
export default async function handler(req, res) {
	if (req.method == "GET") {
		const db = await connectToDatabase(process.env.DB_KEY);
		const collection = db.collection("vendedoresInfo");
		let arr = await collection.find({ ativo: true }).toArray();
		res.json(arr);
	}
}
