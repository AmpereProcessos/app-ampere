import { getPartnerUsers, getUserById } from '@/repositories/crm-users/queries'
import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { validateAuthorization } from '@/utils/constants'
import { InsertUserSchema, TUser } from '@/utils/schemas/crm/users.schema'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

// GET RESPONSE
type GetResponse = {
  data: TUser[] | TUser
}
const getUsers: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)

  const db = await connectToCRMDatabase(process.env.DB_KEY)
  const usersCollection: Collection<TUser> = db.collection('users')
  const { id } = req.query

  if (id && typeof id === 'string') {
    const user = await getUserById({ collection: usersCollection, id: id, query: {} })
    if (!user) throw new createHttpError.NotFound('Nenhum usuário encontrado com o ID fornecido.')
    return res.status(200).json({ data: user })
  }

  const users = await getPartnerUsers({ collection: usersCollection, query: {} })
  return res.status(200).json({ data: users })
}

export default apiHandler({
  GET: getUsers,
})
