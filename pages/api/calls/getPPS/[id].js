import connectToDatabase from "../../../../utils/callsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("pps");
  let call = await collection
    .find({
      _id: ObjectId(req.query.id),
    })
    .toArray();
  return res.json(call[0]);
}
