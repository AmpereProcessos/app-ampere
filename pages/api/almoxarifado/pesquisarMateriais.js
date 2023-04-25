import connectToDatabase from "../../../utils/materialDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("material");
    let { search } = req.query;
    const arr = await collection
      .aggregate([
        {
          $match: {
            nome: { $regex: search },
          },
        },
        {
          $project: {
            nome: 1,
            qtde: 1,
            preco: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
