import { TSolarSystemPropose } from '@/utils/schemas/proposes/solar-system.schema'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import connectToCRMDatabase from '../../../utils/services/mongodb/crm/main'
import { TOpportunity } from '@/utils/schemas/crm-project'
import { apiHandler } from '@/utils/api'

type GetResponse = {
  data: {
    opportunity: TOpportunity | null
    propose: TSolarSystemPropose | null
  }
}

const getReference: NextApiHandler<GetResponse> = async (req, res) => {
  const { proposeId, opportunityId } = req.query
  if (!proposeId || typeof proposeId != 'string' || !ObjectId.isValid(proposeId)) throw new createHttpError.BadRequest('ID de proposta inválido.')
  if (!opportunityId || typeof opportunityId != 'string' || !ObjectId.isValid(opportunityId))
    throw new createHttpError.BadRequest('ID de projeto CRM inválido.')

  const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  const opportunitiesCollection: Collection<TOpportunity> = crmDb.collection('projects')
  const proposesCollection: Collection<TSolarSystemPropose> = crmDb.collection('proposes')

  const propose = await proposesCollection.findOne({ _id: new ObjectId(proposeId) })
  const opportunity = await opportunitiesCollection.findOne({ _id: new ObjectId(opportunityId) })

  return res.status(200).json({ data: { opportunity, propose } })
}

export default apiHandler({ GET: getReference })
