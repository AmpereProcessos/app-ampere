import { updateSaleInstallment } from '@/lib/integrations/conta-azul'
import { getContaAzulAccessToken } from '@/repositories/integrations/conta-azul/queries'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TIntegration } from '@/utils/schemas/integrations'
import { RevenueReceiptItemSchema, TReceiptUnwindSimplifiedDTO, TRevenue } from '@/utils/schemas/revenues'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Collection, Filter, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

export const getReceiptsRoute: NextApiHandler<{ data: TReceiptUnwindSimplifiedDTO[] }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const match: Filter<TRevenue> = { 'fracionamento.dataRecebimento': null }
  const unwind = { path: '$fracionamento', includeArrayIndex: 'indexFracionamento', preserveNullAndEmptyArrays: false }
  const sort = { 'fracionamento.dataPrevisaoRecebimento': -1 }
  const projection = { nome: 1, total: 1, metodo: 1, tipo: 1, fracionamento: 1, indexFracionamento: 1 }

  const db = await connectToDatabase()
  const collection: Collection<TRevenue> = db.collection('receitas')

  const receipts = await collection.aggregate([{ $unwind: unwind }, { $match: match }, { $sort: sort }, { $project: projection }]).toArray()

  return res.status(200).json({ data: receipts as TReceiptUnwindSimplifiedDTO[] })
}

const UpdateReceiptPayloadSchema = z.object({
  receiptIndex: z.number({
    required_error: 'Índice do recebimento não informado.',
    invalid_type_error: 'Tipo não válido para o índice do recebimento.',
  }),
  receiptRevenueId: z.string({
    required_error: 'ID da receita não informado.',
    invalid_type_error: 'Tipo não válido para o ID da receita.',
  }),
  receiptChanges: RevenueReceiptItemSchema,
})
export type TUpdateReceiptPayload = z.infer<typeof UpdateReceiptPayloadSchema>
const updateReceiptRoute: NextApiHandler<any> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { receiptIndex, receiptRevenueId, receiptChanges } = UpdateReceiptPayloadSchema.parse(req.body)

  if (!ObjectId.isValid(receiptRevenueId)) throw new createHttpError.BadRequest('ID de receita inválido.')
  const db = await connectToDatabase()
  const collection = db.collection<TRevenue>('receitas')
  const integrationsCollection = db.collection<TIntegration>('integracoes')
  const revenue = await collection.findOne({ _id: new ObjectId(receiptRevenueId) })
  if (!revenue) throw new createHttpError.NotFound('Receita não encontrada.')

  const revenueContaAzulId = revenue.idContaAzulVenda

  const update: { [key: string]: any } = {
    [`fracionamento.${receiptIndex}`]: receiptChanges,
  }
  const updateResponse = await collection.updateOne({ _id: new ObjectId(receiptRevenueId) }, { $set: { ...update } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro na atualização da receita.')

  if (revenueContaAzulId) {
    console.log('UPDATING CONTA AZUL INSTALLMENT')
    const contaAzulAccessToken = await getContaAzulAccessToken({ collection: integrationsCollection })
    await updateSaleInstallment({
      saleId: revenueContaAzulId,
      saleInstallmentIndex: receiptIndex + 1,
      saleInstallmentPaid: !!receiptChanges.dataRecebimento,
      accessToken: contaAzulAccessToken,
    })
  }
  return res.status(200).json({ data: 'Receita atualizada com sucesso !', message: 'Receita atualizada com sucesso !' })
}
export default apiHandler({ GET: getReceiptsRoute, PUT: updateReceiptRoute })
