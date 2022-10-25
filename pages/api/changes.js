import connectToChangesDatabase from "../../utils/changesDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToChangesDatabase(process.env.DB_KEY);
    const collection = db.collection("info");
    let obj = await collection.insertOne({
      ...req.body,
      data: new Date().toLocaleDateString(),
    });
    res.json("FOI");
  }
}
