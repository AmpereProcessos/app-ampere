import connectToDatabase from "../../../utils/connectDb";
import { vendedores } from "../../../utils/constants";
export default async function handler(req, res) {
  function getComissao(vendedorNome) {
    let vendedorInfo = vendedores.filter((x) => x.nome == vendedorNome)[0];
    if (vendedorInfo != undefined) {
      return {
        pcAtivo: Number(vendedorInfo.comissaoAtivo),
        pcInside: Number(vendedorInfo.comissaoInside),
      };
    } else {
      return {
        pcAtivo: 0,
        pcInside: 0,
      };
    }
  }
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
          porcentagemComissaoAtivo: getComissao(x.vendedor.nome).pcAtivo,
          valorComissaoAtivo:
            getComissao(x.vendedor.nome).pcAtivo *
            Number(x.sistema.valorProjeto),
          porcentagemComissaoInside: getComissao(x.vendedor.nome).pcInside,
          valorComissaoInside:
            getComissao(x.vendedor.nome).pcInside *
            Number(x.sistema.valorProjeto),
        };
      });
      res.json(arr);
    } catch (error) {
      res.status(500).send("Erro na comunicação com o servidor.");
    }
  }
}
