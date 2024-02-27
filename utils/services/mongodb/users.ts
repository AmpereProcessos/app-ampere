import createHttpError from 'http-errors'
import { Db, MongoClient } from 'mongodb'

let cachedDb2: Db | null = null
export default async function connectToColaboratorsDatabase(uri: unknown) {
  if (typeof uri != 'string') throw createHttpError.InternalServerError('Wrong database URI.')
  if (cachedDb2) {
    return cachedDb2
  }
  const client = await MongoClient.connect(uri)
  const db = client.db('authentication')
  cachedDb2 = db
  return db
}
