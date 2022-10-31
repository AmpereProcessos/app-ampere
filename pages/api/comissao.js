import connectToDatabase from "../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "compra.dataPagamento": { $gte: "2022-10-01" },
          },
        },
        {
          $sort: {
            "compra.dataPagamento": 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
