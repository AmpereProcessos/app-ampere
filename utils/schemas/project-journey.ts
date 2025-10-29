import z from "zod";

export const ProjectJourneyLegacySchema = z.object({
	assDocumentacoes: z.boolean().optional().nullable(),
	boasVindas: z.boolean().optional().nullable(),
	compraDoKit: z.boolean().optional().nullable(),
	dataEntregaTecnicaPresencial: z.string().optional().nullable(),
	dataEntregaTecnicaRemota: z.string().optional().nullable(),
	dataNps: z.string().optional().nullable(),
	dataUltimoContato: z.string().optional().nullable(),
	entregaDoKit: z.boolean().optional().nullable(),
	entregaTecnica: z.boolean().optional().nullable(),
	entregaTecnicaPresencial: z.boolean().optional().nullable(),
	instalacaoAgendada: z.boolean().optional().nullable(),
	instalacaoRealizada: z.boolean().optional().nullable(),
	jornadaConcluida: z.boolean().optional().nullable(),
	nfFaturada: z.boolean().optional().nullable(),
	obsJornada: z.string().optional().nullable(),
	obsNps: z.string().optional().nullable(),
	prevChegada: z.boolean().optional().nullable(),
	respConcessionaria: z.boolean().optional().nullable(),
	sistemaLigado: z.boolean().optional().nullable(),
	tipoEntregaTecnica: z.union([z.literal("REMOTO"), z.literal("PRESENCIAL")]),
	vistoriaConcessionaria: z.boolean().optional().nullable(),
	contatos: z.string().optional().nullable(),
	cuidados: z.string().optional().nullable(),
	dataConclusao: z.string().optional().nullable(),
});

export const ProjectJourneyStageLegacySchema = z.object({
	ordem: z.number({
		required_error: "Ordem do estágio não informada.",
		invalid_type_error: "Ordem do estágio inválida.",
	}),
	titulo: z.string({
		required_error: "Título do estágio não informado.",
		invalid_type_error: "Título do estágio inválido.",
	}),
	versao: z.literal("LEGADO"),
	concluido: z.boolean({
		required_error: "Status de conclusão do estágio não informado.",
		invalid_type_error: "Status de conclusão do estágio inválido.",
	}),
	dataConclusao: z
		.string({
			required_error: "Data de conclusão do estágio não informada.",
			invalid_type_error: "Data de conclusão do estágio inválida.",
		})
		.optional()
		.nullable(),
});

export const ProjectJourneyStageWorkflowActionTriggerNativeSchema = z.object({
	tipo: z.literal("NATIVO"),
	evento: z.enum([
		"CONTRATO_LIBERADO",
		"CONTRATO_ASSINADO",
		"HOMOLOGACAO_ACESSO_SOLICITADO",
		"HOMOLOGACAO_ACESSO_LIBERADO",
		"PAGAMENTO_LIBERADO",
		"PAGAMENTO_EFETIVADO",
		"ENTREGA_PREVISTA",
		"ENTREGA_REALIZADA",
		"EXECUCAO_AGENDADA",
		"EXECUCAO_REALIZADA",
		"VISTORIA_SOLICITADA",
		"VISTORIA_REALIZADA",
		"ENERGIA_INJETADA",
		"JORNADA_CONCLUIDA",
	]),
});
// export const ProjectJourneyStageWorkflowActionTriggerConfiguredSchema = z.object({
// 	tipo: z.literal("CONFIGURADO"),
// 	condicoes: z.array(
// 		z.object({
// 			tipo: z.enum(["AND", "OR"]),
// 			variavel: z.string({
// 				required_error: "Variável do gatilho não informada.",
// 				invalid_type_error: "Variável do gatilho inválida.",
// 			}),
// 			igual: z.string({
// 				required_error: "Valor igual do gatilho não informado.",
// 				invalid_type_error: "Valor igual do gatilho inválido.",
// 			}),
// 			maiorQue: z
// 				.number({
// 					required_error: "Valor maior que do gatilho não informado.",
// 					invalid_type_error: "Valor maior que do gatilho inválido.",
// 				})
// 				.optional()
// 				.nullable(),
// 			menorQue: z
// 				.number({
// 					required_error: "Valor menor que do gatilho não informado.",
// 					invalid_type_error: "Valor menor que do gatilho inválido.",
// 				})
// 				.optional()
// 				.nullable(),
// 			intervaloMinimo: z
// 				.number({
// 					required_error: "Valor mínimo do intervalo do gatilho não informado.",
// 					invalid_type_error: "Valor mínimo do intervalo do gatilho inválido.",
// 				})
// 				.optional()
// 				.nullable(),
// 			intervaloMaximo: z
// 				.number({
// 					required_error: "Valor máximo do intervalo do gatilho não informado.",
// 					invalid_type_error: "Valor máximo do intervalo do gatilho inválido.",
// 				})
// 				.optional()
// 				.nullable(),
// 			incluiLista: z
// 				.array(
// 					z.string({
// 						required_error: "Lista de valores do gatilho não informada.",
// 						invalid_type_error: "Lista de valores do gatilho inválida.",
// 					}),
// 				)
// 				.optional()
// 				.nullable(),
// 		}),
// 	),
// });

export const ProjectJourneyStageWorkflowSchema = z.object({
	ordem: z.number({
		required_error: "Ordem do estágio não informada.",
		invalid_type_error: "Ordem do estágio inválida.",
	}),
	titulo: z.string({
		required_error: "Título do estágio não informado.",
		invalid_type_error: "Título do estágio inválido.",
	}),
	versao: z.literal("WORKFLOW"),
	acoes: z.array(
		z.object({
			tipo: z.enum(["ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP"]),
			metadados: z.object({
				whatsappTemplateId: z.string({
					required_error: "ID do template do WhatsApp não informado.",
					invalid_type_error: "ID do template do WhatsApp inválido.",
				}),
				whatsappMessageId: z
					.string({
						required_error: "ID da mensagem do WhatsApp não informado.",
						invalid_type_error: "ID da mensagem do WhatsApp inválido.",
					})
					.optional()
					.nullable(),
			}),
		}),
	),
	gatilho: ProjectJourneyStageWorkflowActionTriggerNativeSchema,
	concluido: z.boolean({
		required_error: "Status de conclusão do estágio não informado.",
		invalid_type_error: "Status de conclusão do estágio inválido.",
	}),
	dataConclusao: z
		.string({
			required_error: "Data de ativação não informada.",
			invalid_type_error: "Data de ativação inválida.",
		})
		.datetime({ message: "Formato inválido para data de ativação." })
		.optional()
		.nullable(),
});
export type TProjectJourneyStageWorkflow = z.infer<typeof ProjectJourneyStageWorkflowSchema>;

export const ProjectJourneySchema = z.object({
	anotacoes: z.string({
		required_error: "Anotações do projeto não informadas.",
		invalid_type_error: "Anotações do projeto inválidas.",
	}),
	estagios: z.array(z.discriminatedUnion("versao", [ProjectJourneyStageLegacySchema, ProjectJourneyStageWorkflowSchema])),
	dataUltimaInteracao: z
		.string({
			required_error: "Data da última interação não informada.",
			invalid_type_error: "Data da última interação inválida.",
		})
		.optional()
		.nullable(),
	dataEfetivacao: z
		.string({
			required_error: "Data de efetivação não informada.",
			invalid_type_error: "Data de efetivação inválida.",
		})
		.optional()
		.nullable(),
});
export type TProjectJourney = z.infer<typeof ProjectJourneySchema>;
export const PROJECT_JOURNEYS_COLLECTION_NAME = "projetos-jornadas";
