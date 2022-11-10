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
            "sistema.qtdeModulos": 1,
            "sistema.topologia": 1,
          },
        },
      ])
      .toArray();
    arr = arr?.map((evento) => {
      return {
        title: evento.nomeDoContrato,
        start: new Date(
          new Date(evento.agendamentoObra.inicio).setHours(32)
        ).toISOString(),
        end: new Date(
          new Date(evento.agendamentoObra.fim).setHours(24)
        ).toISOString(),
        allDay: true,
        id: evento._id.toString(),
        qtde: evento.qtde,
        equipe: evento.obra.equipeResp,
        cidade: evento.cidade,
        logradouro: evento.logradouro,
        bairro: evento.bairro,
        numeroResidencia: evento.numeroResidencia,
        qtdeModulos: evento.sistema.qtdeModulos,
        topologia: evento.sistema.topologia,
      };
    });
    res.json(arr);
  } else if (req.method === "POST") {
    console.log(req.body);
    return "OK";
  }
}
