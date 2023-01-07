import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/insideSalesDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("leads");
    var arr = await collection
      .aggregate([
        {
          $sort: {
            dataDeAquisicao: -1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("leads");
    var arr = await collection
      .aggregate([
        {
          $match: {
            responsavel: req.body.responsavel,
          },
        },
        {
          $sort: {
            dataDeAquisicao: -1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method == "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("leads");
    var id = req.body.id;
    var changes = req.body.changes;
    delete changes._id;
    var newObj = await collection.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: { ...changes },
      }
    );
    res.json("OK");
  }
}
