import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TTechnicalAnalysis } from '@/utils/schemas/technical-analysis'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TTechnicalAnalysis | TTechnicalAnalysis[]
}

const getTechnicalAnalysis: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  console.log(id)
  const db = await connectToCRMDatabase(process.env.CRM_KEY)
  const collection: Collection<TTechnicalAnalysis> = db.collection('technical-analysis')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const analysis = await collection.findOne({ _id: new ObjectId(id) })
    if (!analysis) throw new createHttpError.NotFound('Análise não encontrada.')
    return res.status(200).json({ data: analysis })
  }

  const allAnalysis = await collection.find({}).toArray()

  return res.status(200).json({ data: allAnalysis })
}

export default apiHandler({ GET: getTechnicalAnalysis })
