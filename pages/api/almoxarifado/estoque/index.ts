import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'
import { InsertMaterialSchema, TMaterial } from '@/utils/schemas/materials'
import connectToDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TMaterial | TMaterial[]
}

const getMaterials: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const { id } = req.query

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TMaterial> = db.collection('material')
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const material = await collection.findOne({ _id: new ObjectId(id) })
    if (!material) throw new createHttpError.NotFound('Material não encontrado.')
    return res.status(200).json({ data: material })
  }

  const materials = await collection.find({}, { sort: { nome: 1 } }).toArray()
  return res.status(200).json({ data: materials })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}
const createMaterial: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const material = InsertMaterialSchema.parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TMaterial> = db.collection('material')
  const insertResponse = await collection.insertOne(material)

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao inserir o material.')
  const insertedId = insertResponse.insertedId.toString()
  return res.status(201).json({ data: { insertedId }, message: 'Material criado com sucesso !' })
}
type PutResponse = {
  data: string
  message: string
}

const updateMaterial: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const author = { id: session.user.id, nome: session.user.nome, avatar_url: session.user.avatar_url }
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido ou não fornecido.')

  const changes = InsertMaterialSchema.partial().parse(req.body)

  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection<TMaterial> = db.collection('material')
  const logCollection: Collection<TMaterialUpdateRegistry> = db.collection('alteracoes')

  const material = await collection.findOne({ _id: new ObjectId(id) })

  const updateResponse = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } })
  const hasChangedQty = !!changes.qtde && changes.qtde != material?.qtde

  if (changes.qtde) if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro ao atualizar material.')
  if (!updateResponse.matchedCount) throw new createHttpError.NotFound('Material não encontrado.')

  if (hasChangedQty) {
    const newQty = changes.qtde || 0
    const currentQty = material?.qtde || 0
    const difference = newQty - currentQty
    const log: TMaterialUpdateRegistry = {
      alteracao: difference,
      tipo: 'ALTERAÇÃO MANUAL',
      idFormulario: null,
      material: {
        id: id,
        nome: material?.nome || '',
      },
      projeto: {
        id: null,
        nome: null,
      },
      qtdeAnterior: currentQty,
      qtdeNovo: newQty,
      autor: author,
      dataInsercao: new Date().toISOString(),
    }
    const logResponse = await logCollection.insertOne(log)
    console.log(logResponse)
  }
  return res.status(201).json({ data: 'Material atualizado com sucesso !', message: 'Material atualizado com sucesso !' })
}
export default apiHandler({ GET: getMaterials, POST: createMaterial, PUT: updateMaterial })
