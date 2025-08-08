import { z } from "zod";
import { AuthorSchema } from "./users";

export const PropertyMetadataVehicleSchema = z.object({
	tipo: z.literal("VEÍCULO"),
	kmInicial: z.number({
		required_error: "Kilometragem inicial não informada.",
		invalid_type_error: "Tipo não válido para a kilometragem inicial.",
	}),
	kmAcumulado: z.number({
		required_error: "Kilometragem acumulada não informada.",
		invalid_type_error: "Tipo não válido para a kilometragem acumulada.",
	}),
	kmIntervaloRevisao: z.number({
		required_error: "Kilometragem do intervalo de revisão não informada.",
		invalid_type_error: "Tipo não válido para a kilometragem do intervalo de revisão.",
	}),
	kmProximaRevisao: z.number({
		required_error: "Kilometragem da próxima manutenção não informada.",
		invalid_type_error: "Tipo não válido para a kilometragem da próxima manutenção.",
	}),
	revisoes: z.array(
		z.object({
			km: z.number({
				required_error: "Kilometragem da revisão não informada.",
				invalid_type_error: "Tipo não válido para a kilometragem da revisão.",
			}),
			data: z.string().datetime({ message: "Tipo inválido para a data da revisão." }),
		}),
	),
});
export type TPropertyMetadataVehicle = z.infer<typeof PropertyMetadataVehicleSchema>;
const GeneralPropertySchema = z.object({
	nome: z.string(),
	identificador: z.string(),
	imagemUrl: z.string().optional().nullable(),
	metadados: z.discriminatedUnion("tipo", [PropertyMetadataVehicleSchema]),
	autor: AuthorSchema,
	dataInsercao: z.string().datetime(),
});
export const InsertPropertySchema = z.object({
	nome: z.string({ required_error: "Nome da propriedade não informado.", invalid_type_error: "Tipo não válido para o nome da propriedade." }),
	identificador: z.string({
		required_error: "Identificador da propriedade não informado.",
		invalid_type_error: "Tipo não válido para o identificador da propriedade.",
	}),
	imagemUrl: z.string().optional().nullable(),
	metadados: z.discriminatedUnion("tipo", [PropertyMetadataVehicleSchema]),
	autor: AuthorSchema,
	dataInsercao: z
		.string({ required_error: "Data de inserção não informada.", invalid_type_error: "Tipo não válido para a data de inserção da propriedade." })
		.datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TProperty = z.infer<typeof GeneralPropertySchema>;

export type TPropertyDTO = TProperty & { _id: string };

export const PropertyUsageVehicleUsageMetadataSchema = z.object({
	tipo: z.literal("USO DE VEÍCULO"),
	kmInicial: z.number({
		required_error: "Kilometragem inicial não informada.",
		invalid_type_error: "Tipo não válido para a kilometragem inicial.",
	}),
	kmFinal: z
		.number({
			required_error: "Kilometragem final não informada.",
		})
		.optional()
		.nullable(),
});
export type TPropertyUsageVehicleUsageMetadata = z.infer<typeof PropertyUsageVehicleUsageMetadataSchema>;

export const PropertyTemporaryUsageSchema = z.object({
	propriedade: z.object({
		id: z.string({
			required_error: "ID da propriedade não informado.",
			invalid_type_error: "Tipo não válido para o ID da propriedade.",
		}),
		nome: z.string({
			required_error: "Nome da propriedade não informado.",
			invalid_type_error: "Tipo não válido para o nome da propriedade.",
		}),
		identificador: z.string({
			required_error: "Identificador da propriedade não informado.",
			invalid_type_error: "Tipo não válido para o identificador da propriedade.",
		}),
		imagemUrl: z
			.string({
				required_error: "URL da imagem da propriedade não informada.",
				invalid_type_error: "Tipo não válido para a URL da imagem da propriedade.",
			})
			.optional()
			.nullable(),
	}),
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
	arquivos: z.array(
		z.object({
			titulo: z.string({
				required_error: "Título do arquivo não informado.",
				invalid_type_error: "Tipo não válido para o título do arquivo.",
			}),
			url: z.string({
				required_error: "URL do arquivo não informada.",
				invalid_type_error: "Tipo não válido para a URL do arquivo.",
			}),
			tamanho: z.number({
				required_error: "Tamanho do arquivo não informado.",
				invalid_type_error: "Tipo não válido para o tamanho do arquivo.",
			}),
			formato: z.string({
				required_error: "Formato do arquivo não informado.",
				invalid_type_error: "Tipo não válido para o formato do arquivo.",
			}),
		}),
	),
	anotacoes: z
		.string({
			invalid_type_error: "Tipo não válido para as anotações.",
		})
		.optional()
		.nullable(),
	metadados: z.discriminatedUnion("tipo", [PropertyUsageVehicleUsageMetadataSchema]),
	dataInicio: z.string().datetime({ message: "Tipo inválido para a data de início." }).optional().nullable(),
	dataFim: z.string().datetime({ message: "Tipo inválido para a data de fim." }).optional().nullable(),
	autor: AuthorSchema.extend({
		cpf: z.string({
			required_error: "CPF do autor não informado.",
			invalid_type_error: "Tipo não válido para o CPF do autor.",
		}),
		telefone: z.string({
			required_error: "Telefone do autor não informado.",
			invalid_type_error: "Tipo não válido para o telefone do autor.",
		}),
	}),
	dataInsercao: z.string().datetime({ message: "Tipo inválido para a data de inserção." }),
});
export type TPropertyTemporaryUsage = z.infer<typeof PropertyTemporaryUsageSchema>;
export type TPropertyTemporaryUsageDTO = TPropertyTemporaryUsage & { _id: string };
