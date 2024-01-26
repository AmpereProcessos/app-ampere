import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertNewWarehouseFormularySchema, TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import connectToDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TNewWarehouseFormulary | TNewWarehouseFormulary[]
}
const getForms: NextApiHandler<GetResponse> = async (req, res) => {
  const session = validateAuthenticationWithSession(req, res)
  const { id, after, before } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TNewWarehouseFormulary> = db.collection('formularios')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const form = await collection.findOne({ _id: new ObjectId(id) })
    if (!form) throw new createHttpError.NotFound('Formulário não encontrado.')
    return res.status(200).json({ data: form })
  }

  if (typeof after != 'string' || typeof before != 'string') throw new createHttpError.BadRequest('Parâmetros de período inválidos.')

  const forms = await collection
    .find({ $and: [{ dataInsercao: { $gte: after } }, { dataInsercao: { $lte: before } }] })
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
  const collection: Collection<TNewWarehouseFormulary> = db.collection('formularios')
  const form = InsertNewWarehouseFormularySchema.parse(req.body)
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
  const collection: Collection<TNewWarehouseFormulary> = db.collection('formularios')

  const changes = InsertNewWarehouseFormularySchema.partial().parse(req.body)

  const updateResponse = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ...changes,
      },
    }
  )

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na atualização do formulário.')

  return res.status(201).json({ data: 'Formulário atualizado com sucesso!', message: 'Formulário atualizado com sucesso!' })
}
export default apiHandler({ GET: getForms, POST: createForm, PUT: editForm })
