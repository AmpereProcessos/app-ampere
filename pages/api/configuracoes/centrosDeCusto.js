import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/auxiliaresDb";
import createHttpError from "http-errors";
import { errorHandler } from "../../../utils/methods/handlers";
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const db = await connectToDatabase(process.env.DB_KEY);
      const apportionmentsCollection = db.collection("centrosDeCusto");
      if (id) {
        if (!ObjectId.isValid(id))
          throw new createHttpError.BadRequest("ID inválido.");

        const apportionment = await getSingleApportionment({
          id: id,
          collection: apportionmentsCollection,
        });
        if (!apportionment)
          throw new createHttpError.NotFound(
            "Nenhum centro de custo encontrado para esse ID."
          );
        res.status(200).json(apportionment);
      } else {
        const apportionments = await getAllApportionments({
          collection: apportionmentsCollection,
        });
        res.status(200).json(apportionments);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  }
  if (req.method === "POST") {
    try {
      const { data } = req.body;
      if (!data)
        throw new createHttpError.BadRequest(
          "Informações para inserção de centro de custo não fornecidas."
        );
      const db = await connectToDatabase(process.env.DB_KEY);
      const apportionmentsCollection = db.collection("centrosDeCusto");
    } catch (error) {}
  }
}

async function getSingleApportionment({ id, collection }) {
  try {
    return await collection.findOne({
      _id: ObjectId(id),
    });
  } catch (error) {
    throw error;
  }
}
async function getAllApportionments({ collection }) {
  console.log("CALLED");
  try {
    return await collection
      .aggregate([
        {
          $sort: {
            nome: 1,
          },
        },
      ])
      .toArray();
  } catch (error) {
    throw error;
  }
}
async function insertApportionment({ collection, data }) {
  const { nome, categorias, orcamentos } = data;
  await collection.insertOne({ nome, categorias, orcamentos });
}
