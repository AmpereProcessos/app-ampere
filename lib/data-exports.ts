import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TProject } from "@/utils/schemas/projects";
import { z } from "zod";

export const ProjectExportablesSchema = z.object({
	qtde: z.boolean({
		required_error: "Necessidade de exportação do identificador não informada",
		invalid_type_error: "Necessidade de exportação do identificador não é um booleano",
	}),
	nomeDoContrato: z.boolean({
		required_error: "Necessidade de exportação do nome do contrato não informada",
		invalid_type_error: "Necessidade de exportação do nome do contrato não é um booleano",
	}),
	cpf_cnpj: z.boolean({
		required_error: "Necessidade de exportação do CPF/CNPJ não informada",
		invalid_type_error: "Necessidade de exportação do CPF/CNPJ não é um booleano",
	}),
	inscricaoRural: z.boolean({
		required_error: "Necessidade de exportação da Inscrição Rural não informada",
		invalid_type_error: "Necessidade de exportação da Inscrição Rural não é um booleano",
	}),
	tipoDeServico: z.boolean({
		required_error: "Necessidade de exportação do tipo de serviço não informada",
		invalid_type_error: "Necessidade de exportação do tipo de serviço não é um booleano",
	}),
	telefone: z.boolean({
		required_error: "Necessidade de exportação do telefone não informada",
		invalid_type_error: "Necessidade de exportação do telefone não é um booleano",
	}),
	email: z.boolean({
		required_error: "Necessidade de exportação do email não informada",
		invalid_type_error: "Necessidade de exportação do email não é um booleano",
	}),
	dataNascimento: z.boolean({
		required_error: "Necessidade de exportação da data de nascimento não informada",
		invalid_type_error: "Necessidade de exportação da data de nascimento não é um booleano",
	}),
	canalVenda: z.boolean({
		required_error: "Necessidade de exportação do canal de venda não informada",
		invalid_type_error: "Necessidade de exportação do canal de venda não é um booleano",
	}),
	codigoSVB: z.boolean({
		required_error: "Necessidade de exportação do código CRM não informada",
		invalid_type_error: "Necessidade de exportação do código CRM não é um booleano",
	}),
	"vendedor.nome": z.boolean({
		required_error: "Necessidade de exportação do vendedor não informada",
		invalid_type_error: "Necessidade de exportação do vendedor não é um booleano",
	}),
	insider: z.boolean({
		required_error: "Necessidade de exportação do insider não informada",
		invalid_type_error: "Necessidade de exportação do insider não é um booleano",
	}),
	nps: z.boolean({
		required_error: "Necessidade de exportação do NPS não informada",
		invalid_type_error: "Necessidade de exportação do NPS não é um booleano",
	}),
	cep: z.boolean({
		required_error: "Necessidade de exportação do CEP não informada",
		invalid_type_error: "Necessidade de exportação do CEP não é um booleano",
	}),
	uf: z.boolean({
		required_error: "Necessidade de exportação do estado não informada",
		invalid_type_error: "Necessidade de exportação do estado não é um booleano",
	}),
	cidade: z.boolean({
		required_error: "Necessidade de exportação da cidade não informada",
		invalid_type_error: "Necessidade de exportação da cidade não é um booleano",
	}),
	bairro: z.boolean({
		required_error: "Necessidade de exportação do bairro não informada",
		invalid_type_error: "Necessidade de exportação do bairro não é um booleano",
	}),
	logradouro: z.boolean({
		required_error: "Necessidade de exportação do logradouro não informada",
		invalid_type_error: "Necessidade de exportação do logradouro não é um booleano",
	}),
	numeroResidencia: z.boolean({
		required_error: "Necessidade de exportação do número da residência não informada",
		invalid_type_error: "Necessidade de exportação do número da residência não é um booleano",
	}),
	latitude: z.boolean({
		required_error: "Necessidade de exportação da latitude não informada",
		invalid_type_error: "Necessidade de exportação da latitude não é um booleano",
	}),
	longitude: z.boolean({
		required_error: "Necessidade de exportação da longitude não informada",
		invalid_type_error: "Necessidade de exportação da longitude não é um booleano",
	}),
	'pagamento.forma': z.boolean({
		required_error: "Necessidade de exportação da forma de pagamento não informada",
		invalid_type_error: "Necessidade de exportação da forma de pagamento não é um booleano",
	}),
	'pagamento.credor': z.boolean({
		required_error: "Necessidade de exportação do credor não informada",
		invalid_type_error: "Necessidade de exportação do credor não é um booleano",
	}),
	'pagamento.pagador': z.boolean({
		required_error: "Necessidade de exportação do pagador não informada",
		invalid_type_error: "Necessidade de exportação do pagador não é um booleano",
	}),
	'pagamento.contatoPagador': z.boolean({
		required_error: "Necessidade de exportação do contato do pagador não informada",
		invalid_type_error: "Necessidade de exportação do contato do pagador não é um booleano",
	}),
	'pagamento.cpf_cnpjPagador': z.boolean({
		required_error: "Necessidade de exportação do CPF/CNPJ do pagador não informada",
		invalid_type_error: "Necessidade de exportação do CPF/CNPJ do pagador não é um booleano",
	}),
	"contrato.status": z.boolean({
		required_error: "Necessidade de exportação do status do contrato não informada.",
		invalid_type_error: "Necessidade de exportação do status do contrato não é um booleano.",
	}),
	"sistema.potPico": z.boolean({
		required_error: "Necessidade de exportação da potência pico não informada.",
		invalid_type_error: "Necessidade de exportação da potência pico não é um booleano.",
	}),
	"contrato.dataAssinatura": z.boolean({
		required_error: "Necessidade de exportação da data de assinatura não informada.",
		invalid_type_error: "Necessidade de exportação da data de assinatura não é um booleano.",
	}),
	"homologacao.status": z.boolean({
		required_error: "Necessidade de exportação do status da homologação não informada.",
		invalid_type_error: "Necessidade de exportação do status da homologação não é um booleano.",
	}),
	"homologacao.acesso.dataResposta": z.boolean({
		required_error: "Necessidade de exportação da data de resposta da homologação não informada.",
		invalid_type_error: "Necessidade de exportação da data de resposta da homologação não é um booleano.",
	}),
	"homologacao.vistoria.dataEfetivacao": z.boolean({
		required_error: "Necessidade de exportação da data de efetivação da vistoria não informada.",
		invalid_type_error: "Necessidade de exportação da data de efetivação da vistoria não é um booleano.",
	}),
	"compra.dataLiberacao": z.boolean({
		required_error: "Necessidade de exportação da data de liberação para compra não informada.",
		invalid_type_error: "Necessidade de exportação da data de liberação para compra não é um booleano.",
	}),
	"compra.dataPedido": z.boolean({
		required_error: "Necessidade de exportação da data de pedido para compra não informada.",
		invalid_type_error: "Necessidade de exportação da data de pedido para compra não é um booleano.",
	}),
	"compra.dataEntrega": z.boolean({
		required_error: "Necessidade de exportação da data de entrega para compra não informada.",
		invalid_type_error: "Necessidade de exportação da data de entrega para compra não é um booleano.",
	}),
	"compra.dataPagamento": z.boolean({
		required_error: "Necessidade de exportação da data de pagamento para compra não informada.",
		invalid_type_error: "Necessidade de exportação da data de pagamento para compra não é um booleano.",
	}),
	"compra.dataPagamentoEquipamentos": z.boolean({
		required_error: "Necessidade de exportação da data de pagamento para equipamentos não informada.",
		invalid_type_error: "Necessidade de exportação da data de pagamento para equipamentos não é um booleano.",
	}),
	"obra.statusDaObra": z.boolean({
		required_error: "Necessidade de exportação do status da obra não informada.",
		invalid_type_error: "Necessidade de exportação do status da obra não é um booleano.",
	}),
	"obra.equipeResp": z.boolean({
		required_error: "Necessidade de exportação da equipe responsável pela obra não informada.",
		invalid_type_error: "Necessidade de exportação da equipe responsável pela obra não é um booleano.",
	}),
	"obra.entrada": z.boolean({
		required_error: "Necessidade de exportação da data de entrada da obra não informada.",
		invalid_type_error: "Necessidade de exportação da data de entrada da obra não é um booleano.",
	}),
	"obra.saida": z.boolean({
		required_error: "Necessidade de exportação da data de saída da obra não informada.",
		invalid_type_error: "Necessidade de exportação da data de saída da obra não é um booleano.",
	}),
});

