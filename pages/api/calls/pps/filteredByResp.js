import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    console.log(req.body);
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
    console.log(calls);
    return res.json(calls);
  }
}
