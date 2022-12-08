import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("FUICHMADO");
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    let arr = await collection.insertOne({ ...req.body });
    res.json(arr);
  }
}
