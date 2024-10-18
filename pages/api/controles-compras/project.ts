import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { PurchaseProjectProjection, TPurchaseProject, TPurchaseProjectDTO } from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TPurchaseProject
}
const getPurchaseControlProjectRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { projectId } = req.query

  if (!projectId || typeof projectId != 'string' || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest('ID inválido.')

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TProject>('dados')

  const project = await collection.findOne(
    { _id: new ObjectId(projectId) },
    {
      projection: PurchaseProjectProjection,
    }
  )
  if (!project) throw new createHttpError.NotFound('Projeto não encontrado.')

  return res.status(200).json({ data: project as TPurchaseProject })
}

export default apiHandler({ GET: getPurchaseControlProjectRoute })
