import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    console.log(req.body);
    let vendas = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "vendedor.nome": req.body.vendedor,
          },
        },
        {
          $sort: {
            qtde: -1,
          },
        },
      ])
      .toArray();
    res.json(vendas);
  }
}
