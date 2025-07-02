import { ObjectId } from "mongodb";
import { z } from "zod";

export const GeneralMaterialSchema = z.object({
	alocadorId: z
		.string({
			invalid_type_error: "Tipo não válido para o ID do alocador do material.",
		})
		.optional()
		.nullable(),
	nome: z.string({
		required_error: "Nome do material não informado.",
		invalid_type_error: "Tipo não válido para o nome do material.",
	}),
	nomeTecnico: z.string({ invalid_type_error: "Tipo não válido para o nome técnico do material." }).optional().nullable(),
	preco: z.number({
		required_error: "Preço do material não informado.",
		invalid_type_error: "Tipo não válido para o preço do material.",
	}),
	qtde: z.number({
		required_error: "Quantidade do material não informada.",
		invalid_type_error: "Tipo não válido para a quantidade do material.",
	}),
	qtdeMaxima: z
		.number({
			invalid_type_error: "Tipo não válido para a quantidade máxima do material.",
		})
		.optional()
		.nullable(),
	qtdeMinima: z
		.number({
			invalid_type_error: "Tipo não válido para a quantidade mínima do material.",
		})
		.optional()
		.nullable(),
	localizacao: z
		.string({
			invalid_type_error: "Tipo não válido para a localização do material.",
		})
		.optional()
		.nullable(),
	grandeza: z
		.string({
			invalid_type_error: "Tipo não válido para a grandeza do material.",
		})
		.optional()
		.nullable(),
	codigo: z
		.string({
			invalid_type_error: "Tipo não válido para o código do material.",
		})
		.optional()
		.nullable(),
	anotacoes: z
		.string({
			invalid_type_error: "Tipo não válido para as anotações do material.",
		})
		.optional()
		.nullable(),
	recontagem: z
		.object({
			data: z.string({
				required_error: "Data de recontagem não informada.",
				invalid_type_error: "Tipo não válido para a data de recontagem.",
			}),
			responsavel: z.string({
				required_error: "Responsável pela recontagem não informado.",
				invalid_type_error: "Tipo não válido para o responsável pela recontagem.",
			}),
		})
		.optional()
		.nullable(),
	alteracao: z
		.object({
			id: z.string({
				required_error: "ID do responsável pela alteração não informado.",
				invalid_type_error: "Tipo não válido para o ID do responsável pela alteração.",
			}),
			nome: z.string({
				required_error: "Nome do responsável pela alteração não informado.",
				invalid_type_error: "Tipo não válido para o nome do responsável pela alteração.",
			}),
			avatar_url: z
				.string({
					invalid_type_error: "Tipo não válido para o URL do avatar do responsável.",
				})
				.optional()
				.nullable(),
			dataAlteracao: z.string({
				required_error: "Data da última alteração não informada.",
				invalid_type_error: "Tipo não válido para a data da última alteração.",
			}),
		})
		.optional()
		.nullable(),
	dataInsercao: z
		.string({
			required_error: "Data de inserção não informada.",
			invalid_type_error: "Tipo não válido para a data de inserção.",
		})
		.datetime({
			message: "Data de inserção não informada ou inválida.",
		}),
});

export const InsertMaterialSchema = z.object({
	alocadorId: z.string({ required_error: "Alocador do material não fornecido.", invalid_type_error: "Tipo não válido para o alocador do material." }).optional().nullable(),
	nome: z
		.string({ required_error: "Nome do material não fornecido.", invalid_type_error: "Tipo não válido para o nome do material." })
		.min(3, "Nome do material deve conter ao menos 3 caracteres."),
	nomeTecnico: z.string({ required_error: "Nome técnico do material não fornecido.", invalid_type_error: "Tipo não válido para o nome técnico do material." }).optional().nullable(),
	preco: z.number({ required_error: "Preço do material não fornecido.", invalid_type_error: "Tipo não válido para o preço do material." }),
	qtde: z.number({ required_error: "Quantidade do material não fornecido.", invalid_type_error: "Tipo não válido para o quantidade do material." }),
	qtdeMaxima: z
		.number({
			required_error: "Quantidade máxima do material não fornecido.",
			invalid_type_error: "Tipo não válido para o quantidade máxima do material.",
		})
		.optional()
		.nullable(),
	qtdeMinima: z
		.number({
			required_error: "Quantidade mínima do material não fornecido.",
			invalid_type_error: "Tipo não válido para o quantidade mínima do material.",
		})
		.optional()
		.nullable(),
	localizacao: z.string({ required_error: "Localização do material não fornecido.", invalid_type_error: "Tipo não válido para o Localização do material." }).optional().nullable(),
	grandeza: z.string({ required_error: "Grandeza do material não fornecido.", invalid_type_error: "Tipo não válido para o grandeza do material." }).optional().nullable(),
	codigo: z.string({ required_error: "Código do material não fornecido.", invalid_type_error: "Tipo não válido para o código do material." }).optional().nullable(),
	anotacoes: z.string().optional().nullable(),
	recontagem: z
		.object({
			data: z.string(),
			responsavel: z.string(),
		})
		.optional()
		.nullable(),
	alteracao: z
		.object({
			id: z.string(),
			nome: z.string(),
			avatar_url: z.string().optional().nullable(),
			dataAlteracao: z.string(),
		})
		.optional()
		.nullable(),
	dataInsercao: z.string({ required_error: "Data de inserção não informada." }).datetime(),
});

