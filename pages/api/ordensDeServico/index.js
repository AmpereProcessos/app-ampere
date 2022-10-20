import connectToDatabase from "../../../utils/projectsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ordensDeServico: req.body.arr } }
    );
    console.log(req.body);
    return res.json("OK");
  }
}
