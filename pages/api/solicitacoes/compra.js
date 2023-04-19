import { ObjectId } from "mongodb";
import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("compra");
    const solicitation = {
      ...req.body,
      dataSolicitacao: new Date().toISOString(),
    };
    let dbRes = await collection.insertOne(solicitation);
    res.json(dbRes);
  } else if (req.method == "GET") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("compra");
    const arr = await collection.find({}).toArray();
    res.json(arr);
  } else if (req.method == "PUT") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("compra");
    const { id, changes } = req.body;
    delete changes._id;
    const dbResp = await collection.updateOne(
      { _id: ObjectId(id) },
      {
        $set: { ...changes },
      }
    );
    res.json(dbResp);
  }
}
