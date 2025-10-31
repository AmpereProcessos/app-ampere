import { z } from "zod";

export const ChatSchema = z.object({
	whatsappTelefoneId: z
		.string({
			required_error: "Whatsapp Telefone ID não informado.",
			invalid_type_error: "Whatsapp Telefone ID inválido.",
		})
		.describe("ID do telefone empresarial utilizado para o chat."),
	whatsappJanelaAtiva: z
		.boolean({
			required_error: "Janela de comunicação do Whatsapp não informada.",
			invalid_type_error: "Janela de comunicação do Whatsapp inválida.",
		})
		.describe("Indica se a janela de 24 horas está aberta ou fechada."),
	cliente: z.object({
		id: z.string({
			required_error: "ID do cliente não informado.",
			invalid_type_error: "ID do cliente inválido.",
		}),
		nome: z.string({
			required_error: "Nome do cliente não informado.",
			invalid_type_error: "Nome do cliente inválido.",
		}),
		telefone: z.string({
			required_error: "Telefone do cliente não informado.",
			invalid_type_error: "Telefone do cliente inválido.",
		}),
		avatar: z
			.string({
				required_error: "Avatar do cliente não informado.",
				invalid_type_error: "Avatar do cliente inválido.",
			})
			.optional()
			.nullable(),
	}),
	mensagensNaoLidas: z
		.number({
			required_error: "Número de mensagens não lidas não informado.",
			invalid_type_error: "Número de mensagens não lidas inválidas.",
		})
		.describe("Número de mensagens não lidas pelos atendentes na conversa."),
	ultimaMensagemCliente: z
		.object({
			idMensagem: z.string({
				required_error: "ID da mensagem não informado.",
				invalid_type_error: "ID da mensagem inválido.",
			}),
			conteudoTipo: z.enum(["TEXTO", "IMAGEM", "AUDIO", "VIDEO", "DOCUMENTO"], {
				required_error: "Conteúdo do tipo não informado.",
				invalid_type_error: "Conteúdo do tipo inválido.",
			}),
			conteudoTexto: z
				.string({
					required_error: "Conteúdo da mensagem não informado.",
					invalid_type_error: "Conteúdo da mensagem inválido.",
				})
				.optional()
				.nullable(),
			data: z
				.string({
					required_error: "Data da mensagem não informada.",
					invalid_type_error: "Data da mensagem inválida.",
				})
				.datetime(),
		})
		.describe("Última mensagem enviada pelo cliente na conversa.")
		.optional()
		.nullable(),
	ultimaMensagemAtendente: z
		.object({
			idMensagem: z.string({
				required_error: "ID da mensagem não informado.",
				invalid_type_error: "ID da mensagem inválido.",
			}),
			conteudoTipo: z.enum(["TEXTO", "IMAGEM", "AUDIO", "VIDEO", "DOCUMENTO"], {
				required_error: "Conteúdo do tipo não informado.",
				invalid_type_error: "Conteúdo do tipo inválido.",
			}),
			conteudoTexto: z
				.string({
					required_error: "Conteúdo da mensagem não informado.",
					invalid_type_error: "Conteúdo da mensagem inválido.",
				})
				.optional()
				.nullable(),
			data: z
				.string({
					required_error: "Data da mensagem não informada.",
					invalid_type_error: "Data da mensagem inválida.",
				})
				.datetime(),
		})
		.describe("Última mensagem enviada pelo atendente na conversa.")
		.optional()
		.nullable(),
});

export type TChat = z.infer<typeof ChatSchema>;
