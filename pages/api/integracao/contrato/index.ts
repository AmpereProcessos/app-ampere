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

const obj = {
	contratanteTexto: "**CONTRATANTE: CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA**",
	contratanteDados: {
		nome: "CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA",
		cpfCnpj: "10.681.060/0001-70",
		email: "hudson.bp10@gmail.com",
		representadoPor: {
			nome: "HUDSON ELIAS MARQUES DA SILVEIRA",
			estadoCivil: "NÃO INFORMADO",
			profissao: "SÓCIO",
			rg: "MG-11.566.763",
			cpfCnpj: "067.979.236-89",
			telefone: "(34) 99991-5572",
		},
	},
	contratadaTexto: "**CONTRATADA: AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA**",
	contratadaDados: {
		nome: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
		cpfCnpj: "27.901.968/0001-45",
		email: "NÃO INFORMADO",
		representadoPor: {
			nome: "DIOGO PAULINO CARVALHO",
			estadoCivil: "SOLTEIRO",
			profissao: "EMPRESÁRIO",
			rg: "MG-14372057",
			cpfCnpj: "072.427.186-43",
			telefone: "NÃO INFORMADO",
		},
		logoUrl: null,
		assinaturaUrl: null,
	},
	clausulas: [
		"**CLÁUSULA PRIMEIRA – DO OBJETO E FORMA DE EXECUÇÃO**\nConstitui objeto deste contrato o fornecimento de projeto, mão-de-obra, materiais e instalação de sistema de geração de energia fotovoltaica com potência instalada de 5,85 kWp.\n\n1.1.1.1. O objeto contratado será executado nas seguintes especificações: haverá interligação com rede de baixa tensão da concessionária de energia elétrica local instalada na RUA FRANCISCO REIS GOULART,Nº626, BAIRRO CENTRO,CEP38320-000, no Município de SANTA VITORIA/MG.\n\n1.2. O sistema contratado é composto por:\nA) Fornecimento dos materiais necessários para a instalação do sistema, e seu perfeito e cabal funcionamento, a saber:\nA.1. Módulos fotovoltaicos\nSerão fornecidos 10 (DEZ) módulos modelos HELIUS 585Wp.\nA.2. Micro inversor de frequência\nSerão fornecidos 3 (TREZ) micro inversores modelo HOYMILES 2kW.\nA.3. Sistemas de proteção\nA.3.1. Quadro de proteção para os circuitos de corrente contínua, contendo:\nA.3.2. DPS (Dispositivo de Proteção Contra Surtos) adequados para operação em corrente alternada;\nA.3.2.1. Fusíveis adequados para operação em corrente contínua;\nA.3.2.2. Disjuntor termomagnético.\nParágrafo único – os modelos estipulados no item A.1 e A.2, em caso de indisponibilidade com o fornecedor habitual, poderão ser substituídos por marcas diversas, mantendo-se, contudo, qualificações técnicas que sejam equivalentes a mesma qualidade com equivalência de preço, podendo variar para mais ou para menos.\nA.4. Cabos e Conexões\nA.4.1. Serão utilizados cabos de cobre com isolação adequada para o sistema fotovoltaico e nos pontos sobre o telhado e expostos ao sol com proteção contra raios UV;\nA.5. Sistema de fixação dos módulos nos telhados:\nA.5.1. Os suportes para fixação dos módulos são confeccionados em perfis metálicos, conforme demanda específica do CONTRATANTE indicada no projeto e em termo de visita técnica in loco.\nB) O projeto elétrico do sistema fotovoltaico será elaborado e executado conforme as normas da concessionária de energia elétrica local e a Resolução Normativa ANEEL N° 1000 (REN 1000) que estabelece as condições de acesso e define critérios técnicos e operacionais, requisitos de projeto, informações, dados e a implementação da conexão para Acessantes novos e já existentes;\nC) A CONTRATANTE fornecerá todos os documentos necessários a fim de que a CONTRATADA possa acompanhar solicitação em nome daquela perante a concessionária de energia elétrica, para liberar início de operação do sistema de geração fotovoltaica por parte da CONTRATADA;\nD) Todos os quadros e inversores receberão adesivos com a marca da CONTRATADA e informações da empresa para facilitar a identificação e o contato, sempre que necessário, com a prestadora dos serviços respectivos (A CONTRATADA). Todo o material remanescente, não empregado na execução do objeto, será devolvido para a CONTRATADA.",
	],
	dataTexto: "Ituiutaba/MG, 27 de Maio de 2025.",
	assinaturas: {
		contratante: {
			nome: "CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA",
			cpfCnpj: "**10.681.060/0001-70**",
			assinaturaUrl: null,
		},
		contratada: {
			nome: "AMPERE ENGENHARIA E CONSULTORIA ELETRICA LTDA-ME",
			cpfCnpj: "**27.901.968/0001-45**",
			assinaturaUrl: null,
		},
		testemunha1: {
			nome: "",
			cpfCnpj: "",
			assinaturaUrl: null,
		},
		testemunha2: {
			nome: "",
			cpfCnpj: "",
			assinaturaUrl: null,
		},
	},
};

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

type getContractDataParams = {
	projectContractRequest: WithId<TContractRequest>;
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
