import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    let arr = await collection.insertOne({ ...req.body });
    res.json(arr);
  } else if (req.method === "GET") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  }
}
