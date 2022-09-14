import connectToDatabase from "../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    var dateFilterParam = new Date();
    dateFilterParam.setDate(dateFilterParam.getDate() - 2);
    let filter = dateFilterParam.toJSON();
    console.log(filter);
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
      ])
      .toArray();
    let inProgress = await collection
      .aggregate([
        {
          $match: {
            status: { $in: ["EM ANDAMENTO", "AGUARDANDO VENDEDOR"] },
          },
        },
        {
          $sort: { carimboDataHora: -1 },
        },
      ])
      .toArray();
    return res.json({ closedCalls, inProgress });
  }
}