export const InputMaterialUpdateSchema = z.object({
	qtdeEntrada: z.number({
		required_error: "Quantidade em entrada não informada.",
		invalid_type_error: "Tipo não válido para quantidade em entrada.",
	}),
	precoEntrada: z.number({
		required_error: "Preço em entrada não informada.",
		invalid_type_error: "Tipo não válido para preço em entrada.",
	}),
});

export type TInputMaterialData = z.infer<typeof InputMaterialUpdateSchema>;
export type TMaterial = z.infer<typeof GeneralMaterialSchema>;
export type TMaterialDTO = TMaterial & { _id: string };

export const MaterialSimplifiedProjection = {
	nome: 1,
	alocadorId: 1,
	qtde: 1,
	codigo: 1,
	preco: 1,
	grandeza: 1,
};
export type TMaterialSimplified = Pick<TMaterial, "nome" | "alocadorId" | "qtde" | "codigo" | "preco" | "grandeza">;
export type TMaterialSimplifiedDTO = TMaterialSimplified & { _id: string };

export type TMaterialSimplifiedWithAlocator = TMaterialSimplified & { alocadorDados?: { _id: string; nome: string } };
export type TMaterialSimplifiedWithAlocatorDTO = TMaterialSimplifiedWithAlocator & { _id: string };

export const QueryVinculationMaterialsFiltersSchema = z.object({
	search: z.string({ required_error: "Filtro de pesquisa não informado.", invalid_type_error: "Tipo não válido para o filtro de pesquisa." }),
});
export type TQueryVinculationMaterialsFilter = z.infer<typeof QueryVinculationMaterialsFiltersSchema>;

export const QueryMaterialsFiltersSchema = z.object({
	page: z.number({
		required_error: "Número da página não informado.",
		invalid_type_error: "Tipo não válido para o número da página.",
	}),
	name: z.string({
		required_error: "Filtro de nome não informado.",
		invalid_type_error: "Tipo não válido para o filtro de nome.",
	}),
	quantity: z.object({
		greaterThan: z
			.number({
				required_error: "Filtro de quantidade não informado.",
				invalid_type_error: "Tipo não válido para filtro de quantidade maior que.",
			})
			.optional()
			.nullable(),
		lessThan: z
			.number({
				required_error: "Filtro de quantidade não informado.",
				invalid_type_error: "Tipo não válido para filtro de quantidade menor que.",
			})
			.optional()
			.nullable(),
	}),
	price: z.object({
		greaterThan: z
			.number({
				required_error: "Filtro de preço não informado.",
				invalid_type_error: "Tipo não válido para filtro de preço maior que.",
			})
			.optional()
			.nullable(),
		lessThan: z
			.number({
				required_error: "Filtro de preço não informado.",
				invalid_type_error: "Tipo não válido para filtro de preço menor que.",
			})
			.optional()
			.nullable(),
	}),
	period: z.object({
		field: z.enum(["dataInsercao"]).optional().nullable(),
		after: z
			.string({
				required_error: "Filtros de período não informados.",
				invalid_type_error: "Tipo não válido para os filtros de período.",
			})
			.optional()
			.nullable(),
		before: z
			.string({
				required_error: " Filtros de período não informados.",
				invalid_type_error: "Tipo não válido para os filtros de período.",
			})
			.optional()
			.nullable(),
	}),
	belowMinimum: z.boolean({
		invalid_type_error: "Tipo não válido para filtro de materiais abaixo do mínimo.",
	}),
	aboveMaximum: z.boolean({
		invalid_type_error: "Tipo não válido para filtro de materiais abaixo do mínimo.",
	}),
	minimumUndefined: z.boolean({
		invalid_type_error: "Tipo não válido para filtro de materiais com mínimo indefinido.",
	}),
	maximumUndefined: z.boolean({
		invalid_type_error: "Tipo não válido para filtro de materiais com máximo indefinido.",
	}),
});
export type TQueryMaterialsFiltersSchema = z.infer<typeof QueryMaterialsFiltersSchema>;
