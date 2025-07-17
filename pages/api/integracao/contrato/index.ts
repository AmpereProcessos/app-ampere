import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatAsNumber, formatWithoutDiacritics } from "@/utils/methods/formatting";
import type { TContractRequest } from "@/utils/schemas/contract-requests";
import type { TProject } from "@/utils/schemas/projects";
import { ObjectId, type WithId, type Collection, type Db } from "mongodb";
import connectToRequestsDatabase from "@/utils/services/mongodb/requests";
import type { NextApiHandler } from "next";
// @ts-ignore
import numeroPorExtenso from "numero-por-extenso";
import createHttpError from "http-errors";
import axios from "axios";
import { getContractModelData } from "@/lib/contract-generation";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import type { TProposal } from "@/utils/schemas/crm/proposal.schema";

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

function getContractFinalValue(request: TContractRequest) {
	const { valorContrato, valorSeguro, valorPadrao, valorEstrutura, valorOeMOuSeguro } = request;
	return formatAsNumber(valorContrato) + formatAsNumber(valorSeguro) + formatAsNumber(valorPadrao) + formatAsNumber(valorEstrutura) + formatAsNumber(valorOeMOuSeguro);
}

const handleContractGeneration: NextApiHandler<any> = async (req, res) => {
	const session = await validateAuthenticationWithSession(req, res);

	const isUserAllowed = session.user.permissoes.comercial.editar;

	if (!isUserAllowed) {
		throw new createHttpError.Forbidden("Usuário não tem permissão para gerar contratos");
	}
	const { contractRequestId, contractFormat } = req.query;
	if (!contractRequestId || typeof contractRequestId !== "string" || !ObjectId.isValid(contractRequestId)) {
		throw new createHttpError.BadRequest("ID do contrato inválido");
	}
	const db: Db = await connectToRequestsDatabase();
	const crbDm = await connectToCRMDatabase();
	const projectsCollection: Collection<TContractRequest> = db.collection("contrato");
	const proposalsCollection: Collection<TProposal> = crbDm.collection("proposals");
	const contractRequest = await projectsCollection.findOne({ _id: new ObjectId(contractRequestId) });
	if (!contractRequest) {
		throw new createHttpError.NotFound("Solicitação de contrato não encontrada");
	}
	const salesProposalId = contractRequest.idPropostaCRM;
	if (!salesProposalId) {
		throw new createHttpError.BadRequest("Proposta não encontrada");
	}

	const proposal = await proposalsCollection.findOne({ _id: new ObjectId(salesProposalId) });

	const totalPower = (proposal?.produtos || []).filter((p) => p.categoria === "MÓDULO").reduce((acc, p) => acc + p.qtde * (p.potencia || 0), 0) / 1000;
	const contractData = getContractModelData({
		customer: {
			name: contractRequest.nomeDoContrato,
			phone: contractRequest.telefone,
			email: contractRequest.email,
			documents: {
				cpfCnpj: contractRequest.cpf_cnpj?.toString() || "",
				rg: contractRequest.rg?.toString() || "",
			},
			location: {
				address: contractRequest.enderecoCobranca,
				number: contractRequest.numeroResCobranca,
				complement: "",
				neighborhood: contractRequest.bairro,
				cep: contractRequest.cep,
				city: contractRequest.cidade || "",
				state: contractRequest.uf || "",
			},
		},
		system: {
			topology: contractRequest.topologia || "INVERSOR",
			equipments:
				proposal?.produtos
					.filter((p) => ["MÓDULO", "INVERSOR"].includes(p.categoria))
					.map((p) => ({
						model: p.modelo,
						power: p.potencia || 0,
						quantity: p.qtde,
						warranty: p.garantia || 0,
						type: p.categoria as "MÓDULO" | "INVERSOR",
					})) || [],
			installationLocation: {
				address: contractRequest.enderecoInstalacao,
				number: contractRequest.numeroResInstalacao?.toString() || "",
				complement: "",
				neighborhood: contractRequest.bairroInstalacao,
				cep: contractRequest.cepInstalacao,
				city: contractRequest.cidadeInstalacao || "",
				state: contractRequest.ufInstalacao || "",
			},
			totalPower: totalPower,
		},
		additionalServices: {
			serviceEntranceAdequacy: contractRequest.aumentoDeCarga === "SIM",
			operationAndMaintenance: contractRequest.planoOeM && contractRequest.planoOeM !== "NÃO SE APLICA",
			structureAdequacy: contractRequest.estruturaAmpere === "SIM",
		},
		payment: {
			negotiation: contractRequest.formaDePagamento === "80% A VISTA NA ENTRADA + 20% NA FINALIZAÇÃO DA INSTALAÇÃO" ? "80-20" : "100%",
			value: getContractFinalValue(contractRequest),
			resourceSource: contractRequest.origemRecurso === "CAPITAL PRÓPRIO" ? "OWN" : "BANK FINANCING",
		},
	});

	// In here, split in two cases:
	// 1. contractFormat is "pdf"
	// 2. contractFormat is "docx"
	if (contractFormat === "pdf") {
		const response = await axios.post("https://contract-generation-api-496303969093.southamerica-east1.run.app/generate-contract-pdf", contractData, {
			headers: {
				"x-api-key": process.env.SECRET_INTERNAL_COMMUNICATION_API_TOKEN,
			},
			responseType: "arraybuffer", // <- ESSENCIAL!
		});

		// Pega o nome sugerido do arquivo, se vier no header
		const disposition = response.headers["content-disposition"];
		let filename = `CONTRATO ${formatWithoutDiacritics(contractData.contratanteDados.nome)}.pdf`;
		if (disposition || disposition.includes("filename=")) {
			filename = disposition.split("filename=")[1].replace(/"/g, "");
		}

		// Seta os headers para download
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		return res.status(200).send(Buffer.from(response.data, "binary"));
	}
	if (contractFormat === "docx") {
		const response = await axios.post("https://contract-generation-api-496303969093.southamerica-east1.run.app/generate-contract", contractData, {
			headers: {
				"x-api-key": process.env.SECRET_INTERNAL_COMMUNICATION_API_TOKEN,
			},
			responseType: "arraybuffer",
		});
		// Pega o nome sugerido do arquivo, se vier no header
		const disposition = response.headers["content-disposition"];
		let filename = `CONTRATO ${formatWithoutDiacritics(contractData.contratanteDados.nome)}.docx`;
		if (disposition || disposition.includes("filename=")) {
			filename = disposition.split("filename=")[1].replace(/"/g, "");
		}
		// Seta os headers para download
		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
		return res.status(200).send(Buffer.from(response.data, "binary"));
	}
};

export default apiHandler({
	GET: handleContractGeneration,
});
