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
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray();
    let assinatura = await collection
      .aggregate([
        {
          $match: {
            "projeto.projetoConcluido": { $ne: "SIM" },
            $or: [
              { "compra.statusLiberacao": "PAGO" },
              { "projeto.iniciar": "SIM" },
            ],
            "projeto.dataAssDocumentacao": null, // filtrar statusDoParecerDeAcesso = "AGUARDANDO ASSINATURA"
          },
        },
        {
          $project: {
            "projeto.dataAssDocumentacao": 1,
            "parecer.statusDoParecerDeAcesso": 1,
          },
        },
      ])
      .toArray();
    res.json({
      projetos: posvenda,
      assinatura: {
        confeccionar: assinatura.filter(
          (x) => x.parecer.statusDoParecerDeAcesso != "AGUARDANDO ASSINATURA"
        ).length,
        paraAssinar: assinatura.filter(
          (x) => x.parecer.statusDoParecerDeAcesso == "AGUARDANDO ASSINATURA"
        ).length,
      },
    });
  }
}
