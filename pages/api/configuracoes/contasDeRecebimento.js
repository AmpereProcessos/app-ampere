import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
import createHttpError from "http-errors";
import { errorHandler } from "../../../utils/methods/handlers";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
    const db = await connectToDatabase(process.env.DB_KEY);
    const receiptAccountsCollection = db.collection("contasDeRecebimento");
    try {
      if (id) {
        if (typeof id != "string")
          throw new createHttpError.BadRequest("ID inválido.");

        const account = await receiptAccountsCollection.findOne({
          _id: new ObjectId(id),
        });
        res.status(200).json(account);
      } else {
        const accounts = await receiptAccountsCollection
          .aggregate([
            {
              $sort: {
                nome: 1,
              },
            },
          ])
          .toArray();
        res.status(200).json(accounts);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
