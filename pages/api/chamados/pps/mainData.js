import dayjs from 'dayjs'
import connectToDatabase from '../../../../utils/services/mongodb/calls'
import connectToCRMDatabase from '../../../../utils/services/mongodb/crm/main'
import { calculateStringSimilarity, formatProjectCode } from '../../../../utils/constants'
import { errorHandler } from '../../../../utils/methods/handlers'
import { getFirstDayOfMonth, getLastDayOfMonth } from '../../../../utils/methods/shared'
import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
function findSellerInCRM(seller, users) {
  const userInCRM = users.find((user) => calculateStringSimilarity(user.nome.toUpperCase(), seller) > 80)
  if (userInCRM)
    return {
      idCRM: userInCRM._id,
      nomeCRM: userInCRM.nome,
      apelido: seller,
      avatar_url: userInCRM.avatar_url,
    }
  else
    return {
      idCRM: null,
      nomeCRM: null,
      apelido: seller,
      avatar_url: null,
    }
}
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status, after, before } = req.query
    try {
      const db = await connectToDatabase(process.env.DB_KEY)
      const collection = db.collection('pps')
      if (status == 'ABERTOS') {
        const openCalls = await collection
          .aggregate([
            {
              $match: {
                status: { $ne: 'REALIZADO' },
              },
            },
          ])
          .toArray()
        res.json(openCalls)
      }
      if (status == 'REALIZADOS') {
        var dateParam
        if (!after || !before) {
          const currentDate = dayjs()
          const twoDaysAgoDate = currentDate.subtract(2, 'days')
          dateParam = {
            $and: [
              {
                dataEfetivacao: { $gte: twoDaysAgoDate.toISOString() },
              },
              {
                dataEfetivacao: { $lte: currentDate.toISOString() },
              },
            ],
          }
        } else {
          dateParam = dateParam = {
            $and: [
              {
                dataEfetivacao: { $gte: after },
              },
              {
                dataEfetivacao: { $lte: before },
              },
            ],
          }
        }

        const closedCalls = await collection
          .aggregate([
            {
              $match: {
                status: 'REALIZADO',
                ...dateParam,
              },
            },
          ])
          .toArray()
        res.json(closedCalls)
      }
    } catch (error) {
      errorHandler(error, res)
    }
  }
  if (req.method === 'POST') {
    try {
      const info = req.body
      if (!info) throw new createHttpError.BadRequest('Nenhuma informação fornecida.')
      const db = await connectToDatabase(process.env.DB_KEY)
      const collection = db.collection('pps')
      const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
      const usersCRMCollection = crmDb.collection('users')
      const crmUsers = await usersCRMCollection.find().toArray()
      const applicantAlias = info.requerente?.apelido
      const applicant = findSellerInCRM(applicantAlias, crmUsers)
      const insertInfo = { ...info, requerente: applicant }
      await collection.insertOne({
        ...insertInfo,
        status: 'PENDENTE',
        dataInsercao: new Date().toISOString(),
      })
      return res.json('Chamado criado!')
    } catch (error) {
      errorHandler(error, res)
    }
  }
  if (req.method === 'PUT') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY)
      const collection = db.collection('pps')
      const { id } = req.query
      const { changes } = req.body
      if (!id || typeof id != 'string') throw new createHttpError('ID inválido!')
      if (!changes) throw new createHttpError('Objeto de alterações não fornecido.')
      const dbResponse = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...changes } })
      return res.status(201).json('Alterações feitas com sucesso.')
    } catch (error) {
      errorHandler(error, res)
    }
  }
}
