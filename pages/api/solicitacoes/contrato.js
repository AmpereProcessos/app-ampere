import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "solicitacoes");
    const collection = db.collection("contrato");
    let arr = await collection.insertOne({ ...req.body });
    res.json(arr);
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "solicitacoes");
    const collection = db.collection("contrato");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "solicitacoes");
    const collection = db.collection("contrato");
    const id = req.body._id;
    delete req.body._id;
    var newObj = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { ...req.body } }
    );
    res.json(newObj);
  }
}
