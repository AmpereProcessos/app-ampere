import dayjs from "dayjs";
import connectToCRMDatabase from "../../utils/crmDb";
import connectToRequestsDatabase from "../../utils/solicitacoesDb";
import connectToWarehouseDatabase from "../../utils/materialDb";
import { ObjectId } from "mongodb";
import connectToProjectsDatabase from "../../utils/connectDb";
import { calculateStringSimilarity } from "../../utils/constants";
import StatesAndCities from "../../utils/estados_cidades.json";
import axios from "axios";
import { errorHandler } from "../../utils/methods/handlers";
import connectToDatabase from "../../utils/auxiliaresDb";
import createHttpError from "http-errors";
function formatItens(list) {
  const formattedItens = list.map((item) => {
    return {
      descricao: item.nome,
      qtde: item.qtde,
      preco: item.cotacao,
      grandeza: item.grandeza,
      dataCompra: item.dataCompra,
      dataEntrega: item.dataEntrega,
      anotacoes: item.descricao, //
    };
  });
  return formattedItens;
}

const reasonFormatting = {
  "REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO":
    "REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO",
  "REPOSIÇÃO DE ITENS DE LIMPEZA": "REPOSIÇÃO DE ITENS DE LIMPEZA",
  "REPOSIÇÃO DO ALMOXARIFADO": "REPOSIÇÃO DE ITENS DE ALMOXARIFADO",
  "USO EM OBRA": "USO EM OBRA DE CLIENTE",
  OUTROS: "OUTROS",
};
function getContractValue(valorProjeto, valorPadrao, valorEstrutura, valorOeM) {
  var totalSum = 0;

  const projeto = !isNaN(valorProjeto) ? valorProjeto : 0;
  const padrao = !isNaN(valorPadrao) ? valorPadrao : 0;
  const estrutura = !isNaN(valorEstrutura) ? valorEstrutura : 0;
  const oem = !isNaN(valorOeM) ? valorOeM : 0;
  totalSum =
    Number(totalSum) +
    Number(projeto) +
    Number(padrao) +
    Number(estrutura) +
    oem;
  return totalSum;
}
export default async function handler(req, res) {
  const db = await connectToRequestsDatabase(process.env.DB_KEY);
  const collection = db.collection("visitaTecnica");
  const requests = await collection
    .aggregate([
      {
        $project: {
          nomeDoCliente: 1,
          cidade: 1,
        },
      },
    ])
    .toArray();
  var citiesArr = [];
  StatesAndCities.forEach((state) => {
    const cities = state.cidades;
    cities.forEach((city) => {
      citiesArr.push({ cidade: city, uf: state.sigla });
    });
  });
  const formattedRequests = requests.map((request) => {
    const correspondentCity = citiesArr.find(
      (city) =>
        city.cidade.toUpperCase() == request.cidade.toUpperCase() &&
        city.uf != "BA" &&
        city.uf != "SP"
    );
    return {
      ...request,
      uf: correspondentCity?.uf,
    };
  });
  const bulkwriteArr = formattedRequests.map((request) => {
    return {
      updateOne: {
        filter: { _id: new ObjectId(request._id) },
        update: {
          $set: { uf: request.uf },
        },
      },
    };
  });

  // const projects = await projectsCollection
  //   .aggregate([
  //     {
  //       $match: {
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //     {
  //       $project: {
  //         qtde: 1,
  //         nomeDoContrato: 1,
  //         tipoDeServico: 1,
  //         contrato: 1,
  //         "sistema.valorProjeto": 1,
  //         "padrao.valor": 1,
  //         "estruturaPersonalizada.valor": 1,
  //         "oem.valor": 1,
  //       },
  //     },
  //     {
  //       $sort: {
  //         qtde: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const formattedRevenues = projects.map((project) => {
  //   return {
  //     tipo: project.tipoDeServico,
  //     autor: {
  //       id: "6318db05929e9f8731d8d9bb", // id do usuário que criou o referente registro de custos
  //       nome: "Lucas Fernandes", // nome do usuário que criou o referente registro de custos
  //     },
  //     projeto: {
  //       id: project._id, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
  //       nome: project.nomeDoContrato, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
  //       identificador: project.qtde, // identificador QTDE do projeto no banco de projetos
  //     },
  //     total: getContractValue(
  //       project.sistema.valorProjeto,
  //       project.padrao.valor,
  //       project.estruturaPersonalizada.valor,
  //       project.oem?.valor
  //     ),
  //     efetivacao: {
  //       efetivado: true,
  //       data: project.contrato.dataAssinatura,
  //     },
  //     dataInsercao:
  //       project.contrato.dataAssinatura ||
  //       new ObjectId(project._id).getTimestamp(),
  //     criterioReferencia: false,
  //     criterioCompetencia: true,
  //   };
  // });
  // const totalRevenue = formattedRevenues.reduce((acc, current) => {
  //   const toSum = current.total;
  //   return acc + toSum;
  // }, 0);
  // console.log(totalRevenue);
  // const expenses = await expensesCollection.find({}).toArray();
  // const bulkwriteArr = expenses.map((expense) => {
  //   var updateObj;
  //   if (expense.idFormularioAlmoxarifado) {
  //     updateObj = {
  //       $set: {
  //         rateio: "CUSTOS DIRETOS",
  //         categoria: "INSUMOS DE ALMOXARIFADO",
  //         descricao: `SAÍDA DE MATERIAL PARA ${expense.categoria}`,
  //         efetivacao: {
  //           efetivado: true,
  //           data: new Date(expense.dataInsercao).toISOString(),
  //         },
  //         criterioCompetencia: true,
  //       },
  //     };
  //   } else
  //     updateObj = {
  //       $set: {
  //         dataInsercao: expense.dataInsercao,
  //       },
  //     };
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(expense._id) },
  //       update: updateObj,
  //     },
  //   };
  // });
  const responseDb = await collection.bulkWrite(bulkwriteArr);
  res.json(responseDb);
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
//   },
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
