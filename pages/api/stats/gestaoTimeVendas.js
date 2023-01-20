import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
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
            "_id.ano": 2022,
          },
        },
        {
          $sort: {
            "_id.mes": 1,
          },
        },
      ])
      .toArray();
    res.json(result);
  }
}
