import dayjs from 'dayjs'
import connectToCRMDatabase from '../../utils/crmDb'
import connectToRequestsDatabase from '../../utils/solicitacoesDb'
import connectToWarehouseDatabase from '../../utils/materialDb'
import { ObjectId } from 'mongodb'
import connectToProjectsDatabase from '../../utils/connectDb'
import { calculateStringSimilarity } from '../../utils/constants'
import StatesAndCities from '../../utils/estados_cidades.json'
import axios from 'axios'
import { errorHandler } from '../../utils/methods/handlers'
import connectToDatabase from '../../utils/callsDb'
import createHttpError from 'http-errors'
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
    }
  })
  return formattedItens
}

const reasonFormatting = {
  'REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO': 'REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO',
  'REPOSIÇÃO DE ITENS DE LIMPEZA': 'REPOSIÇÃO DE ITENS DE LIMPEZA',
  'REPOSIÇÃO DO ALMOXARIFADO': 'REPOSIÇÃO DE ITENS DE ALMOXARIFADO',
  'USO EM OBRA': 'USO EM OBRA DE CLIENTE',
  OUTROS: 'OUTROS',
}
const callResponsibles = {
  ADRIANO: {
    id: null,
    nome: 'Adriano Arantes',
    apelido: 'ADRIANO',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-adriano.jpg?alt=media&token=a30ec3dd-8a2e-4a24-b330-1f4e9b9f0db6',
  },
  ARTHUR: {
    id: null,
    nome: 'Arthur Alexander',
    apelido: 'ARTHUR',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-arthurziin.jpg?alt=media&token=150fd914-04d5-4c0a-bf33-7daccdf81916',
  },
  LUCAS: {
    id: '6318db05929e9f8731d8d9bb',
    nome: 'Lucas Fernandes',
    apelido: 'LUCAS',
    avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
  },
  NATHAN: {
    id: '632372d90d695bd5256518bb',
    nome: 'Nathan Peres',
    apelido: 'NATHAN',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-nathan_peres?alt=media&token=7f672eea-0b33-4e49-b747-f2de2ee110ad',
  },
  MATHEUS: {
    id: '631f832a5ba9ffa2a4cb8369',
    nome: 'Matheus Oliveira',
    apelido: 'MATHEUS',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2FavatarMatheus.jpg?alt=media&token=adb60500-22e6-4c1d-908f-72e3279fc641',
  },
  LEANDRO: {
    id: '63a5fb69e6a905a237de81eb',
    nome: 'Leandro Viali',
    apelido: 'LEANDRO',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-leandro_viali?alt=media&token=dffd6966-b6d4-460d-9baa-d467d933a8a7',
  },
}
const engineeringAnalysts = {
  ANDREW: {
    id: 1,
    nome: 'Andrew Borges Alexander',
    apelido: 'ANDREW',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-andrew_borges_alexander?alt=media&token=1d9787c0-7fd9-4343-9674-1ee69c03709b',
  },
  TULIO: {
    id: 2,
    nome: 'Tulio Medeiros',
    apelido: 'TULIO',
    avatar_url:
      'https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-tulio_medeiros?alt=media&token=233e20b5-520d-473a-9e7e-f603a0b9493c',
  },
}

function findResponsible(responsibleName) {
  const respObj = callResponsibles[responsibleName]
  if (respObj) return respObj
  else return null
}
function findSeller(seller, users) {
  const userInCRM = users.find((user) => calculateStringSimilarity(user.nome.toUpperCase(), seller) > 80)
  if (userInCRM)
    return {
      idCRM: userInCRM._id,
      nomeCRM: userInCRM.nome,
      apelido: seller,
      avatar_url: userInCRM.avatar_url,
    }
  else
    return {
      idCRM: null,
      nomeCRM: null,
      apelido: seller,
      avatar_url: null,
    }
}
function formatCharges(charges) {
  if (!charges || !Array.isArray(charges)) return
  const formatted = charges.map((charge) => {
    return {
      descricao: charge.nome,
      horasFuncionamento: charge.horasDiarias,
      potencia: charge.pot,
      qtde: charge.qtde,
    }
  })
  return formatted
}
function formatStructure(type) {
  if (type == 'TELHADO') return 'Fibrocimento'
  if (type === 'SOLO') return 'Solo'
  if (type === 'CARPORT') return 'Carport'
  if (type === 'ESTRUTURA PERSONALIZADA') return 'Personalizada'
}

export default async function handler(req, res) {
  // const db = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  // const projectsCollection = db.collection('dados')
  // const paidComissions = await projectsCollection
  //   .aggregate([
  //     {
  //       $match: {
  //         'contrato.comissaoPaga': { $ne: null },
  //       },
  //     },
  //   ])
  //   .toArray()
  // const formatted = paidComissions.map((project) => {
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(project._id) },
  //       update: {
  //         $unset: { 'contrato.comissaoPaga': '', 'contrato.comissaoVendedor': '' },
  //       },
  //     },
  //   }
  // })
  // const crmDb = await connectToCRMDatabase(process.CRM_KEY)
  // const crmUsersCollection = crmDb.collection('users')

  // const allAnalysis = await analysisCollection.find({}).toArray()
  // const allUsers = await crmUsersCollection.find({}).toArray()

  // const bulkwriteArr = allAnalysis.map(analysis => {
  //   const crmUserReference =
  // })
  // const dbResponse = await collection.updateMany(
  //   {
  //     'contrato.status': 'RECISÃO DE CONTRATO',
  //   },
  //   {
  //     $set: {
  //       'contrato.status': 'RESCISÃO DE CONTRATO',
  //     },
  //   }
  // )
  // const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  // const crmUsersCollection = crmDb.collection('users')

  // const crmUsers = await crmUsersCollection.find({}).toArray()
  // const calls = await collection.find({}).toArray()
  // const newPPSCalls = calls.map((call) => {
  //   return {
  //     _id: {
  //       $oid: call._id,
  //     },
  //     status: call.status,
  //     tipoSolicitacao: call.tipoDeSolicitacao,
  //     responsavel: findResponsible(call.responsavel),
  //     requerente: findSeller(call.vendedor, crmUsers),
  //     projeto: {
  //       id: undefined,
  //       nome: call.nomeProjeto,
  //       codigo: call.codigoDoProjeto,
  //     },
  //     premissas: {
  //       geracao: call.geracaoEstimada,
  //       cargas: call.equipamentos ? formatCharges(call.equipamentos) : undefined,
  //       topologia: call.topologia,
  //       tipoEstrutura: call.tipoDaEstrutura ? formatStructure(call.tipoDaEstrutura) : undefined,
  //       valorFinanciamento: call.valorFinanciamento,
  //     },
  //     cliente: {
  //       nome: call.nomeDoCliente,
  //       tipo: call.tipoDoCliente,
  //       telefone: call.telefone,
  //       cep: call.cep,
  //       uf: call.uf,
  //       cidade: call.cidade,
  //       endereco: call.enderecoDoCliente,
  //       numeroOuIdentificador: call.numeroResidencia,
  //       cpfCnpj: call.cpf_cnpj,
  //       dataNascimento: call.dataDeNascimento,
  //       email: call.email,
  //       renda: call.rendaDoCliente,
  //       profissao: call.profissao,
  //     },
  //     links: call.links,
  //     observacoes: call.observacoes,
  //     anotacoes: call.anotacoes,
  //     dataInsercao: call.carimboDataHora,
  //     dataEfetivacao: call.dataDeConclusao,
  //   }
  // })
  // console.log(newPPSCalls.length)
  res.json('DESATIVADA')
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
