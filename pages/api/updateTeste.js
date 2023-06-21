import dayjs from "dayjs";
import connectToDatabase from "../../utils/connectDb";
import connectoToInsideDb from "../../utils/insideSalesDb";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");
  const dbResp = await collection.updateMany(
    { tipoDeServico: "SISTEMA FOTOVOLTAICO" },
    { $set: { "projeto.realizarHomologacao": true } }
  );

  // const db2 = await connectoToInsideDb(process.env.DB_KEY);
  // const collection2 = db2.collection("leads");
  // const codes = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //     {
  //       $project: {
  //         codigoSVB: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const arr = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.dataAssinatura": { $gte: "2023-04-01T00:00:00.000Z" },
  //       },
  //     },
  //     {
  //       $project: {
  //         qtde: 1,
  //         codigoSVB: 1,
  //         nomeDoContrato: 1,
  //         tipoDeServico: 1,
  //         "contrato.dataAssinatura": 1,
  //         "sistema.valorProjeto": 1,
  //         "padrao.valor": 1,
  //         "estruturaPersonalizada.valor": 1,
  //         "oem.valor": 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // console.log(arr.length);
  // let newArr = arr.map((item) => {
  //   let projeto = !isNaN(item.sistema?.valorProjeto)
  //     ? item.sistema.valorProjeto
  //     : 0;
  //   let padrao = !isNaN(item.padrao?.valor) ? item.padrao?.valor : 0;
  //   let estrutura = !isNaN(item.estruturaPersonalizada?.valor)
  //     ? item.estruturaPersonalizada.valor
  //     : 0;
  //   let oem = !isNaN(item.oem?.valor) ? item.oem.valor : 0;
  //   let totalSum =
  //     Number(projeto) + Number(padrao) + Number(estrutura) + Number(oem);
  //   let itemFromSVB = svbJSON.filter(
  //     (svbItem) => svbItem.codigoSVB == item.codigoSVB
  //   )[0];
  //   console.log(itemFromSVB);
  //   return {
  //     QTDE: item.qtde,
  //     "CÓDIGO SVB": item.codigoSVB,
  //     "TIPO DE SERVIÇO": item.tipoDeServico,
  //     "NOME DO CONTRATO": item.nomeDoContrato,
  //     "DATA DE ASSINATURA": item.contrato?.dataAssinatura
  //       ? dayjs(item.contrato?.dataAssinatura)
  //           .add(4, "hours")
  //           .format("DD/MM/YYYY")
  //       : "-",
  //     "VALOR DO CONTRATO": totalSum,
  //     "PREÇO INSTALAÇÃO": itemFromSVB?.InstalacaoPrecoTotal
  //       ? itemFromSVB?.InstalacaoPrecoTotal
  //       : 0,
  //     "PREÇO DE TRANSFORMADORES (SE APLICÁVEL)": itemFromSVB?.TrafoPrecoTotal
  //       ? itemFromSVB?.TrafoPrecoTotal
  //       : 0,
  //     IMPOSTO: itemFromSVB?.Imposto ? itemFromSVB?.Imposto : 0,
  //     "MÃO DE OBRA": itemFromSVB?.MaoDeObra ? itemFromSVB?.MaoDeObra : 0,
  //     "CUSTO DE PROJETO": itemFromSVB["CUSTO DO PROJETO"]
  //       ? itemFromSVB["CUSTO DO PROJETO"]
  //       : 0,
  //     "CUSTO DE VENDA": itemFromSVB["CUSTO DE VENDA"]
  //       ? itemFromSVB["CUSTO DE VENDA"]
  //       : 0,
  //     "MANUTENÇÃO (SE APLICÁVEL)": itemFromSVB?.Manutencao
  //       ? itemFromSVB?.Manutencao
  //       : 0,
  //     "SERVIÇOS EXTRA (SE APLICÁVEL)": itemFromSVB?.ServicosExtra
  //       ? itemFromSVB?.ServicosExtra
  //       : 0,
  //     "ATERRAMENTO (SE APLICÁVEL)": itemFromSVB?.ATERRAMENTO
  //       ? itemFromSVB?.ATERRAMENTO
  //       : 0,
  //     "SEGURO (SE APLICÁVEL)": itemFromSVB?.SEGURO ? itemFromSVB?.SEGURO : 0,
  //   };
  // });

  // res.json(newArr);

  // const filteredCodes = codes.filter((obj) => !!obj.codigoSVB);
  // const arr = filteredCodes.map((obj) => Number(obj.codigoSVB));
  // console.log(arr.length);
  // const dbResp = await collection2.updateMany(
  //   { codigoSVB: { $in: arr } },
  //   { $set: { contratoAssinado: true } }
  // );
  // console.log(arr.length);
  res.json(dbResp);
}

