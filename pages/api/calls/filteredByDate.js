import connectToDatabase from "../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const date = new Date(req.body.date).toJSON();
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    let calls = await collection
      .aggregate([
        {
          $match: {
            status: "REALIZADO",
          },
        },
        {
          $match: {
            carimboDataHora: { $gte: date },
          },
        },
        {
          $sort: { dataDeConclusao: -1 },
        },
      ])
      .toArray();
    return res.json(calls);
  }
}
