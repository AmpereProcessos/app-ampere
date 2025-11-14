import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { InsertFileReferenceSchema, TFileReference } from "@/utils/schemas/file-reference.schema";
import createHttpError from "http-errors";
import { Collection, Db, ObjectId } from "mongodb";
import { NextApiHandler } from "next";
import connectToDatabase from "@/utils/services/mongodb/auxiliaries";
type GetResponse = {
	data: TFileReference | TFileReference[];
};

const getFileReferences: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { projectId, userId } = req.query;

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const referencesCollection: Collection<TFileReference> = db.collection("referencias-arquivos");

	if (projectId) {
		if (typeof projectId != "string" || !ObjectId.isValid(projectId)) throw new createHttpError.BadRequest("ID de projeto inválido.");
		const references = await referencesCollection.find({ idProjeto: projectId, dataExclusao: null }).toArray();
		return res.status(200).json({ data: references });
	}
	if (userId) {
		if (typeof userId != "string" || !ObjectId.isValid(userId)) throw new createHttpError.BadRequest("ID de colaborador inválido.");
		const references = await referencesCollection.find({ idColaborador: userId, dataExclusao: null }).toArray();
		return res.status(200).json({ data: references });
	}

	throw new createHttpError.BadRequest("Nenhum ID de referência fornecido.");
};

type PostResponse = {
	data: {
		insertedId: string;
	};
	message: string;
};
const createFileReference: NextApiHandler<PostResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const reference = InsertFileReferenceSchema.parse(req.body);

	const db: Db = await connectToDatabase(process.env.DB_KEY);
	const referencesCollection: Collection<TFileReference> = db.collection("referencias-arquivos");

	const insertResponse = await referencesCollection.insertOne(reference);
	if (!insertResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao criar referência de arquivo.");
	const insertedId = insertResponse.insertedId.toString();

	return res.status(201).json({ data: { insertedId }, message: "Referência criada com sucesso !" });
};
export default apiHandler({
	POST: createFileReference,
	GET: getFileReferences,
});
