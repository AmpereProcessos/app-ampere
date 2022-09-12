import { MongoClient } from "mongodb";

let cachedDb = null;
export default async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("projetos");
  cachedDb = db;
  return db;
}
