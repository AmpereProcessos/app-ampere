import { MongoClient } from "mongodb";

let cachedDb = null;
export default async function connectToSolicitacoesDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("solicitacoes");
  cachedDb = db;
  return db;
}
