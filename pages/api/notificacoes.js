import { ObjectId } from "mongodb";
import connectToDatabase from "../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("notificacoes");
    let notificacoes = await collection
      .aggregate([
        {
          $match: {
            destinatario: "6318db05929e9f8731d8d9bb",
            lido: null,
          },
        },
      ])
      .toArray();
    res.json(notificacoes);
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("notificacoes");
    await collection.updateOne(
      {
        _id: ObjectId(req.body.id),
      },
      {
        $set: {
          lido: true,
        },
      }
    );
    res.json("Atualizado!");
  }
}
