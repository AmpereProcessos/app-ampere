import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "changes");
    const collection = db.collection("info");
    let obj = await collection.insertOne({
      ...req.body,
      data: new Date().toLocaleDateString(),
    });
    res.json("FOI");
  }
}
