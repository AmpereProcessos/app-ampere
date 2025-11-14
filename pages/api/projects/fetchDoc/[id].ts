import { ObjectId, type WithId } from "mongodb";
import connectToDatabase from "../../../../utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { apiHandler, validateAuthenticationWithSession } from "../../../../utils/api";
import type { TProject, TProjectWithClient, TProjectWithClientDTO } from "@/utils/schemas/projects";
import type { NextApiHandler } from "next";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { TClient, TClientDTO } from "@/utils/schemas/crm/client.schema";

type GetResponse = TProjectWithClient;
const getProjectById: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasRestrictionPermission = session.user.permissoes.gestao.restringirProjetos;
	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>("clients");

	const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
	if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");

	// Checking for any project restrictions
	const isProjectRestricted = !!project.restricao?.aplicavel;
	if (isProjectRestricted && !userHasRestrictionPermission)
		throw new createHttpError.Unauthorized(
			`Projeto restrito em ${project.restricao?.data} por ${project.restricao?.autor?.nome || "gestor"}. Entre em contato para mais detalhes.`,
		);

	// Getting the associated client
	let client: WithId<TClient> | undefined;
	if (project.idClienteCRM) {
		client = (await clientsCollection.findOne({ _id: new ObjectId(project.idClienteCRM) })) || undefined;
	}

	return res.json({ ...project, cliente: client ? { ...client, _id: client._id.toString() } : undefined });
};

export default apiHandler({ GET: getProjectById });
