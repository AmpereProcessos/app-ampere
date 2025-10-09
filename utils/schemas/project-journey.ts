import z from "zod";

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
	dataConclusao: z.string({
		required_error: "Data de conclusão do estágio não informada.",
		invalid_type_error: "Data de conclusão do estágio inválida.",
	}),
});

export const ProjectJourneyStageWorkflowActionTriggerNativeSchema = z.object({
	tipo: z.literal("NATIVO"),
	evento: z.enum(["CONTRATO_LIBERADO", "CONTRATO_ASSINADO", "HOMOLOGACAO_ACESSO_SOLICITADO", "HOMOLOGACAO_ACESSO_LIBERADO", "PAGAMENTO_LIBERADO"]),
});
export const ProjectJourneyStageWorkflowActionTriggerConfiguredSchema = z.object({
	tipo: z.literal("CONFIGURADO"),
	condicoes: z.array(
		z.object({
			tipo: z.enum(["AND", "OR"]),
			variavel: z.string({
				required_error: "Variável do gatilho não informada.",
				invalid_type_error: "Variável do gatilho inválida.",
			}),
			igual: z.string({
				required_error: "Valor igual do gatilho não informado.",
				invalid_type_error: "Valor igual do gatilho inválido.",
			}),
			maiorQue: z
				.number({
					required_error: "Valor maior que do gatilho não informado.",
					invalid_type_error: "Valor maior que do gatilho inválido.",
				})
				.optional()
				.nullable(),
			menorQue: z
				.number({
					required_error: "Valor menor que do gatilho não informado.",
					invalid_type_error: "Valor menor que do gatilho inválido.",
				})
				.optional()
				.nullable(),
			intervaloMinimo: z
				.number({
					required_error: "Valor mínimo do intervalo do gatilho não informado.",
					invalid_type_error: "Valor mínimo do intervalo do gatilho inválido.",
				})
				.optional()
				.nullable(),
			intervaloMaximo: z
				.number({
					required_error: "Valor máximo do intervalo do gatilho não informado.",
					invalid_type_error: "Valor máximo do intervalo do gatilho inválido.",
				})
				.optional()
				.nullable(),
			incluiLista: z
				.array(
					z.string({
						required_error: "Lista de valores do gatilho não informada.",
						invalid_type_error: "Lista de valores do gatilho inválida.",
					}),
				)
				.optional()
				.nullable(),
		}),
	),
});

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
				whatsappMessageId: z.string({
					required_error: "ID da mensagem do WhatsApp não informado.",
					invalid_type_error: "ID da mensagem do WhatsApp inválido.",
				}),
			}),
		}),
	),
	gatilho: ProjectJourneyStageWorkflowActionTriggerNativeSchema,
});

export const ProjectJourneySchema = z.object({
	projeto: z.object({
		id: z.string({
			required_error: "ID do projeto é obrigatório",
		}),
		identificador: z.string({
			required_error: "Identificador do projeto é obrigatório",
		}),
		nome: z.string({
			required_error: "Nome do projeto é obrigatório",
		}),
		tipo: z.string({
			required_error: "Tipo do projeto é obrigatório",
		}),
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
