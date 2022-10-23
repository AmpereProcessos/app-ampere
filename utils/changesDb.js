import { MongoClient } from "mongodb";

let cachedDb = null;
export default async function connectToChangesDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("changes");
  cachedDb = db;
  return db;
}
