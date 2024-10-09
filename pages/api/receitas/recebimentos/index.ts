import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TReceiptUnwindSimplifiedDTO, TRevenue } from '@/utils/schemas/revenues'
import connectToDatabase from '@/utils/services/mongodb/projects'
import { Collection, Filter } from 'mongodb'
import { NextApiHandler } from 'next'

export const getReceiptsRoute: NextApiHandler<{ data: TReceiptUnwindSimplifiedDTO[] }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const match: Filter<TRevenue> = { 'fracionamento.dataRecebimento': null }
  const unwind = { path: '$fracionamento', includeArrayIndex: 'indexFracionamento', preserveNullAndEmptyArrays: false }
  const sort = { 'fracionamento.dataPrevisaoRecebimento': -1 }
  const projection = { nome: 1, total: 1, metodo: 1, tipo: 1, fracionamento: 1, indexFracionamento: 1 }

  const db = await connectToDatabase(process.env.MONGODB_URI, 'projetos')
  const collection: Collection<TRevenue> = db.collection('receitas')

  const receipts = await collection.aggregate([{ $unwind: unwind }, { $match: match }, { $sort: sort }, { $project: projection }]).toArray()

  return res.status(200).json({ data: receipts as TReceiptUnwindSimplifiedDTO[] })
}

export default apiHandler({ GET: getReceiptsRoute })
