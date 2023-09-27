import dayjs from 'dayjs'
import connectToCRMDatabase from '../../utils/crmDb'
import connectToProjectsDatabase from '../../utils/connectDb'
import connectToUsersDatabase from '../../utils/usersDb'

function getList({ str, category }) {
  if (category != 'MONTAGEM') return null
  if (typeof str != 'string') return null
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]

    return {
      qtde: qty,
      descricao: desc,
    }
  })
  return formattedSpllited
}
export default async function handler(req, res) {
  // const projectDb = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  // const projectsCollection = projectDb.collection('dados')
  // const usersDb = await connectToUsersDatabase(process.env.DB_KEY)
  // const usersCollection = usersDb.collection('users')
  // const projects = await projectsCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         telefone: 1,
  //         qtde: 1,
  //         tipoDeServico: 1,
  //         cep: 1,
  //         uf: 1,
  //         cidade: 1,
  //         bairro: 1,
  //         sistema: 1,
  //         logradouro: 1,
  //         numeroResidencia: 1,
  //         'estruturaPersonalizada.tipo': 1,
  //         'compra.kitInfo': 1,
  //         'material.materialFaltante': 1,
  //         'visitaTecnica.tipoDaTelha': 1,
  //         ordensDeServico: 1,
  //       },
  //     },
  //   ])
  //   .toArray()
  // const users = await usersCollection.find({}).toArray()
  // var serviceOrders = []
  // projects.forEach((project) => {
  //   if (project.ordensDeServico) {
  //     project.ordensDeServico.forEach((serviceOrder) =>
  //       serviceOrders.push({
  //         favorecido: { nome: project.nomeDoContrato, contato: project.telefone },
  //         projeto: { id: project._id, nome: project.nomeDoContrato, identificador: project.qtde, tipo: project.tipoDeServico },
  //         modulos: {
  //           modelo: null,
  //           qtde: project.sistema.qtdeModulos,
  //           potencia: project.sistema.potModulos,
  //         },
  //         inversor: project.sistema.inversor,
  //         inversorOs: serviceOrder.inversor,
  //         localizacao: {
  //           cep: project.cep,
  //           uf: project.uf,
  //           cidade: project.cidade,
  //           bairro: project.bairro,
  //           endereco: project.logradouro,
  //           numeroOuIdentificador: project.numeroResidencia,
  //         },
  //         topologia: project.sistema?.topologia,
  //         disponivel: project.compra?.kitInfo,
  //         retirada: project.material?.materialFaltante,
  //         tipoTelha: project.visitaTecnica?.tipoDaTelha,
  //         ...serviceOrder,
  //       })
  //     )
  //   }
  // })
  // const formatted = serviceOrders.map((order) => {
  //   const userByAuthorName = users.find((user) => user.nome == order.usuarioEmissor)
  //   var author
  //   if (userByAuthorName) {
  //     author = {
  //       id: userByAuthorName._id,
  //       nome: userByAuthorName.nome,
  //       avatar_url: userByAuthorName.avatar_url,
  //     }
  //   }
  //   const regexInverterQty = /^(\d{1,3})x/i
  //   const regexInverterModel = /x([^()]+)/
  //   const regexInverterPower = /\((\d+)W\)/
  //   const inverterQty = regexInverterQty.exec(order.inversor) ? regexInverterQty.exec(order.inversor)[0].slice(0, -1) : null
  //   const inverterModel = regexInverterModel.exec(order.inversor) ? regexInverterModel.exec(order.inversor)[0].substring(1) : null
  //   const inverterPower = regexInverterPower.exec(order.inversor)
  //     ? regexInverterPower.exec(order.inversor)[0].replace('(', '').replace(')', '').replace('W', '')
  //     : null

  //   const available = getList({ str: order.disponivel, category: order.categoria })
  //   const take = getList({ str: order.retirada, category: order.categoria })
  //   return {
  //     categoria: order.categoria,
  //     favorecido: order.favorecido,
  //     projeto: order.projeto,
  //     descricao: order.servicoExecutado,
  //     localizacao: order.localizacao,
  //     responsavel: {
  //       nome: order.equipe ? order.equipe : order.nomeTerceiro,
  //       tipo: order.equipe ? 'INTERNO' : 'EXTERNO',
  //     },
  //     // configurar: true,
  //     urgencia: order.grauDeUrgencia,
  //     periodo: {
  //       inicio: null,
  //       fim: null,
  //     },
  //     pagamento: {
  //       recebedor: order.pagamentoTerceiro ? order.nomeTerceiro : null,
  //       valor: null,
  //     },
  //     cobranca: {
  //       pagador: order.realizarCobranca ? order.projeto.nome : null,
  //       valor: order.realizarCobranca ? order.valorCobranca : null,
  //     },
  //     autor: author,
  //     equipamentos: {
  //       modulos: order.modulos,
  //       inversor: {
  //         modelo: inverterModel,
  //         qtde: Number(inverterQty),
  //         potencia: Number(inverterPower),
  //       },
  //       disponivel: available,
  //       retirada: take,
  //     },
  //     detalhes: {
  //       pontoAgua: order.pontoDeAgua,
  //       senhaWifi: order.senhaDoWifi,
  //       configuracaoMonitoramento: order.configurar,
  //       possuiTrafo: null,
  //       tipoEstrutura: order.estruturaPersonalizada?.tipo,
  //       topologia: order.topologia,
  //       tipoTelha: order.tipoTelha,
  //     },
  //     observacoes: order.observacoes,
  //     dataEfetivacao: order.dataDeFechamento,
  //     dataInsercao: order.dataDeAbertura,
  //   }
  // })
  // console.log(formatted.length) // ordensDeServico
  // res.json(formatted)
  res.json('DESATIVADA')
}
