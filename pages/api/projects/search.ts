import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { formatDateQuery } from '@/utils/methods/dates'
import { PersonalizedFiltersSchema, ProjectDBSimplifiedProjection, TProject, TProjectDTODBSimplified } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export type TProjectsByFiltersResult = {
  projects: TProjectDTODBSimplified[]
  projectsMatched: number
  totalPages: number
}

type PostResponse = {
  data: TProjectsByFiltersResult
}

const QuerySchema = z.object({
  page: z.string({ required_error: 'Parâmetro de páginação não informado.' }),
})
const getProjectsByPersonalizedFilters: NextApiHandler<PostResponse> = async (req, res) => {
  const PAGE_SIZE = 200
  const session = await validateAuthenticationWithSession(req, res)
  const { page } = QuerySchema.parse(req.query)
  const filters = PersonalizedFiltersSchema.parse(req.body)

  // Validating page parameter
  if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest('Parâmetro de paginação inválido ou não informado.')

  // Defining the queries
  const nameQuery: Filter<TProject> =
    filters.name.trim().length > 0 ? { $or: [{ nomeDoContrato: { $regex: filters.name, $options: 'i' } }, { nomeDoContrato: filters.name }] } : {}
  const dateQuery: Filter<TProject> =
    filters.period.after && filters.period.before && filters.period.field
      ? {
          $and: [
            { [filters.period.field]: { $gte: formatDateQuery(filters.period.after, 'start') } },
            { [filters.period.field]: { $lte: formatDateQuery(filters.period.before, 'end') } },
          ],
        }
      : {}
  const stateQuery: Filter<TProject> = filters.state.length > 0 ? { uf: { $in: filters.state } } : {}
  const cityQuery: Filter<TProject> = filters.city.length > 0 ? { cidade: { $in: filters.city } } : {}
  const serviceTypeQuery: Filter<TProject> = filters.serviceType.length > 0 ? { tipoDeServico: { $in: filters.serviceType } } : {}
  const sellerQuery: Filter<TProject> = filters.seller.length > 0 ? { 'vendedor.nome': { $in: filters.seller } } : {}
  const insiderQuery: Filter<TProject> = filters.insider.length > 0 ? { insider: { $in: filters.insider } } : {}
  const technicalTeamQuery: Filter<TProject> = filters.technicalTeam.length > 0 ? { 'obra.equipeResp': { $in: filters.technicalTeam } } : {}
  const acquisitionChannelQuery: Filter<TProject> = filters.acquisitionChannel.length > 0 ? { canalVenda: { $in: filters.acquisitionChannel } } : {}
  const modulesQtyQuery: Filter<TProject> =
    filters.modulesQty.greater != null && filters.modulesQty.less != null
      ? { $and: [{ 'sistema.qtdeModulos': { $gte: filters.modulesQty.greater } }, { 'sistema.qtdeModulos': { $lte: filters.modulesQty.less } }] }
      : {}
  const query = {
    ...nameQuery,
    ...dateQuery,
    ...stateQuery,
    ...cityQuery,
    ...serviceTypeQuery,
    ...sellerQuery,
    ...insiderQuery,
    ...technicalTeamQuery,
    ...acquisitionChannelQuery,
    ...modulesQtyQuery,
  }
  console.log(query)
  const skip = PAGE_SIZE * (Number(page) - 1)
  const limit = PAGE_SIZE

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')

  const { projects, projectsMatched } = await getProjectsByFilter({ collection, query, skip, limit })
  const totalPages = Math.round(projectsMatched / PAGE_SIZE)

  return res.status(200).json({ data: { projects, projectsMatched, totalPages } })
}

export default apiHandler({ POST: getProjectsByPersonalizedFilters })

type GetProjectsByFilterParams = {
  collection: Collection<TProject>
  query: Filter<TProject>
  skip: number
  limit: number
}
async function getProjectsByFilter({ collection, query, skip, limit }: GetProjectsByFilterParams) {
  try {
    const projectsMatched = await collection.countDocuments({ ...query })
    const sort = { qtde: -1 }
    const match = { ...query }
    const projects = await collection
      .aggregate([{ $sort: sort }, { $match: match }, { $skip: skip }, { $project: ProjectDBSimplifiedProjection }, { $limit: limit }])
      .toArray()
    return { projects, projectsMatched } as { projects: WithId<TProjectDTODBSimplified>[]; projectsMatched: number }
  } catch (error) {
    throw error
  }
}
