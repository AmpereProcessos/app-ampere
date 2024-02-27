import createHttpError from 'http-errors'
import { Db, MongoClient } from 'mongodb'

let cachedDb: Db | null = null
export default async function connectToAdministrationDatabase(uri: unknown) {
  if (typeof uri != 'string') throw createHttpError.InternalServerError('Wrong database URI.')
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(uri)
  const db = client.db('administracao')
  cachedDb = db
  return db
}
