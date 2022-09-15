import connectToDatabase from "../../../utils/callsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("suporte");
    var exists = req.body.fechamento;
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: {
          fechamento: exists ? new Date().toJSON() : "",
          statusChamado: req.body.statusChamado,
        },
      },
      { returnNewDocument: true }
    );
    console.log(req.body);
    return res.json(newDocument);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("suporte");
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body._id),
      },
      {
        $set: {
          anotacoes: req.body.anotacoes,
          responsavel: req.body.responsavel,
        },
      },
      { returnNewDocument: true }
    );
    return res.json("Alterações feitas!");
  }
}
