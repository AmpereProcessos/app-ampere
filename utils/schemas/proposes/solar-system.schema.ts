import { z } from "zod";

import { ObjectId } from "mongodb";

export const ModuleSchema = z.object({
	id: z.union([z.string(), z.number()]),
	fabricante: z.string(),
	modelo: z.string(),
	qtde: z.number(),
	potencia: z.number(),
	garantia: z.number(),
});
export type TModule = z.infer<typeof ModuleSchema>;
export const InverterSchema = z.object({
	id: z.union([z.string(), z.number()]),
	fabricante: z.string(),
	modelo: z.string(),
	qtde: z.number(),
	potenciaNominal: z.number(),
	garantia: z.number(),
});
export type TInverter = z.infer<typeof InverterSchema>;

const PricingItemSchema = z.object({
	margemLucro: z.number(),
	faturavel: z.boolean().optional().nullable(),
	imposto: z.number(),
	custo: z.number(),
	vendaProposto: z.number(),
	vendaFinal: z.number(),
});
export type TPricingItem = z.infer<typeof PricingItemSchema>;

export const GeneralSolarSystemProposeSchema = z.object({
	nome: z.string(),
	template: z.string(),
	projeto: z.object({
		nome: z.string(),
		id: z.string(),
	}),
	premissas: z.object({
		consumoEnergiaMensal: z.number(),
		fatorSimultaneidade: z.number(),
		distribuidora: z.string(),
		subgrupo: z.string().optional().nullable(),
		tarifaEnergia: z.number(),
		tarifaTUSD: z.number(),
		tensaoRede: z.string(),
		fase: z.string(),
		tipoEstrutura: z.string(),
		orientacao: z.string(),
		distancia: z.number(),
	}),
	kit: z.object({
		kitId: z.array(z.string()),
		tipo: z.union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")]),
		nome: z.string(),
		topologia: z.string(),
		modulos: z.array(ModuleSchema),
		inversores: z.array(InverterSchema),
		fornecedor: z.string(),
		preco: z.number(),
	}),
	precificacao: z.record(PricingItemSchema),
	linkArquivo: z.string().optional().nullable(),
	potenciaPico: z.number().optional().nullable(),
	valorProposta: z.number().optional().nullable(),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	dataInsercao: z.string().datetime(),
});
export const InsertSolarSystemProposeSchema = z.object({
	nome: z.string({ required_error: "Nome da proposta não fornecido.", invalid_type_error: "Tipo não válido para o nome da proposta." }),
	template: z.string({
		required_error: "Template não fornecido.",
		invalid_type_error: "Tipo não válido para template da proposta.",
	}),
	projeto: z.object({
		nome: z.string({
			required_error: "Nome de referência do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o nome de referência de projeto.",
		}),
		id: z.string({
			required_error: "ID de referência do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o ID de referência do projeto.",
		}),
	}),
	premissas: z.object({
		consumoEnergiaMensal: z.number({
			required_error: "Premissa de consumo de energia não fornecido.",
			invalid_type_error: "Tipo não válido para a premissa de consumo de energia.",
		}),
		fatorSimultaneidade: z.number({
			required_error: "Premissa de fator de simultaneidade não fornecido.",
			invalid_type_error: "Tipo não válido para a premissa de fator de simultaneidade.",
		}),
		distribuidora: z.string({
			required_error: "Premissa de distribuidora de energia não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de distribuidora de energia.",
		}),
		subgrupo: z
			.string({
				required_error: "Premissa de subgrupo de tarifa não fornecida.",
				invalid_type_error: "Tipo não válido para a premissa de subgrupo de tarifa.",
			})
			.optional()
			.nullable(),
		tarifaEnergia: z.number({
			required_error: "Premissa de tarifa de energia não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de tarifa de energia.",
		}),
		tarifaTUSD: z.number({
			required_error: "Premissa de tarifa de fio B não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de tarifa de fio B.",
		}),
		tensaoRede: z.string({
			required_error: "Premissa de tensão de rede não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de tensão de rede.",
		}),
		fase: z.string({
			required_error: "Premissa de fase de distribuição não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de fase de distribuição.",
		}),
		tipoEstrutura: z.string({
			required_error: "Premissa de tipo de estrutura não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de tipo de estrutura.",
		}),
		orientacao: z.string({
			required_error: "Premissa de orientação não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de orientação.",
		}),
		distancia: z.number({
			required_error: "Premissa de distância não fornecida.",
			invalid_type_error: "Tipo não válido para a premissa de distância.",
		}),
	}),
	kit: z.object({
		kitId: z.array(z.string()).min(1, "Adicione ao menos um kit."),
		tipo: z.union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")], { required_error: "Tipo do kit não fornecido." }),
		nome: z.string({ required_error: "Nome do kit não fornecido.", invalid_type_error: "Tipo não válido para o nome do kit." }),
		topologia: z.string({ required_error: "Topologia do kit não fornecida.", invalid_type_error: "Tipo não válido para a topologia do kit." }),
		modulos: z.array(ModuleSchema, {
			required_error: "Informações sobre os módulos não fornecidas.",
			invalid_type_error: "Tipo não válido para informações de módulos.",
		}),
		inversores: z.array(InverterSchema, {
			required_error: "Informações sobre os inversores não fornecida.",
			invalid_type_error: "Tipo não válido para as informações dos inversores.",
		}),
		fornecedor: z.string({ required_error: "Fornecedor não fornecido.", invalid_type_error: "Tipo não válido para o fornecedor." }),
		preco: z.number({ required_error: "Preço do kit não fornecido.", invalid_type_error: "Tipo não válido para o preço do kit." }),
	}),
	precificacao: z.record(PricingItemSchema),
	linkArquivo: z.string({ invalid_type_error: "Tipo não válido para o link do arquivo." }).optional().nullable(),
	potenciaPico: z.number({ invalid_type_error: "Tipo não válido para a potência pico." }).optional().nullable(),
	valorProposta: z.number({ invalid_type_error: "Tipo não válido para o valor da proposta." }).optional().nullable(),
	autor: z.object({
		id: z.string({
			required_error: "ID de referência do autor não fornecido.",
			invalid_type_error: "Tipo não válido para o ID de referência do autor.",
		}),
		nome: z.string({ required_error: "Nome do autor não fornecido.", invalid_type_error: "Tipo n]ao válido para o nome do autor." }),
		avatar_url: z.string({ invalid_type_error: "Tipo não válido para o avatar o autor." }).optional().nullable(),
	}),
	dataInsercao: z.string().datetime(),
});
export const SolarSystemProposeEntitySchema = z.object({
	_id: z.instanceof(ObjectId),
	nome: z.string(),
	template: z.string(),
	projeto: z.object({
		nome: z.string(),
		id: z.string(),
	}),
	premissas: z.object({
		consumoEnergiaMensal: z.number(),
		fatorSimultaneidade: z.number(),
		distribuidora: z.string(),
		subgrupo: z.string().optional().nullable(),
		tarifaEnergia: z.number(),
		tarifaTUSD: z.number(),
		tensaoRede: z.string(),
		fase: z.string(),
		tipoEstrutura: z.string(),
		orientacao: z.string(),
		distancia: z.number(),
	}),
	kit: z.object({
		kitId: z.array(z.string()),
		tipo: z.union([z.literal("TRADICIONAL"), z.literal("PROMOCIONAL")]),
		nome: z.string(),
		topologia: z.string(),
		modulos: z.array(ModuleSchema),
		inversores: z.array(InverterSchema),
		fornecedor: z.string(),
		preco: z.number(),
	}),
	precificacao: z.record(PricingItemSchema),
	linkArquivo: z.string().optional().nullable(),
	potenciaPico: z.number().optional().nullable(),
	valorProposta: z.number().optional().nullable(),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	dataInsercao: z.string().datetime(),
});
export type TSolarSystemPropose = z.infer<typeof GeneralSolarSystemProposeSchema>;

export type TSolarSystemProposeEntity = z.infer<typeof SolarSystemProposeEntitySchema>;

export type TSolarSystemProposeDTO = TSolarSystemProposeEntity & { _id: string };
