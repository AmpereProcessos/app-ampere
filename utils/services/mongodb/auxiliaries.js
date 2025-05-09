import { MongoClient } from "mongodb";
import clientPromise from "./mongo-client";

let cachedDb2 = null;
export default async function connectToDatabase(uri) {
	if (cachedDb2) {
		return cachedDb2;
	}
	const client = await clientPromise;
	const db = client.db("auxiliares");
	cachedDb2 = db;
	return db;
}
