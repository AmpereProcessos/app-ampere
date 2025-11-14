import { insertHomologation, updateHomologation } from "@/repositories/crm-homologations/mutations";
import { getHomologationById, getHomologationByOpportunityId, getPartnerHomologations } from "@/repositories/crm-homologations/queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertHomologationSchema, THomologation } from "@/utils/schemas/crm/homologation.schema";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import createHttpError from "http-errors";
import { Collection, Filter, ObjectId } from "mongodb";
import { NextApiHandler } from "next";

type GetResponse = {
	data: THomologation | THomologation[];
};

const getHomologations: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id, opportunityId } = req.query;
	const db = await connectToCRMDatabase(process.env.DB_KEY);
	const collection: Collection<THomologation> = db.collection("homologations");

	if (id) {
		if (typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID de homologação inválido.");
		const homologation = await getHomologationById({ collection: collection, id: id, query: {} });
		if (!homologation) throw new createHttpError.NotFound("Homologação não encontrada.");

		return res.status(200).json({ data: homologation });
	}

	if (opportunityId) {
		if (typeof opportunityId != "string" || !ObjectId.isValid(opportunityId)) throw new createHttpError.BadRequest("ID de oportunidade inválido.");
		const homologations = await getHomologationByOpportunityId({ collection: collection, opportunityId: opportunityId, query: {} });

		return res.status(200).json({ data: homologations });
	}

	const homologations = await getPartnerHomologations({ collection: collection, query: {} });
	return res.status(200).json({ data: homologations });
};

type PostResponse = {
	data: { insertedId: string };
	message: string;
};

const createHomologation: NextApiHandler<PostResponse> = async (req, res) => {
	const homologation = InsertHomologationSchema.parse(req.body);

	const db = await connectToCRMDatabase(process.env.DB_KEY);
	const collection: Collection<THomologation> = db.collection("homologations");

	const insertResponse = await insertHomologation({ collection, info: homologation, partnerId: "65454ba15cf3e3ecf534b308" });
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar homologação.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Homologação criada com sucesso !" });
};

type PutResponse = {
	data: string;
	message: string;
};

const editHomologation: NextApiHandler<PutResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = req.query;
	if (!id || typeof id != "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

	const changes = InsertHomologationSchema.partial().parse(req.body);

	const db = await connectToCRMDatabase(process.env.DB_KEY);
	const collection: Collection<THomologation> = db.collection("homologations");

	const updateResponse = await updateHomologation({ id: id, collection: collection, changes: changes, query: {} });

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao atualizar homologação.");
	if (updateResponse.matchedCount == 0) throw new createHttpError.NotFound("Homologação não encontrada.");

	return res.status(201).json({ data: "Homologação atualizada com sucesso !", message: "Homologação atualizada com sucesso !" });
};

export default apiHandler({ GET: getHomologations, POST: createHomologation, PUT: editHomologation });
