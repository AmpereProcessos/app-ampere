import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

const handleUpdateClient: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new Error("ID inválido.");

	const changes = req.body;

	const db = await connectToCRMDatabase();
	const clientsCollection = db.collection<TClient>("clients");

	const updateResponse = await clientsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...changes } });
	if (!updateResponse.acknowledged) throw new Error("Oops, houve um erro desconhecido ao atualizar cliente.");
	if (updateResponse.matchedCount === 0) throw new Error("Cliente não encontrado.");

	return res.status(200).json({ data: "Cliente atualizado com sucesso !", message: "Cliente atualizado com sucesso !" });
};

export default apiHandler({ PUT: handleUpdateClient });
