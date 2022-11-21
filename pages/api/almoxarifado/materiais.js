import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let materiais = await collection.find({}).toArray();
    res.json(materiais);
  }
}
