import type { TAuthSession } from "@/lib/authentication/types";
import { createWhatsappTemplate, deleteWhatsappTemplate } from "@/lib/whatsapp/template-management";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { type TWhatsappTemplate, WhatsappTemplateSchema } from "@/utils/schemas/whatsapp-templates";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

export const CreateWhatsappTemplateInput = z.object({
	template: WhatsappTemplateSchema.omit({
		autor: true,
		dataInsercao: true,
		status: true,
		whatsappTemplateId: true,
		qualidade: true,
	}),
	syncToWhatsapp: z.boolean().default(true),
});
export type TCreateWhatsappTemplateInput = z.infer<typeof CreateWhatsappTemplateInput>;

async function createWhatsappTemplateHandler({
	input,
	session,
}: {
	input: TCreateWhatsappTemplateInput;
	session: TAuthSession;
}) {
	const template = input.template;
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TWhatsappTemplate>("whatsapp-templates");

	// Check if template name already exists
	const existingTemplate = await templatesCollection.findOne({ nome: template.nome });
	if (existingTemplate) {
		throw new createHttpError.BadRequest("Já existe um template com este nome.");
	}

	let whatsappTemplateId: string | null = null;
	let status: "RASCUNHO" | "PENDENTE" | "APROVADO" | "REJEITADO" | "PAUSADO" | "DESABILITADO" = "RASCUNHO";

	// Sync to WhatsApp if requested
	if (input.syncToWhatsapp) {
		try {
			const whatsappResponse = await createWhatsappTemplate({ template });
			whatsappTemplateId = whatsappResponse.whatsappTemplateId;
			status = "PENDENTE";
		} catch (error) {
			console.error("[ERROR] [WHATSAPP_TEMPLATE_SYNC_ERROR]", error);
			// Continue with local creation even if WhatsApp sync fails
			// The user can retry sync later
			throw error;
		}
	}

	const result = await templatesCollection.insertOne({
		...template,
		status,
		whatsappTemplateId,
		qualidade: "PENDENTE",
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	if (!result.acknowledged) {
		throw new createHttpError.InternalServerError("Oops, houve um erro ao criar o template.");
	}

	return {
		data: {
			insertedId: result.insertedId.toString(),
			whatsappTemplateId,
			status,
		},
		message: input.syncToWhatsapp ? "Template criado e sincronizado com WhatsApp com sucesso!" : "Template criado localmente com sucesso!",
	};
}
export type TCreateWhatsappTemplateOutput = Awaited<ReturnType<typeof createWhatsappTemplateHandler>>;

const createWhatsappTemplateApiHandler: NextApiHandler<TCreateWhatsappTemplateOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateWhatsappTemplateInput.parse(req.body);
	const result = await createWhatsappTemplateHandler({ input, session });
	return res.status(200).json(result);
};

const GetWhatsappTemplatesInput = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
		})
		.optional()
		.nullable(),
});
export type TGetWhatsappTemplatesInput = z.infer<typeof GetWhatsappTemplatesInput>;

async function getWhatsappTemplates({ input }: { input: TGetWhatsappTemplatesInput }) {
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TWhatsappTemplate>("whatsapp-templates");

	if (input.id) {
		if (!ObjectId.isValid(input.id)) throw new createHttpError.BadRequest("ID inválido.");
		const template = await templatesCollection.findOne({ _id: new ObjectId(input.id) });
		if (!template) throw new createHttpError.NotFound("Template não encontrado.");
		return {
			data: {
				byId: { ...template, _id: template._id.toString() },
			},
		};
	}

	const templates = await templatesCollection.find({}).sort({ dataInsercao: -1 }).toArray();

	const templatesFormatted = templates.map((template) => ({
		...template,
		_id: template._id.toString(),
	}));

	return {
		data: {
			byId: undefined,
			default: templatesFormatted,
		},
	};
}
export type TGetWhatsappTemplatesOutput = Awaited<ReturnType<typeof getWhatsappTemplates>>;
export type TGetWhatsappTemplatesOutputDefault = Exclude<TGetWhatsappTemplatesOutput["data"]["default"], undefined>;
export type TGetWhatsappTemplatesOutputById = Exclude<TGetWhatsappTemplatesOutput["data"]["byId"], undefined>;

