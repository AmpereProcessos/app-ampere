import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { getDayStringsBetweenDates } from '@/utils/methods/dates'
import { TRevenue } from '@/utils/schemas/revenues'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import { Collection, Db } from 'mongodb'
import { NextApiHandler } from 'next'

export type TRevenueStatsResult = {
  totalFaturado: number
  totalRecebido: number
  totalAReceber: number
  totalAReceberHoje: number
  totalAReceberEmAtraso: number
  diario: { dia: string; efetivado: number; esperado: number }[]
}

type TRevenueStatsReduced = {
  totalFaturado: number
  totalRecebido: number
  totalAReceber: number
  totalAReceberHoje: number
  totalAReceberEmAtraso: number
  diario: { [key: string]: { efetivado: number; esperado: number } }
}

const getRevenueStatsRoute: NextApiHandler<{
  data: TRevenueStatsResult
}> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const periodStartDate = dayjs().startOf('month').toDate()
  const periodEndDate = dayjs().endOf('month').toDate()
  const periodStartDateStr = periodStartDate.toISOString()
  const periodEndDateStr = periodEndDate.toISOString()

  const datesStrs = getDayStringsBetweenDates({ initialDate: periodStartDateStr, endDate: periodEndDateStr })

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TRevenue> = db.collection('receitas')

  const revenues = await getRevenues({ collection, after: periodStartDateStr, before: periodEndDateStr })

  const initialReducedAcc: TRevenueStatsReduced = {
    totalFaturado: 0,
    totalRecebido: 0,
    totalAReceber: 0,
    totalAReceberHoje: 0,
    totalAReceberEmAtraso: 0,
    diario: datesStrs.reduce((acc: TRevenueStatsReduced['diario'], current) => {
      acc[current] = { esperado: 0, efetivado: 0 }
      return acc
    }, {}),
  }

  const stats = revenues.reduce((acc: TRevenueStatsReduced, current) => {
    const revenueTotal = current.total

    const billingDate = current.efetivacao.data ? new Date(current.efetivacao.data) : null

    const wasBilledWithinPeriod = !!billingDate && billingDate >= periodStartDate && billingDate <= periodEndDate

    if (wasBilledWithinPeriod) acc.totalFaturado += revenueTotal

    current.fracionamento.forEach((fraction) => {
      const fractionValue = fraction.valor || 0

      const fractionPreviewDate = new Date(fraction.dataPrevisaoRecebimento)
      const fractionPreviewDay = dayjs(fractionPreviewDate).format('DD/MM')
      const fractionDate = fraction.dataRecebimento ? new Date(fraction.dataRecebimento) : null
      const fractionReceiptDay = dayjs(fractionDate).format('DD/MM')

      const wasReceivedWithinCurrentPeriod = fractionDate && fractionDate >= periodStartDate && fractionDate <= periodEndDate

      if (wasReceivedWithinCurrentPeriod) {
        acc.totalRecebido += fractionValue
        if (acc.diario[fractionReceiptDay]) acc.diario[fractionReceiptDay].efetivado += fractionValue
      } else {
        acc.totalAReceber += fractionValue

        const receiptIsExpectedWithinCurrentPeriod =
          fractionPreviewDate && fractionPreviewDate >= periodStartDate && fractionPreviewDate <= periodEndDate
        const receiptIsForToday = fractionReceiptDay && dayjs(fractionReceiptDay).isSame(new Date(), 'day')
        const receiptIsOverdue = fractionReceiptDay && dayjs(fractionReceiptDay).isBefore(new Date())

        // In case the flag receiptIsForToday is true (for receipts due to today), updating the totalToReceiveToday
        if (receiptIsForToday) acc.totalAReceberHoje += fractionValue
        // In case the flag receiptIsOverdue is true (for overdue receipts), updating the totalToReceiveDue
        if (receiptIsOverdue) acc.totalAReceberEmAtraso += fractionValue
        // In case the flag receiptIsWithinCurrentPeriod is true (for receipts within the period of filter), updating the corresponding
        // day previsto field
        if (receiptIsExpectedWithinCurrentPeriod && !!acc.diario[fractionPreviewDay]) acc.diario[fractionPreviewDay].esperado += fractionValue
      }
    })
    return acc
  }, initialReducedAcc)

  const result: TRevenueStatsResult = {
    ...stats,
    diario: Object.entries(stats.diario).map(([key, value]) => ({ dia: key, ...value })),
  }

  return res.status(200).json({ data: result })
}

export default apiHandler({ GET: getRevenueStatsRoute })
type TRevenueResult = {
  total: TRevenue['total']
  efetivacao: TRevenue['efetivacao']
  fracionamento: {
    valor: TRevenue['fracionamento'][number]['valor']
    dataPrevisaoRecebimento: TRevenue['fracionamento'][number]['dataPrevisaoRecebimento']
    dataRecebimento: TRevenue['fracionamento'][number]['dataRecebimento']
  }[]
}
type GetRevenuesParams = {
  collection: Collection<TRevenue>
  after: string
  before: string
}
async function getRevenues({ collection, after, before }: GetRevenuesParams) {
  try {
    const revenues = (await collection
      .aggregate([
        {
          $match: {
            $or: [
              {
                'efetivacao.data': {
                  $gte: after,
                  $lte: before,
                },
              },
              {
                'fracionamento.0': { $exists: true },
                $or: [
                  { 'fracionamento.dataPrevisaoRecebimento': { $gte: after, $lte: before } },
                  { 'fracionamento.dataRecebimento': { $gte: after, $lte: before } },
                ],
              },
            ],
          },
        },
        {
          $project: {
            total: 1,
            efetivacao: 1,
            'fracionamento.valor': 1,
            'fracionamento.dataPrevisaoRecebimento': 1,
            'fracionamento.dataRecebimento': 1,
          },
        },
      ])
      .toArray()) as TRevenueResult[]

    return revenues
  } catch (error) {
    throw error
  }
}
