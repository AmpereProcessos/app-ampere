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
import { TMaterial } from '@/utils/schemas/materials'
import { TNewWarehouseFormulary, TWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'

const handleUpdateTeste: NextApiHandler<any> = async (req, res) => {
  const projectsDb: Db = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  const db: Db = await connectToWarehouseDatabase(process.env.DB_KEY)

  const projectsCollection: Collection<TProject> = projectsDb.collection('dados')
  const projects = await projectsCollection.find({}).toArray()

  const formulariesCollection: Collection<TWarehouseFormulary> = db.collection('formularios')
  const formularies = await formulariesCollection.find({}).toArray()

  const newFormularies = formularies.map((form) => {
    const equivalentProject = projects.find((project) => project._id.toString() == form.idPai)
    const insertDate = form._id.getTimestamp().toISOString()
    const newFormulary: TNewWarehouseFormulary = {
      titulo: `SAIDA PARA ${form.nomeDoContrato || form.nomeTerceiro}`,
      categoria: form.servico,
      responsaveis: form.equipeResp || form.nomeTerceiro || 'NÃO DEFINIDO',
      projeto: {
        id: equivalentProject?._id.toString(),
        nome: equivalentProject?.nomeDoContrato,
        identificador: equivalentProject?.qtde,
      },
      localizacao: {
        cep: equivalentProject?.cep,
        uf: equivalentProject?.uf,
        cidade: equivalentProject?.cidade,
        bairro: equivalentProject?.bairro || '',
        endereco: equivalentProject?.logradouro || '',
        numeroOuIdentificador: equivalentProject?.numeroResidencia.toString() || '',
        complemento: '',
        distancia: null,
      },
      materiais: form.materiais.map((mat) => ({
        id: mat.id,
        nome: mat.nome,
        preco: mat.precoUnit,
        grandeza: mat.grandeza,
        qtdeRetirada: mat.qtdeSaida || 0,
        qtdeDevolucao: mat.qtdeDevolucao || 0,
      })),
      autor: {
        id: '639b4b9ffbca702a25180057',
        nome: 'Almoxarifado',
        avatar_url:
          'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-alex.jpeg?alt=media&token=37101720-3dee-43ee-a3e4-07ed654a3ad0',
      },
      dataEfetivacao: form.dataEfetivacao,
      dataInsercao: insertDate,
    }
    return newFormulary
  })
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
  return res.json(newFormularies)
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
