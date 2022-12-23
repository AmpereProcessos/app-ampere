import connectToDatabase from "../../../utils/insideSalesDb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("leads");
  try {
    let arr = await collection.insertOne({
      ...req.body,
      dataEnvio: new Date().toISOString(),
    });
    res.json(arr);
  } catch (error) {
    res.status(500).send(error);
  }
}
