import connectToDatabase from "../../../utils/projectsDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "ordensDeServico.realizarCobranca": true,
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            ordensDeServico: {
              $filter: {
                input: "$ordensDeServico",
                as: "item",
                cond: { $eq: ["$$item.realizarCobranca", true] },
              },
            },
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    var newObj = await collection.findOneAndUpdate(
      {
        _id: ObjectId(req.body.id),
        "ordensDeServico.index": req.body.index,
      },
      {
        $set: {
          "ordensDeServico.$.cobrancaRealizada": req.body.status,
          "ordensDeServico.$.dataDeCobranca": req.body.date,
        },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(newObj);
  }
}
