import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "comissionamento.projetos": { $ne: true },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            comissionamento: 1,
          },
        },
      ])
      .toArray();
    res.json(arr);
  }
}
