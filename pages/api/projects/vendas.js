import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let vendas = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            "vendedor.nome": req.body.vendedor,
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            "contrato.status": 1,
            "contrato.dataAssinatura": 1,
            "compra.dataPagamento": 1,
            "pagamento.status": 1,
            cidade: 1,
            "obra.statusDaObra": 1,
            "vistoria.status": 1,
          },
        },
        {
          $sort: {
            qtde: -1,
          },
        },
      ])
      .toArray();
    res.json(vendas);
  }
}
