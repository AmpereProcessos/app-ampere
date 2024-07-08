import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { TServiceOrder } from '@/utils/schemas/service-order'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db, Filter, WithId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = any

const getExecutionSectorStatsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const isAuthorized = session?.user.permissoes.rotas.includes('Obras')
  if (!isAuthorized) throw new createHttpError.Unauthorized('Oops, seu usuário não possui acesso a esse módulo.')

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const projectsCollection: Collection<TProject> = db.collection('dados')
  const serviceOrdersCollection: Collection<TServiceOrder> = db.collection('ordensDeServico')
}

type GetProjectsInPeriodScopeParams = {
  after: string
  before: string
  collection: Collection<TProject>
}
type TExecutionPeriodStatsReduced = {
  iniciados: number
  executados: number
  tempoTotalExecucao: number
  tempoTotalPlanejamento: number
  entregasEfetivadas: number
  entregasPrevistas: number
}
type TWorkableProject = Pick<TProject, 'obra' | 'compra'>
async function getProjectsInPeriodScope({ after, before, collection }: GetProjectsInPeriodScopeParams) {
  try {
    const match: Filter<TProject> = {
      $or: [
        { $and: [{ 'obra.entrada': { $gte: after } }, { 'obra.entrada': { $lte: before } }] },
        { $and: [{ 'obra.saida': { $gte: after } }, { 'obra.saida': { $lte: before } }] },
        { $and: [{ 'compra.previsaoEntrega': { $gte: after } }, { 'compra.previsaoEntrega': { $lte: before } }] },
        { $and: [{ 'compra.dataEntrega': { $gte: after } }, { 'compra.dataEntrega': { $lte: before } }] },
      ],
    }
    const project = { 'obra.entrada': 1, 'obra.saida': 1, 'compra.previsaoEntrega': 1, 'compra.dataEntrega': 1 }

    const projects = (await collection.aggregate([{ $match: match }, { $project: project }]).toArray()) as WithId<TWorkableProject>[]

    const information = projects.reduce(
      (acc: TExecutionPeriodStatsReduced, current) => {
        return acc
      },
      {
        iniciados: 0,
        executados: 0,
        tempoTotalExecucao: 0,
        tempoTotalPlanejamento: 0,
        entregasEfetivadas: 0,
        entregasPrevistas: 0,
      }
    )
  } catch (error) {}
}

export default apiHandler({ GET: getExecutionSectorStatsRoute })
