import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("fenesc");
    const info = req.body;
    let dbRes = await collection.insertOne(info);
    res.json(dbRes);
  } else if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("fenesc");
    const registers = await collection.find({}).toArray();
    res.json(registers);
  } else if (req.method == "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("fenesc");
    const { id, changes } = req.body;
    delete changes._id;
    let dbRes = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          efetivado: changes.efetivado,
        },
      }
    );
    res.json(dbRes);
  }
}
