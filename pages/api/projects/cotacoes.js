import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("cotacoes");
    let arr = await collection.find({}).toArray();
    res.json(arr);
  } else if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("cotacoes");
    let insertObj = req.body;
    console.log(insertObj);
    let insert = await collection.insertOne(insertObj);
    res.json(insert);
  }
}
