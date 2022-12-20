import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let obj = collection.insertOne({ ...req.body });
    console.log(req.body);
    res.json(obj);
  }
}
