import { ObjectId } from 'mongodb'
import connectToDatabase from '../../../utils/services/mongodb/auxiliaries'
import createHttpError from 'http-errors'
import { errorHandler } from '../../../utils/methods/handlers'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const db = await connectToDatabase(process.env.DB_KEY)
      const receiptAccountsCollection = db.collection('contasDeRecebimento')

      if (id) {
        if (typeof id != 'string') throw new createHttpError.BadRequest('ID inválido.')

        // const account = await receiptAccountsCollection.findOne({
        //   _id: new ObjectId(id),
        // })
        const account = await getSingleAccount({ id: id, collection: receiptAccountsCollection })
        res.status(200).json(account)
      } else {
        // const accounts = await receiptAccountsCollection
        //   .aggregate([
        //     {
        //       $sort: {
        //         nome: 1,
        //       },
        //     },
        //   ])
        //   .toArray()
        const accounts = await getAllAccounts({ collection: receiptAccountsCollection })
        res.status(200).json(accounts)
      }
    } catch (error) {
      errorHandler(error, res)
    }
  }
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase(process.env.DB_KEY)
      const receiptAccountsCollection = db.collection('contasDeRecebimento')
      const { data } = req.body
      if (!data) new createHttpError.BadRequest('Informações não fornecidades para criação de conta de recebimento.')
      const insertResponse = await insertReceiptAccount({ data: data, collection: receiptAccountsCollection })
      res.status(201).json('Conta de recebimento criada com sucesso!')
    } catch (error) {
      errorHandler(error, res)
    }
  }
  if (req.method === 'PUT') {
    try {
      const { id } = req.query
      if (!id || !ObjectId.isValid(id)) throw new createHttpError.BadRequest('ID inválido ou não fornecido.')
      const { data } = req.body
      if (!data) throw new createHttpError.BadRequest('Informação para alteração da conta de recebimento não fornecidas.')
      const db = await connectToDatabase(process.env.DB_KEY)
      const receiptAccountsCollection = db.collection('contasDeRecebimento')
      var updateObj = { ...data }
      delete updateObj._id
      const updateResponse = await updateReceiptAccount({ id: id, collection: receiptAccountsCollection, data: updateObj })
      res.status(201).json('Conta de recebimento atualizada com sucesso !')
    } catch (error) {
      errorHandler(error, res)
    }
  }
}

async function getSingleAccount({ id, collection }) {
  try {
    return await collection.findOne({ _id: ObjectId(id) })
  } catch (error) {
    throw error
  }
}
async function getAllAccounts({ collection }) {
  try {
    return await collection
      .aggregate([
        {
          $sort: {
            nome: 1,
          },
        },
      ])
      .toArray()
  } catch (error) {
    throw error
  }
}
async function insertReceiptAccount({ data, collection }) {
  try {
    const insertResponse = await collection.insertOne(data)
    return insertResponse
  } catch (error) {
    throw error
  }
}
async function updateReceiptAccount({ id, data, collection }) {
  try {
    const updateResponse = await collection.updateOne({ _id: ObjectId(id) }, { $set: { ...data } })
    return updateResponse
  } catch (error) {
    throw error
  }
}
