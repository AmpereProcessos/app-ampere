import axios from "axios";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("monitoramento");
    try {
      var arr = await collection
        .aggregate([
          {
            $match: {
              status: { $ne: "RESOLVIDO" },
            },
          },
          {
            $project: {
              status: 1,
              codProjeto: 1,
              nomeUsina: 1,
              nomeCliente: 1,
              problema: 1,
              observacoes: 1,
            },
          },
        ])
        .toArray();
      res.json(arr);
    } catch (error) {
      res
        .status(500)
        .send("Erro na comunicação com o servidor, por favor tente novamente.");
    }
  } else if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("monitoramento");
    let call = await collection.insertOne({
      ...req.body,
    });
    console.log(call);
    res.json(call);
  } else if (req.method == "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("monitoramento");
    let id = req.body._id;
    let changes = { ...req.body };
    delete changes._id;
    var newObj = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { ...changes } }
    );
    res.json("Alterações feitas!");
  }
}
