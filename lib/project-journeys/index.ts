import type { TProjectJourneyStageWorkflow } from "@/utils/schemas/project-journey";

export const UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_LEGACY_CONFIG = [
	{
		ordem: 1,
		titulo: "BOAS VINDAS !",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 2,
		titulo: "ASSINATURA DAS DOCUMENTAÇÕES",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 3,
		titulo: "RESPOSTA DA CONCESSIONÁRIA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 4,
		titulo: "COMPRA DO KIT",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 5,
		titulo: "NF FATURADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 6,
		titulo: "PREVISÃO DE ENTREGA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 7,
		titulo: "ENTREGA DO KIT",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 8,
		titulo: "INSTALAÇÃO AGENDADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 9,
		titulo: "INSTALAÇÃO REALIZADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 10,
		titulo: "VISTORIA REALIZADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 11,
		titulo: "SISTEMA OPERANTE",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 12,
		titulo: "ENTREGA TÉCNICA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 13,
		titulo: "JORNADA CONCLUÍDA",
		versao: "LEGADO" as const,
		concluido: false,
	},
];
export const UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_CONFIG: {
	id: string;
	stages: TProjectJourneyStageWorkflow[];
}[] = [
	{
		id: "1",
		stages: [
			{
				ordem: 1,
				titulo: "BOAS VINDAS !",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_boas_vindas",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "CONTRATO_ASSINADO",
				},
			},
			{
				ordem: 2,
				titulo: "APROVAÇÃO DO PARECER DE ACESSO",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_aprovacao_parecer",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "HOMOLOGACAO_ACESSO_LIBERADO",
				},
			},
			{
				ordem: 3,
				titulo: "APROVAÇÃO DO PARECER DE ACESSO",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_aprovacao_parecer",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "HOMOLOGACAO_ACESSO_LIBERADO",
				},
			},
			{
				ordem: 4,
				titulo: "CONFIRMAÇÃO DO PAGAMENTO",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_confirmacao_pagamento",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "PAGAMENTO_EFETIVADO",
				},
			},
			{
				ordem: 5,
				titulo: "PREVISÃO DE ENTREGA",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_previsao_entrega",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "ENTREGA_PREVISTA",
				},
			},
			{
				ordem: 6,
				titulo: "CONFIRMAÇÃO DA ENTREGA",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_confirmacao_entrega",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "ENTREGA_REALIZADA",
				},
			},
			{
				ordem: 7,
				titulo: "CONFIRMAÇÃO DA ENTREGA (EXTERNO)",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_confirmacao_entrega_externo",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "ENTREGA_REALIZADA",
				},
			},
			{
				ordem: 8,
				titulo: "AGENDAMENTO DA INSTALAÇÃO",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_agendamento_montagem",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "EXECUCAO_AGENDADA",
				},
			},
			{
				ordem: 9,
				titulo: "SOLICITAÇÃO DE VISTORIA",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_solicitacao_vistoria",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "VISTORIA_SOLICITADA",
				},
			},
			{
				ordem: 10,
				titulo: "CONFIRMAÇÃO DA VISTORIA",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_aprovacao_vistoria",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "VISTORIA_REALIZADA",
				},
			},
			{
				ordem: 11,
				titulo: "SISTEMA OPERANTE",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_sistema_operante",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "ENERGIA_INJETADA",
				},
			},
			{
				ordem: 12,
				titulo: "JORNADA CONCLUÍDA",
				versao: "WORKFLOW",
				acoes: [
					{
						tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
						metadados: {
							whatsappTemplateId: "jornada_conclusao",
							whatsappMessageId: null,
						},
					},
				],
				concluido: false,
				gatilho: {
					tipo: "NATIVO",
					evento: "JORNADA_CONCLUIDA",
				},
			},
		],
	},
];
