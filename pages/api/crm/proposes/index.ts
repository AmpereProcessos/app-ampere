import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { TSolarSystemPropose, TSolarSystemProposeDTO } from "@/utils/schemas/proposes/solar-system.schema";
import { NextApiHandler } from "next";
import connectToCRMDatabase from "../../../../utils/services/mongodb/crm/main";
import { Collection, ObjectId } from "mongodb";
import createHttpError from "http-errors";
type GetResponse = {
	data: TSolarSystemPropose | TSolarSystemProposeDTO[];
};
const getPropose: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (!id || typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const db = await connectToCRMDatabase(process.env.CRM_KEY);
	const proposesCollection: Collection<TSolarSystemPropose> = db.collection("proposes");
	const propose = await proposesCollection.findOne({ _id: new ObjectId(id) });
	if (!propose) throw new createHttpError.NotFound("Proposta não encontrada.");

	return res.status(200).json({ data: propose });
};

export default apiHandler({
	GET: getPropose,
});
