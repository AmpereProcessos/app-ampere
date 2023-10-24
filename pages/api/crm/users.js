import { ObjectId } from 'mongodb'
import { errorHandler } from '../../../utils/methods/handlers'
import createHttpError from 'http-errors'
import connectToDatabase from '../../../utils/crmDb'

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const { id } = req.query

    try {
      const crmDb = await connectToDatabase(process.env.CRM_KEY)
      const usersCollection = crmDb.collection('users')
      if (id) {
        if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido.')
        const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { _id: 1, nome: 1, avatar_url: 1, telefone: 1, email: 1 })

        if (!user) throw new createHttpError.NotFound('Usuário não encontrado.')

        return res.status(200).json(user)
      }
      const users = await usersCollection
        .aggregate([
          {
            $project: {
              _id: 1,
              nome: 1,
              avatar_url: 1,
              telefone: 1,
              email: 1,
            },
          },
        ])
        .toArray()
      return res.json(users)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
