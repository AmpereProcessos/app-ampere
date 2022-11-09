import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            compra: 1,
            material: 1,
            tempoPassado: {
              $dateDiff: {
                startDate: { $toDate: "$compra.previsaoEntrega" },
                endDate: { $toDate: "2022-10-28" },
                unit: "day",
              },
            },
          },
        },
        {
          $match: {
            $and: [
              { tempoPassado: { $gte: 0 } },
              { tempoPassado: { $lt: 15 } },
            ],
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
    console.log(req.body);
    return res.json("OK");
  }
}
