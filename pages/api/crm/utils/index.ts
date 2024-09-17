import { insertUtil } from '@/repositories/crm-utils/mutations'
import { getCreditors, getEquipments } from '@/repositories/crm-utils/queries'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { GeneralUtilSchema, TUtil, UtilsIdentifierSchema } from '@/utils/schemas/crm/utils'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TUtil[]
}

const getUtilsRelated: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { equipmentCategory } = req.query
  const identifier = UtilsIdentifierSchema.parse(req.query.identifier)

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const collection: Collection<TUtil> = db.collection('utils')
  if (identifier == 'CREDITOR') {
    const creditors = await getCreditors({ collection: collection })
    return res.status(200).json({ data: creditors })
  }

  if (identifier == 'EQUIPMENT') {
    const categoryQuery: Filter<TUtil> =
      equipmentCategory && equipmentCategory != 'null' && equipmentCategory != 'undefined' ? { categoria: equipmentCategory } : {}

    const query = { ...categoryQuery }
    const equipments = await getEquipments({ collection: collection, query: query })
    return res.status(200).json({ data: equipments })
  }
  return res.status(200).json({ data: [] })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createUtil: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const collection: Collection<TUtil> = db.collection('utils')
  const util = GeneralUtilSchema.parse(req.body)

  const insertResponse = await insertUtil({ collection: collection, info: util })
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao inserir personalização.')

  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Personalização criada com sucesso !' })
}

export default apiHandler({ GET: getUtilsRelated, POST: createUtil })
