import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.tipo == "CONTRATO") {
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
      const collection = db.collection("contrato");
      let arr = await collection
        .find({ nomeVendedor: req.body.vendedor })
        .toArray();
      res.json(arr);
    } else if (req.body.tipo == "VISITA") {
      const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
      const collection = db.collection("visitaTecnica");
      let arr = await collection
        .find({
          nomeVendedor: req.body.vendedor,
        })
        .toArray();
      console.log(arr);
      res.json(arr);
    }
  }
}