const getWhatsappTemplatesApiHandler: NextApiHandler<TGetWhatsappTemplatesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetWhatsappTemplatesInput.parse(req.query);
	const result = await getWhatsappTemplates({ input });
	return res.status(200).json(result);
};

const UpdateWhatsappTemplateInput = z.object({
	template: WhatsappTemplateSchema.omit({
		autor: true,
		dataInsercao: true,
	}).partial(),
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
			required_error: "ID não informado",
		})
		.refine((v) => ObjectId.isValid(v), {
			message: "ID inválido.",
		}),
});
export type TUpdateWhatsappTemplateInput = z.infer<typeof UpdateWhatsappTemplateInput>;

async function updateWhatsappTemplateHandler({ input }: { input: TUpdateWhatsappTemplateInput }) {
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TWhatsappTemplate>("whatsapp-templates");

	const existingTemplate = await templatesCollection.findOne({ _id: new ObjectId(input.id) });
	if (!existingTemplate) {
		throw new createHttpError.NotFound("Template não encontrado.");
	}

	// Note: WhatsApp API doesn't support template updates directly
	// Templates must be deleted and recreated with a new name or version
	// For now, we only update local data
	const result = await templatesCollection.updateOne({ _id: new ObjectId(input.id) }, { $set: input.template });

	if (!result.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o template.");

	return {
		data: {
			updatedId: input.id,
		},
		message: "Template atualizado com sucesso.",
	};
}
export type TUpdateWhatsappTemplateOutput = Awaited<ReturnType<typeof updateWhatsappTemplateHandler>>;

const updateWhatsappTemplateApiHandler: NextApiHandler<TUpdateWhatsappTemplateOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = UpdateWhatsappTemplateInput.parse(req.body);
	const result = await updateWhatsappTemplateHandler({ input });
	return res.status(200).json(result);
};

const DeleteWhatsappTemplateInput = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
			required_error: "ID não informado",
		})
		.refine((v) => ObjectId.isValid(v), {
			message: "ID inválido.",
		}),
	deleteFromWhatsapp: z.boolean().default(true),
});
export type TDeleteWhatsappTemplateInput = z.infer<typeof DeleteWhatsappTemplateInput>;

async function deleteWhatsappTemplateHandler({ input }: { input: TDeleteWhatsappTemplateInput }) {
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TWhatsappTemplate>("whatsapp-templates");

	const existingTemplate = await templatesCollection.findOne({ _id: new ObjectId(input.id) });
	if (!existingTemplate) {
		throw new createHttpError.NotFound("Template não encontrado.");
	}

	// Delete from WhatsApp if requested and template is synced
	if (input.deleteFromWhatsapp && existingTemplate.whatsappTemplateId) {
		try {
			await deleteWhatsappTemplate({ templateName: existingTemplate.nome });
		} catch (error) {
			console.error("[ERROR] [WHATSAPP_TEMPLATE_DELETE_SYNC_ERROR]", error);
			// Continue with local deletion even if WhatsApp deletion fails
		}
	}

	const result = await templatesCollection.deleteOne({ _id: new ObjectId(input.id) });

	if (!result.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao deletar o template.");

	return {
		data: {
			deletedId: input.id,
		},
		message: input.deleteFromWhatsapp ? "Template deletado localmente e do WhatsApp com sucesso!" : "Template deletado localmente com sucesso!",
	};
}
export type TDeleteWhatsappTemplateOutput = Awaited<ReturnType<typeof deleteWhatsappTemplateHandler>>;

const deleteWhatsappTemplateApiHandler: NextApiHandler<TDeleteWhatsappTemplateOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = DeleteWhatsappTemplateInput.parse(req.body);
	const result = await deleteWhatsappTemplateHandler({ input });
	return res.status(200).json(result);
};

export default apiHandler({
	GET: getWhatsappTemplatesApiHandler,
	POST: createWhatsappTemplateApiHandler,
	PUT: updateWhatsappTemplateApiHandler,
	DELETE: deleteWhatsappTemplateApiHandler,
});
