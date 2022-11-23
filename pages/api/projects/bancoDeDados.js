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
          $limit: 1000,
        },
      ])
      .toArray();
    res.json(arr);
  } else if (req.method === "POST") {
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
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
      ])
      .skip(1000)
      .toArray();
    res.json(arr);
  }
}
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
