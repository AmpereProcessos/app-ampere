import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TExpense, TPaymentUnwindSimplifiedDTO } from '@/utils/schemas/expenses'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

export const getPaymentsRoute: NextApiHandler<{ data: TPaymentUnwindSimplifiedDTO[] }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const match: Filter<TExpense> = { 'pagamentos.dataPagamento': null }
  const unwind = {
    path: '$pagamentos',
    includeArrayIndex: 'indexPagamento',
    preserveNullAndEmptyArrays: false,
  }
  const sort = { 'pagamentos.dataPrevisaoPagamento': -1 }
  const projection = { rateio: 1, categoria: 1, total: 1, pagamentos: 1, indexPagamento: 1 }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'projetos')
  const collection: Collection<TExpense> = db.collection('despesas')

  const result = await collection.aggregate([{ $unwind: unwind }, { $match: match }, { $sort: sort }, { $project: projection }]).toArray()

  const payments: TPaymentUnwindSimplifiedDTO[] = result.map((r) => ({
    _id: r._id,
    rateio: r.rateio,
    categoria: r.categoria,
    total: r.total,
    pagamento: r.pagamentos,
    indexPagamento: r.indexPagamento,
  }))

  return res.status(200).json({ data: payments })
}

export default apiHandler({ GET: getPaymentsRoute })
