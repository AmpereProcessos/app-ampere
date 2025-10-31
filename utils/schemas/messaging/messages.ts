import { z } from "zod";

export const MessageSchema = z.object({
	chat: z.object({
		id: z.string({
			required_error: "ID do chat não informado.",
			invalid_type_error: "ID do chat inválido.",
		}),
	}),
	atendimento: z
		.object({
			id: z.string({
				required_error: "ID do atendimento não informado.",
				invalid_type_error: "ID do atendimento inválido.",
			}),
		})
		.optional()
		.nullable(),
	status: z.enum(["ENVIADO", "RECEBIDO", "LIDO"], {
		required_error: "Status da mensagem não informado.",
		invalid_type_error: "Status da mensagem inválido.",
	}),
	whatsappId: z
		.string({
			required_error: "Whatsapp ID da mensagem não informado.",
			invalid_type_error: "Whatsapp ID da mensagem inválido.",
		})
		.optional()
		.nullable(),
	whatsappStatus: z
		.enum(["PENDENTE", "ENVIADO", "ENTREGUE", "FALHOU"], {
			required_error: "Status do Whatsapp não informado.",
			invalid_type_error: "Status do Whatsapp inválido.",
		})
		.optional()
		.nullable(),
	conteudo: z.object({
		tipo: z.enum(["TEXTO", "IMAGEM", "AUDIO", "VIDEO", "DOCUMENTO"], {
			required_error: "Tipo de conteúdo da mensagem não informado.",
			invalid_type_error: "Tipo de conteúdo da mensagem inválido.",
		}),
		texto: z
			.string({
				required_error: "Texto da mensagem não informado.",
				invalid_type_error: "Texto da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaId: z
			.string({
				required_error: "ID da mídia da mensagem não informado.",
				invalid_type_error: "ID da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaUrl: z
			.string({
				required_error: "URL da mídia da mensagem não informada.",
				invalid_type_error: "URL da mídia da mensagem inválida.",
			})
			.optional()
			.nullable(),
		midiaTipo: z
			.string({
				required_error: "Tipo da mídia da mensagem não informado.",
				invalid_type_error: "Tipo da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaTamanho: z
			.number({
				required_error: "Tamanho da mídia da mensagem não informado.",
				invalid_type_error: "Tamanho da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaNomeArquivo: z
			.string({
				required_error: "Nome do arquivo da mídia da mensagem não informado.",
				invalid_type_error: "Nome do arquivo da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaTextoProcessado: z
			.string({
				required_error: "Texto processado da mídia da mensagem não informado.",
				invalid_type_error: "Texto processado da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaTextoProcessadoResumo: z
			.string({
				required_error: "Resumo do texto processado da mídia da mensagem não informado.",
				invalid_type_error: "Resumo do texto processado da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
		midiaWhatsappId: z
			.string({
				required_error: "Whatsapp ID da mídia da mensagem não informado.",
				invalid_type_error: "Whatsapp ID da mídia da mensagem inválido.",
			})
			.optional()
			.nullable(),
	}),
	autor: z.object({
		tipo: z.enum(["CLIENTE", "ATENDENTE", "AGENTE-IA"], {
			required_error: "Tipo do autor da mensagem não informado.",
			invalid_type_error: "Tipo do autor da mensagem inválido.",
		}),
		id: z.string({
			required_error: "ID do autor da mensagem não informado.",
			invalid_type_error: "ID do autor da mensagem inválido.",
		}),
		nome: z.string({
			required_error: "Nome do autor da mensagem não informado.",
			invalid_type_error: "Nome do autor da mensagem inválido.",
		}),
		avatar: z
			.string({
				required_error: "Avatar do autor da mensagem não informado.",
				invalid_type_error: "Avatar do autor da mensagem inválido.",
			})
			.optional()
			.nullable(),
	}),
	dataInsercao: z
		.string({
			required_error: "Data de inserção da mensagem não informada.",
			invalid_type_error: "Data de inserção da mensagem inválida.",
		})
		.datetime(),
});
export type TMessage = z.infer<typeof MessageSchema>;
