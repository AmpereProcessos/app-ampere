import { ObjectId } from "mongodb";
import { z } from "zod";
import createHttpError from "http-errors";

import type { NextApiHandler } from "next";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject, TProjectRestriction } from "@/utils/schemas/projects";

import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";

const UpdateProjectRestrictionInputSchema = z.discriminatedUnion("type", [
	z.object({
		projectId: z.string({
			required_error: "ID do projeto não informado.",
			invalid_type_error: "Tipo não válido para o ID do projeto.",
		}),
		type: z.literal("ADD_RESTRICTION"),
		observations: z.string({
			required_error: "Observações não informadas.",
			invalid_type_error: "Tipo não válido para as observações.",
		}),
	}),
	z.object({
		projectId: z.string({
			required_error: "ID do projeto não informado.",
			invalid_type_error: "Tipo não válido para o ID do projeto.",
		}),
		type: z.literal("REMOVE_RESTRICTION"),
	}),
]);
export type TUpdateProjectRestrictionInput = z.infer<typeof UpdateProjectRestrictionInputSchema>;

async function handleProjectRestriction({ payload, session }: { payload: TUpdateProjectRestrictionInput; session: TAuthSession }) {
	const db = await connectToDatabase();
	const projectsCollection = db.collection<TProject>("dados");
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>("clients");

	const projectId = new ObjectId(payload.projectId);
	const project = await projectsCollection.findOne({ _id: projectId });
	if (!project) {
		throw new createHttpError.NotFound("Projeto não encontrado.");
	}
	console.log("[INFO] [UPDATE_PROJECT_RESTRITION] Updating project restriction.", {
		userId: session.user.id,
		userName: session.user.nome,
		projectId: payload.projectId,
		operationType: payload.type,
	});
	if (payload.type === "ADD_RESTRICTION") {
		const restriction: TProjectRestriction = {
			autor: {
				id: session.user.id,
				nome: session.user.nome,
				avatar_url: session.user.avatar_url,
			},
			data: new Date().toISOString(),
			observacoes: payload.observations,
			aplicavel: true,
		};
		await projectsCollection.updateOne(
			{ _id: new ObjectId(payload.projectId) },
			{
				$set: {
					restricao: restriction,
				},
			},
		);
		if (project.idClienteCRM) {
			console.log("[INFO] [UPDATE_PROJECT_RESTRITION] Adding client restriction.", {
				clientId: project.idClienteCRM,
			});
			await clientsCollection.updateOne({ _id: new ObjectId(project.idClienteCRM) }, { $set: { restricao: restriction } });
		}
	} else if (payload.type === "REMOVE_RESTRICTION") {
		await projectsCollection.updateOne({ _id: new ObjectId(payload.projectId) }, { $set: { restricao: null } });
		if (project.idClienteCRM) {
			console.log("[INFO] [UPDATE_PROJECT_RESTRITION] Removing client restriction.", {
				clientId: project.idClienteCRM,
			});
			await clientsCollection.updateOne({ _id: new ObjectId(project.idClienteCRM) }, { $set: { restricao: null } });
		}
	} else {
		throw new createHttpError.BadRequest("Tipo de restrição não informado.");
	}

	console.log("[SUCCESS] [UPDATE_PROJECT_RESTRITION] Project restriction updated successfully.");
	return {
		data: {
			updatedId: payload.projectId,
		},
		message: payload.type === "ADD_RESTRICTION" ? "Projeto restrito com sucesso." : "Restrição removida com sucesso.",
	};
}
export type TUpdateProjectRestrictionOutput = Awaited<ReturnType<typeof handleProjectRestriction>>;

const handleProjectRestrictionHandler: NextApiHandler<TUpdateProjectRestrictionOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const userHasRestrictionPermission = !!session.user.permissoes.gestao?.restringirProjetos;

	if (!userHasRestrictionPermission) {
		throw new createHttpError.Forbidden("Usuário não tem permissão para restringir projetos.");
	}

	const payload = UpdateProjectRestrictionInputSchema.parse(req.body);

	const result = await handleProjectRestriction({ payload, session });

	res.status(201).json(result);
};

export default apiHandler({
	POST: handleProjectRestrictionHandler,
});
