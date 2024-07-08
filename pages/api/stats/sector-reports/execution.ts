import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TProject } from '@/utils/schemas/projects'
import { TServiceOrder } from '@/utils/schemas/service-order'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Db } from 'mongodb'
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

export default apiHandler({ GET: getExecutionSectorStatsRoute })
