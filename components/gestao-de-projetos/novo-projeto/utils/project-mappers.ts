import type { TSimilarClientSimplifiedDTO } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";

import type { TDirectProjectClientDraft } from "../types";

export function createEmptyClientDraft(): TDirectProjectClientDraft {
	return {
		clientId: null,
		selectedClient: null,
		clientData: {
			nome: "",
			cpfCnpj: "",
			telefonePrimario: "",
			email: "",
			cep: "",
			uf: "",
			cidade: "",
			bairro: "",
			endereco: "",
			numeroOuIdentificador: "",
			complemento: "",
		},
	};
}

export function mapClientToClientDraft(client: TSimilarClientSimplifiedDTO): TDirectProjectClientDraft {
	return {
		clientId: client._id,
		selectedClient: client,
		clientData: {
			nome: client.nome || "",
			cpfCnpj: client.cpfCnpj || "",
			telefonePrimario: client.telefonePrimario || "",
			email: client.email || "",
			cep: client.cep || "",
			uf: client.uf || "",
			cidade: client.cidade || "",
			bairro: client.bairro || "",
			endereco: client.endereco || "",
			numeroOuIdentificador: client.numeroOuIdentificador || "",
			complemento: client.complemento || "",
		},
	};
}

export function applyClientToProject(project: TProject, client: TDirectProjectClientDraft): TProject {
	const clientData = client.clientData;
	return {
		...project,
		idClienteCRM: client.clientId,
		nomeDoContrato: clientData.nome.toUpperCase(),
		nomeDoProjeto: project.nomeDoProjeto || clientData.nome.toUpperCase(),
		cpf_cnpj: clientData.cpfCnpj,
		telefone: clientData.telefonePrimario,
		email: clientData.email,
		cep: clientData.cep,
		uf: clientData.uf,
		cidade: clientData.cidade,
		bairro: clientData.bairro,
		logradouro: clientData.endereco,
		numeroResidencia: clientData.numeroOuIdentificador,
		pagamento: {
			...project.pagamento,
			contatoPagador: clientData.telefonePrimario,
			cpf_cnpjPagador: clientData.cpfCnpj,
			pagador: {
				...project.pagamento.pagador,
				nome: project.pagamento.pagador.nome || clientData.nome,
				cpfCnpj: project.pagamento.pagador.cpfCnpj || clientData.cpfCnpj,
				telefone: project.pagamento.pagador.telefone || clientData.telefonePrimario,
				email: project.pagamento.pagador.email || clientData.email,
				localizacao: {
					...project.pagamento.pagador.localizacao,
					cep: project.pagamento.pagador.localizacao.cep || clientData.cep,
					uf: project.pagamento.pagador.localizacao.uf || clientData.uf,
					cidade: project.pagamento.pagador.localizacao.cidade || clientData.cidade,
					bairro: project.pagamento.pagador.localizacao.bairro || clientData.bairro,
					endereco: project.pagamento.pagador.localizacao.endereco || clientData.endereco,
					numeroOuIdentificador: project.pagamento.pagador.localizacao.numeroOuIdentificador || clientData.numeroOuIdentificador,
					complemento: project.pagamento.pagador.localizacao.complemento || clientData.complemento,
				},
			},
		},
		compra: {
			...project.compra,
			localizacaoEntrega: {
				...project.compra.localizacaoEntrega,
				cep: clientData.cep,
				uf: clientData.uf,
				cidade: clientData.cidade,
				bairro: clientData.bairro,
				endereco: clientData.endereco,
				numeroOuIdentificador: clientData.numeroOuIdentificador,
				complemento: clientData.complemento,
			},
		},
		homologacao: {
			...project.homologacao,
			titular: {
				...project.homologacao.titular,
				nome: project.homologacao.titular.nome || clientData.nome,
				contato: project.homologacao.titular.contato || clientData.telefonePrimario,
			},
			localizacao: {
				...project.homologacao.localizacao,
				uf: clientData.uf,
				cidade: clientData.cidade,
			},
		},
	};
}
