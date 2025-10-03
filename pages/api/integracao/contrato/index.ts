import { getContractModelData, getContractViaHtml } from "@/lib/contract-generation";
import { getTemplateProcessed } from "@/lib/contract-templates/processing";
import { getContractTemplateNativeVariablesValues, getContractTemplateVariablesValues } from "@/lib/contract-templates/variables";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatAsNumber, formatWithoutDiacritics } from "@/utils/methods/formatting";
import type { TContractRequest } from "@/utils/schemas/contract-requests";
import type { TContractTemplate } from "@/utils/schemas/contract-templates";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TProposal } from "@/utils/schemas/crm/proposal.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToRequestsDatabase from "@/utils/services/mongodb/requests";
import axios from "axios";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { type Collection, type Db, ObjectId, type WithId } from "mongodb";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
// @ts-ignore

export type TContractModel = {
	contratanteTexto: string;
	contratanteDados: {
		nome: string;
		cpfCnpj: string;
		email: string;
		representadoPor: {
			nome: string;
			estadoCivil: string;
			profissao: string;
			rg: string;
			cpfCnpj: string;
		};
	};
	contratadaTexto: string;
	contratadaDados: {
		nome: string;
		cpfCnpj: string;
		email: string;
	};
	clausulas: string[];
	dataTexto: string;
	assinaturas: {
		contratante: {
			nome: string;
			cpfCnpj: string;
			assinaturaUrl: string | null;
		};
		contratada: {
			nome: string;
			cpfCnpj: string;
			assinaturaUrl: string | null;
		};
		testemunha1: {
			nome: string;
			cpfCnpj: string;
			assinaturaUrl: string | null;
		};
		testemunha2: {
			nome: string;
			cpfCnpj: string;
			assinaturaUrl: string | null;
		};
	};
};

async function handleContractGenerationViaHtml(req: NextApiRequest, res: NextApiResponse) {
	const session = await validateAuthenticationWithSession(req, res);

	const isUserAllowed = session.user.permissoes.comercial.editar;

	if (!isUserAllowed) {
		throw new createHttpError.Forbidden("Usuário não tem permissão para gerar contratos");
	}
	const { contractRequestId, contractFormat, templateId } = req.query;
	if (!contractRequestId || typeof contractRequestId !== "string" || !ObjectId.isValid(contractRequestId)) {
		throw new createHttpError.BadRequest("ID do contrato inválido");
	}
	if (!templateId || typeof templateId !== "string" || !ObjectId.isValid(templateId)) {
		throw new createHttpError.BadRequest("ID do template de contrato inválido");
	}

	const admDb = await connectToAdministrationDatabase();
	const contractTemplateVariablesCollection = admDb.collection<TContractTemplateVariable>("templates-contrato-variaveis");
	const contractTemplateVariables = await contractTemplateVariablesCollection.find({}).toArray();
	const contractTemplateCollection = admDb.collection<TContractTemplate>("templates-contrato");
	// Getting the first one (fow now)
	const contractTemplate = await contractTemplateCollection.findOne({});
	if (!contractTemplate) {
		throw new createHttpError.NotFound("Template de contrato não encontrado");
	}

	const db: Db = await connectToRequestsDatabase();
	const crbDm = await connectToCRMDatabase();
	const projectsCollection: Collection<TContractRequest> = db.collection("contrato");
	const proposalsCollection: Collection<TProposal> = crbDm.collection("proposals");
	const contractRequest = await projectsCollection.findOne({ _id: new ObjectId(contractRequestId) });
	if (!contractRequest) {
		throw new createHttpError.NotFound("Solicitação de contrato não encontrada");
	}

	const nativeContractTemplateVariables = getContractTemplateNativeVariablesValues({
		contractRequest: { ...contractRequest, _id: contractRequest._id.toString() },
	});

	const allContractTemplateVariables = getContractTemplateVariablesValues({
		definitions: contractTemplateVariables.map((v) => ({ ...v, _id: v._id.toString() })),
		nativeVariablesValues: nativeContractTemplateVariables,
	});

	const contractTemplateContent = getTemplateProcessed({ templateContent: contractTemplate.conteudo, variables: allContractTemplateVariables });

	const { buffer, filename } = await getContractViaHtml({
		content: contractTemplateContent,
		personalization: {
			fontFamily: "Raleway",
		},
		signatures: {
			contractor: {
				name: contractRequest.nomeDoContrato,
				identifier: contractRequest.cpf_cnpj?.toString() || "",
			},
			company: {
				name: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
				identifier: "27.901.968/0001-45",
			},
			firstWitness: {
				name: "",
				identifier: "",
			},
			secondWitness: {
				name: "",
				identifier: "",
			},
		},
		date: `Ituiutaba/MG, ${dayjs().format("DD [de] MMMM [de] YYYY")}`,
		returnType: contractFormat === "pdf" ? "pdf" : "docx",
	});

	// Setting headers for download
	res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
	res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
	return res.status(200).send(Buffer.from(buffer, "binary"));
}

export default apiHandler({
	GET: handleContractGenerationViaHtml,
});
