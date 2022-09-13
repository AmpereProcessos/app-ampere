import connectToDatabase from "../../../utils/callsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("pps");
    let calls = await collection
      .find({
        carimboDataHora: { $gte: "2022-08-31T00:19:00.000Z" },
      })
      .toArray();
    let inProgress = await collection
      .aggregate([
        {
          $match: {
            status: "EM ANDAMENTO",
          },
        },
      ])
      .toArray();
    return res.json({ calls, inProgress });
  }
}
