import connectToDatabase from "../../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY, "chamados");
  const collection = db.collection("suporte");
  let call = await collection
    .find({
      _id: ObjectId(req.query.id),
    })
    .toArray();
  return res.json(call[0]);
}
