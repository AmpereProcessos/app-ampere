import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "estruturaPersonalizada.aplicavel": "SIM",
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ...req.body.mudancas } }
    );
    return res.json(newObj);
  }
}
