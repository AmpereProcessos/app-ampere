import connectToDatabase from "../../../utils/connectDb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    const { after, before, field } = req.query;
    console.log(after, before, field);
    const arr = await collection
      .aggregate([
        {
          $match: {
            $and: [{ [field]: { $gte: after } }, { [field]: { $lte: before } }],
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
