import { apiHandler, validateAuthenticationWithSession } from '@/utils/api'
import { InsertUserSchema, TUser, TUserDTO } from '@/utils/schemas/users'
import connectToAdministrationDatabase from '@/utils/services/mongodb/administration'
import createHttpError from 'http-errors'
import { Collection, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

type GetResponse = {
  data: TUser | TUser[]
}

const projection = {
  acessoAtivo: 1,
  nome: 1,
  email: 1,
  telefone: 1,
  avatar_url: 1,
  visualizacao: 1,
  permissoes: 1,
  empresaVinculada: 1,
  cargos: 1,
  dataInsercao: 1,
  autor: 1,
}
const getUsers: NextApiHandler<GetResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const { id } = req.query

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const usersCollection: Collection<TUser> = db.collection('colaboradores')

  if (id) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

    const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { projection: projection })
    if (!user) throw new createHttpError.NotFound('Usuário não encontrado.')
    return res.status(200).json({ data: user })
  }

  const users = await usersCollection.find({}, { projection: projection }).toArray()

  return res.status(200).json({ data: users })
}

type PostResponse = {
  data: {
    insertedId: string
  }
  message: string
}

const createUser: NextApiHandler<PostResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const { id, nome, avatar_url } = session.user
  if (!session.user.permissoes.usuarios.criar) throw new createHttpError.Unauthorized('Você não possui permissão para criação de usuários.')
  const user = InsertUserSchema.parse(req.body)

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const usersCollection: Collection<TUser> = db.collection('colaboradores')

  const insertResponse = await usersCollection.insertOne({ ...user, autor: { id, nome, avatar_url } })

  if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido na criação de um novo usuário.')
  const insertedId = insertResponse.insertedId.toString()
  return res.status(200).json({ data: { insertedId }, message: 'Usuário criado com sucesso !' })
}

type PutResponse = {
  data: string
  message: string
}

const editUser: NextApiHandler<PutResponse> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res)
  const { id } = req.query
  if (!id || typeof id != 'string' || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')

  const user = InsertUserSchema.partial().parse(req.body)

  const db = await connectToAdministrationDatabase(process.env.DB_KEY)
  const usersCollection: Collection<TUser> = db.collection('colaboradores')

  const updateResponse = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...user } })

  if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, houve um erro desconhecido ao atualizar usuário.')
  if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound('Usuário não encontrado.')

  return res.status(201).json({ data: 'Usuário atualizado com sucesso !', message: 'Usuário atualizado com sucesso !' })
}

export default apiHandler({
  GET: getUsers,
  POST: createUser,
  PUT: editUser,
})
