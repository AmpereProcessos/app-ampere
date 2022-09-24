import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("suporte");
    let calls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: {
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
          $sort: { abertura: -1 },
        },
      ])
      .toArray();
    return res.json(calls);
  }
}
