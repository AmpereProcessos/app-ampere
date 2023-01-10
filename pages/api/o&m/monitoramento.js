import axios from "axios";
import connectToDatabase from "../../../utils/auxiliaresDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("monitoramento");
    var arr = await collection
      .aggregate([
        {
          $project: {
            status: 1,
            codProjeto: 1,
            nomeCliente: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
