import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
	ProjectResumeProjection,
	type TProject,
	type TProjectResumeDTO,
} from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

type GetResponse = {
	data: TProjectResumeDTO;
};

// Resumo enxuto para o painel de detalhes do seletor de projetos.
// Diferente de /api/projects/fetchDoc/[id], que devolve o documento inteiro do projeto.
const getProjectResume: NextApiHandler<GetResponse> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasRestrictionPermission = !!session.user.permissoes.gestao?.restringirProjetos;

	const { id } = req.query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id))
		throw new createHttpError.BadRequest("ID inválido.");

	const db = await connectToDatabase();
	const collection = db.collection<TProject>("dados");

	const project = await collection.findOne(
		{ _id: new ObjectId(id) },
		{ projection: { ...ProjectResumeProjection, "restricao.aplicavel": 1, "restricao.data": 1, "restricao.autor": 1 } },
	);
	if (!project) throw new createHttpError.NotFound("Projeto não encontrado.");

	const isProjectRestricted = !!project.restricao?.aplicavel;
	if (isProjectRestricted && !userHasRestrictionPermission)
		throw new createHttpError.Unauthorized(
			`Projeto restrito em ${project.restricao?.data} por ${project.restricao?.autor?.nome || "gestor"}. Entre em contato para mais detalhes.`,
		);

	const { restricao, ...resume } = project;

	return res.status(200).json({ data: { ...resume, _id: project._id.toString() } as TProjectResumeDTO });
};

export default apiHandler({ GET: getProjectResume });
