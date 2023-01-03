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
    try {
      await collection.insertOne(req.body);
      res.json("Proposta gerada");
    } catch (error) {
      res.status(500).send("Houve um erro, por favor tente novamente.");
    }
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB2_KEY);
    const collection = db.collection("infos");
    let users = await collection.find({}).toArray();
    return res.status(201).json(users);
  }
}
