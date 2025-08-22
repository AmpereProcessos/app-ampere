import { NextApiHandler } from 'next'
import connectToDatabase from '../../../../utils/services/mongodb/projects'

import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import type { TAuthSession } from '@/lib/authentication/types'
import { TProject } from '@/utils/schemas/projects'
import { Collection, Db } from 'mongodb'
import { formatDecimalPlaces } from '@/utils/constants'
import { z } from 'zod'
import createHttpError from 'http-errors'
import { TSaleGraphStat } from '@/utils/schemas/stats'
import { getGenFactorByOrientation } from '@/utils/methods/shared'

function getQueryByVisualization(session: TAuthSession) {
  const visualization = session.user.visualizacao.tipo
  const seller = session.user.visualizacao.referencia

  if (visualization == 'VENDAS') return { 'vendedor.nome': seller }
  return {}
}

type GetResponse = TSaleGraphStat[]
const getYearlyStats: NextApiHandler<GetResponse> = async (req, res) => {
  const { year } = req.query
  if (!year) throw new createHttpError.BadRequest('Ano de referência não informado.')
  const queryYear = z
    .number({ required_error: 'Ano de referência não informado.', invalid_type_error: 'Tipo não válido para o ano de referência.' })
    .parse(Number(year))

  const session = await validateAuthenticationWithSession(req, res)

  const partialQuery = getQueryByVisualization(session)

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TProject> = db.collection('dados')
  const graphData = await getGraphData({ collection: collection, partialQuery: partialQuery, year: queryYear })

  res.status(200).json(graphData)
}
type GetStats = {
  collection: Collection<TProject>
  partialQuery: any
  year: number
}
async function getGraphData({ collection, partialQuery, year }: GetStats) {
  try {
    const stats = await collection
      .aggregate([
        {
          $match: {
            ...partialQuery,
            'contrato.status': 'ASSINADO',
            'contrato.dataAssinatura': { $ne: '-' },
            tipoDeServico: {
              $nin: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
            },
          },
        },
        {
          $group: {
            _id: {
              ano: {
                $year: {
                  $dateFromString: { dateString: '$contrato.dataAssinatura' },
                },
              },
              mes: {
                $month: {
                  $dateFromString: { dateString: '$contrato.dataAssinatura' },
                },
              },
            },
            total: {
              $sum: '$sistema.potPico',
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            '_id.ano': 1,
            '_id.mes': 1,
          },
        },
        {
          $match: {
            '_id.ano': Number(year),
          },
        },
      ])
      .toArray()

    const graphData = stats.map((info) => {
      return {
        IDENTIFICADOR: info._id.mes >= 10 ? `${info._id.mes}/${info._id.ano}` : `0${info._id.mes}/${info._id.ano}`,
        VALOR: Number(Number(info.total).toFixed(2)),
      }
    })
    return graphData
  } catch (error) {
    throw error
  }
}

export default apiHandler({ GET: getYearlyStats })
