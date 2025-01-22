import { Collection, ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import connectToISDatabase from '../../../utils/services/mongodb/inside-sales'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { RiCollageLine } from 'react-icons/ri'
import createHttpError from 'http-errors'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import { TClient } from '@/utils/schemas/crm/client.schema'
import { TOpportunity } from '@/utils/schemas/crm-project'

type PostResponse = {
  data: { insertedId: string }
  message: string
}
const createNewProjectRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const project: TProject = req.body

  const crmDb = await connectToCRMDatabase()
  const db = await connectToDatabase()

  const collection: Collection<TProject> = db.collection('dados')

  const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection('opportunities')

  const latestInserted = await collection
    .aggregate([
      {
        $sort: {
          qtde: -1,
        },
      },
      {
        $limit: 1,
      },
    ])
    .toArray()

  const lastIndexer = latestInserted[0].qtde

  const newIndexer = lastIndexer + 1

  var clientCrmId: string | null = null

  if (project.idProjetoCRM) {
    const opportunity = await opportunitiesCollection.findOne({ _id: new ObjectId(project.idProjetoCRM) })
    if (opportunity) clientCrmId = opportunity.clienteId
  }
  const insertResponse = await collection.insertOne({ ...project, qtde: newIndexer, idClienteCRM: clientCrmId })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação do projeto.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Projeto criado com sucesso !' })
}

export default apiHandler({ POST: createNewProjectRoute })
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('dados')

//     // Pegando o último projeto adicionado na gestão de projetos
//     let lastestInserted = await collection
//       .aggregate([
//         {
//           $sort: {
//             qtde: -1,
//           },
//         },
//         {
//           $limit: 1,
//         },
//       ])
//       .toArray()
//     // Inserindo novo projeto com qtde ajustado e insider
//     let project = await collection.insertOne({
//       ...req.body,
//       qtde: lastestInserted[0].qtde + 1,
//     })
//     return res.json(project)
//   }
// }
