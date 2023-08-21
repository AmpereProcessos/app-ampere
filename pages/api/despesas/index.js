import createHttpError from "http-errors";
import connectToDatabase from "../../../utils/connectDb";
import { errorHandler } from "../../../utils/methods/handlers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("despesas");
    const { projectId } = req.query;
    try {
      if (projectId && typeof projectId == "string") {
        // Project related expenses
        const expenses = await collection
          .aggregate([
            {
              $match: {
                "projeto.id": projectId,
              },
            },
          ])
          .toArray();
        res.status(200).json(expenses);
      } else {
        // All expenses
        const expenses = await collection
          .aggregate([{ $sort: { dataInsercao: -1 } }])
          .toArray();
        res.status(200).json(expenses);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
  if (req.method == "POST") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, "projetos");
      const collection = db.collection("despesas");
      const info = req.body.data;
      let dbRes = await collection.insertOne(info);
      res.json(dbRes);
    } catch (error) {
      errorHandler(error, res);
    }
  }
  if (req.method == "PUT") {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, "projetos");
      const collection = db.collection("despesas");
      const { changes } = req.body;
      const { id } = req.query;
      if (!changes)
        throw new createHttpError.BadRequest(
          "Objeto de mudanças não fornecido."
        );
      if (!id || typeof id != "string")
        throw new createHttpError.BadRequest("ID inválido.");

      const dbResponse = await collection.updateOne(
        { _id: ObjectId(id) },
        { $set: { ...changes } }
      );
      res.json(dbResponse);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
