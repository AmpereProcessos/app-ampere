import { MongoClient } from "mongodb";

let cachedDb2 = null;
export default async function connectToDatabase2(uri) {
  if (cachedDb2) {
    return cachedDb2;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("osInfo");
  cachedDb2 = db;
  return db;
}
