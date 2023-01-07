import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const after = new Date(req.body.date.after).toJSON();
    const before = new Date(req.body.date.before).toJSON();
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("suporte");
    let calls = await collection
      .aggregate([
        {
          $match: {
            statusChamado: "RESOLVIDO",
          },
        },
        {
          $match: {
            fechamento: {
              $gte: after,
              $lt: before,
            },
          },
        },
        {
          $sort: { fechamento: -1 },
        },
      ])
      .toArray();
    return res.json(calls);
  }
}
