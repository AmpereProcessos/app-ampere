import { MongoClient } from "mongodb";
import clientPromise from "./mongo-client";

let cachedDb = null;
export default async function connectToSolicitacoesDatabase(uri) {
	if (cachedDb) {
		return cachedDb;
	}
	const client = await clientPromise;
	const db = client.db("solicitacoes");
	cachedDb = db;
	return db;
}
