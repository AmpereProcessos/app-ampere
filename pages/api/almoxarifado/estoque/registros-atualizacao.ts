import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { MaterialUpdateRegistryType, TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'
import connectToDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TMaterialUpdateRegistry | TMaterialUpdateRegistry[]
}

const getRegistries: NextApiHandler<GetResponse> = async (req, res) => {
  await validateAuthenticationWithSession(req, res)
  const { id, materialId, type } = req.query
  const warehouseDb: Db = await connectToDatabase(process.env.DB_KEY)
  const logCollection: Collection<TMaterialUpdateRegistry> = warehouseDb.collection('alteracoes')
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
    const registry = await logCollection.findOne({ _id: new ObjectId(id) })
    if (!registry) throw new createHttpError.NotFound('Registros não encontrado.')
    return res.status(200).json({ data: registry })
  }
  if (materialId) {
    if (typeof materialId != 'string' || !ObjectId.isValid(materialId))
      throw new createHttpError.BadRequest('ID de material inválido ou não fornecido.')
    const registries = await logCollection.find({ 'material.id': materialId }, { sort: { _id: -1 } }).toArray()
    return res.status(200).json({ data: registries })
  }
  if (type) {
    const fixedType = MaterialUpdateRegistryType.parse(type)
    const registries = await logCollection
      .find({ tipo: fixedType }, { sort: { _id: 1 } })
      .limit(30)
      .toArray()
    return res.status(200).json({ data: registries })
  }
  const registries = await logCollection
    .find({}, { sort: { _id: -1 } })
    .limit(30)
    .toArray()
  return res.status(200).json({ data: registries })
}

export default apiHandler({ GET: getRegistries })
