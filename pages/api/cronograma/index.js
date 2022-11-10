import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");
  if (req.method === "GET") {
    var arr = await collection
      .aggregate([
        {
          $match: {
            "agendamentoObra.inicio": { $gte: "2022-11-01T00:00:00.000Z" },
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
            agendamentoObra: 1,
          },
        },
      ])
      .toArray();
    arr = arr?.map((evento) => {
      return {
        title: evento.nomeDoContrato,
        date: new Date(
          new Date(evento.agendamentoObra.inicio).setHours(28)
        ).toISOString(),
        qtde: evento.qtde,
        equipe: evento.obra.equipeResp,
        cidade: evento.cidade,
        logradouro: evento.logradouro,
        numeroResidencia: evento.numeroResidencia,
      };
    });
    res.json(arr);
  } else if (req.method === "POST") {
    console.log(req.body);
    return "OK";
  }
}