export type TProjectExportables = z.infer<typeof ProjectExportablesSchema>;

type TProjectExportableFieldsConfig = Record<
	keyof TProjectExportables,
	{
		label: string;
		formattingFunction: (value: any) => string;
	}
>;
export const ProjectExportableFieldsConfig: TProjectExportableFieldsConfig = {
	qtde: {
		label: "QTDE",
		formattingFunction: (value: TProject["qtde"]) => value?.toString() ?? "",
	},
	nomeDoContrato: {
		label: "NOME DO CONTRATO",
		formattingFunction: (value: TProject["nomeDoContrato"]) => value ?? "",
	},
	cpf_cnpj: {
		label: "CPF/CNPJ",
		formattingFunction: (value: TProject["cpf_cnpj"]) => value?.toString() ?? "",
	},
	inscricaoRural: {
		label: "INSCRIÇÃO RURAL",
		formattingFunction: (value: TProject["inscricaoRural"]) => value ?? "",
	},
	tipoDeServico: {
		label: "TIPO DE SERVIÇO",
		formattingFunction: (value: TProject["tipoDeServico"]) => value ?? "",
	},
	telefone: {
		label: "TELEFONE",
		formattingFunction: (value: TProject["telefone"]) => value ?? "",
	},
	email: {
		label: "EMAIL",
		formattingFunction: (value: TProject["email"]) => value ?? "",
	},
	dataNascimento: {
		label: "DATA DE NASCIMENTO",
		formattingFunction: (value: TProject["dataNascimento"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	canalVenda: {
		label: "CANAL DE VENDA",
		formattingFunction: (value: TProject["canalVenda"]) => value ?? "",
	},
	codigoSVB: {
		label: "CÓDIGO CRM",
		formattingFunction: (value: TProject["codigoSVB"]) => value?.toString() ?? "",
	},
	"vendedor.nome": {
		label: "VENDEDOR",
		formattingFunction: (value: TProject["vendedor"]["nome"]) => value ?? "",
	},
	insider: {
		label: "INSIDER",
		formattingFunction: (value: TProject["insider"]) => value ?? "",
	},
	nps: {
		label: "NPS",
		formattingFunction: (value: TProject["nps"]) => value?.toString() ?? "",
	},
	cep: {
		label: "CEP",
		formattingFunction: (value: TProject["cep"]) => value?.toString() ?? "",
	},
	uf: {
		label: "UF",
		formattingFunction: (value: TProject["uf"]) => value ?? "",
	},
	cidade: {
		label: "CIDADE",
		formattingFunction: (value: TProject["cidade"]) => value ?? "",
	},
	bairro: {
		label: "BAIRRO",
		formattingFunction: (value: TProject["bairro"]) => value ?? "",
	},
	logradouro: {
		label: "LOGRADOURO",
		formattingFunction: (value: TProject["logradouro"]) => value ?? "",
	},
	numeroResidencia: {
		label: "NÚMERO",
		formattingFunction: (value: TProject["numeroResidencia"]) => value?.toString() ?? "",
	},
	latitude: {
		label: "LATITUDE",
		formattingFunction: (value: TProject["latitude"]) => value?.toString() ?? "",
	},
	longitude: {
		label: "LONGITUDE",
		formattingFunction: (value: TProject["longitude"]) => value?.toString() ?? "",
	},
	'pagamento.forma': {
		label: "FORMA DE PAGAMENTO",
		formattingFunction: (value: TProject["pagamento"]["forma"]) => value ?? "",
	},
	'pagamento.credor': {
		label: "CREDOR",
		formattingFunction: (value: TProject["pagamento"]["credor"]) => value ?? "",
	},
	'pagamento.pagador': {
		label: "PAGADOR",
		formattingFunction: (value: TProject["pagamento"]["pagador"]) => value ?? "",
	},
	'pagamento.contatoPagador': {
		label: "CONTATO DO PAGADOR",
		formattingFunction: (value: TProject["pagamento"]["contatoPagador"]) => value ?? "",
	},
	'pagamento.cpf_cnpjPagador': {
		label: "CPF/CNPJ DO PAGADOR",
		formattingFunction: (value: TProject["pagamento"]["cpf_cnpjPagador"]) => value?.toString() ?? "",
	},
	"contrato.status": {
		label: "STATUS DO CONTRATO",
		formattingFunction: (value: TProject["contrato"]["status"]) => value ?? "",
	},
	"sistema.potPico": {
		label: "POTÊNCIA PICO",
		formattingFunction: (value: TProject["sistema"]["potPico"]) => value?.toString() ?? "",
	},
	"contrato.dataAssinatura": {
		label: "DATA DE ASSINATURA",
		formattingFunction: (value: TProject["contrato"]["dataAssinatura"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"homologacao.status": {
		label: "STATUS DA HOMOLOGAÇÃO",
		formattingFunction: (value: TProject["homologacao"]["status"]) => value ?? "",
	},
	"homologacao.acesso.dataResposta": {
		label: "DATA DE RESPOSTA DA HOMOLOGAÇÃO",
		formattingFunction: (value: TProject["homologacao"]["acesso"]["dataResposta"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"homologacao.vistoria.dataEfetivacao": {
		label: "DATA DE EFETIVAÇÃO DA VISTORIA",
		formattingFunction: (value: TProject["homologacao"]["vistoria"]["dataEfetivacao"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"compra.dataLiberacao": {
		label: "DATA DE LIBERAÇÃO PARA COMPRA",
		formattingFunction: (value: TProject["compra"]["dataLiberacao"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"compra.dataPedido": {
		label: "DATA DE PEDIDO PARA COMPRA",
		formattingFunction: (value: TProject["compra"]["dataPedido"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"compra.dataEntrega": {
		label: "DATA DE ENTREGA PARA COMPRA",
		formattingFunction: (value: TProject["compra"]["dataEntrega"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"compra.dataPagamento": {
		label: "DATA DE PAGAMENTO PARA COMPRA",
		formattingFunction: (value: TProject["compra"]["dataPagamento"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"compra.dataPagamentoEquipamentos": {
		label: "DATA DE PAGAMENTO PARA EQUIPAMENTOS",
		formattingFunction: (value: TProject["compra"]["dataPagamentoEquipamentos"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"obra.statusDaObra": {
		label: "STATUS DA OBRA",
		formattingFunction: (value: TProject["obra"]["statusDaObra"]) => value ?? "",
	},
	"obra.equipeResp": {
		label: "EQUIPE RESPONSÁVEL PELA OBRA",
		formattingFunction: (value: TProject["obra"]["equipeResp"]) => value ?? "",
	},
	"obra.entrada": {
		label: "DATA DE ENTRADA DA OBRA",
		formattingFunction: (value: TProject["obra"]["entrada"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
	"obra.saida": {
		label: "DATA DE SAÍDA DA OBRA",
		formattingFunction: (value: TProject["obra"]["saida"]) => (value ? formatDateAsLocale(value) || "" : ""),
	},
};

type TGetProjectExportFormattedParams = {
	projects: Partial<TProject>[];
	exportablesDefinition: TProjectExportables;
};

export function getProjectExportFormatted({ projects, exportablesDefinition }: TGetProjectExportFormattedParams) {
	const formattedProjects = projects.map((project) => {
		const formattedProject: Record<string, string> = {};

		// Iterate through each exportable field
		for (const [field, shouldExport] of Object.entries(exportablesDefinition)) {
			if (!shouldExport) continue;

			// Get the formatting function for this field
			const fieldConfig = ProjectExportableFieldsConfig[field as keyof typeof ProjectExportableFieldsConfig];
			if (!fieldConfig) continue;

			// Handle nested fields (e.g., "vendedor.nome", "contrato.status")
			const fieldParts = field.split(".");
			let value: any = project;

			// Navigate through nested objects
			for (const part of fieldParts) {
				if (value === undefined || value === null) break;
				value = value[part];
			}

			// Format the value using the field's formatting function
			formattedProject[fieldConfig.label] = fieldConfig.formattingFunction(value);
		}

		return formattedProject;
	});

	return formattedProjects;
}

export const GetProjectsExportRoutePayloadSchema = z.object({
	filters: z.object({
		contractNamesearch: z.string({ required_error: "Filtro de nome não informado", invalid_type_error: "Filtro de nome não é uma string" }),
		neighborhoodSearch: z.string({ required_error: "Filtro de bairro não informado", invalid_type_error: "Filtro de bairro não é uma string" }),
		streetSearch: z.string({ required_error: "Filtro de logradouro não informado", invalid_type_error: "Filtro de logradouro não é uma string" }),
		contractStatus: z.array(z.string({ required_error: "Status do contrato não informado", invalid_type_error: "Status do contrato não é uma string" })),
		serviceType: z.array(z.string({ required_error: "Tipo de serviço não informado", invalid_type_error: "Tipo de serviço não é uma string" })),
		sellers: z.array(z.string({ required_error: "Vendedor não informado", invalid_type_error: "Vendedor não é uma string" })),
		insiders: z.array(z.string({ required_error: "Insider não informado", invalid_type_error: "Insider não é uma string" })),
		cities: z.array(z.string({ required_error: "Cidade não informada", invalid_type_error: "Cidade não é uma string" })),
		states: z.array(z.string({ required_error: "Estado não informado", invalid_type_error: "Estado não é uma string" })),
		period: z.object({
			field: z.string({ required_error: "Campo de período não informado", invalid_type_error: "Campo de período não é uma string" }).optional().nullable(),
			after: z.string({ required_error: "Data de início não informada", invalid_type_error: "Data de início não é uma string" }).optional().nullable(),
			before: z.string({ required_error: "Data de fim não informada", invalid_type_error: "Data de fim não é uma string" }).optional().nullable(),
		}),
	}),
	projection: ProjectExportablesSchema,
});

export type TGetProjectsExportRoutePayload = z.infer<typeof GetProjectsExportRoutePayloadSchema>;

export function getProjectProjection(projection: TProjectExportables): Record<string, 1> {
	const mongoProjection: Record<string, 1> = {};

	for (const [field, shouldInclude] of Object.entries(projection)) {
		if (shouldInclude) {
			mongoProjection[field] = 1;
		}
	}

	return mongoProjection;
}
