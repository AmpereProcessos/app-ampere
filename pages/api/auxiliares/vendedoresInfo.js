import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("vendedoresInfo");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  }
}
