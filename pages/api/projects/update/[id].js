import { ObjectId } from "mongodb";
import connectToDatabase from "../../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    delete req.body._id;
    // let obj = await collection.findOne({ _id: ObjectId(req.query.id) });
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.query.id) },
      { $set: { ...req.body } }
    );
    // var newObj = { ...obj, ...req.body };
    return res.json(newObj);
  }
}
