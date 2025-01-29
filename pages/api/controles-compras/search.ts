import { getPurchaseControlsByFilter } from '@/repositories/purchase-controls/queries'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { PurchaseControlsQueryFiltersSchema, TPurchaseControl, TPurchaseControlSimplifiedDTO } from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Db, Filter } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export type TPurchaseControlsByFiltersResult = {
  purchaseControls: TPurchaseControlSimplifiedDTO[]
  purchaseControlsMatched: number
  totalPages: number
}
const QueryParamsSchema = z.object({
  page: z.string({ required_error: 'Parâmetro de páginação não informado.' }),
})
const getPurchasesControlsBySearchRoute: NextApiHandler<{ data: TPurchaseControlsByFiltersResult }> = async (req, res) => {
  const PAGE_SIZE = 50

  const { page } = QueryParamsSchema.parse(req.query)

  const { title, supplier, carrier, period, tags, pendingOrder, pendingDelivery } = PurchaseControlsQueryFiltersSchema.parse(req.body)
  const session = await validateAuthenticationWithSession(req, res)

  // Validating page parameter
  if (!page || isNaN(Number(page))) throw new createHttpError.BadRequest('Parâmetro de paginação inválido ou não informado.')

  const andFiltersArr: Filter<TPurchaseControl>[] = []
  const searchFiltersArr: Filter<TPurchaseControl>[] = []
  if (title.trim().length > 0) {
    searchFiltersArr.push({ $or: [{ titulo: { $regex: title, $options: 'i' } }, { titulo: title }] })
  }
  if (supplier.trim().length > 0) {
    searchFiltersArr.push({ $or: [{ 'fornecedor.nome': { $regex: supplier, $options: 'i' } }, { 'fornecedor.nome': supplier }] })
  }
  if (carrier.trim().length > 0) {
    searchFiltersArr.push({
      $or: [{ 'transporte.transportadora.nome': { $regex: carrier, $options: 'i' } }, { 'transporte.transportadora.nome': carrier }],
    })
  }
  if (period.type && period.after && period.before) {
    andFiltersArr.push({ [period.type]: { $gte: period.after, $lte: period.before } })
  }
  if (tags.length > 0) {
    andFiltersArr.push({ 'etiquetas.id': { $in: tags } })
  }
  if (pendingOrder) {
    andFiltersArr.push({ dataPedido: null })
  }

  if (pendingDelivery) {
    andFiltersArr.push({ 'entrega.dataEfetivacao': null })
  }

  const andFilters = andFiltersArr.reduce((acc, current) => ({ ...acc, ...current }), {})
  const orFilters = searchFiltersArr.length > 0 ? { $and: searchFiltersArr } : {}

  const queryFilters: Filter<TPurchaseControl> = { ...andFilters, ...orFilters }

  const skip = PAGE_SIZE * (Number(page) - 1)
  const limit = PAGE_SIZE

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const { purchaseControls, purchaseControlsMatched } = await getPurchaseControlsByFilter({ collection, query: queryFilters, skip, limit })
  const totalPages = Math.ceil(purchaseControlsMatched / PAGE_SIZE)

  return res.status(200).json({ data: { purchaseControls, purchaseControlsMatched, totalPages } })
}

export default apiHandler({ POST: getPurchasesControlsBySearchRoute })
