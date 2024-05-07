import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProjectUpdateLog } from '@/utils/schemas/project-updates-logs'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TProjectUpdateLog[]
}

const getProjectUpdateLogs: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { projectId } = req.query

  if (!projectId) throw new createHttpError.BadRequest('ID inválido.')

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProjectUpdateLog> = db.collection('logAlteracoes')
  const logs = await collection.find({ idProjetoAlterado: projectId }, { sort: { _id: -1 } }).toArray()

  return res.status(200).json({ data: logs })
}

export default apiHandler({ GET: getProjectUpdateLogs })
