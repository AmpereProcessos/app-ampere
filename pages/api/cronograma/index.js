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
            "ordensDeServico.agendar": true,
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
            ordensDeServico: 1,
            "sistema.qtdeModulos": 1,
            "sistema.potModulos": 1,
            "sistema.topologia": 1,
          },
        },
      ])
      .toArray();
    let eventos = [];
    arr.forEach((item) =>
      item.ordensDeServico.forEach((x) => {
        if (x.agendar) {
          eventos.push({
            id: item._id,
            qtde: item.qtde,
            nomeDoContrato: item.nomeDoContrato,
            cidade: item.cidade ? item.cidade : "-",
            bairro: item.bairro ? item.bairro : "-",
            logradouro: item.logradouro ? item.logradouro : "-",
            numeroResidencia: item.numeroResidencia
              ? item.numeroResidencia
              : "-",
            ...x,
          });
        }
      })
    );
    res.json(eventos);
  } else if (req.method === "POST") {
    console.log(req.body);
    return "OK";
  }
}
