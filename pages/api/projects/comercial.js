import connectToDatabase from "../../../utils/projectsDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const collection = db.collection("dados");
    let comercial = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "obra.statusDaObra": {
              $in: [
                "AGENDADA",
                "AGUARDANDO AGENDAMENTO",
                "EM ANDAMENTO",
                "NÃO DEFINIDO",
                "",
                null,
                undefined,
              ],
            },
          },
        },
      ])
      .toArray();
    res.json(comercial);
  }
}
