import connectToProjectsDatabase from '../../utils/services/mongodb/projects'
import connectToWarehouseDatabase from '../../utils/services/mongodb/warehouse'
import connectToRequestsDatabase from '../../utils/services/mongodb/requests'
import { calculateStringSimilarity, equipesTecnicas, formatDate } from '../../utils/constants'
import { formatDateAsLocale, getProductsStr } from '../../utils/methods/formatting'
import { Collection, Db, ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import { getContractValue } from '../../utils/methods/util/projects'
import { NextApiHandler } from 'next'
import { TProject } from '@/utils/schemas/projects'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import { TOpportunity } from '@/utils/schemas/crm/opportunity.schema'
import { apiHandler } from '@/utils/api'
import { TPurchaseControl, TPurchaseControlTag } from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/auxiliaries'
import { TExpense } from '@/utils/schemas/expenses'

type TPreviousUser = {
  nome: string
  password: string
  accessibleRoutes?: string[]
  admin?: boolean
  admission?: string
  avatar_url?: string
  birthday?: string
  controller?: boolean
  cpf?: string
  rg?: string
  email: string
  equipe?: string
  manager?: string
  vendedor?: string
  visualizacao?: 'OBRAS' | 'VENDEDOR' | 'INSIDE'
}

type Maintenance = {
  titulo: string
  dataEfetivacao?: string | null
}

const UFEquivalent = {
  M: 'MG',
  mg: 'MG',
  Mg: 'MG',
}

const handleUpdateTeste: NextApiHandler<any> = async (req, res) => {
  const db: Db = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  const updateResponse = await collection.updateMany(
    {},
    {
      $set: {
        pagamentos: [],
      },
    }
  )

  return res.status(200).json(updateResponse)
  // const contractRequestsCollection = db.collection('contrato')

  // const updateManyResponse = await contractRequestsCollection.updateMany(
  //   {},
  //   { $set: { idParceiro: '65454ba15cf3e3ecf534b308', nomeParceiro: 'Ampère Energias' } }
  // )
  // const db: Db = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')

  // const projectsCollection: Collection<TProject> = db.collection('dados')

  // const updateManyResponse = await projectsCollection.updateMany(
  //   {},
  //   { $set: { idParceiro: '65454ba15cf3e3ecf534b308', nomeParceiro: 'Ampère Energias' } }
  // )

  // const updateResponse = await projectsCollection.updateMany({}, { $set: { seguro: { aplicavel: false } } })
  // const projects = await projectsCollection
  //   .find({
  //     'contrato.status': 'ASSINADO',
  //     tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
  //     'compra.dataPedido': { $ne: null },
  //     $or: [{ 'compra.dataEntrega': { $gte: '2024-03-01T00:00:00.000Z' } }, { 'compra.statusEntrega': { $ne: 'ENTREGUE' } }],
  //   })
  //   .toArray()

  // const formatted = projects.map((project) => {
  //   return {
  //     QTDE: project.qtde,
  //     'NOME DO CONTRATO': project.nomeDoContrato,
  //     'VALOR DO PROJETO': project.sistema.valorProjeto,
  //     'VALOR PAGO NO KIT': project.compra.valorDoKit || 0,
  //     'POTÊNCIA PICO': project.sistema.potPico,
  //     FORNECEDOR: project.compra.fornecedor || 'NÃO DEFINIDO',
  //     'DATA DE ENTREGA': project.compra.dataEntrega ? formatDateAsLocale(project.compra.dataEntrega) : 'NÃO ENTREGUE',
  //     'STATUS DA ENTREGA': project.compra.statusEntrega,
  //   }
  // })
  // const requests = await contractRequestsCollection.find({}).toArray()
  // const result = projects.map((project) => {
  //   const equivalentRequest = requests.find((r) => r._id.toString() == project.idSolicitacaoContrato)
  //   console.log('SOLICITAÇÃO', equivalentRequest?.nomeDoContrato)
  //   return {
  //     QTDE: project.qtde,
  //     NOME: project.nomeDoContrato,
  //     'CPF/CNPJ': project.cpf_cnpj,
  //     TELEFONE: project.telefone,
  //     EMAIL: project.email,
  //     UF: project.uf,
  //     CIDADE: project.cidade,
  //     BAIRRO: project.bairro,
  //     LOGRADOURO: project.logradouro,
  //     'NÚMERO DA RESIDÊNCIA': project.numeroResidencia,
  //     'ESTADO CIVIL': equivalentRequest?.estadoCivil,
  //     PROFISSÃO: equivalentRequest?.profissao,
  //     'STATUS DO CONTRATO': project.contrato.status,
  //     'ASSINATURA DO CONTRATO': project.contrato.dataAssinatura ? formatDateAsLocale(project.contrato.dataAssinatura) : null,
  //     'LIBERAÇÃO DO PARECER': project.homologacao.acesso.dataResposta ? formatDateAsLocale(project.homologacao.acesso.dataResposta) : null,
  //   }
  // })
  // const purchases = projects.map((project) => {
  //   return {
  //     QTDE: project.qtde,
  //     'NOME DO CLIENTE': project.nomeDoContrato,
  //     TIPO: project.tipoDeServico,
  //     ESTADO: project.uf,
  //     CIDADE: project.cidade,
  //     VENDEDOR: project.vendedor.nome,
  //     'DATA DE ASSINATURA': project.contrato.dataAssinatura ? formatDateAsLocale(project.contrato.dataAssinatura) : null,
  //     'VALOR DO CONTRATO': getContractValue({
  //       projectValue: project.sistema.valorProjeto || 0,
  //       paValue: project.padrao.valor || 0,
  //       structureValue: project.estruturaPersonalizada.valor || 0,
  //     }),
  //     'STATUS DA OBRA': project.obra.statusDaObra,
  //     'SAIDA DE OBRA': project.obra.saida ? formatDateAsLocale(project.obra.saida) : null,
  //     'COBRANÇA FEITA': project.pagamento.cobrancaFeita ? 'SIM' : 'NÃO',
  //     'DATA DE RECEBIMENTO': project.pagamento.dataRecebimento ? formatDateAsLocale(project.pagamento.dataRecebimento) : null,
  //     'FATURAMENTO FEITO': project.faturamento.concluido ? 'SIM' : 'NÃO',
  //     'DATA DE FATURAMENTO': project.faturamento.dataFaturamento ? formatDateAsLocale(project.faturamento.dataFaturamento) : null,
  //   }
  // })
  // const projects = await projectsCollection
  //   .find({ $and: [{ 'compra.dataPedido': { $gte: '2023-06-01T00:00:00.000Z' } }, { 'compra.dataPedido': { $lte: '2024-04-10T22:00:00.000Z' } }] })
  //   .toArray()
  // const purchases = projects.map((project) => {
  //   return {
  //     QTDE: project.qtde,
  //     'NOME DO CLIENTE': project.nomeDoContrato,
  //     TIPO: project.tipoDeServico,
  //     VENDEDOR: project.vendedor.nome,
  //     ESTADO: project.uf,
  //     CIDADE: project.cidade,
  //     TOPOLOGIA: project.sistema.topologia,
  //     FORNECEDOR: project.compra.fornecedor,
  //     MODULOS: `${project.sistema.qtdeModulos} x ${project.sistema.potModulos}W`,
  //     INVERSORES: `${project.sistema.inversor}`,
  //     'VALOR PREVISTO DO KIT': project.compra.previsaoValorDoKit,
  //     'VALOR PAGO NO KIT': project.compra.valorDoKit,
  //     'DATA DE LIBERAÇÃO PARA COMPRA': project.compra.dataLiberacao ? formatDateAsLocale(project.compra.dataLiberacao) : null,
  //     'DATA DE COMPRA': project.compra.dataPedido ? formatDateAsLocale(project.compra.dataPedido) : null,

  //     'DATA DE ENTREGA': project.compra.dataEntrega ? formatDateAsLocale(project.compra.dataEntrega) : null,
  //   }
  // })
  // const revenues = projects.map((project) => {
  //   const revenue = {
  //     nome: `CONTRATO DE ${project.nomeDoContrato}`,
  //     tipo: project.tipoDeServico,
  //     autor: {
  //       id: session.user.id,
  //       nome: session.user.nome,
  //       avatar_url: session.user.avatar_url,
  //     },
  //     projeto: {
  //       id: project._id,
  //       nome: project.nomeDoContrato,
  //       identificador: project.qtde,
  //     },
  //     total: getContractValue({
  //       projectValue: project.sistema.valorProjeto,
  //       structureValue: project.estruturaPersonalizada.valor,
  //       paValue: project.padrao.valor,
  //     }),
  //     metodo: project.pagamento.forma == 'FINANCIAMENTO' ? 'FINANCIAMENTO' : 'À VISTA (GERAL)',
  //     efetivacao: {
  //       efetivado: true,
  //       data: project.contrato.dataAssinatura,
  //     },
  //     fracionamento: [],
  //     dataInsercao: project.contrato.dataAssinatura,
  //   }
  //   return revenue
  // })
  // const projectsCollection: Collection<TProject> = db.collection('dados')

  // return res.status(200).json(bkResponse)

  return res.status(200).json('DESATIVADA')
}
export default apiHandler({
  GET: handleUpdateTeste,
})

// GETTING COMPLETED PROJECTS FOR A GIVEN MONTH

// const db: Db = await connectToProjectsDatabase(process.env.DB_KEY)

// const projectsCollection: Collection<TProject> = db.collection('dados')
// const expensesCollection: Collection<TExpense> = db.collection('despesas')

// const projects = await projectsCollection
//   .find({
//     $and: [{ 'obra.saida': { $gte: '2024-01-01T00:00:00.000Z' } }, { 'obra.saida': { $lte: '2024-01-31T22:00:00.000Z' } }],
//   })
//   .toArray()
// const expenses = await expensesCollection.find({}, { projection: { categoria: 1, projeto: 1, total: 1 } }).toArray()

// const exportation = projects.map((project) => {
//   const projectExpenses = expenses.filter((e) => e.projeto?.id == project._id.toString())
//   const expensesByCategory = projectExpenses.reduce((acc: { [key: string]: number }, current) => {
//     if (!acc[current.categoria]) acc[current.categoria] = 0
//     acc[current.categoria] += current.total
//     return acc
//   }, {})
//   return {
//     ID: project._id,
//     QTDE: project.qtde,
//     NOME: project.nomeDoContrato,
//     'CONCLUSÃO DE SERVIÇO': formatDateAsLocale(project.obra.saida),
//     ...expensesByCategory,
//   }
// })
// return res.json(exportation)

// CREATING EMPLOYEES BY USERS
// const usersDb = await connectToColaboratorsDatabase(process.env.DB_KEY)
// const usersCollection: Collection<TPreviousUser> = usersDb.collection('users')

// const adminstrationDb = await connectToAdministrationDatabase(process.env.DB_KEY)
// const employeesCollection = await adminstrationDb.collection('colaboradores')

// const users = await usersCollection.find({}).toArray()

// const VisualizationTypesMap = {
//   OBRAS: 'EXECUÇÃO',
//   VENDEDOR: 'VENDAS',
//   INSIDE: 'VENDAS',
// }
// const newUsers = users.map((user) => {
//   const insertDate = user._id.getTimestamp().toISOString()
//   const newUser: TEmployeeDTO = {
//     _id: {
//       $oid: user._id,
//     },
//     acessoAtivo: true,
//     nome: user.nome,
//     email: user.email,
//     telefone: '',
//     senha: user.password,
//     avatar_url: user.avatar_url,
//     visualizacao: {
//       tipo: user.visualizacao ? (VisualizationTypesMap[user.visualizacao] as TEmployeeDTO['visualizacao']['tipo']) : 'OPERACIONAL',
//       referencia: !!user.visualizacao ? user.vendedor || user.equipe : null,
//     },
//     permissoes: {
//       rotas: user.accessibleRoutes || [],
//       usuarios: {
//         escopo: null,
//         visualizar: !!user.manager,
//         editar: !!user.manager,
//         criar: !!user.manager,
//       },
//       comercial: {
//         visualizar: !!user.accessibleRoutes?.includes('PPS'),
//         editar: !!user.accessibleRoutes?.includes('PPS'),
//       },
//       posVenda: {
//         visualizar: !!user.accessibleRoutes?.includes('Pós-Venda'),
//         editar: !!user.accessibleRoutes?.includes('Pós-Venda'),
//       },
//       suprimentos: {
//         visualizar: !!user.accessibleRoutes?.includes('Suprimentos'),
//         editar: !!user.accessibleRoutes?.includes('Suprimentos'),
//       },
//       engenharia: {
//         visualizar: !!user.accessibleRoutes?.includes('Projetos'),
//         editar: !!user.accessibleRoutes?.includes('Projetos'),
//       },
//       execucao: {
//         visualizar: !!user.accessibleRoutes?.includes('Obras'),
//         editar: !!user.accessibleRoutes?.includes('Obras'),
//       },
//       suporte: {
//         visualizar: !!user.accessibleRoutes?.includes('O&M'),
//         editar: !!user.accessibleRoutes?.includes('O&M'),
//       },
//       financeiro: {
//         visualizar: !!user.accessibleRoutes?.includes('Financeiro'),
//         editar: !!user.accessibleRoutes?.includes('Financeiro'),
//       },
//       administrativo: {
//         visualizar: !!user.accessibleRoutes?.includes('ADM'),
//         editar: !!user.accessibleRoutes?.includes('ADM'),
//       },
//       recursosHumanos: {
//         visualizar: !!user.accessibleRoutes?.includes('RH'),
//         editar: !!user.accessibleRoutes?.includes('RH'),
//       },
//       gestao: {
//         visualizarResultados: !!user.manager,
//       },
//       ordensDeServico: {
//         criar: !!user.controller,
//         visualizar: !!user.controller,
//         editar: !!user.controller,
//       },
//     },
//     empresaVinculada: '', //
//     dataNascimento: '', //
//     localNascimento: '',
//     nacionalidade: 'Brasileiro', //
//     estadoCivil: '', //
//     grauInstrucao: '', //
//     tituloEleitor: '', //
//     carteiraTrabalho: {
//       pisPaseb: '', //
//       numero: '', //
//       serie: '', //
//     },
//     rg: user.rg || '', //
//     cpf: user.cpf || '', //
//     carteiraTransito: {
//       numero: '', //
//       dataVencimento: null, //
//     },
//     qtdeFilhos: 0, //
//     localizacao: {
//       cep: null, //
//       uf: null, //
//       cidade: null, //
//       bairro: '', //
//       endereco: '', //
//       numeroOuIdentificador: '', //
//     },
//     dataAdmissao: user.admission, //
//     cargos: [], //
//     salarioBase: 0,
//     horariosTrabalho: [], //
//     contatosAuxiliares: [],
//     autor: {
//       id: '6318db05929e9f8731d8d9bb',
//       nome: 'Lucas Fernandes',
//       avatar_url: 'https://avatars.githubusercontent.com/u/60222823?s=400&u=d82dbc3d1d666b315b793f1888fd65c92d8ca0a9&v=4',
//     },
//     dataInsercao: insertDate,
//   }
//   return newUser
// })

// return res.json(newUsers)

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
