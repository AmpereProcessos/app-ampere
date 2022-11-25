import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = await db.collection("dados");
    let arr = await collection
      .find({
        "contrato.status": "ASSINADO",
        "obra.statusDaObra": {
          $ne: "CONCLUIDA",
        },
        "material.statusSeparacao": {
          $ne: "SEPARADO",
        },
      })
      .toArray();
    res.json(arr);
  }
}
