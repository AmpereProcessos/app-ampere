// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../utils/proposesDb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    /*const {
    clientName,
    city,
    attendant,
    modulesQty,
    modulesPot,
    currentEfficience,
    distance,
    price,
  } = req.body;*/
    const db = await connectToDatabase(process.env.DB2_KEY);
    const collection = db.collection("infos");
    await collection.insertOne(req.body);
    return res.status(201).json("Proposta gerada");
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB2_KEY);
    const collection = db.collection("infos");
    let users = await collection.find({}).toArray();
    return res.status(201).json(users);
  }
}
