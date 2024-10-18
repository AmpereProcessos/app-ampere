import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { ProjectDBSimplifiedProjection, QueryVinculationProjectsFiltersSchema, TProject, TProjectDBSimplified } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Db, Filter } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

type PostResponse = {
  data: TProjectDBSimplified[]
}
const getProjectsVinculationsBySearch: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { search } = QueryVinculationProjectsFiltersSchema.parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TProject>('dados')

  const query: Filter<TProject> = {
    $or: [{ nomeDoContrato: search }, { nomeDoContrato: { $regex: search, $options: 'i' } }],
  }
  const projects = await collection.find(query, { projection: ProjectDBSimplifiedProjection }).toArray()

  return res.status(200).json({ data: projects })
}

export default apiHandler({ POST: getProjectsVinculationsBySearch })
