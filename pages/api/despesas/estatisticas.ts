import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { getDayStringsBetweenDates } from '@/utils/methods/dates'
import { TExpense } from '@/utils/schemas/expenses'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import { Collection, Db } from 'mongodb'
import { NextApiHandler } from 'next'

export type TExpenseStatsResult = {
  totalFaturado: number
  totalPago: number
  totalAPagar: number
  totalAPagarHoje: number
  totalAPagarEmAtraso: number
  diario: { dia: string; efetivado: number; esperado: number }[]
}
export type TExpenseStatsReduced = {
  totalFaturado: number
  totalPago: number
  totalAPagar: number
  totalAPagarHoje: number
  totalAPagarEmAtraso: number
  diario: { [key: string]: { efetivado: number; esperado: number } }
}

const getExpenseStatsRoute: NextApiHandler<{ data: TExpenseStatsResult }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const periodStartDate = dayjs().startOf('month').toDate()
  const periodEndDate = dayjs().endOf('month').toDate()
  const periodStartDateStr = periodStartDate.toISOString()
  const periodEndDateStr = periodEndDate.toISOString()

  const datesStrs = getDayStringsBetweenDates({ initialDate: periodStartDateStr, endDate: periodEndDateStr })

  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  const expenses = await getExpenses({ collection, after: periodStartDateStr, before: periodEndDateStr })

  const initialReducedAcc: TExpenseStatsReduced = {
    totalFaturado: 0,
    totalPago: 0,
    totalAPagar: 0,
    totalAPagarHoje: 0,
    totalAPagarEmAtraso: 0,
    diario: datesStrs.reduce((acc: TExpenseStatsReduced['diario'], current) => {
      acc[current] = { esperado: 0, efetivado: 0 }
      return acc
    }, {}),
  }
  const stats = expenses.reduce((acc: TExpenseStatsReduced, current) => {
    const revenueTotal = current.total

    const billingDate = current.efetivacao.data ? new Date(current.efetivacao.data) : null

    const wasBilledWithinPeriod = !!billingDate && billingDate >= periodStartDate && billingDate <= periodEndDate

    if (wasBilledWithinPeriod) acc.totalFaturado += revenueTotal

    current.pagamentos.forEach((fraction) => {
      const fractionValue = fraction.valor || 0

      const fractionPreviewDate = new Date(fraction.dataPrevisaoPagamento)
      const fractionPreviewDay = dayjs(fractionPreviewDate).format('DD/MM')
      const fractionDate = fraction.dataPagamento ? new Date(fraction.dataPagamento) : null
      const fractionReceiptDay = dayjs(fractionDate).format('DD/MM')

      const wasPaidWithinCurrentPeriod = fractionDate && fractionDate >= periodStartDate && fractionDate <= periodEndDate

      if (wasPaidWithinCurrentPeriod) {
        acc.totalPago += fractionValue
        if (acc.diario[fractionReceiptDay]) acc.diario[fractionReceiptDay].efetivado += fractionValue
      } else {
        acc.totalAPagar += fractionValue

        const paymentIsExpectedWithinCurrentPeriod =
          fractionPreviewDate && fractionPreviewDate >= periodStartDate && fractionPreviewDate <= periodEndDate
        const paymentIsForToday = fractionReceiptDay && dayjs(fractionReceiptDay).isSame(new Date(), 'day')
        const paymentIsOverdue = fractionReceiptDay && dayjs(fractionReceiptDay).isBefore(new Date())

        // In case the flag paymentIsForToday is true (for payments due to today), updating the totalToReceiveToday
        if (paymentIsForToday) acc.totalAPagarHoje += fractionValue
        // In case the flag paymentIsOverdue is true (for overdue payments), updating the totalToReceiveDue
        if (paymentIsOverdue) acc.totalAPagarEmAtraso += fractionValue
        // In case the flag receiptIsWithinCurrentPeriod is true (for payments within the period of filter), updating the corresponding
        // day previsto field
        if (paymentIsExpectedWithinCurrentPeriod && !!acc.diario[fractionPreviewDay]) acc.diario[fractionPreviewDay].esperado += fractionValue
      }
    })
    return acc
  }, initialReducedAcc)

  const result: TExpenseStatsResult = {
    ...stats,
    diario: Object.entries(stats.diario).map(([key, value]) => ({ dia: key, ...value })),
  }

  return res.status(200).json({ data: result })
}

export default apiHandler({ GET: getExpenseStatsRoute })

type TExpenseResult = {
  total: TExpense['total']
  efetivacao: TExpense['efetivacao']
  pagamentos: {
    valor: TExpense['pagamentos'][number]['valor']
    dataPrevisaoPagamento: TExpense['pagamentos'][number]['dataPrevisaoPagamento']
    dataPagamento: TExpense['pagamentos'][number]['dataPagamento']
  }[]
}
type GetExpensesParams = {
  collection: Collection<TExpense>
  after: string
  before: string
}
async function getExpenses({ collection, after, before }: GetExpensesParams) {
  try {
    const expenses = (await collection
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
                'pagamentos.0': { $exists: true },
                $or: [
                  { 'pagamentos.dataPrevisaoRecebimento': { $gte: after, $lte: before } },
                  { 'pagamentos.dataRecebimento': { $gte: after, $lte: before } },
                ],
              },
            ],
          },
        },
        {
          $project: {
            total: 1,
            efetivacao: 1,
            'pagamentos.valor': 1,
            'pagamentos.dataPrevisaoRecebimento': 1,
            'pagamentos.dataRecebimento': 1,
          },
        },
      ])
      .toArray()) as TExpenseResult[]

    return expenses
  } catch (error) {
    throw error
  }
}
