import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ordensDeServico: req.body.arr } }
    );
    return res.json("OK");
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .find({ ordensDeServico: { $ne: null } })
      .toArray();
    return res.json(arr);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body.id),
        "ordensDeServico.index": req.body.index,
      },
      {
        $set: {
          "ordensDeServico.$.dataDeFechamento": req.body.fechamento,
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(newObj);
  }
}
