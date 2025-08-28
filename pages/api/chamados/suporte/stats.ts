import { TAuthSession } from '@/lib/authentication/types'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TSupportCall } from '@/utils/schemas/support-calls'
import connectToCallsDatabase from '@/utils/services/mongodb/calls'
import dayjs from 'dayjs'
import { Db } from 'mongodb'
import { NextApiHandler } from 'next'
import z from 'zod'

const SupportCallsStatsInputSchema = z.object({
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

export type TSupportCallsStatsInput = z.infer<typeof SupportCallsStatsInputSchema>

async function getSupportCallsStats({ session, input }: { session: TAuthSession; input: TSupportCallsStatsInput }) {
  const { periodAfter, periodBefore } = input

  const diffInDays = Math.abs(dayjs(periodAfter).diff(dayjs(periodBefore), 'day'))

  const previousPeriodAfter = dayjs(periodAfter).subtract(diffInDays, 'day').toISOString()
  const previousPeriodBefore = dayjs(periodBefore).subtract(diffInDays, 'day').toISOString()

  const callsDb: Db = await connectToCallsDatabase()
  const supportCallsCollection = callsDb.collection<TSupportCall>('suporte')

  const statsResult = (await supportCallsCollection
    .aggregate([
      {
        $group: {
          _id: {},
          total: {
            $count: {},
          },
          totalClosed: {
            $sum: {
              $cond: [{ $ne: ['$fechamento', null] }, 1, 0],
            },
          },
          totalOpen: {
            $sum: {
              $cond: [{ $in: ['$statusChamado', ['ABERTO', 'EM ANDAMENTO']] }, 1, 0],
            },
          },
          openThisPeriod: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$abertura', periodAfter] }, { $lte: ['$fechamento', periodBefore] }],
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
                  $and: [{ $gte: ['$abertura', previousPeriodAfter] }, { $lte: ['$fechamento', previousPeriodBefore] }],
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
  }[]

  const [stats] = statsResult

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
    },
  }
}
export type TSupportCallsStatsOutput = Awaited<ReturnType<typeof getSupportCallsStats>>

const getSupportCallsStatsHandler: NextApiHandler<TSupportCallsStatsOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const input = SupportCallsStatsInputSchema.parse(req.query)
  const stats = await getSupportCallsStats({ session, input })
  res.status(200).json(stats)
}
export default apiHandler({
  GET: getSupportCallsStatsHandler,
})
