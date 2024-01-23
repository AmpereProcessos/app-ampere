import { Collection, Db, ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { TWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'

type GetResponse = {
  data: TWarehouseFormulary | TWarehouseFormulary[]
}
const getForms: NextApiHandler<GetResponse> = async (req, res) => {
  const session = validateAuthenticationWithSession(req, res)
  const { id, after, before } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TWarehouseFormulary> = db.collection('formularios')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const form = await collection.findOne({ _id: new ObjectId(id) })
    if (!form) throw new createHttpError.NotFound('Formulário não encontrado.')
    return res.status(200).json({ data: form })
  }

  if (typeof after != 'string' || typeof before != 'string') throw new createHttpError.BadRequest('Parâmetros de período inválidos.')

  const forms = await collection
    .find({ $and: [{ abertura: { $gte: after } }, { abertura: { $lte: before } }] })
    .sort({ _id: -1 })
    .toArray()
  return res.status(200).json({ data: forms })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createForm: NextApiHandler<PostResponse> = async (req, res) => {
  const session = validateAuthenticationWithSession(req, res)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TWarehouseFormulary> = db.collection('formularios')
  const form = req.body
  if (!form) throw new createHttpError.BadRequest('Informações para a criação formulário não fornecidas.')

  const insertResponse = await collection.insertOne(form)

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na inserção do formulário.')
  return res.status(201).json({ data: { insertedId: insertResponse.insertedId.toString() }, message: 'Formulário criado com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}
const editForm: NextApiHandler<PutResponse> = async (req, res) => {
  const session = validateAuthenticationWithSession(req, res)
  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TWarehouseFormulary> = db.collection('formularios')

  const changes = req.body.data

  delete changes._id
  const updateResponse = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ...req.body.data,
      },
    }
  )

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na atualização do formulário.')

  return res.status(201).json({ data: 'Formulário atualizado com sucesso!', message: 'Formulário atualizado com sucesso!' })
}

export default apiHandler({
  GET: getForms,
  POST: createForm,
  PUT: editForm,
})
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const db = await connectToDatabase(process.env.DB_KEY)
//     const collection = db.collection('formularios')
//     let obj = await collection.insertOne({ ...req.body })
//     res.json(obj)
//   } else if (req.method === 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY)
//     const collection = db.collection('formularios')
//     var { page, limit } = req.query
//     limit = !isNaN(limit) ? Number(Number(limit).toFixed(0)) : 200
//     const skip = limit ? (page - 1) * limit : (page - 1) * 200
//     try {
//       if (!page || page <= 0) throw new createHttpError.BadRequest('Página não especificada ou inválida.')
//       const forms = await collection
//         .aggregate([
//           {
//             $sort: {
//               _id: -1,
//             },
//           },
//           {
//             $skip: skip,
//           },
//           {
//             $limit: limit,
//           },
//         ])
//         .toArray()

//       res.status(200).json(forms)
//     } catch (error) {
//       errorHandler(error, res)
//     }
//   } else if (req.method === 'PUT') {
//     const db = await connectToDatabase(process.env.DB_KEY)
//     const collection = db.collection('formularios')
//     const changes = req.body.data
//     console.log(changes)
//     delete changes._id
//     await collection.updateOne(
//       {
//         _id: ObjectId(req.body.id),
//       },
//       {
//         $set: {
//           ...req.body.data,
//         },
//       }
//     )
//     res.json('UEPA')
//   }
// }
