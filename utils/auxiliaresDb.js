import { MongoClient } from "mongodb";

let cachedDb2 = null;
export default async function connectToDatabase(uri) {
  if (cachedDb2) {
    return cachedDb2;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("auxiliares");
  cachedDb2 = db;
  return db;
}
