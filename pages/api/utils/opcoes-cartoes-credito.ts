import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { TCreditCardOption } from '@/utils/schemas/credit-card-options'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import createHttpError from 'http-errors'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

const getCreditCardOptions: NextApiHandler<{ data: TCreditCardOption | TCreditCardOption[] }> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const db: Db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const collection: Collection<TCreditCardOption> = db.collection('opcoes-cartoes-credito')

  const { id } = req.query
  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const option = await collection.findOne({ _id: new ObjectId(id) })
    if (!option) throw new createHttpError.NotFound('Opção de cartão de crédito não encontrada.')

    return res.status(200).json({ data: option })
  }

  const options = await collection.find({}).toArray()

  return res.status(200).json({ data: options })
}

export default apiHandler({ GET: getCreditCardOptions })
