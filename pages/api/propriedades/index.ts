import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertPropertySchema, TProperty } from '@/utils/schemas/properties'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TProperty | TProperty[]
}
const getProperties: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const { id } = req.query

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const propertiesCollection: Collection<TProperty> = db.collection('propriedades')
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const property = await propertiesCollection.findOne({ _id: new ObjectId(id) })
    if (!property) throw new createHttpError.NotFound('Propriedade não encontrada.')
    return res.status(200).json({ data: property })
  }

  const properties = await propertiesCollection.find({}).toArray()

  return res.status(200).json({ data: properties })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}
const createProperty: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  if (!session.user.permissoes.recursosHumanos.editar) throw new createHttpError.BadRequest('Usuário não autorizado a cadastrar propriedades.')

  const property = InsertPropertySchema.parse(req.body)

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const propertiesCollection: Collection<TProperty> = db.collection('propriedades')

  const insertResponse = await propertiesCollection.insertOne(property)

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao cadastrar propriedade.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Propriedade cadastrada com sucesso !.' })
}

type PutResponse = {
  data: string
  message: string
}

const updateProperty: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  if (!session.user.permissoes.recursosHumanos.editar) throw new createHttpError.BadRequest('Usuário não autorizado a editar propriedades.')

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
  const changes = InsertPropertySchema.partial().parse(req.body)

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const propertiesCollection: Collection<TProperty> = db.collection('propriedades')

  const updateResponse = await propertiesCollection.updateOne({ _id: new ObjectId(id) }, { $set: changes })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar propriedade.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.InternalServerError('Nenhuma propriedade encontrada para atualização.')

  return res.status(200).json({ data: 'Propriedade atualizada com sucesso !', message: 'Propriedade atualizada com sucesso !' })
}

export default apiHandler({
  GET: getProperties,
  POST: createProperty,
  PUT: updateProperty,
})
