import { MongoClient } from 'mongodb'
import clientPromise from './mongo-client'
let cachedDb = null
export default async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }
  const client = await clientPromise
  const db = client.db('insideSales')
  cachedDb = db
  return db
}
