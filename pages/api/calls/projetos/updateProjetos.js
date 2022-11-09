import connectToDatabase from "../../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("projetos");
    const id = req.body.id;
    delete req.body._id;
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ...req.body.mudancas } }
    );

    res.json("Alterações feitas!");
  }
}
