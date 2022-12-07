import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let adm = await collection
      .aggregate([
        {
          $match: {
            "obra.statusDaObra": "CONCLUIDA",
            "pagamento.cobrancaFeita": { $ne: true },
          },
        },
        {
          $project: {
            _id: 1,
            qtde: 1,
            nomeDoContrato: 1,
            "vendedor.nome": 1,
            "pagamento.forma": 1,
            "pagamento.status": 1,
            "contrato.status": 1,
            "contrato.dataAssinatura": 1,
            "compra.statusLiberacao": 1,
            "obra.equipeResp": 1,
            "obra.saida": 1,
            "medidor.data": 1,
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
    res.json(adm);
  }
}
