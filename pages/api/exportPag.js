import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    var page = req.query.page;
    var limit = req.query.limit;
    var supLimit = Number(page) * Number(limit);
    var infLimit = Number(page) * Number(limit) - Number(limit);
    console.log(infLimit, supLimit);
    let text = `INFERIOR:${infLimit} -- SUPERIOR:${supLimit}`;
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            $and: [{ qtde: { $gte: infLimit } }, { qtde: { $lte: supLimit } }],
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
