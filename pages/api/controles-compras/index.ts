import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import {
  GeneralPurchaseControlSchema,
  PurchaseControlKanbanSimplifiedProjection,
  PurchaseControlSimplifiedProjection,
  TPurchaseControl,
  TPurchaseControlDTO,
  TPurchaseControlWithProjectDTO,
} from '@/utils/schemas/purchases'
import connectToDatabase from '@/utils/services/mongodb/projects'
import createHttpError from 'http-errors'
import { Db, Filter, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TPurchaseControlWithProjectDTO | TPurchaseControl[]
}
const getPurchasesControlsRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  console.log(req.query)
  const { id, projectId, queryTags, queryPendingConclusion } = req.query
  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const addFields = { projectIdAsObjectId: { $toObjectId: '$projeto.id' } }
    const lookup = { from: 'dados', localField: 'projectIdAsObjectId', foreignField: '_id', as: 'projetoDados' }
    const purchaseControlArr = await collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $addFields: addFields },
        { $lookup: lookup },
        {
          $project: {
            status: 1,
            titulo: 1,
            anotacoes: 1,
            projeto: 1,
            etiquetas: 1,
            atualizacoes: 1,
            totalPrevisto: 1,
            liberacao: 1,
            composicao: 1,
            dataRequisicaoPagamento: 1,
            dataLiberacaoPagamento: 1,
            dataPagamento: 1,
            dataPedido: 1,
            fornecedor: 1,
            total: 1,
            transporte: 1,
            faturamentos: 1,
            entrega: 1,
            autor: 1,
            dataInsercao: 1,
            dataEfetivacao: 1,
            'projetoDados._id': 1,
            'projetoDados.nomeDoContrato': 1,
            'projetoDados.qtde': 1,
            'projetoDados.cpf_cnpj': 1,
            'projetoDados.inscricaoRural': 1,
            'projetoDados.tipoDeServico': 1,
            'projetoDados.telefone': 1,
            'projetoDados.email': 1,
            'projetoDados.cep': 1,
            'projetoDados.uf': 1,
            'projetoDados.cidade': 1,
            'projetoDados.bairro': 1,
            'projetoDados.logradouro': 1,
            'projetoDados.numeroResidencia': 1,
            'projetoDados.pagamento.pagador': 1,
            'projetoDados.pagamento.contatoPagador': 1,
            'projetoDados.pagamento.cpf_cnpjPagador': 1,
            'projetoDados.pagamento.forma': 1,
            'projetoDados.pagamento.metodo': 1,
            'projetoDados.pagamento.credor': 1,
            'projetoDados.pagamento.credorNomeGerente': 1,
            'projetoDados.pagamento.credorContatoGerente': 1,
            'projetoDados.pagamento.negociacao': 1,
            'projetoDados.produtos': 1,
            'projetoDados.idVisitaTecnica': 1,
          },
        },
      ])
      .toArray()
    const purchaseControl = purchaseControlArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0]
    // const purchaseControl = await collection.findOne({ _id: new ObjectId(id) })
    if (!purchaseControl) throw new createHttpError.NotFound('Controle de compra não encontrado.')
    return res.status(200).json({ data: purchaseControl as TPurchaseControlWithProjectDTO })
  }
  if (projectId) {
    if (typeof projectId != 'string' || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest('ID do projeto inválido.')

    const purchaseControls = await collection.find({ 'projeto.id': projectId }, { projection: PurchaseControlSimplifiedProjection }).toArray()

    return res.status(200).json({ data: purchaseControls })
  }

  const queryTagsIds = typeof queryTags == 'string' ? queryTags.split(',').filter((q) => !!ObjectId.isValid(q)) : []
  const queryPendingConclusionValue = queryPendingConclusion == 'true' ? true : false

  const queryTagsQuery: Filter<TPurchaseControl> = queryTagsIds.length > 0 ? { 'etiquetas.id': { $in: queryTagsIds } } : {}
  const queryPendingConclusionQuery: Filter<TPurchaseControl> = queryPendingConclusionValue ? { dataEfetivacao: null } : {}
  console.log(queryTagsQuery)
  console.log(queryPendingConclusionQuery)
  const purchaseControls = await collection
    .find(
      { ...queryTagsQuery, ...queryPendingConclusionQuery },
      {
        projection: PurchaseControlKanbanSimplifiedProjection,
      }
    )
    .toArray()

  return res.status(200).json({ data: purchaseControls })
}

type PostResponse = {
  data: { insertedId: string }
  message: string
}

const createPurchaseControlRoute: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const purchaseControl = GeneralPurchaseControlSchema.parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const purchaseControlWithRegistrosStatus = {
    ...purchaseControl,
    registrosStatus: { [purchaseControl.status]: { entrada: new Date().toISOString() } },
  }
  const insertResponse = await collection.insertOne(purchaseControlWithRegistrosStatus)
  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao inserir controle de compra.')
  const insertedId = insertResponse.insertedId.toString()

  return res.status(201).json({ data: { insertedId }, message: 'Controle de compra criado com sucesso !' })
}

type PutResponse = {
  message: string
}
const updatePurchaseControlRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query

  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const changes = GeneralPurchaseControlSchema.partial().parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar controle de compra.')

  return res.status(201).json({ message: 'Controle de compras atualizado com sucesso !' })
}

const deletePurchaseControlRoute: NextApiHandler<any> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  console.log('ID PARA DELETE', id)
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection = db.collection<TPurchaseControl>('controles-compras')

  const deleteResponse = await collection.deleteOne({ _id: new ObjectId(id) })
  if (!deleteResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao excluir o controle de compra.')
  if (deleteResponse.deletedCount == 0) throw new createHttpError.NotFound('Controle de compra não encontrado.')

  return res.status(201).json({ data: 'Controle de compra excluído com sucesso !', message: 'Controle de compra excluído com sucesso !' })
}

export default apiHandler({
  GET: getPurchasesControlsRoute,
  POST: createPurchaseControlRoute,
  PUT: updatePurchaseControlRoute,
  DELETE: deletePurchaseControlRoute,
})
