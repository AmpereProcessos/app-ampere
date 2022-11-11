import connectToDatabase from "../../../../utils/callsDb";
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
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("projetos");
    console.log(req.body._id);
    var obj = await collection.findOneAndDelete({
      _id: ObjectId(req.body._id),
    });
    res.json("Chamado excluido com sucesso.");
  }
}
