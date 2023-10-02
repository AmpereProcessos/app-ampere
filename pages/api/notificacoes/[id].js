import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/connectDb'
import { errorHandler } from '../../../utils/methods/handlers'
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('notificacoes')
      await collection.insertOne({
        ...req.body,
        dataDeEnvio: new Date(),
        lido: false,
      })
      res.status(201).json('Notificação criada com sucesso!')
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'GET') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('notificacoes')

      var dateObj = new Date()
      // Setando date de parâmetro pra buscar notificações dos últimos 14 dias
      dateObj.setDate(dateObj.getDate() - 14)
      let notificacoes = await collection
        .aggregate([
          {
            $match: {
              destinatario: req.query.id,
              $or: [
                { lido: false },
                {
                  dataDeLeitura: { $gte: new Date(dateObj) },
                },
              ],
            },
          },
          {
            $sort: {
              lido: 1,
              dataDeLeitura: -1,
            },
          },
        ])
        .toArray()
      res.status(200).json(notificacoes)
    } catch (error) {
      errorHandler(error, res)
    }
  } else if (req.method === 'PUT') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
      const collection = db.collection('notificacoes')
      await collection.updateOne(
        {
          _id: ObjectId(req.body.id),
        },
        {
          $set: {
            lido: true,
            dataDeLeitura: new Date(),
          },
        }
      )
      res.status(201).json('Notificação atualizada com sucesso!')
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
