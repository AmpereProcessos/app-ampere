import createHttpError from 'http-errors'
import connectToDatabase from '../../../utils/services/mongodb/projects'
import { errorHandler } from '../../../utils/methods/handlers'
import { Collection, Db, ObjectId } from 'mongodb'
import { TExpense } from '@/utils/schemas/expenses'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'

type GetResponse = {
  data: TExpense | TExpense[]
}
const getExpenses: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id, projectId } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  // Query for specific expense
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const expense = await collection.findOne({ _id: new ObjectId(id) })
    if (!expense) throw new createHttpError.NotFound('Despesa não encontrada.')
    return res.status(200).json({ data: expense })
  }

  // Query for a given project expenses
  if (projectId) {
    if (typeof projectId != 'string') throw new createHttpError.BadRequest('ID de projeto inválido.')
    const expenses = await collection.find({ 'projeto.id': projectId }, { sort: { _id: -1 } }).toArray()
    return res.status(200).json({ data: expenses })
  }

  const expenses = await collection.find({}, { sort: { _id: -1 } }).toArray()
  return res.status(200).json({ data: expenses })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}
const createExpense: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const info = req.body.data
  if (!info) throw new createHttpError.BadRequest('Informações para criação da despesas não fornecidas.')

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  const insertResponse = await collection.insertOne({ ...info, dataInsercao: new Date().toISOString() })

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na criação da receita.')

  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Receita criada com sucesso !' })
}
type PutResponse = {
  data: string
  message: string
}

const editExpense: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { changes } = req.body
  const { id } = req.query
  if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  // const changes = InsertRevenueSchema.partial().parse(req.body)

  delete changes._id
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao atualizar receita.')

  return res.status(201).json({ data: 'Despesa atualizada com sucesso!', message: 'Despesa atualizada com sucesso!' })
}

export default apiHandler({
  GET: getExpenses,
  POST: createExpense,
  PUT: editExpense,
})
// export default async function handler(req, res) {
//   if (req.method == 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('despesas')
//     const { projectId } = req.query
//     try {
//       if (projectId && typeof projectId == 'string') {
//         // Project related expenses
//         const expenses = await collection
//           .aggregate([
//             {
//               $match: {
//                 'projeto.id': projectId,
//               },
//             },
//           ])
//           .toArray()
//         res.status(200).json(expenses)
//       } else {
//         // All expenses
//         const expenses = await collection.aggregate([{ $sort: { dataInsercao: -1 } }]).toArray()
//         res.status(200).json(expenses)
//       }
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
//   if (req.method == 'POST') {
//     try {
//       const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//       const collection = db.collection('despesas')
//       const info = req.body.data
//       let dbRes = await collection.insertOne(info)
//       res.json(dbRes)
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
//   if (req.method == 'PUT') {
//     try {
//       const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//       const collection = db.collection('despesas')
//       const { changes } = req.body
//       const { id } = req.query
//       if (!changes) throw new createHttpError.BadRequest('Objeto de mudanças não fornecido.')
//       if (!id || typeof id != 'string') throw new createHttpError.BadRequest('ID inválido.')

//       const dbResponse = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...changes } })
//       res.json(dbResponse)
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   }
// }
