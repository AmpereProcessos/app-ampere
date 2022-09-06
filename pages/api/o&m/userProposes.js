import connectToDatabase from "../../../utils/proposesDb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user } = req.body;
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("infos");
    let proposes = await collection.find({ attendant: user }).toArray();
    return res.status(201).json(proposes);
  }
}
