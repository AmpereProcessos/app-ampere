import connectToDatabase from "../../../utils/callsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    var exists = req.body.dataDeConclusao;
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: {
          dataDeConclusao: exists ? new Date().toJSON() : "",
          status: req.body.status,
          ultAlteracoes: req.body.ultAlteracoes,
        },
      },
      { returnNewDocument: true }
    );
    return res.json(newDocument);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    console.log(req.body.ultAlteracoes);
    const collection = db.collection("pps");
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: {
          anotacoes: req.body.anotacoes,
          responsavel: req.body.responsavel,
          status: req.body.status,
          ultAlteracoes: req.body.ultAlteracoes,
        },
      },
      { returnNewDocument: true }
    );
    return res.json("Alterações feitas!");
  }
}
