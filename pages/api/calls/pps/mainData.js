import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    var dateFilterParam = new Date();
    dateFilterParam.setDate(dateFilterParam.getDate() - 2);
    let filter = dateFilterParam.toJSON();
    let closedCalls = await collection
      .aggregate([
        {
          $match: {
            status: "REALIZADO",
          },
        },
        {
          $match: {
            carimboDataHora: { $gte: filter },
          },
        },
        {
          $sort: { dataDeConclusao: -1 },
        },
      ])
      .toArray();
    let inProgress = await collection
      .aggregate([
        {
          $match: {
            status: {
              $in: ["EM ANDAMENTO", "AGUARDANDO VENDEDOR", "PENDENTE"],
            },
          },
        },
        {
          $sort: { carimboDataHora: -1 },
        },
      ])
      .toArray();
    return res.json({
      closedCalls,
      inProgress,
    });
  }
  if (req.method === "POST") {
    let svbCode = Number(req.body.codigoDoProjeto);
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    await collection.insertOne({
      ...req.body,
      carimboDataHora: new Date().toJSON(),
      codigoDoProjeto: svbCode,
    });
    return res.json("Chamado criado!");
  }
}
