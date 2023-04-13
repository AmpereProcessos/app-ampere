import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, info } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID não fornecido." });
    }
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    const dbResponse = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $project: {
            _id: 1,
            nomeDoContrato: 1,
            ordensDeServico: 1,
          },
        },
      ])
      .toArray();
    console.log(info);
    if (!dbResponse[0]) res.status(404).json({ error: "ID não fornecido." });
    const index = dbResponse[0].ordensDeServico
      ? dbResponse[0].ordensDeServico.at(-1).index + 1
      : 0;
    const newOrder = { ...info, index: index };
    let dbUpdateResponse = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $push: {
          ordensDeServico: newOrder,
        },
      }
    );
    console.log(dbUpdateResponse);
    res.json(newOrder);
  }
}
