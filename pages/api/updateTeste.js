import dayjs from "dayjs";
import connectToCRMDatabase from "../../utils/crmDb";
import connectToRequestsDatabase from "../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
import connectToProjectsDatabase from "../../utils/connectDb";
import { calculateStringSimilarity } from "../../utils/constants";
import axios from "axios";
import { createClient, get } from "@vercel/edge-config";
import connectToDatabase from "../../utils/connectDb.js";
export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.DB_KEY, "projetos");
  const collection = db.collection("dados");

  const projects = await collection
    .aggregate([
      {
        $match: {
          "contrato.status": "ASSINADO",
          qtde: { $lte: 1556 },
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          telefone: 1,
          "contrato.dataAssinatura": 1,
          cep: 1,
          uf: 1,
          cidade: 1,
          bairro: 1,
          logradouro: 1,
          numeroResidencia: 1,
        },
      },
      {
        $sort: {
          qtde: 1,
        },
      },
    ])
    .toArray();
  const formatted = projects.map((project) => {
    return {
      QTDE: project.qtde,
      "NOME DO CLIENTE": project.nomeDoContrato,
      TELEFONE: project.telefone,
      "DATA DE ASSINATURA": project.contrato?.dataAssinatura
        ? dayjs(project.contrato.dataAssinatura)
            .add(3, "hour")
            .format("DD/MM/YYYY")
        : null,
      CEP: project.cep,
      UF: project.uf,
      CIDADE: project.cidade,
      BAIRRO: project.bairro,
      LOGRADOURO: project.logradouro,
      "NÚMERO DA RESIDÊNCIA": project.numeroResidencia,
    };
  });
  // var arr = [];
  // const formatted = materials.map((material) => {
  //   const duplicatedMaterial = materials.find(
  //     (x) =>
  //       x._id != material._id &&
  //       calculateStringSimilarity(
  //         x.nome.toUpperCase(),
  //         material.nome.toUpperCase()
  //       ) > 98
  //   );
  //   if (!!duplicatedMaterial) {
  //     return {
  //       materialUm: {
  //         id: material._id,
  //         nome: material.nome,
  //         qtde: material.qtde,
  //       },
  //       materialDois: {
  //         id: duplicatedMaterial._id,
  //         nome: duplicatedMaterial.nome,
  //         qtde: duplicatedMaterial.qtde,
  //       },
  //     };
  //   } else return null;
  // });

  // const rd_marketing_access_token = await createClient(
  //   "ecfg_celqhqfkg1woq2lp9pztgjokn7av"
  // ).get("rd_marketing_access_token");
  // const edgeRequestItemAPI = `https://edge-config.vercel.com/ecfg_celqhqfkg1woq2lp9pztgjokn7av/item/rd_marketing_access_token?token=583e45e4-5ecd-4581-9e6f-65ba32d126a7`;
  // const item = await axios.get(edgeRequestItemAPI);
  res.json(formatted);
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

// Query de O&M
// const db = await connectToDatabase(process.env.DB_KEY, "projetos");
// const collection = db.collection("dados");
// const projects = await collection
//   .aggregate([
//     {
//       $match: {
//         "contrato.status": "ASSINADO",
//         "medidor.data": { $ne: null },
//         // $and: [
//         //   { "medidor.data": { $gte: "2022-09-01T08:00:00.000Z" } },
//         //   { "medidor.data": { $lte: "2022-10-31T08:00:00.000Z" } },
//         // ],
//         "manutencaoPreventiva.data": { $in: [null] },
//         "oem.plano": { $nin: [null, "NÃO SE APLICA"] },
//       },
//     },
//     {
//       $project: {
//         qtde: 1,
//         nomeDoContrato: 1,
//         "contrato.dataAssinatura": 1,
//         "medidor.data": 1,
//         "sistema.qtdeModulos": 1,
//         cidade: 1,
//         "sistema.topologia": 1,
//       },
//     },
//   ])
//   .toArray();
// const formatted = projects.map((project) => {
//   return {
//     QTDE: project.qtde,
//     NOME: project.nomeDoContrato,
//     CIDADE: project.cidade,
//     "DATA DE ASSINATURA": project.contrato.dataAssinatura
//       ? dayjs(project.contrato.dataAssinatura)
//           .add(4, "hours")
//           .format("DD/MM/YYYY")
//       : "-",
//     "DATA DE TROCA DO MEDIDOR": project.medidor.data
//       ? dayjs(project.medidor.data).add(4, "hours").format("DD/MM/YYYY")
//       : "-",
//     "QUANTIDADE DE MÓDULOS": project.sistema.qtdeModulos,
//     TOPOLOGIA: project.sistema.topologia,
//   };
// });
