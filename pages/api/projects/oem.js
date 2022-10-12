import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("data");
    let oem = await collection
      .aggregate([
        {
          $match: {
            statusobra: "CONCLUIDA",
          },
        },
        {
          $sort: {
            saidadeobra: -1,
          },
        },
      ])
      .toArray();
    res.json(oem);
  }
}
