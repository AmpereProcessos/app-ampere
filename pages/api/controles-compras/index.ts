import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import {
  GeneralPurchaseControlSchema,
  PurchaseControlKanbanSimplifiedProjection,
  PurchaseControlSimplifiedProjection,
  TPurchaseControl,
  TPurchaseControlDTO,
} from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TPurchaseControl | TPurchaseControl[]
}
const getPurchasesControlsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const purchaseControl = await collection.findOne({ _id: new ObjectId(id) })
    if (!purchaseControl) throw new createHttpError.NotFound('Controle de compra não encontrado.')
    return res.status(200).json({ data: purchaseControl })
  }

  const purchaseControls = await collection
    .find(
      {},
      {
        projection: PurchaseControlKanbanSimplifiedProjection,
      }
    )
    .toArray()

  return res.status(200).json({ data: purchaseControls })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createPurchaseControlRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const purchaseControl = GeneralPurchaseControlSchema.parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const insertResponse = await collection.insertOne(purchaseControl)
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao inserir controle de compra.')
  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Controle de compra criado com sucesso !' })
}

type PutResponse = {
  message: string
}
const updatePurchaseControlRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = GeneralPurchaseControlSchema.partial().parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar controle de compra.')

  return res.status(201).json({ message: 'Controle de compras atualizado com sucesso !' })
}

export default apiHandler({ GET: getPurchasesControlsRoute, POST: createPurchaseControlRoute, PUT: updatePurchaseControlRoute })
