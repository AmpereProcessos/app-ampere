import connectToDatabase from "../../../utils/proposesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("infos");
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body.id),
      },
      { $set: { negotiationStage: req.body.listId } },
      { returnNewDocument: true }
    );
    // await collection.insertOne(req.body);
    //  return res.status(201).json("Proposta gerada");*/
    return res.json(newDocument);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("infos");

    if (req.body.rejected == true) {
      let newDocument = await collection.findOneAndUpdate(
        {
          _id: ObjectId(req.body.id),
        },
        { $set: { rejected: req.body.rejected } },
        { returnNewDocument: true }
      );
      return res.json(newDocument);
    } else {
      let newDocument = await collection.findOneAndUpdate(
        {
          _id: ObjectId(req.body.id),
        },
        { $set: { currentPlanOption: Number(req.body.plan) } },
        { returnNewDocument: true }
      );
      return res.json(newDocument);
    }
  } else if (req.method === "PATCH") {
    const { id } = req.body;
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("infos");
    let newDocument = await collection.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      { $set: { closed: true } },
      { returnNewDocument: true }
    );
    return res.json("Proposta alterada");
  }
}
