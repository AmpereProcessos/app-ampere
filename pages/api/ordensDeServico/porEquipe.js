import connectToDatabase from "../../../utils/connectDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var equipe = req.query.equipe;
    var arr = await collection
      .aggregate([
        {
          $match: {
            ordensDeServico: { $ne: null },
            "ordensDeServico.dataDeFechamento": null,
            "ordensDeServico.equipe": equipe,
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
      item.ordensDeServico.forEach((x, index) => {
        if (x.equipe == equipe) {
          eventos.push({
            id: item._id,
            index: index,
            qtde: item.qtde,
            nomeDoContrato: item.nomeDoContrato,
            categoria: x.categoria,
            servicoExecutado: x.servicoExecutado,
            cidade: item.cidade ? item.cidade : "-",
            bairro: item.bairro ? item.bairro : "-",
            logradouro: item.logradouro ? item.logradouro : "-",
            numeroResidencia: item.numeroResidencia
              ? item.numeroResidencia
              : "-",
            qtdeModulos: item.sistema.qtdeModulos
              ? item.sistema.qtdeModulos
              : "-",
            potModulos: item.sistema.potModulos ? item.sistema.potModulos : "-",
            topologia: item.sistema.topologia ? item.sistema.topologia : "-",
            ...x,
          });
        }
      })
    );
    eventos = JSON.parse(JSON.stringify(eventos));
    res.json(eventos);
  }
}
