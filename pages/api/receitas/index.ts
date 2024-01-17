import connectToDatabase from '../../../utils/services/mongodb/projects'
import { InsertRevenueSchema, TRevenue } from '../../../utils/schemas/revenues'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '../../../utils/api'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
type GetResponse = {
  data: TRevenue | TRevenue[]
}

const getRevenues: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id, projectId } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TRevenue> = db.collection('receitas')

  // Query for a specific revenue
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const revenue = await collection.findOne({ _id: new ObjectId(id) })
    if (!revenue) throw new createHttpError.NotFound('Receita não encontrada.')
    return res.status(200).json({ data: revenue })
  }
  // Query for a given project revenues
  if (projectId) {
    if (typeof projectId != 'string') throw new createHttpError.BadRequest('ID de projeto inválido.')
    console.log('PROJETO ID', projectId)
    const revenues = await collection.find({ 'projeto.id': projectId }).toArray()
    return res.status(200).json({ data: revenues })
  }
  console.log('CHEGOU AQUI')
  // Query for all revenues
  const revenues = await collection.find({}).toArray()
  return res.status(200).json({ data: revenues })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createRevenue: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const revenue = InsertRevenueSchema.parse(req.body)
  const author = { id: session.user.id, nome: session.user.name, avatar_url: session.user.image }
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TRevenue> = db.collection('receitas')

  const insertResponse = await collection.insertOne({ ...revenue, autor: author, dataInsercao: new Date().toISOString() })

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na criação da receita.')

  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Receita criada com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}

const editRevenue: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const changes = InsertRevenueSchema.partial().parse(req.body)

  console.log(changes)
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TRevenue> = db.collection('receitas')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao atualizar receita.')

  return res.status(201).json({ data: 'Receita atualizada com sucesso!', message: 'Receita atualizada com sucesso!' })
}
export default apiHandler({ GET: getRevenues, POST: createRevenue, PUT: editRevenue })
// async function handler(req, res) {
//   if (req.method == 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('receitas')
//     const { projectId } = req.query
//     try {
//       if (projectId && typeof projectId == 'string') {
//         // Project related revenues
//         const revenues = await collection
//           .aggregate([
//             {
//               $match: {
//                 'projeto.id': projectId,
//               },
//             },
//           ])
//           .toArray()
//         res.status(200).json(revenues)
//       } else {
//         // All revenues
//         const revenues = await collection.aggregate([{ $sort: { dataInsercao: -1 } }]).toArray()
//         res.status(200).json(revenues)
//       }
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
// }
