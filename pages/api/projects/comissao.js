import connectToDatabase from "../../../utils/connectDb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var depois = new Date(req.query.depois).toISOString();
    var antes = new Date(req.query.antes).toISOString();
    try {
      var arr = await collection
        .aggregate([
          {
            $match: {
              "contrato.status": "ASSINADO",
              $and: [
                { "compra.dataPagamento": { $gte: depois } },
                { "compra.dataPagamento": { $lte: antes } },
              ],
            },
          },
          {
            $project: {
              qtde: 1,
              nomeDoContrato: 1,
              codigoSVB: 1,
              cidade: 1,
              vendedor: 1,
              "contrato.dataAssinatura": 1,
              "sistema.potPico": 1,
              "sistema.valorProjeto": 1,
              "compra.dataPagamento": 1,
              canalVenda: 1,
              insider: 1,
            },
          },
        ])
        .toArray();
      arr = arr.map((x) => {
        return {
          ...x,
          porcentagemComissao: x.insider ? 3.0 : 4.0,
          valorComissao: x.insider
            ? Number((x.sistema.valorProjeto * 0.03).toFixed(2))
            : Number((x.sistema.valorProjeto * 0.04).toFixed(2)),
        };
      });
      res.json(arr);
    } catch (error) {
      res.status(500).send("Erro na comunicação com o servidor.");
    }
  }
}
