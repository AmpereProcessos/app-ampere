import { ObjectId } from "mongodb";
import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    if (!id) {
      res.status(401).json("ID não fornecido.");
    }
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("contrato");
    const { operation } = req.body;
    var newObj = await collection.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      { ...operation }
    );
    res.json(newObj);
  }
}
