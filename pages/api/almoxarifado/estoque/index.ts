import { validateAuthenticationWithSession } from '@/utils/api'
import { TMaterialUpdateRegistry } from '@/utils/schemas/material-updates-registry'
import { InsertMaterialSchema, TMaterial } from '@/utils/schemas/materials'
import connectToDatabase from '@/utils/services/mongodb/warehouse'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type PutResponse = {
  data: string
  message: string
}

const updateMaterial: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const update = InsertMaterialSchema.partial().parse(req.body)
  const warehouseDb: Db = await connectToDatabase(process.env.DB_KEY)
  const materialCollection: Collection<TMaterial> = warehouseDb.collection('material')
  const logCollection: Collection<TMaterialUpdateRegistry> = warehouseDb.collection('alteracoes')
}
