import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var arr = await collection
      .aggregate([
        {
          $match: {
            "obra.entrada": { $gte: "2022-11-01T00:00:00.000Z" },
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            logradouro: 1,
            bairro: 1,
            numeroResidencia: 1,
            "obra.equipeResp": 1,
            "obra.entrada": 1,
          },
        },
      ])
      .toArray();
    arr = arr?.map((evento) => {
      return {
        title: evento.nomeDoContrato,
        date: new Date(
          new Date(evento.obra.entrada).setHours(28)
        ).toISOString(),
        qtde: evento.qtde,
        equipe: evento.obra.equipeResp,
        cidade: evento.cidade,
        logradouro: evento.logradouro,
        numeroResidencia: evento.numeroResidencia,
      };
    });
    res.json(arr);
  }
}
