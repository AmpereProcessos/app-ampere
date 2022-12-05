import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let arr = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
        {
          $sort: { qtde: 1 },
        },
        {
          $limit: 800,
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let skip = req.body.skip;
    console.log(req.body.lastId);
    var limit = 300;
    let arr = await collection
      .aggregate([
        {
          $sort: {
            qtde: 1,
          },
        },
        {
          $match: {
            qtde: { $gt: req.body.lastId },
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
        {
          $limit: 300,
        },
      ])
      .toArray();
    res.json(arr);
  }
}
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
