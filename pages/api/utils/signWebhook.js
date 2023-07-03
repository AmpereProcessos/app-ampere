import connectToDatabase from "../../../utils/auxiliaresDb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("webhook");
    console.log(req.body);
    await collection.insertOne(req.body);
  }
}
