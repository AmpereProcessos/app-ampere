import { TAuthSession } from '@/lib/authentication/types'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TEngineeringCall } from '@/utils/schemas/engineering-calls'
import connectToCallsDatabase from '@/utils/services/mongodb/calls'
import dayjs from 'dayjs'
import { Db } from 'mongodb'
import { NextApiHandler } from 'next'
import z from 'zod'

const EngineeringCallsStatsInputSchema = z.object({
  periodAfter: z
    .string({
      required_error: 'Data de início é obrigatória',
    })
    .datetime({
      message: 'Data de início inválida',
    }),
  periodBefore: z
    .string({
      required_error: 'Data de fim é obrigatória',
    })
    .datetime({
      message: 'Data de fim inválida',
    }),
})

export type TEngineeringCallsStatsInput = z.infer<typeof EngineeringCallsStatsInputSchema>

async function getEngineeringCallsStats({ session, input }: { session: TAuthSession; input: TEngineeringCallsStatsInput }) {
  const { periodAfter, periodBefore } = input

  const diffInDays = Math.abs(dayjs(periodAfter).diff(dayjs(periodBefore), 'day'))

  const previousPeriodAfter = dayjs(periodAfter).subtract(diffInDays, 'day').toISOString()
  const previousPeriodBefore = dayjs(periodBefore).subtract(diffInDays, 'day').toISOString()

  const callsDb: Db = await connectToCallsDatabase()
  const engineeringCallsCollection = callsDb.collection<TEngineeringCall>('projetos')

  const statsResult = (await engineeringCallsCollection
    .aggregate([
      {
        $group: {
          _id: {},
          total: {
            $count: {},
          },
          totalClosed: {
            $sum: {
              $cond: [{ $in: ['$status', ['FINALIZADO']] }, 1, 0],
            },
          },
          totalOpen: {
            $sum: {
              $cond: [{ $in: ['$status', ['PENDENTE', 'EM ANDAMENTO', 'AGUARDANDO CONCESSIONÁRIA']] }, 1, 0],
            },
          },
          openThisPeriod: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$abertura', periodAfter] }, { $lte: ['$abertura', periodBefore] }],
                },
                1,
                0,
              ],
            },
          },
          openPreviousPeriod: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$abertura', previousPeriodAfter] }, { $lte: ['$abertura', previousPeriodBefore] }],
                },
                1,
                0,
              ],
            },
          },
          closedThisPeriod: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$fechamento', periodAfter] }, { $lte: ['$fechamento', periodBefore] }],
                },
                1,
                0,
              ],
            },
          },
          closedPreviousPeriod: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$fechamento', previousPeriodAfter] }, { $lte: ['$fechamento', previousPeriodBefore] }],
                },
                1,
                0,
              ],
            },
          },
          avgTimeToCloseThisPeriod: {
            $avg: {
              $cond: [
                {
                  $and: [{ $gte: ['$fechamento', periodAfter] }, { $lte: ['$fechamento', periodBefore] }],
                },
                {
                  $dateDiff: {
                    startDate: {
                      $dateFromString: {
                        dateString: '$abertura',
                      },
                    },
                    endDate: {
                      $dateFromString: {
                        dateString: '$fechamento',
                      },
                    },
                    unit: 'hour',
                  },
                },
                '-', // non-numerical to force avg to ignore
              ],
            },
          },
          avgTimeToClosePreviousPeriod: {
            $avg: {
              $cond: [
                {
                  $and: [{ $gte: ['$fechamento', previousPeriodAfter] }, { $lte: ['$fechamento', previousPeriodBefore] }],
                },
                {
                  $dateDiff: {
                    startDate: {
                      $dateFromString: {
                        dateString: '$abertura',
                      },
                    },
                    endDate: {
                      $dateFromString: {
                        dateString: '$fechamento',
                      },
                    },
                    unit: 'hour',
                  },
                },
                '-', // non-numerical to force avg to ignore
              ],
            },
          },
          // Engineering-specific metrics
          totalByType: {
            $push: '$tipoDoChamado',
          },
          totalByProject: {
            $push: '$projeto',
          },
          totalByResponsible: {
            $push: '$responsavel',
          },
        },
      },
    ])
    .toArray()) as {
    _id: null
    total: number
    totalClosed: number
    totalOpen: number
    openThisPeriod: number
    openPreviousPeriod: number
    closedThisPeriod: number
    closedPreviousPeriod: number
    avgTimeToCloseThisPeriod: number
    avgTimeToClosePreviousPeriod: number
    totalByType: string[]
    totalByProject: string[]
    totalByResponsible: string[]
  }[]

  const [stats] = statsResult

  // Calculate type distribution
  //   const typeDistribution = stats.totalByType.reduce(
  //     (acc, type) => {
  //       acc[type] = (acc[type] || 0) + 1
  //       return acc
  //     },
  //     {} as Record<string, number>
  //   )

  //   // Calculate project distribution
  //   const projectDistribution = stats.totalByProject.reduce(
  //     (acc, project) => {
  //       acc[project] = (acc[project] || 0) + 1
  //       return acc
  //     },
  //     {} as Record<string, number>
  //   )

  //   // Calculate responsible distribution
  //   const responsibleDistribution = stats.totalByResponsible.reduce(
  //     (acc, responsible) => {
  //       acc[responsible] = (acc[responsible] || 0) + 1
  //       return acc
  //     },
  //     {} as Record<string, number>
  //   )

  return {
    data: {
      total: stats.total,
      totalFechados: stats.totalClosed,
      totalAbertos: stats.totalOpen,
      abertos: {
        atual: stats.openThisPeriod,
        anterior: stats.openPreviousPeriod,
      },
      fechados: {
        atual: stats.closedThisPeriod,
        anterior: stats.closedPreviousPeriod,
      },
      tempoMedioFechamento: {
        atual: stats.avgTimeToCloseThisPeriod,
        anterior: stats.avgTimeToClosePreviousPeriod,
      },
      // Engineering-specific stats
      //   distribuicaoPorTipo: typeDistribution,
      //   distribuicaoPorProjeto: projectDistribution,
      //   distribuicaoPorResponsavel: responsibleDistribution,
    },
  }
}
export type TEngineeringCallsStatsOutput = Awaited<ReturnType<typeof getEngineeringCallsStats>>

const getEngineeringCallsStatsHandler: NextApiHandler<TEngineeringCallsStatsOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const input = EngineeringCallsStatsInputSchema.parse(req.query)
  const stats = await getEngineeringCallsStats({ session, input })
  res.status(200).json(stats)
}
export default apiHandler({
  GET: getEngineeringCallsStatsHandler,
})
