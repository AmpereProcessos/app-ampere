import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import connectToISDatabase from "../../../utils/services/mongodb/inside-sales";
import type { NextApiHandler } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TProject } from "@/utils/schemas/projects";
import { RiCollageLine } from "react-icons/ri";
import createHttpError from "http-errors";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import { TClient } from "@/utils/schemas/crm/client.schema";
import type { TOpportunity } from "@/utils/schemas/crm-project";

type PostResponse = {
	data: { insertedId: string };
	message: string;
};
const createNewProjectRoute: NextApiHandler<PostResponse> = async (
	req,
	res,
) => {
	const session = await validateAuthenticationWithSession(req, res);

	const project: TProject = req.body;

	const crmDb = await connectToCRMDatabase();
	const db = await connectToDatabase();

	const collection: Collection<TProject> = db.collection("dados");

	const opportunitiesCollection: Collection<TOpportunity> =
		crmDb.collection("opportunities");

	const latestInserted = await collection
		.aggregate([
			{
				$sort: {
					qtde: -1,
				},
			},
			{
				$limit: 1,
			},
		])
		.toArray();

	const lastIndexer = latestInserted[0].qtde;

	const newIndexer = lastIndexer + 1;

	let clientCrmId: string | null = null;

	if (project.idProjetoCRM) {
		const opportunity = await opportunitiesCollection.findOne({
			_id: new ObjectId(project.idProjetoCRM),
		});
		if (opportunity) clientCrmId = opportunity.clienteId;
	}
	const insertResponse = await collection.insertOne({
		...project,
		qtde: newIndexer,
		idClienteCRM: clientCrmId,
	});
	if (!insertResponse.acknowledged)
		throw new createHttpError.InternalServerError(
			"Oops, houve um erro desconhecido na criação do projeto.",
		);

	const insertedId = insertResponse.insertedId.toString();

	return res
		.status(201)
		.json({ data: { insertedId }, message: "Projeto criado com sucesso !" });
};

export default apiHandler({ POST: createNewProjectRoute });
