import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            "projeto.aumentoDeCarga": "SIM",
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            "compra.statusLiberacao": 1,
            cidade: 1,
            bairro: 1,
            logradouro: 1,
            numeroResidencia: 1,
            "projeto.dataAssDocumentacao": 1,
            "parecer.statusDoParecerDeAcesso": 1,
            padrao: 1,
            visitaTecnica: 1,
            "projeto.fechamentoAC": 1,
            "projeto.acStatus": 1,
            ordensDeServico: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var newObj = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { ...req.body.mudancas } }
    );
    return res.json(newObj);
  }
}
