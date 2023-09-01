import dayjs from 'dayjs'
import connectToDatabase from '../../../../utils/callsDb'
import { formatProjectCode } from '../../../../utils/constants'
import { errorHandler } from '../../../../utils/methods/handlers'
import { getFirstDayOfMonth, getLastDayOfMonth } from '../../../../utils/methods/shared'
import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
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
    let svbCode = formatProjectCode(req.body.codigoDoProjeto)
    const db = await connectToDatabase(process.env.DB_KEY)
    const collection = db.collection('pps')
    try {
      await collection.insertOne({
        ...req.body,
        carimboDataHora: new Date().toJSON(),
        codigoDoProjeto: svbCode,
      })
      return res.json('Chamado criado!')
    } catch (error) {
      res.status(500).send('Houve um erro no servidor, por favor tente novamente.')
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
