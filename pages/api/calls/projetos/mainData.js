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

    let assinatura = await collection2
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
          },
        },
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
    let comissionamento = await collection2
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
          },
        },
        {
          $match: {
            "comissionamento.projetos": { $ne: true },
            "contrato.status": "ASSINADO",
            "compra.statusLiberacao": { $in: ["PAGO", "REALIZAR COMPRA"] },
          },
        },
        {
          $project: {
            comissionamento: 1,
          },
        },
      ])
      .toArray();
    let parecer = await collection2
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
          },
        },
        {
          $match: {
            "projeto.projetoConcluido": { $ne: "SIM" },
            $or: [
              { "compra.statusLiberacao": "PAGO" },
              { "projeto.iniciar": "SIM" },
            ],
            "parecer.statusDoParecerDeAcesso": {
              $in: [
                "PENDENCIAS",
                "SOLICITAR ACESSO",
                "SOLICITAR TROCA DE TITULARIDADE",
                "SOLICITAR AUMENTO DE CARGA",
                "AGUARDANDO TROCA DE TITULARIDADE",
                "AGUARDANDO AUMENTO DE CARGA",
                "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
              ],
            },
          },
        },
      ])
      .toArray();
    let vistoria = await collection2
      .aggregate([
        {
          $match: {
            "contrato.status": "ASSINADO",
            "obra.statusDaObra": "CONCLUIDA",
            "vistoria.status": {
              $in: ["NÃO DEFINIDO", "AGUARDANDO CONCESSIONARIA"],
            },
          },
        },
        {
          $project: {
            "obra.statusDaObra": 1,
            "vistoria.status": 1,
          },
        },
      ])
      .toArray();
    res.json({
      assinatura: {
        confeccionar: assinatura.filter(
          (x) => x.parecer.statusDoParecerDeAcesso != "AGUARDANDO ASSINATURA"
        ).length,
        paraAssinar: assinatura.filter(
          (x) => x.parecer.statusDoParecerDeAcesso == "AGUARDANDO ASSINATURA"
        ).length,
      },
      parecer: {
        solicitar: parecer.filter(
          (x) =>
            x.parecer.statusDoParecerDeAcesso !=
            "AGUARDANDO RESPOSTA DA CONCESSIONARIA"
        ).length,
        aguardando: parecer.filter(
          (x) =>
            x.parecer.statusDoParecerDeAcesso ==
            "AGUARDANDO RESPOSTA DA CONCESSIONARIA"
        ).length,
      },
      vistoria: {
        pendente: vistoria.filter((x) => x.vistoria.status == "NÃO DEFINIDO")
          .length,
        aguardando: vistoria.filter(
          (x) => x.vistoria.status == "AGUARDANDO CONCESSIONARIA"
        ).length,
      },
      comissionamento: {
        total: comissionamento.length,
        parcial: comissionamento.filter(
          (x) =>
            x.comissionamento?.comercial == true &&
            x.comissionamento?.suprimentos == true
        ).length,
      },
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
