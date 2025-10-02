import type { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ContractTemplateSchema, type TContractTemplate } from "@/utils/schemas/contract-templates";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

export const CreateContractTemplateInput = z.object({
	template: ContractTemplateSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
});
export type TCreateContractTemplateInput = z.infer<typeof CreateContractTemplateInput>;

async function createContractTemplate({ input, session }: { input: TCreateContractTemplateInput; session: TAuthSession }) {
	const template = input.template;
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TContractTemplate>("templates-contrato");
	const result = await templatesCollection.insertOne({
		...template,
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});
	if (!result.acknowledged) {
		throw new createHttpError.InternalServerError("Oops, houve um erro ao criar o template de contrato.");
	}
	return {
		data: {
			insertedId: result.insertedId.toString(),
		},
		message: "Template de contrato criado com sucesso.",
	};
}
export type TCreateContractTemplateOutput = Awaited<ReturnType<typeof createContractTemplate>>;

const createContractTemplateHandler: NextApiHandler<TCreateContractTemplateOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = CreateContractTemplateInput.parse(req.body);
	const result = await createContractTemplate({ input, session });
	return res.status(200).json(result);
};

const GetContractTemplatesInput = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
		})
		.optional()
		.nullable(),
});
export type TGetContractTemplatesInput = z.infer<typeof GetContractTemplatesInput>;

async function getContractTemplates({ input }: { input: TGetContractTemplatesInput }) {
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TContractTemplate>("templates-contrato");
	if (input.id) {
		if (!ObjectId.isValid(input.id)) throw new createHttpError.BadRequest("ID inválido.");
		const template = await templatesCollection.findOne({ _id: new ObjectId(input.id) });
		if (!template) throw new createHttpError.NotFound("Template de contrato não encontrado.");
		return {
			data: {
				byId: { ...template, _id: template._id.toString() },
			},
		};
	}

	const templates = await templatesCollection.find({}).toArray();

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
export type TGetContractTemplatesOutput = Awaited<ReturnType<typeof getContractTemplates>>;
export type TGetContractTemplatesOutputDefault = Exclude<TGetContractTemplatesOutput["data"]["default"], undefined>;
export type TGetContractTemplatesOutputById = Exclude<TGetContractTemplatesOutput["data"]["byId"], undefined>;
const getContractTemplatesHandler: NextApiHandler<TGetContractTemplatesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = GetContractTemplatesInput.parse(req.query);
	const result = await getContractTemplates({ input });
	return res.status(200).json(result);
};

const UpdateContractTemplateInput = z.object({
	template: ContractTemplateSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
			required_error: "ID não informado",
		})
		.refine((v) => ObjectId.isValid(v), {
			message: "ID inválido.",
		}),
});
export type TUpdateContractTemplateInput = z.infer<typeof UpdateContractTemplateInput>;

async function updateContractTemplate({ input }: { input: TUpdateContractTemplateInput }) {
	const db = await connectToAdministrationDatabase();
	const templatesCollection = db.collection<TContractTemplate>("templates-contrato");
	const result = await templatesCollection.updateOne({ _id: new ObjectId(input.id) }, { $set: input.template });
	if (!result.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar o template de contrato.");
	return {
		data: {
			updatedId: input.id,
		},
		message: "Template de contrato atualizado com sucesso.",
	};
}
export type TUpdateContractTemplateOutput = Awaited<ReturnType<typeof updateContractTemplate>>;

const updateContractTemplateHandler: NextApiHandler<TUpdateContractTemplateOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const input = UpdateContractTemplateInput.parse(req.body);
	const result = await updateContractTemplate({ input });
	return res.status(200).json(result);
};

export default apiHandler({
	GET: getContractTemplatesHandler,
	POST: createContractTemplateHandler,
	PUT: updateContractTemplateHandler,
});
