import { Collection, ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import connectToISDatabase from '../../../utils/services/mongodb/inside-sales'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { RiCollageLine } from 'react-icons/ri'
import createHttpError from 'http-errors'

type PostResponse = {
  data: { insertedId: string }
  message: string
}
const createNewProjectRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const project: TProject = req.body
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

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

  const insertResponse = await collection.insertOne({ ...project, qtde: newIndexer })
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
