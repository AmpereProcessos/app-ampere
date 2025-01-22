import { Db, MongoClient } from 'mongodb'
import clientPromise from './mongo-client'

let cachedDb: Db | null = null
export default async function connectToAITestingDatabase() {
  if (cachedDb) {
    return cachedDb
  }
  const client = await clientPromise
  const db = client.db('testando-ia')
  cachedDb = db
  return db
}
