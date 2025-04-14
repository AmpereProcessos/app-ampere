import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TFunnel } from "@/utils/schemas/crm/funnels.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

const handleGetFunnels: NextApiHandler = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const db = await connectToCRMDatabase();
	const funnelsCollection = db.collection<TFunnel>("funnels");

	const { id } = req.query;

	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
		const funnel = await funnelsCollection.findOne({ _id: new ObjectId(id) });
		if (!funnel) throw new createHttpError.NotFound("Funil não encontrado.");
		return res.status(200).json({ data: funnel });
	}

	const funnels = await funnelsCollection.find({}).toArray();
	return res.status(200).json({ data: funnels });
};

export default apiHandler({
	GET: handleGetFunnels,
});
