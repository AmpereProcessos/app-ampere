import dayjs from "dayjs";
import connectToCRMDatabase from "../../utils/crmDb";
import connectToRequestsDatabase from "../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
import connectToProjectsDatabase from "../../utils/connectDb";
export default async function handler(req, res) {
  // // COnnecting to CRM projects and proposes db/collection
  // const crmDb = await connectToCRMDatabase(process.env.CRM_KEY);
  // const crmProjectsCollection = crmDb.collection("projects");
  // const crmProposesCollection = crmDb.collection("proposes");
  // // Connecting to projects db/collection
  // const projectsDb = await connectToProjectsDatabase(
  //   process.env.DB_KEY,
  //   "projetos"
  // );
  // const projectsCollection = projectsDb.collection("dados");
  // // Connecting to contract requests db/collection
  // const requestsDb = await connectToRequestsDatabase(process.env.DB_KEY);
  // const contractRequestsCollection = requestsDb.collection("contrato");
  // const allProjects = await projectsCollection
  //   .aggregate([
  //     {
  //       $match: { "contrato.status": "ASSINADO", idProjetoCRM: { $ne: null } },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         "contrato.dataAssinatura": 1,
  //         codigoSVB: 1,
  //         idProjetoCRM: 1,
  //         idPropostaCRM: 1,
  //         idSolicitacaoContrato: 1,
  //       },
  //     },
  //   ])
  //   .toArray();

  // const allContractRequests = await contractRequestsCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         dataSolicitacao: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const allCRMProjects = await crmProjectsCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         nome: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const allCRMProposes = await crmProposesCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         "projeto.nome": 1,
  //       },
  //     },
  //   ])
  //   .toArray();

  // const bulkWriteArr = allProjects.map((project) => {
  //   const equivalentCRMProject = allCRMProjects.find(
  //     (x) => x._id == project.idProjetoCRM
  //   );
  //   const equivalentCRMPropose = allCRMProposes.find(
  //     (x) => x._id == project.idPropostaCRM
  //   );
  //   const equivalentContractRequest = allContractRequests.find(
  //     (x) => x._id == project.idSolicitacaoContrato
  //   );
  //   console.log(
  //     project.nomeDoContrato,
  //     " CRM: ",
  //     equivalentCRMProject?.nome,
  //     " PROPOSE: ",
  //     equivalentCRMPropose?.projeto?.nome,
  //     "SOLICITACAO CONTRATO: ",
  //     equivalentContractRequest.dataSolicitacao
  //   );
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(equivalentCRMProject._id) },
  //       update: {
  //         $set: {
  //           contrato: {
  //             id: new ObjectId(project._id).toString(),
  //             idProposta: new ObjectId(equivalentCRMPropose._id).toString(),
  //             dataAssinatura: project.contrato?.dataAssinatura,
  //           },
  //           solicitacaoContrato: {
  //             id: project.idSolicitacaoContrato,
  //             idProposta: new ObjectId(equivalentCRMPropose._id).toString(),
  //             dataSolicitacao: equivalentContractRequest.dataSolicitacao,
  //           },
  //         },
  //       },
  //     },
  //   };
  // });

  // const bulkWriteResponse = await crmProjectsCollection.bulkWrite(bulkWriteArr);
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
