import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ContractTemplateVariableSchema, type TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import z from "zod";

async function getContractTemplateVariables({ id }: { id?: string | null }) {
	const db = await connectToAdministrationDatabase();
	const variablesCollection = db.collection<TContractTemplateVariable>("templates-contrato-variaveis");

	if (id) {
		if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const variable = await variablesCollection.findOne({ _id: new ObjectId(id) });
		if (!variable) throw new createHttpError.NotFound("Variável de template de contrato não encontrada.");

		return {
			data: {
				byId: { ...variable, _id: variable._id.toString() },
				default: undefined,
			},
		};
	}
	const variables = await variablesCollection.find({}).toArray();
	return {
		data: {
			byId: undefined,
			default: variables.map((variable) => ({
				...variable,
				_id: variable._id.toString(),
			})),
		},
	};
}
export type TGetContractTemplateVariablesOutput = Awaited<ReturnType<typeof getContractTemplateVariables>>;
export type TGetContractTemplateVariablesOutputDefault = Exclude<TGetContractTemplateVariablesOutput["data"]["default"], undefined>;
export type TGetContractTemplateVariablesOutputById = Exclude<TGetContractTemplateVariablesOutput["data"]["byId"], undefined>;
const getContractTemplateVariablesInput = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
		})
		.optional()
		.nullable(),
});
const getContractTemplateVariablesHandler: NextApiHandler<TGetContractTemplateVariablesOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const { id } = getContractTemplateVariablesInput.parse(req.query);
	const result = await getContractTemplateVariables({ id });
	return res.status(200).json(result);
};

const CreateContractTemplateVariableInput = z.object({
	variable: ContractTemplateVariableSchema,
});
export type TCreateContractTemplateVariableInput = z.infer<typeof CreateContractTemplateVariableInput>;
async function createContractTemplateVariable({ input }: { input: TCreateContractTemplateVariableInput }) {
	const db = await connectToAdministrationDatabase();
	const variablesCollection = db.collection<TContractTemplateVariable>("templates-contrato-variaveis");
	const result = await variablesCollection.insertOne(input.variable);

	if (!result.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao criar a variável de template de contrato.");
	const insertedId = result.insertedId.toString();
	return {
		data: {
			insertedId,
		},
		message: "Variável de template de contrato criada com sucesso.",
	};
}
export type TCreateContractTemplateVariableOutput = Awaited<ReturnType<typeof createContractTemplateVariable>>;
const createContractTemplateVariableHandler: NextApiHandler<TCreateContractTemplateVariableOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { variable } = CreateContractTemplateVariableInput.parse(req.body);
	const result = await createContractTemplateVariable({ input: { variable } });
	return res.status(200).json(result);
};

const UpdateContractTemplateVariableInput = z.object({
	id: z
		.string({
			invalid_type_error: "Tipo inválido para ID",
		})
		.refine((v) => ObjectId.isValid(v), {
			message: "ID inválido.",
		}),
	variable: ContractTemplateVariableSchema,
});
export type TUpdateContractTemplateVariableInput = z.infer<typeof UpdateContractTemplateVariableInput>;
async function updateContractTemplateVariable({ input }: { input: TUpdateContractTemplateVariableInput }) {
	const db = await connectToAdministrationDatabase();
	const variablesCollection = db.collection<TContractTemplateVariable>("templates-contrato-variaveis");
	const result = await variablesCollection.updateOne({ _id: new ObjectId(input.id) }, { $set: input.variable });

	if (!result.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro ao atualizar a variável de template de contrato.");
	const updatedId = result.upsertedId?.toString() || input.id;
	return {
		data: {
			updatedId,
		},
		message: "Variável de template de contrato atualizada com sucesso.",
	};
}
export type TUpdateContractTemplateVariableOutput = Awaited<ReturnType<typeof updateContractTemplateVariable>>;
const updateContractTemplateVariableHandler: NextApiHandler<TUpdateContractTemplateVariableOutput> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);
	const { id, variable } = UpdateContractTemplateVariableInput.parse(req.body);
	const result = await updateContractTemplateVariable({ input: { id, variable } });
	return res.status(200).json(result);
};

export default apiHandler({
	GET: getContractTemplateVariablesHandler,
	POST: createContractTemplateVariableHandler,
	PUT: updateContractTemplateVariableHandler,
});
