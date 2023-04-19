import dayjs from "dayjs";
import connectToDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  // const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  // const collection = db.collection("dados");
  // let arr = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",
  //         $or: [
  //           {
  //             cidade: {
  //               $in: [
  //                 "CALDAS NOVAS",
  //                 "PORTEIRÃO",
  //                 "SÃO SIMÃO",
  //                 "INACIOLÂNDIA",
  //                 "TRINDADE",
  //                 "ITUMBIARA",
  //                 "QUIRINÓPOLIS",
  //                 "PARANAIGUARA",
  //                 "CATALÃO",
  //                 "CACHOEIRA ALTA",
  //               ],
  //             },
  //           },
  //           { uf: "GO" },
  //         ],
  //       },
  //     },
  //     {
  //       $project: {
  //         qtde: 1,
  //         nomeDoContrato: 1,
  //         nomeDoProjeto: 1,
  //         cidade: 1,
  //         "contrato.dataAssinatura": 1,
  //         "obra.saida": 1,
  //         "sistema.potPico": 1,
  //         "sistema.topologia": 1,
  //         "sistema.qtdeModulos": 1,
  //         "sistema.inversor": 1,
  //         "material.previsaoCustos": 1,
  //         "material.efetivoCustos": 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const ajustedArr = arr.map((item) => {
  //   return {
  //     QTDE: item.qtde,
  //     "NOME DO CONTRATO": item.nomeDoContrato,
  //     "NOME DO PROJETO": item.nomeDoProjeto,
  //     CIDADE: item.cidade,
  //     TOPOLOGIA: item.sistema.topologia,
  //     "ASSINATURA DO CONTRATO": item.contrato.dataAssinatura
  //       ? dayjs(item.contrato.dataAssinatura)
  //           .add(4, "hours")
  //           .format("DD/MM/YYYY")
  //       : "-",
  //     "SAÍDA DE OBRA": item.obra.saida
  //       ? dayjs(item.obra.saida).add(4, "hours").format("DD/MM/YYYY")
  //       : "-",
  //     "POTÊNCIA PICO": item.sistema.potPico,
  //     "QTDE MÓDULOS": item.sistema.qtdeModulos,
  //     INVERSOR: item.sistema.inversor,
  //     "PREVISÃO DE CUSTOS": item.material.previsaoCustos
  //       ? item.material.previsaoCustos
  //       : "-",
  //     "EFETIVO DE CUSTOS": item.material.efetivoCustos
  //       ? item.material.efetivoCustos
  //       : "-",
  //   };
  // });

  // console.log(arr.length);
  // // let arr = await collection
  // //   .aggregate([
  // //     {
  // //       $match: {
  // //         "contrato.status": "ASSINADO",
  // //       },
  // //     },
  // //     {
  // //       $project: {
  // //         qtde: 1,
  // //         "sistema.potPico": 1,
  // //         "contrato.dataAssinatura": 1,
  // //         "contrato.formaAssinatura": 1,
  // //         "vendedor.nome": 1,
  // //         cidade: 1,
  // //         regional: 1,
  // //         tipoDeServico: 1,
  // //       },
  // //     },
  // //   ])
  // //   .toArray();
  // // let newArr = arr.map((item) => {
  // //   return {
  // //     QTDE: item.qtde,
  // //     "POTÊNCIA PICO": item.sistema.potPico ? item.sistema.potPico : "-",
  // //     "DATA ASSINATURA": item.contrato?.dataAssinatura
  // //       ? dayjs(item.contrato?.dataAssinatura)
  // //           .add(4, "hours")
  // //           .format("DD/MM/YYYY")
  // //       : "-",
  // //     "FORMA ASSINATURA": item.contrato?.formaAssinatura
  // //       ? item.contrato?.formaAssinatura
  // //       : "-",
  // //     CIDADE: item.cidade ? item.cidade : "-",
  // //     REGIONAL: item.regional ? item.regional : "-",
  // //     "TIPO DE SERVIÇO": item.tipoDeServico ? item.tipoDeServico : "-",
  // //   };
  // // });
  // // let arr = await collection
  // //   .aggregate([
  // //     {
  // //       $match: {
  // //         nps: { $gte: 8 },
  // //       },
  // //     },
  // //     {
  // //       $project: {
  // //         nomeDoContrato: 1,
  // //         cidade: 1,
  // //         vendedor: 1,
  // //         nps: 1,
  // //         telefone: 1,
  // //         "contrato.dataAssinatura": 1,
  // //       },
  // //     },
  // //   ])
  // //   .toArray();
  // // arr = arr.map((item) => {
  // //   return {
  // //     nome: item.nomeDoContrato,
  // //     nps: item.nps,
  // //     telefone: item.telefone ? item.telefone : "-",
  // //     cidade: item.cidade,
  // //     vendedor: item.vendedor?.nome,
  // //     assinaturaDoContrato: item.contrato?.dataAssinatura
  // //       ? dayjs(item.contrato.dataAssinatura)
  // //           .add(4, "hours")
  // //           .format("DD/MM/YYYY")
  // //       : "-",
  // //   };
  // // });
  // // res.json(arr);
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
  res.json("DESATIVADA");
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
