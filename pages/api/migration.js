import dayjs from 'dayjs'
import connectToCRMDatabase from '../../utils/crmDb'
import connectToProjectsDatabase from '../../utils/connectDb'
import connectToUsersDatabase from '../../utils/usersDb'
import { ObjectId } from 'mongodb'

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
  const projectDb = await connectToProjectsDatabase(process.env.DB_KEY, 'projetos')
  const projectsCollection = await projectDb.collection('dados')
  const projects = await projectsCollection
    .aggregate([
      {
        $match: {
          'contrato.status': 'ASSINADO',
        },
      },
      {
        $sort: {
          qtde: 1,
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          compra: 1,
        },
      },
    ])
    .toArray()
  const formatted = projects.map((project) => {
    var eligibleToBuy = false
    var supplyStatus = 'NÃO DEFINIDO'
    const status = project.compra.statusLiberacao
    const deliveryStatus = project.compra.statusEntrega
    if (status == 'REALIZAR COMPRA') {
      eligibleToBuy = true
    }
    if (status == 'PAGO') {
      eligibleToBuy = true
    }
    if (status == 'PAGO' && deliveryStatus == 'ENTREGUE') {
      eligibleToBuy = true
      supplyStatus = 'CONCLUIDA'
    }
    if (status == 'AGUARDAR PARECER DE ACESSO') {
      eligibleToBuy = true
      supplyStatus = 'AGUARDANDO PARECER DE ACESSO'
    }
    if (status == 'AGUARDANDO PAGAMENTO') {
      eligibleToBuy = true
      supplyStatus = 'AGUARDANDO PAGAMENTO'
    }
    if (status == 'PREVISÃO DE EQUIPAMENTOS') {
      eligibleToBuy = true
      supplyStatus = 'PREDEFINIÇÃO DE EQUIPAMENTOS' // QUE NOME UTILIZAR ?
    }
    return {
      updateOne: {
        filter: {
          _id: new ObjectId(project._id),
        },
        update: {
          $set: {
            'compra.status': supplyStatus,
            'compra.liberacao': eligibleToBuy,
          },
        },
      },
    }
  })
  const bulkwriteResp = await projectsCollection.bulkWrite(formatted)
  res.json(bulkwriteResp)
}
