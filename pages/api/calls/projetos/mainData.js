import connectToDatabase from "../../../../utils/callsDb";
import connectToProjectsDatabase from "../../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY);
    const projectsDb = await connectToProjectsDatabase(
      process.env.DB_KEY,
      "projetos"
    );
    const collection = db.collection("projetos");
    const collection2 = projectsDb.collection("dados");
    let chamadosAbertos = await collection
      .find({ status: { $ne: "FINALIZADO" } })
      .toArray();
    let chamadosFechados = await collection
      .aggregate([
        {
          $match: {
            status: "FINALIZADO",
          },
        },
      ])
      .toArray();
    /*let assinatura = await collection2
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
            "projeto.statusDoParecerDeAcesso": 1,
          },
        },
      ])
      .toArray();
    let comissionamento = await collection2
      .aggregate([
        {
          $match: {
            "comissionamento.projetos": { $ne: true },
            "contrato.status": "ASSINADO",
            "compra.statusLiberacao": { $in: ["PAGO", "REALIZAR COMPRA"] },
          },
        },
        {
          comissionamento: 1,
        },
      ])
      .toArray();*/
    res.json({
      chamadosAbertos: chamadosAbertos,
      chamadosFechados: chamadosFechados,
    });
  } else if (req.method === "POST") {
    let date = new Date().toJSON();
    var obj = { ...req.body, abertura: date };
    const db = await connectToDatabase(process.env.DB_KEY, "chamados");
    const collection = db.collection("projetos");
    try {
      let created = await collection.insertOne(obj);
      res.json("CHAMADO ABERTO");
    } catch (error) {
      res.error(error);
    }
  }
}
