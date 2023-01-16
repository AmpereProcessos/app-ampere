import connectToSolicitacoesDatabase from "../../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    let id = req.query.id;
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    var arr = await collection.find({ _id: ObjectId(id) }).toArray();
    res.json(arr[0]);
  }
}
