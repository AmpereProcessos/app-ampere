import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let posvenda = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": {
              $in: ["ASSINADO"],
            },

            "jornada.jornadaConcluida": { $ne: true },
          },
        },
      ])
      .toArray();
    res.json(posvenda);
  }
}
