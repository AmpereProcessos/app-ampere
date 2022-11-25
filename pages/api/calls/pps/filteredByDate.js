import connectToDatabase from "../../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const after = new Date(req.body.date.after).toJSON();
    const before = new Date(req.body.date.before).toJSON();
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
          $addFields: {
            convertedDataDeConclusao: {
              $convert: {
                input: "$dataDeConclusao",
                to: "string",
              },
            },
          },
        },
        {
          $match: {
            convertedDataDeConclusao: {
              $gte: after,
              $lte: before,
            },
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
