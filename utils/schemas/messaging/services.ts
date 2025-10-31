import { z } from "zod";

export const ServiceSchema = z.object({
	status: z.enum(["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO", "CANCELADO"], {
		required_error: "Status do serviço não informado.",
		invalid_type_error: "Status do serviço inválido.",
	}),
	descricao: z.string({
		required_error: "Descrição do atendimento não informada.",
		invalid_type_error: "Descrição do atendimento inválida.",
	}),
	chat: z.object({
		id: z.string({
			required_error: "ID do chat não informado.",
			invalid_type_error: "ID do chat inválido.",
		}),
	}),
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
	atendente: z
		.object({
			tipo: z.enum(["USUÁRIO", "AGENTE-IA"], {
				required_error: "Tipo do atendente não informado.",
				invalid_type_error: "Tipo do atendente inválido.",
			}),
			id: z.string({
				required_error: "ID do atendente não informado.",
				invalid_type_error: "ID do atendente inválido.",
			}),
			nome: z.string({
				required_error: "Nome do atendente não informado.",
				invalid_type_error: "Nome do atendente inválido.",
			}),
			avatar: z
				.string({
					required_error: "Avatar do atendente não informado.",
					invalid_type_error: "Avatar do atendente inválido.",
				})
				.optional()
				.nullable(),
		})
		.optional()
		.nullable(),
	tags: z.array(z.any()),
	dataInicio: z
		.string({
			required_error: "Data de início do serviço não informada.",
			invalid_type_error: "Data de início do serviço inválida.",
		})
		.datetime(),
	dataFim: z
		.string({
			required_error: "Data de fim do serviço não informada.",
			invalid_type_error: "Data de fim do serviço inválida.",
		})
		.datetime()
		.optional()
		.nullable(),
});

export type TService = z.infer<typeof ServiceSchema>;
