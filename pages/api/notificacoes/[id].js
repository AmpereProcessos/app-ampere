import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("notificacoes");
    await collection.insertOne({
      ...req.body,
      dataDeEnvio: new Date(),
      lido: false,
    });
    res.json("Enviado!");
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("notificacoes");
    let notificacoes = await collection
      .aggregate([
        {
          $match: {
            destinatario: req.query.id,
          },
        },
        {
          $sort: {
            lido: 1,
            dataDeLeitura: -1,
          },
        },
      ])
      .toArray();
    res.json(notificacoes);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("notificacoes");
    await collection.updateOne(
      {
        _id: ObjectId(req.body.id),
      },
      {
        $set: {
          lido: true,
          dataDeLeitura: new Date(),
        },
      }
    );
    res.json("Atualizado!");
  }
}
