import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let { search } = req.query;
    const arr = await collection
      .aggregate([
        {
          $match: {
            nome: { $regex: search },
          },
        },
        {
          $project: {
            nome: 1,
            qtde: 1,
            preco: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    const { materials } = req.body;
    const arrOfIds = materials.map((item) => item.id);
    const upToDateItems = await collection
      .aggregate([
        {
          $match: {
            _id: { $in: arrOfIds.map((id) => ObjectId(id)) },
          },
        },
        {
          $project: {
            nome: 1,
            qtde: 1,
            preco: 1,
            codigo: 1,
          },
        },
      ])
      .toArray();
    res.json(upToDateItems);
  }
}
