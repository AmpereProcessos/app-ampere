import connectToDatabase from '../../../utils/services/mongodb/projects'
import { Collection, Db, Filter, ObjectId } from 'mongodb'
import { errorHandler } from '../../../utils/methods/handlers'
import createHttpError from 'http-errors'
import { NextApiHandler } from 'next'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { validateAuthorization } from '@/utils/constants'
import { TServiceOrder } from '@/utils/schemas/service-order'

const createServiceOrderRoute: NextApiHandler<string> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  if (!session.user.permissoes.ordensDeServico.criar) throw new createHttpError.Unauthorized('Nível de permissão insuficiente.')
  const db: Db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TServiceOrder> = db.collection('ordensDeServico')
  const info = req.body
  if (!info) throw new createHttpError.BadRequest('Nenhuma informações provida.')
  const dbResponse = await insertServiceOrder({ collection, info })
  res.status(201).json(dbResponse.insertedId.toString())
}
type GetResponse = TServiceOrder | TServiceOrder[]
const getServiceOrdersRoute: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('ordensDeServico')

  const after = req.query.after
  const before = req.query.before
  const simplified = req.query.simplified == 'false' ? false : true
  const id = req.query.id
  const projectId = req.query.projectId
  const status = req.query.status
  const responsibleName = req.query.responsibleName

  if (!!projectId && projectId != 'undefined' && typeof projectId == 'string') {
    const orders = await getServiceOrdersByProject({ collection, projectId, simplified })
    return res.status(200).json(orders)
  }
  if (!!id && id != 'undefined' && typeof id == 'string') {
    const order = await getServiceOrderById({ collection, id })
    if (!order) throw new createHttpError.NotFound('Ordem de serviço não encontrada.')
    return res.json(order)
  }

  const periodQuery: Filter<TServiceOrder> =
    after != 'null' && before != 'null' ? { $and: [{ dataInsercao: { $gte: after as string } }, { dataInsercao: { $lte: before as string } }] } : {}
  const responsibleQuery: Filter<TServiceOrder> = responsibleName != 'undefined' ? { 'responsavel.nome': responsibleName as string } : {}
  const openOnlyQuery: Filter<TServiceOrder> = status == 'EM ABERTO' ? { dataEfetivacao: null } : {}

  const query = { ...periodQuery, ...responsibleQuery, ...openOnlyQuery }
  const orders = await getServiceOrders({ collection, query, simplified })
  return res.json(orders)
}

type PutResponse = any
const editServiceOrderRoute: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection = db.collection('ordensDeServico')
  const { id } = req.query
  const changes = req.body
  if (!id || typeof id != 'string') throw new createHttpError.BadRequest('ID não fornecido ou inválido.')
  if (!changes) throw new createHttpError.BadRequest('Mudanças não fornecidas.')
  delete changes._id
  var newObj = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ...changes,
      },
    },
    {
      returnDocument: 'after',
    }
  )

  return res.status(201).json(newObj)
}

type DeleteResponse = {
  data: string
  message: string
}

const deleteServiceOrderRoute: NextApiHandler<DeleteResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  if (!session.user.permissoes.ordensDeServico.editar) throw new createHttpError.Unauthorized('Permissão insuficiente.')
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
  const collection: Collection<TServiceOrder> = db.collection('ordensDeServico')

  const deleteResponse = await collection.deleteOne({ _id: new ObjectId(id) })
  if (!deleteResponse.acknowledged) throw new createHttpError.BadRequest('Oops, houve um erro desconhecido ao excluir ordem de serviço.')

  return res.status(201).json({ data: 'Ordem de serviço excluída com sucesso !', message: 'Ordem de serviço excluída com sucesso !' })
}

export default apiHandler({ GET: getServiceOrdersRoute, POST: createServiceOrderRoute, PUT: editServiceOrderRoute, DELETE: deleteServiceOrderRoute })

type GetServiceOrdersParams = {
  collection: Collection<TServiceOrder>
  simplified: boolean
  query: Filter<TServiceOrder>
}
async function getServiceOrders({ collection, simplified, query }: GetServiceOrdersParams) {
  const projection = simplified
    ? {
        categoria: 1,
        urgencia: 1,
        'favorecido.nome': 1,
        'projeto.identificador': 1,
        periodo: 1,
        localizacao: 1,
        responsavel: 1,
        autor: 1,
        observacoes: 1,
        dataInsercao: 1,
        dataEfetivacao: 1,
      }
    : undefined
  try {
    const orders = await collection.find({ ...query }, { projection: projection }).toArray()
    return orders
  } catch (error) {
    throw error
  }
}

type GetServiceOrdersByProjectParams = {
  collection: Collection<TServiceOrder>
  simplified: boolean
  projectId: string
}
async function getServiceOrdersByProject({ collection, simplified, projectId }: GetServiceOrdersByProjectParams) {
  const projection = simplified
    ? {
        categoria: 1,
        descricao: 1,
        urgencia: 1,
        'favorecido.nome': 1,
        'projeto.identificador': 1,
        localizacao: 1,
        responsavel: 1,
        autor: 1,
        observacoes: 1,
        dataInsercao: 1,
        dataEfetivacao: 1,
      }
    : undefined
  try {
    const orders = await collection.find({ 'projeto.id': projectId }, { projection: projection }).toArray()
    return orders
  } catch (error) {
    throw error
  }
}

type GetServiceOrderByIdParams = {
  collection: Collection<TServiceOrder>
  id: string
}
async function getServiceOrderById({ collection, id }: GetServiceOrderByIdParams) {
  try {
    const order = await collection.findOne({ _id: new ObjectId(id) })
    return order
  } catch (error) {
    throw error
  }
}

type InsertServiceOrderParams = {
  collection: Collection<TServiceOrder>
  info: TServiceOrder
}
async function insertServiceOrder({ collection, info }: InsertServiceOrderParams) {
  try {
    const dbResponse = await collection.insertOne({ ...info, dataInsercao: new Date().toISOString() })
    return dbResponse
  } catch (error) {
    throw error
  }
}
