import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    console.log(req.body);
    const collection = db.collection("contrato");
    let arr = await collection.insertOne({ ...req.body });
    res.json(arr);
  }
}
