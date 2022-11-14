import connectToDatabase from "../../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let obras = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": {
              $ne: "CONCLUIDA",
            },
            "contrato.status": "ASSINADO",
            regional: "REGIONAL UBERLÂNDIA",
          },
        },
      ])
      .toArray();
    res.json(obras);
  }
}
