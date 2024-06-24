import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { PartnerSimplifiedProject, TPartner } from '@/utils/schemas/crm/partner.schema'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TPartner | TPartner[]
}
const getPartners: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const db = await connectToCRMDatabase(process.env.CRM_KEY)
  const collection: Collection<TPartner> = db.collection('partners')

  const partners = await collection.find({}, { projection: PartnerSimplifiedProject }).toArray()

  return res.status(200).json({ data: partners })
}

export default apiHandler({ GET: getPartners })
