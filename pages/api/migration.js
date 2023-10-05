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
  const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  const crmProposesCollection = crmDb.collection('proposes')

  const projectsWithProposeId = await projectsCollection
    .aggregate([
      {
        $match: {
          idPropostaCRM: { $ne: null },
          tipoDeServico: 'SISTEMA FOTOVOLTAICO',
        },
      },
      {
        $project: {
          nomeDoContrato: 1,
          idPropostaCRM: 1,
        },
      },
    ])
    .toArray()
  const proposes = await crmProposesCollection
    .aggregate([
      {
        $project: {
          precificacao: 1,
        },
      },
    ])
    .toArray()
  const formatted = projectsWithProposeId.map((project) => {
    const proposeId = project.idPropostaCRM
    const equivalentPropose = proposes.find((propose) => propose._id == proposeId)
    if (!equivalentPropose) return null
    const kitPrice = equivalentPropose.precificacao.kit?.custo || 0
    return {
      updateOne: {
        filter: { _id: new ObjectId(project._id) },
        update: {
          $set: {
            'compra.previsaoValorDoKit': Number(Number(kitPrice).toFixed(2)),
          },
        },
      },
    }
  })
  console.log(formatted.length)

  const dbResponse = await projectsCollection.bulkWrite(formatted)
  res.json(dbResponse)
}
