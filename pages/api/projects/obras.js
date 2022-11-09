import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let obras = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "CASA EM CONSTRUÇÃO",
                null,
                undefined,
                "",
                " ",
                "NÃO DEFINIDO",
              ],
            },
            "contrato.status": "ASSINADO",
          },
        },
      ])
      .toArray();
    res.json(obras);
  }
}
