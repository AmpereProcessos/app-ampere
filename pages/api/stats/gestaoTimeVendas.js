import connectToDatabase from "../../../utils/connectDb";
import connectToVendedoresDatabase from "../../../utils/auxiliaresDb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let year = Number(req.query.ano);
    let result = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
            "obra.saida": { $ne: "-" },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: { dateString: "$contrato.dataAssinatura" },
                },
              },
              mes: {
                $month: {
                  $dateFromString: { dateString: "$contrato.dataAssinatura" },
                },
              },
              vendedor: "$vendedor.nome",
            },
            total: {
              $sum: "$sistema.potPico",
            },
            count: { $count: {} },
          },
        },
        {
          $match: {
            "_id.ano": year,
          },
        },
        {
          $sort: {
            "_id.mes": 1,
          },
        },
      ])
      .toArray();
    let newArr = result.map((item) => {
      return {
        vendedor: item._id.vendedor,
        ano: item._id.ano,
        mes: item._id.mes,
        numProjetos: item.count,
        potVendida: item.total,
      };
    });
    res.json(newArr);
  } else if (req.method == "PUT") {
    const db = await connectToVendedoresDatabase(process.env.DB_KEY);
    const collection = db.collection("vendedoresInfo");
    let id = req.query.id;
    let ano = req.body.year;
    let novasMetas = req.body.goalArr;
    var newObj = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { [ano]: novasMetas } }
    );
    console.log(id);
    console.log(req.body);
    res.json(newObj);
  }
}
