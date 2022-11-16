import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
