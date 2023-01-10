import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("contrato");
    let arr = await collection.insertOne({ ...req.body });
    res.json(arr);
  } else if (req.method === "GET") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("contrato");
    // {
    //   $addFields: {
    //     dataInsercao: {
    //       $toDate: "$_id";
    //     }
    //   }
    // }
    let arr = await collection
      .aggregate([
        {
          $project: {
            nomeDoContrato: 1,
            nomeVendedor: 1,
            tipoDeServico: 1,
            cidade: 1,
            confeccionado: 1,
            aprovacao: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "PUT") {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("contrato");
    const id = req.body._id;
    delete req.body._id;
    var newObj = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { ...req.body } }
    );
    res.json(newObj);
  }
}
