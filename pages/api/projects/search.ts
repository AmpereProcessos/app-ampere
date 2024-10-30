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
  const nameQuery: Filter<TProject> | null =
    filters.name.trim().length > 0 ? { $or: [{ nomeDoContrato: { $regex: filters.name, $options: 'i' } }, { nomeDoContrato: filters.name }] } : null
  const payerNameQuery: Filter<TProject> | null =
    filters.payerName.trim().length > 0
      ? { $or: [{ 'pagamento.pagador': { $regex: filters.payerName, $options: 'i' } }, { 'pagamento.pagador': filters.payerName }] }
      : null
  const dateQuery: Filter<TProject> | null =
    filters.period.after && filters.period.before && filters.period.field
      ? {
          [filters.period.field]: { $gte: formatDateQuery(filters.period.after, 'start'), $lte: formatDateQuery(filters.period.before, 'end') },
        }
      : null
  const stateQuery: Filter<TProject> | null = filters.state.length > 0 ? { uf: { $in: filters.state } } : null
  const cityQuery: Filter<TProject> | null = filters.city.length > 0 ? { cidade: { $in: filters.city } } : null
  const neighborhoodQuery: Filter<TProject> | null =
    filters.neighborhood.trim().length > 0
      ? { $or: [{ bairro: { $regex: filters.neighborhood, $options: 'i' } }, { bairro: filters.neighborhood }] }
      : null
  const addressQuery: Filter<TProject> | null =
    filters.address.trim().length > 0 ? { $or: [{ logradouro: { $regex: filters.address, $options: 'i' } }, { logradouro: filters.address }] } : null
  const serviceTypeQuery: Filter<TProject> | null = filters.serviceType.length > 0 ? { tipoDeServico: { $in: filters.serviceType } } : null
  const sellerQuery: Filter<TProject> | null = filters.seller.length > 0 ? { 'vendedor.nome': { $in: filters.seller } } : null
  const insiderQuery: Filter<TProject> | null = filters.insider.length > 0 ? { insider: { $in: filters.insider } } : null
  const technicalTeamQuery: Filter<TProject> | null = filters.technicalTeam.length > 0 ? { 'obra.equipeResp': { $in: filters.technicalTeam } } : null
  const acquisitionChannelQuery: Filter<TProject> | null =
    filters.acquisitionChannel.length > 0 ? { canalVenda: { $in: filters.acquisitionChannel } } : null
  const modulesQtyQuery: Filter<TProject> | null =
    filters.modulesQty.greater != null && filters.modulesQty.less != null
      ? { 'sistema.qtdeModulos': { $gte: filters.modulesQty.greater, $lte: filters.modulesQty.less } }
      : null

  const andQuery = [
    nameQuery,
    payerNameQuery,
    dateQuery,
    stateQuery,
    cityQuery,
    neighborhoodQuery,
    addressQuery,
    serviceTypeQuery,
    sellerQuery,
    insiderQuery,
    technicalTeamQuery,
    acquisitionChannelQuery,
    modulesQtyQuery,
  ].filter((q) => !!q)

  const query = andQuery.length > 0 ? { $and: andQuery } : {}
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
