import { getTechnicalAnalysis } from '@/repositories/technical-analysis/queries'
import { getLeadReceivers, getOpportunityCreators, getTechnicalAnalysts } from '@/repositories/crm-users/queries'

import { Collection, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import technicalAnalysis from '../technical-analysis'
import { TUser, TUserDTOSimplified } from '@/utils/schemas/crm/users.schema'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'

type GetResponse = {
  data: WithId<TUserDTOSimplified>[]
}
const PersonalizedQueryTypes = [
  'user-creators',
  'opportunity-creators',
  'client-creators',
  'kit-creators',
  'proposal-creators',
  'price-editors',
  'technical-analysts',
  'lead-receivers',
] as const

const getUsersPersonalized: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const type = z
    .enum(PersonalizedQueryTypes, { invalid_type_error: 'Tipo inválido para tipo de usuários.', required_error: 'Tipo de usuários não definido.' })
    .parse(req.query.type)

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const usersCollection: Collection<TUser> = db.collection('users')

  if (type == 'opportunity-creators') {
    const creators = await getOpportunityCreators({ collection: usersCollection, query: {} })
    return res.status(200).json({ data: creators })
  }
  if (type == 'technical-analysts') {
    const analysts = await getTechnicalAnalysts({ collection: usersCollection, query: {} })
    return res.status(200).json({ data: analysts })
  }
  if (type == 'lead-receivers') {
    const receivers = await getLeadReceivers({ collection: usersCollection, query: {} })
    return res.status(200).json({ data: receivers })
  }
  return res.status(200).json({ data: [] })
}
export default apiHandler({
  GET: getUsersPersonalized,
})
