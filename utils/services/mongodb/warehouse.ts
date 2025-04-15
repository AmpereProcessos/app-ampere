import type { Db, MongoClient } from "mongodb";
import clientPromise from "./mongo-client";

let cachedDb: Db | null = null;
export default async function connectToWarehouseDatabase() {
	if (cachedDb) {
		return cachedDb;
	}
	const client = await clientPromise;
	const db = client.db("almoxarifado");
	cachedDb = db;
	return db;
}
