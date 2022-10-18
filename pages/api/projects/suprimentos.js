import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let suprimentos = await collection
      .aggregate([
        {
          $match: {
            "compra.statusEntrega": {
              $in: ["EM ROTA", "AGUARDANDO COMPRA", "", null, undefined],
            },
            "contrato.status": "ASSINADO",
          },
        },
      ])
      .toArray();
    res.json(suprimentos);
  }
}
