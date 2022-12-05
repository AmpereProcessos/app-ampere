import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var prev = req.body.prev;
    var limit = 750;
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray()
      .skip(prev)
      .limit(750);
    res.json(arr);
  }
}
