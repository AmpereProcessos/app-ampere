import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    let obj = await collection.insertOne({ ...req.body });
    res.json(obj);
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    let forms = await collection.find({}).toArray();
    res.json(forms);
  }
}
