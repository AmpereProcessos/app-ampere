import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let lastestInserted = await collection
      .aggregate([
        {
          $sort: {
            qtde: -1,
          },
        },
      ])
      .toArray();
    console.log(lastestInserted[0]);
    let project = await collection.insertOne({
      ...req.body,
      qtde: lastestInserted[0].qtde + 1,
    });
    return res.json(project);
  }
}
