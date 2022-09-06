import connectToDatabase from "../../../utils/proposesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log(req.query);
    const { id } = req.query;
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("infos");
    let user = await collection.findOne({
      _id: ObjectId(id),
    });
    return res.status(201).json(user);
  }
}
