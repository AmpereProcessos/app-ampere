import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/materialDb";
import createHttpError from "http-errors";
import errorHandler from "../../../utils/methods/handlers";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    let obj = await collection.insertOne({ ...req.body });
    res.json(obj);
  } else if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    var { page, limit } = req.query;
    limit = !isNaN(limit) ? Number(Number(limit).toFixed(0)) : 200;
    const skip = limit ? (page - 1) * limit : (page - 1) * 200;
    try {
      if (!page || page <= 0)
        throw new createHttpError.BadRequest(
          "Página não especificada ou inválida."
        );
      const forms = await collection
        .aggregate([
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ])
        .toArray();

      res.status(200).json(forms);
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (req.method === "PUT") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("formularios");
    await collection.updateOne(
      {
        _id: ObjectId(req.body.id),
      },
      {
        $set: {
          ...req.body.data,
        },
      }
    );
    res.json("UEPA");
  }
}
