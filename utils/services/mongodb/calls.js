import clientPromise from "./mongo-client";
let cachedDb2 = null;
export default async function connectToCallsDatabase() {
	if (cachedDb2) {
		return cachedDb2;
	}
	const client = await clientPromise;
	const db = client.db("chamados");
	cachedDb2 = db;
	return db;
}
