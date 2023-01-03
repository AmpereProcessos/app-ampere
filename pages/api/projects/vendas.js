import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var queryKey;
    var queryValue;
    if (req.body.filtrarPor == "REGIONAL") {
      queryKey = "regional";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "VENDEDOR") {
      queryKey = "vendedor.nome";
      queryValue = req.body.parametro;
    } else if (req.body.filtrarPor == "INSIDE") {
      queryKey = "insider";
      queryValue = req.body.parametro;
    }
    let vendas = await collection
      .aggregate([
        {
          $match: {
            "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
            [`${queryKey}`]: queryValue,
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
            nps: 1,
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
