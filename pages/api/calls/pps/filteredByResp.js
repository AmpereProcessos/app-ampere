import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("pps");
    let calls = await collection
      .aggregate([
        {
          $match: {
            status: {
              $in: req.body.status,
            },
          },
        },
        {
          $match: {
            responsavel: {
              $in: req.body.responsavel,
            },
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
