import connectToEventsDatabase from "../../../utils/eventsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToEventsDatabase(process.env.DB_KEY);
    const collection = db.collection("info");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ...req.body } }
    );
    res.json(newObj);
  }
}
