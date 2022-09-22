import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    var dateFilterParam = new Date();
    dateFilterParam.setDate(dateFilterParam.getDate() - 2);
    let filter = dateFilterParam.toJSON();
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("suporte");
    let openCalls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: { $in: ["EM ANDAMENTO", "ABERTO", "PENDENTE"] },
          },
        },
        {
          $sort: {
            abertura: -1,
          },
        },
      ])
      .toArray();
    let closedCalls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: "RESOLVIDO",
          },
        },
        {
          $sort: {
            abertura: -1,
          },
        },
      ])
      .toArray();
    let stats = await collection
      .aggregate([
        {
          $match: {
            statusChamado: {
              $in: ["ABERTO", "PENDENTE"],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $count: {},
            },
          },
        },
      ])
      .toArray();
    return res.json({ openCalls, closedCalls, stats: stats[0].total });
  }
  if (req.method === "POST") {
    let date = new Date().toJSON();
    var obj = {
      abertura: date,
      nomeCliente: req.body.clientName,
      cidade: req.body.clientCity,
      tipoChamado: req.body.problemType,
      descricaoProblema: req.body.problemDesc,
      statusChamado: "ABERTO",
      responsavel: "DEFINIR",
    };
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("suporte");
    console.log(req.body);
    let created = await collection.insertOne({
      abertura: date,
      nomeCliente: req.body.clientName,
      cidade: req.body.clientCity,
      tipoChamado: req.body.problemType,
      descricaoProblema: req.body.problemDesc,
      statusChamado: "ABERTO",
      responsavel: "DEFINIR",
    });
    console.log(created);
    return res.json("CHAMADO CRIADO");
  }
}
