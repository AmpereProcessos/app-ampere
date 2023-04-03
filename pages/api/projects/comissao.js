import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/connectDb";
import { vendedores } from "../../../utils/constants";
export default async function handler(req, res) {
  function getComissao(vendedorNome, insider) {
    let vendedorInfo = vendedores.filter((x) => x.nome == vendedorNome)[0];
    if (vendedorInfo != undefined) {
      if (insider) return { porcentagemComissao: vendedorInfo.comissaoInside };
      else return { porcentagemComissao: vendedorInfo.comissaoAtivo };

      // return {
      //   pcAtivo: Number(vendedorInfo.comissaoAtivo),
      //   pcInside: Number(vendedorInfo.comissaoInside),
      // };
    } else {
      return {
        porcentagemComissao: 0,
      };
    }
  }
  if (req.method == "GET") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    var depois = new Date(req.query.depois).toISOString();
    var antes = new Date(req.query.antes).toISOString();
    console.log(depois, antes);
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
              tipoDeServico: 1,
              "contrato.dataAssinatura": 1,
              "contrato.comissaoVendedor": 1,
              "contrato.comissaoPaga": 1,
              "sistema.potPico": 1,
              "sistema.valorProjeto": 1,
              "padrao.valor": 1,
              "estruturaPersonalizada.valor": 1,
              "compra.dataPagamento": 1,
              canalVenda: 1,
              insider: 1,
            },
          },
        ])
        .toArray();
      arr = arr.map((x) => {
        // var valor;
        // var valorEstrutura;
        // var valorPadrao;
        // var pc;
        // if (x.insider != undefined) {
        //   valor = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor * Number(x.sistema.valorProjeto)) /
        //       100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.sistema.valorProjeto)) /
        //         100
        //       ).toFixed(2);
        //   valorPadrao = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor * Number(x.padrao.valor)) / 100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.padrao.valor)) /
        //         100
        //       ).toFixed(2);
        //   valorEstrutura = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor *
        //         Number(x.estruturaPersonalizada.valor)) /
        //       100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.estruturaPersonalizada.valor)) /
        //         100
        //       ).toFixed(2);
        //   pc = x.contrato.comissaoVendedor
        //     ? x.contrato.comissaoVendedor
        //     : getComissao(x.vendedor.nome).pcInside;
        // } else {
        //   valor = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor * Number(x.sistema.valorProjeto)) /
        //       100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.sistema.valorProjeto)) /
        //         100
        //       ).toFixed(2);
        //   valorPadrao = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor * Number(x.padrao.valor)) / 100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.padrao.valor)) /
        //         100
        //       ).toFixed(2);
        //   valorEstrutura = x.contrato.comissaoVendedor
        //     ? (x.contrato.comissaoVendedor *
        //         Number(x.estruturaPersonalizada.valor)) /
        //       100
        //     : (
        //         (getComissao(x.vendedor.nome).pcAtivo *
        //           Number(x.estruturaPersonalizada.valor)) /
        //         100
        //       ).toFixed(2);
        //   pc = x.contrato.comissaoVendedor
        //     ? x.contrato.comissaoVendedor
        //     : getComissao(x.vendedor.nome).pcAtivo;
        // }
        // if (valor == "NaN") {
        //   valor = 0;
        // }
        // if (valorEstrutura == "NaN") {
        //   valorEstrutura = 0;
        // }
        // if (valorPadrao == "NaN") {
        //   valorEstrutura = 0;
        // }
        return {
          ...x,
          porcentagemComissao: x.contrato.comissaoVendedor
            ? x.contrato.comissaoVendedor
            : getComissao(x.vendedor.nome, x.insider).porcentagemComissao,
          porcentagemComissaoInsider: 0.3,
          // valorComissaoProjeto: Number(valor),
          // valorComissaoPadrao: Number(valorPadrao),
          // valorComissaoEstrutura: Number(valorEstrutura),
        };
      });
      res.json(arr);
    } catch (error) {
      res.status(500).send("Erro na comunicação com o servidor.");
    }
  } else if (req.method === "POST") {
    const db = await connectToDatabase(process.env.DB_KEY, "projetos");
    const collection = db.collection("dados");
    let changes = req.body.map((mat) => {
      return {
        updateOne: {
          filter: { _id: ObjectId(mat._id) },
          update: {
            $set: { "contrato.comissaoVendedor": mat.porcentagemComissao },
          },
        },
      };
    });
    let output = await collection.bulkWrite(changes);
    console.log(output);
    res.json("OK");
  }
}
