import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertCreditCardOptionSchema, TCreditCardOption } from '@/utils/schemas/credit-card-options'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

const getCreditCardOptions: NextApiHandler<{ data: TCreditCardOption | TCreditCardOption[] }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db: Db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const collection: Collection<TCreditCardOption> = db.collection('opcoes-cartoes-credito')

  const { id } = req.query
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const option = await collection.findOne({ _id: new ObjectId(id) })
    if (!option) throw new createHttpError.NotFound('Opção de cartão de crédito não encontrada.')

    return res.status(200).json({ data: option })
  }

  const options = await collection.find({}).toArray()

  return res.status(200).json({ data: options })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createCreditCardOptionRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db: Db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const collection: Collection<TCreditCardOption> = db.collection('opcoes-cartoes-credito')

  const option = InsertCreditCardOptionSchema.parse(req.body)

  const insertResponse = await collection.insertOne(option)
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao criar opção de cartão de crédito.')
  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Opção de cartão de crédito criada com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}
const updateCreditCardOptionRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db: Db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const collection: Collection<TCreditCardOption> = db.collection('opcoes-cartoes-credito')

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = InsertCreditCardOptionSchema.partial().parse(req.body)

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  if (!updateResponse.acknowledged)
    throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar opção de cartão de crédito.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound('Opção de cartão de crédito não encontrada.')

  return res
    .status(201)
    .json({ data: 'Opção de cartão de crédito atualizada com sucesso !', message: 'Opção de cartão de crédito atualizada com sucesso !' })
}

export default apiHandler({ GET: getCreditCardOptions, POST: createCreditCardOptionRoute, PUT: updateCreditCardOptionRoute })
