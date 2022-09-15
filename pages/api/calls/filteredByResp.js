import connectToDatabase from "../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    let calls = await collection
      .aggregate([
        {
          $match: {
            status: {
              $in: ["EM ANDAMENTO", "AGUARDANDO VENDEDOR", "PENDENTE"],
            },
          },
        },
        {
          $match: {
            responsavel: req.body.responsavel,
          },
        },
        {
          $sort: { carimboDataHora: -1 },
        },
      ])
      .toArray();
    return res.json(calls);
  }
}
