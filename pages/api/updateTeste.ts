import connectToProjectsDatabase from '../../utils/services/mongodb/projects'
import connectToWarehouseDatabase from '../../utils/services/mongodb/warehouse'
import connectToRequestsDatabase from '../../utils/services/mongodb/requests'
import { calculateStringSimilarity, formatDate } from '../../utils/constants'
import { formatDateAsLocale } from '../../utils/methods/formatting'
import { Collection, Db, ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import { getContractValue } from '../../utils/methods/util/projects'
import { NextApiHandler } from 'next'
import { TProject } from '@/utils/schemas/projects'
import { apiHandler } from '@/utils/api'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analyis'
import { TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'

const handleUpdateTeste: NextApiHandler<any> = async (req, res) => {
  const db: Db = await connectToWarehouseDatabase(process.env.DB_KEY)
  const logsCollection: Collection<TMaterialUpdateRegistry> = db.collection('alteracoes')

  const deleteResponse = await logsCollection.deleteMany({
    $or: [{ 'material.id': '64d143b9a44d78ad3f3cff40' }, { 'material.id': '64e781ac52a1e57fee30aa18' }],
  })
  // const mainCollection: Collection<TProject> = db.collection('dados')

  // const projects = await mainCollection.find({ 'compra.statusEntrega': 'EM ROTA', 'compra.liberacao': null }).toArray()

  // const bulkwrite = projects
  //   .map((project) => {
  //     const libDate = project.parecer.dataParecerDeAcesso
  //     return {
  //       updateOne: {
  //         filter: { _id: new ObjectId(project._id) },
  //         update: {
  //           $set: {
  //             'compra.liberacao': true,
  //             'compra.dataLiberacao': libDate,
  //           },
  //         },
  //       },
  //     }
  //   })
  //   .filter((b) => !!b)
  // const bkResponse = await mainCollection.bulkWrite(bulkwrite)
  // return res.json(bkResponse)
  return res.json(deleteResponse)
}
export default apiHandler({
  GET: handleUpdateTeste,
})
// export default async function handler(req, res) {
//   const db = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
//   const collection = db.collection('dados')
//   let suprimentos = await collection
//     .aggregate([
//       {
//         $sort: {
//           qtde: 1,
//         },
//       },
//       {
//         $match: {
//           tipoDeServico: { $ne: 'OPERAÇÃO E MANUTENÇÃO' },
//           'compra.liberacao': true,
//           'compra.status': { $ne: 'CONCLUIDA' },
//           'parecer.statusDoParecerDeAcesso': { $ne: 'PARECER DE ACESSO APROVADO' },
//           'project.compra.dataPedido': null,
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           nomeDoContrato: 1,
//           qtde: 1,
//           compra: 1,
//           tipoDeServico: 1,
//           'faturamento.previsaoFaturamento': 1,
//           'parecer.statusDoParecerDeAcesso': 1,
//           'sistema.potPico': 1,
//           'sistema.qtdeModulos': 1,
//           'pagamento.status': 1,
//         },
//       },
//     ])
//     .toArray()
//   console.log(suprimentos.length)
//   const bulkwrite = suprimentos.map((s) => {
//     return {
//       updateOne: {
//         filter: { _id: new ObjectId(s._id) },
//         update: {
//           $set: {
//             'compra.liberacao': null,
//             'compra.dataLiberacao': null,
//           },
//         },
//       },
//     }
//   })
//   const bkResponse = await collection.
//   return res.json(bkResponse)
// }
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