// Update Many example:
// let arr = await collection.updateMany(
//   {
//     "pagamento.forma": "CAPITAL PROPRIO",
//   },
//   {
//     $set: {
//       "pagamento.forma": "CAPITAL PRÓPRIO",
//     },
//   }
// );

// SCRIPT PARA EXPORTAÇÃO DO RELATÓRIO DE ANÁLISE ECONOMICA DOS PROJETOS
// const db = await connectToDatabase(process.env.DB_KEY, "projetos");
// const collection = db.collection("dados");
// let arr = await collection
//   .aggregate([
//     {
//       $match: {
//         "contrato.status": "ASSINADO",
//         "contrato.dataAssinatura": { $gte: "2022-01-01T00:00:00.000Z" },
//       },
//     },
//     {
//       $project: {
//         qtde: 1,
//         codigoSVB: 1,
//         tipoDeServico: 1,
//         nomeDoContrato: 1,
//         "contrato.dataAssinatura": 1,
//         "sistema.valorProjeto": 1,
//         "padrao.valor": 1,
//         "estruturaPersonalizada.valor": 1,
//         "compra.valorDoKit": 1,
//         "oem.valor": 1,
//       },
//     },
//   ])
//   .toArray();
// console.log(arr.length);
// let newArr = arr.map((item) => {
//   let projeto = !isNaN(item.sistema?.valorProjeto)
//     ? item.sistema.valorProjeto
//     : 0;
//   let padrao = !isNaN(item.padrao?.valor) ? item.padrao?.valor : 0;
//   let estrutura = !isNaN(item.estruturaPersonalizada?.valor)
//     ? item.estruturaPersonalizada.valor
//     : 0;
//   let oem = !isNaN(item.oem?.valor) ? item.oem.valor : 0;
//   let totalSum =
//     Number(projeto) + Number(padrao) + Number(estrutura) + Number(oem);
//   let itemFromSVB = svbJSON.filter(
//     (svbItem) => svbItem.codigoSVB == item.codigoSVB
//   )[0];
//   console.log(itemFromSVB);
//   return {
//     QTDE: item.qtde,
//     "CÓDIGO SVB": item.codigoSVB,
//     "TIPO DE SERVIÇO": item.tipoDeServico,
//     "NOME DO CONTRATO": item.nomeDoContrato,
//     "DATA DE ASSINATURA": item.contrato?.dataAssinatura
//       ? dayjs(item.contrato?.dataAssinatura)
//           .add(4, "hours")
//           .format("DD/MM/YYYY")
//       : "-",
//     "VALOR DO CONTRATO": totalSum,
//     "PREÇO INSTALAÇÃO": itemFromSVB?.precoInstalacao
//       ? itemFromSVB?.precoInstalacao
//       : 0,
//     "PREÇO DE TRANSFORMADORES (SE APLICÁVEL)":
//       itemFromSVB?.precoTransformadores
//         ? itemFromSVB?.precoTransformadores
//         : 0,
//     IMPOSTO: itemFromSVB?.imposto ? itemFromSVB?.imposto : 0,
//     "MÃO DE OBRA": itemFromSVB?.maoDeObra ? itemFromSVB?.maoDeObra : 0,
//     "CUSTO DE PROJETO": itemFromSVB?.custoProjeto
//       ? itemFromSVB?.custoProjeto
//       : 0,
//     "CUSTO DE VENDA": itemFromSVB?.custoVenda ? itemFromSVB?.custoVenda : 0,
//     "MANUTENÇÃO (SE APLICÁVEL)": itemFromSVB?.manutencao
//       ? itemFromSVB?.manutencao
//       : 0,
//     "SERVIÇOS EXTRA (SE APLICÁVEL)": itemFromSVB?.servicosExtra
//       ? itemFromSVB?.servicosExtra
//       : 0,
//     "ATERRAMENTO (SE APLICÁVEL)": itemFromSVB?.aterramento
//       ? itemFromSVB?.aterramento
//       : 0,
//     "SEGURO (SE APLICÁVEL)": itemFromSVB?.seguro ? itemFromSVB?.seguro : 0,
//   };
// });
// res.json(newArr);
