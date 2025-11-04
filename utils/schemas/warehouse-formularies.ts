import { z } from "zod";
import { AuthorSchema } from "./users";

const WarehouseFormularyMaterialSchema = z.object({
	id: z.string({ invalid_type_error: "Tipo inválido para o ID do material." }).optional().nullable(),
	nome: z.string({
		required_error: "Nome do material não informado.",
		invalid_type_error: "Tipo inválido para o nome do material.",
	}),
	preco: z.number({
		required_error: "Preço do material não informado.",
		invalid_type_error: "Tipo inválido para o preço do material.",
	}),
	idExterno: z
		.string({
			invalid_type_error: "Tipo inválido para o ID externo do material.",
		})
		.optional()
		.nullable(),
	grandeza: z
		.string({
			invalid_type_error: "Tipo inválido para a grandeza do material.",
		})
		.optional()
		.nullable(),
	qtdeRetirada: z.number({
		required_error: "Quantidade retirada do material não informada.",
		invalid_type_error: "Tipo inválido para a quantidade retirada do material.",
	}),
	qtdeRetiradaEfetivada: z.number({
		required_error: "Quantidade retirada efetivada do material não informada.",
		invalid_type_error: "Tipo inválido para a quantidade retirada efetivada do material.",
	}),
	qtdeDevolucao: z.number({
		required_error: "Quantidade devolvida do material não informada.",
		invalid_type_error: "Tipo inválido para a quantidade devolvida do material.",
	}),
	qtdeDevolucaoEfetivada: z.number({
		required_error: "Quantidade devolvida efetivada do material não informada.",
		invalid_type_error: "Tipo inválido para a quantidade devolvida efetivada do material.",
	}),
});

export const WarehouseFormularySchema = z.object({
	titulo: z.string({ required_error: "Titulo do formulário não informado.", invalid_type_error: "Tipo não válido para o tipo do formulário." }),
	categoria: z.string({
		required_error: "Categoria do formulário não informada.",
		invalid_type_error: "Tipo não válido para a categoria do formulário.",
	}),
	responsaveis: z.string({
		required_error: "Responsáveis do formulário não informados.",
		invalid_type_error: "Tipo não válido para os responsáveis.",
	}),
	projeto: z.object({
		id: z.string({ invalid_type_error: "Tipo não válido para o ID do projeto de referência." }).optional().nullable(),
		nome: z.string({ invalid_type_error: "Tipo não válido para o nome do projeto de referência." }).optional().nullable(),
		identificador: z
			.union([z.string(), z.number()], { invalid_type_error: "Tipo não válido para o identificador do projeto de referência." })
			.optional()
			.nullable(),
	}),
	localizacao: z.object({
		cep: z.union([z.string(), z.number()], { invalid_type_error: "Tipo inválido para CEP da localização." }).optional().nullable(),
		uf: z.string({ invalid_type_error: "Tipo inválido para a UF da localização." }).optional().nullable(),
		cidade: z.string({ invalid_type_error: "Tipo inválido para a cidade da localização." }).optional().nullable(),
		bairro: z.string({ invalid_type_error: "Tipo inválido para o bairro da localização." }),
		endereco: z.string({ invalid_type_error: "Tipo inválido para o endereço da localização." }),
		numeroOuIdentificador: z.string({ invalid_type_error: "Tipo inválido para o número/identificador da localização." }),
		complemento: z.string({ invalid_type_error: "Tipo inválido para o complemento da localização." }),
		distancia: z.number().optional().nullable(),
	}),
	materiais: z.array(WarehouseFormularyMaterialSchema),
	autor: AuthorSchema,
	dataEfetivacao: z
		.string({
			invalid_type_error: "Tipo inválido para a data de efetivação.",
		})
		.datetime({
			message: "Formato inválido para data de efetivação.",
		})
		.optional()
		.nullable(),
	dataInsercao: z
		.string({
			invalid_type_error: "Tipo inválido para a data de inserção.",
		})
		.datetime({
			message: "Formato inválido para data de inserção.",
		})
		.optional()
		.nullable(),
});

export const TransactionalWarehouseFormularySchema = WarehouseFormularySchema.omit({
	autor: true,
}).extend({
	materiais: z.array(
		WarehouseFormularyMaterialSchema.omit({
			qtdeDevolucaoEfetivada: true,
			qtdeRetiradaEfetivada: true,
		}),
	),
});
export type TNewWarehouseFormulary = z.infer<typeof WarehouseFormularySchema>;
export type TNewWarehouseFormularyDTO = TNewWarehouseFormulary & { _id: string };
export type TTransactionalWarehouseFormulary = z.infer<typeof TransactionalWarehouseFormularySchema>;
