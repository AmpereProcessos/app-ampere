import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("contrato");
    let arr = await collection
      .find({ nomeVendedor: req.body.vendedor })
      .toArray();
    res.json(arr);
  }
}
