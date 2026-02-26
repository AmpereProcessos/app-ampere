import { z } from "zod";
import { AuthorSchema } from "./users";

export const TransportControlTransportItemSchema = z.object({
	ordem: z
		.number({
			required_error: "Ordem é obrigatória",
			invalid_type_error: "Ordem deve ser um número",
		})
		.describe("Ordem do transporte na rota."),
	id: z
		.string({
			required_error: "ID é obrigatório",
			invalid_type_error: "ID deve ser uma string",
		})
		.describe("ID do transporte (controle de compra)."),
	titulo: z
		.string({
			required_error: "Título é obrigatório",
			invalid_type_error: "Título deve ser uma string",
		})
		.describe("Título do transporte (controle de compra)."),
	projeto: z.object(
		{
			id: z
				.string({
					required_error: "ID do projeto é obrigatório",
					invalid_type_error: "ID do projeto deve ser uma string",
				})
				.optional()
				.nullable(),
			nome: z
				.string({
					required_error: "Nome do projeto é obrigatório",
					invalid_type_error: "Nome do projeto deve ser uma string",
				})
				.optional()
				.nullable(),
		},
		{
			required_error: "Projeto é obrigatório",
			invalid_type_error: "Projeto deve ser um objeto",
		},
	),
	anexos: z.array(
		z.object(
			{
				idArquivoReferencia: z.string({
					required_error: "ID do arquivo de referência é obrigatório",
				}),

				titulo: z
					.string({
						required_error: "Título é obrigatório",
						invalid_type_error: "Título deve ser uma string",
					})
					.describe("Título do anexo."),
				identificador: z
					.string({
						invalid_type_error: "Identificador deve ser uma string",
					})
					.optional()
					.nullable()
					.describe("Identificador de configuração do anexo."),
				url: z
					.string({
						required_error: "URL é obrigatória",
						invalid_type_error: "URL deve ser uma string",
					})
					.describe("URL do anexo."),
				formato: z.string({
					required_error: "Formato é obrigatório",
					invalid_type_error: "Formato deve ser uma string",
				}),
				tamanho: z.number({
					required_error: "Tamanho é obrigatório",
					invalid_type_error: "Tamanho deve ser um número",
				}),
			},
			{
				required_error: "Anexos é obrigatório",
				invalid_type_error: "Anexos deve ser um array",
			},
		),
		{
			required_error: "Anexos é obrigatório",
			invalid_type_error: "Anexos deve ser um array",
		},
	),
	dataEfetivacao: z
		.string({
			invalid_type_error: "Data de efetivação deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("Data de efetivação/entrega do transporte."),
});
export const TransportControlCostItemSchema = z.object({
	identificador: z
		.string({
			invalid_type_error: "Identificador deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("Identificador de configuração do custo."),
	descricao: z
		.string({
			required_error: "Descrição é obrigatória",
			invalid_type_error: "Descrição deve ser uma string",
		})
		.describe("Descrição do custo."),
	valor: z
		.number({
			required_error: "Valor é obrigatório",
			invalid_type_error: "Valor deve ser um número",
		})
		.describe("Valor do custo."),
	anexos: z.array(
		z.object(
			{
				idArquivoReferencia: z.string({
					required_error: "ID do arquivo de referência é obrigatório",
				}),
				titulo: z.string({
					required_error: "Título é obrigatório",
					invalid_type_error: "Título deve ser uma string",
				}),
				url: z.string({
					required_error: "URL é obrigatória",
					invalid_type_error: "URL deve ser uma string",
				}),
				formato: z.string({
					required_error: "Formato é obrigatório",
					invalid_type_error: "Formato deve ser uma string",
				}),
				tamanho: z.number({
					required_error: "Tamanho é obrigatório",
					invalid_type_error: "Tamanho deve ser um número",
				}),
			},
			{
				required_error: "Anexos é obrigatório",
				invalid_type_error: "Anexos deve ser um array",
			},
		),
	),
});
export const TransportControlSchema = z.object({
	identificador: z
		.number({
			required_error: "Identificador é obrigatório",
			invalid_type_error: "Identificador deve ser um número",
		})
		.describe("Identificador númerico único para o controle de transporte"),
	titulo: z
		.string({
			required_error: "Título é obrigatório",
			invalid_type_error: "Título deve ser uma string",
		})
		.describe("Título do controle de transporte."),
	responsaveis: z.array(
		z.object({
			id: z.string({
				required_error: "ID do responsável não informado.",
				invalid_type_error: "Tipo não válido para o ID do responsável.",
			}),
			nome: z.string({
				required_error: "Nome do responsável não informado.",
				invalid_type_error: "Tipo não válido para o nome do responsável.",
			}),
			avatar_url: z
				.string({
					required_error: "Avatar do responsável não informado.",
					invalid_type_error: "Tipo não válido para o avatar do responsável.",
				})
				.optional()
				.nullable(),
			telefone: z.string({
				required_error: "Telefone do responsável não informado.",
				invalid_type_error: "Tipo não válido para o telefone do responsável.",
			}),
		}),
	),
	itens: z.array(TransportControlTransportItemSchema, {
		required_error: "Itens é obrigatório",
		invalid_type_error: "Itens deve ser um array",
	}),
	configuracoes: z.object({
		custoQuilometragem: z.number({
			required_error: "Custo quilométrico é obrigatório",
			invalid_type_error: "Custo quilométrico deve ser um número",
		}),
	}),
	distanciaQuilometragemInicial: z
		.number({
			invalid_type_error: "Distância quilométrica inicial deve ser um número",
		})
		.optional()
		.nullable()
		.describe("Distância quilométrica inicial do transporte geral."),
	distanciaQuilometragemInicialImagemUrl: z
		.string({
			invalid_type_error: "URL da imagem da distância quilométrica inicial deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("URL da imagem da distância quilométrica inicial do transporte geral."),
	distanciaQuilometragemFinal: z
		.number({
			invalid_type_error: "Distância quilométrica final deve ser um número",
		})
		.optional()
		.nullable()
		.describe("Distância quilométrica final do transporte geral."),
	distanciaQuilometragemFinalImagemUrl: z
		.string({
			invalid_type_error: "URL da imagem da distância quilométrica final deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("URL da imagem da distância quilométrica final do transporte geral."),
	dataInicio: z
		.string({
			required_error: "Data de início é obrigatória",
			invalid_type_error: "Data de início deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("Data de início do transporte geral."),
	dataFim: z
		.string({
			invalid_type_error: "Data de fim deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("Data de fim do transporte geral."),
	custos: z.array(TransportControlCostItemSchema, {
		required_error: "Custos é obrigatório",
		invalid_type_error: "Custos deve ser um array",
	}),
	autor: AuthorSchema,
	dataValidacao: z
		.string({
			invalid_type_error: "Data de validação deve ser uma string",
		})
		.optional()
		.nullable()
		.describe("Data de validação do transporte geral."),
	dataInsercao: z
		.string({
			required_error: "Data de inserção é obrigatória",
			invalid_type_error: "Data de inserção deve ser uma string",
		})
		.datetime({ message: "Data de inserção deve ser uma data válida" }),
});
export type TTransportControl = z.infer<typeof TransportControlSchema>;
