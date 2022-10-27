import connectToDatabase from "../../../utils/projectsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "projeto.aumentoDeCarga": "SIM",
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ...req.body.mudancas } }
    );
    return res.json(newObj);
  }
}
