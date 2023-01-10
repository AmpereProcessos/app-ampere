import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const after = new Date(req.body.date.after).toJSON();
    const before = new Date(req.body.date.before).toJSON();
    console.log(after, before);
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("projetos");
    let calls = await collection
      .aggregate([
        {
          $match: {
            status: "FINALIZADO",
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
          $project: {
            projeto: 1,
            status: 1,
            responsavel: 1,
            tipoDoChamado: 1,
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
