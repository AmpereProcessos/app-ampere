import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    // let materiais = await collection.find({}).toArray();
    console.log(req.body);
    res.json(req.body);
  }
}
