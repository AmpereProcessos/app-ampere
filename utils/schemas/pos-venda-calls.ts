import { z } from "zod";
import { AuthorSchema } from "./users";

export const PosVendaCallSchema = z.object({
	titulo: z.string({
		required_error: "Título é obrigatório",
		invalid_type_error: "Título deve ser uma string",
	}),
	status: z.enum(["PENDENTE", "AGUARDANDO PAGAMENTO", "PAGO", "CONCLUÍDO"], {
		required_error: "Status é obrigatório",
		invalid_type_error: "Status deve ser uma string",
	}),
	descricao: z.string({
		required_error: "Descrição é obrigatória",
		invalid_type_error: "Descrição deve ser uma string",
	}),
	projeto: z
		.object({
			id: z.string({
				required_error: "ID do projeto é obrigatório",
				invalid_type_error: "ID do projeto deve ser uma string",
			}),
			identificador: z.string({
				required_error: "Identificador do projeto é obrigatório",
				invalid_type_error: "Identificador do projeto deve ser uma string",
			}),
			nome: z.string({
				required_error: "Nome do projeto é obrigatório",
				invalid_type_error: "Nome do projeto deve ser uma string",
			}),
			tipo: z.string({
				required_error: "Tipo do projeto é obrigatório",
				invalid_type_error: "Tipo do projeto deve ser uma string",
			}),
		})
		.optional()
		.nullable(),
	metadados: z.object({
		valor: z.number({
			required_error: "Valor é obrigatório",
			invalid_type_error: "Valor deve ser um número",
		}),
		dataPagamento: z
			.string({
				required_error: "Data de pagamento é obrigatória",
				invalid_type_error: "Data de pagamento deve ser uma string",
			})
			.datetime({
				message: "Data de pagamento deve ser uma data válida",
			})
			.optional()
			.nullable(),
	}),
	atualizacoes: z.array(
		z.object({
			descricao: z.string({
				required_error: "Descrição da atualização é obrigatória",
				invalid_type_error: "Descrição da atualização deve ser uma string",
			}),
			data: z.string({
				required_error: "Data da atualização é obrigatória",
				invalid_type_error: "Data da atualização deve ser uma string",
			}),
			autor: AuthorSchema,
		}),
		{
			required_error: "Atualizações são obrigatórias",
			invalid_type_error: "Atualizações devem ser um array",
		},
	),
	dataInsercao: z
		.string({
			required_error: "Data de inserção é obrigatória",
			invalid_type_error: "Data de inserção deve ser uma string",
		})
		.datetime({
			message: "Data de inserção deve ser uma data válida",
		}),
	dataUltimaAtualizacao: z
		.string({
			required_error: "Data da última atualização é obrigatória",
			invalid_type_error: "Data da última atualização deve ser uma string",
		})
		.datetime({
			message: "Data de inserção deve ser uma data válida",
		}),
	dataEfetivacao: z
		.string({
			required_error: "Data de efetivação é obrigatória",
			invalid_type_error: "Data de efetivação deve ser uma string",
		})
		.datetime({
			message: "Data de efetivação deve ser uma data válida",
		})
		.optional()
		.nullable(),
	autor: AuthorSchema.optional().nullable(),
});
export type TPosVendaCall = z.infer<typeof PosVendaCallSchema>;
export type TPosVendaCallDTO = TPosVendaCall & { _id: string };
