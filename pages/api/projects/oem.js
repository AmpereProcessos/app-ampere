import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let oem = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "CONCLUIDA",
              ],
            },
          },
        },
        {
          $limit: 700,
        },
      ])
      .toArray();
    res.json(oem);
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let oem = await collection
      .aggregate([
        {
          $match: {
            qtde: { $gt: 713 },
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "CONCLUIDA",
              ],
            },
          },
        },
        {
          $limit: 700,
        },
      ])
      .toArray();
    res.json(oem);
  }
}
export const config = {
  api: {
    responseLimit: "8mb",
  },
};
