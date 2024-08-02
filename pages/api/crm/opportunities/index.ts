import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertOpportunitySchema, TOpportunity } from '@/utils/schemas/crm/opportunity.schema'

import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type PutResponse = {
  data: string
  message: string
}

const updateOpportunity: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  // const changes = InsertOpportunitySchema.partial().parse(req.body)
  const changes = req.body

  const db = await connectToCRMDatabase(process.env.CRM_KEY)
  const collection: Collection<TOpportunity> = db.collection('opportunities')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar oportunidade.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound('Oportunidade não encontrada.')

  return res.status(200).json({ data: 'Oportunidade atualizada com sucesso !', message: 'Oportunidade atualizada com sucesso !' })
}

export default apiHandler({ PUT: updateOpportunity })
