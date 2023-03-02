import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let data = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            tipoDeServico: { $ne: "OPERAÇÃO E MANUTENÇÃO" },
          },
        },
        {
          $project: {
            "contrato.status": 1,
            "vendedor.nome": 1,
            cidade: 1,
            "sistema.potPico": 1,
            "sistema.valorProjeto": 1,
            "padrao.valor": 1,
            "estruturaPersonalizada.valor": 1,
            "compra.valorDoKit": 1,
            "compra.dataPagamento": 1,
            "material.previsaoCustos": 1,
            "material.efetivoCustos": 1,
            "obra.statusDaObra": 1,
            "obra.entrada": 1,
            "obra.saida": 1,
            "contrato.dataAssinatura": 1,
            "parecer.dataParecerDeAcesso": 1,
            "parecer.statusDoParecerDeAcesso": 1,
            "projeto.dataAssDocumentacao": 1,
            insider: 1,
            regional: 1,
            nps: 1,
          },
        },
      ])
      .toArray();
    res.json(data);
    // var entregues = await collection
    //   .aggregate([
    //     {
    //       $match: {
    //         "compra.statusEntrega": "ENTREGUE",
    //         "obra.statusDaObra": {
    //           $ne: "CONCLUIDA",
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         nomeDoContrato: 1,
    //         nomeDoProjeto: 1,
    //         "sistema.qtdeModulos": 1,
    //         "sistema.topologia": 1,
    //         compra: 1,
    //         cidade: 1,
    //       },
    //     },
    //   ])
    //   .toArray();
    // var emRota = await collection
    //   .aggregate([
    //     {
    //       $match: {
    //         "compra.statusEntrega": "EM ROTA",
    //         "obra.statusDaObra": {
    //           $ne: "CONCLUIDA",
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         nomeDoContrato: 1,
    //         nomeDoProjeto: 1,
    //         "sistema.qtdeModulos": 1,
    //         "sistema.topologia": 1,
    //         compra: 1,
    //         cidade: 1,
    //       },
    //     },
    //   ])
    //   .toArray();
    // res.json({ entregues, emRota });
  }
}
