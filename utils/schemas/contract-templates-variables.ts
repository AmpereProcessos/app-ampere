import z from "zod";
import { ConditionTypesEnumSchema } from "./enums";

export const ContractTemplateVariableNativeSchema = z.object({
	titulo: z.string({
		required_error: "Título não informado",
		invalid_type_error: "Tipo inválido para título",
	}),
	identificador: z.string({
		required_error: "Identificador não informado",
		invalid_type_error: "Tipo inválido para identificador",
	}),
	descricao: z.string({
		required_error: "Descrição não informada",
		invalid_type_error: "Tipo inválido para descrição",
	}),
	categoria: z.literal("NATIVA"),
});
export type TContractTemplateVariableNative = z.infer<typeof ContractTemplateVariableNativeSchema>;
const ContractTemplateVariableComputedCondition = z.object({
	tipo: ConditionTypesEnumSchema,
	variavelId: z.string({
		required_error: "Variável ID não informado",
		invalid_type_error: "Tipo inválido para variável ID",
	}),
	igual: z
		.string({
			required_error: "Valor igual não informado",
			invalid_type_error: "Tipo inválido para valor igual",
		})
		.optional()
		.nullable(),
	maiorQue: z
		.number({
			required_error: "Valor maior que não informado",
			invalid_type_error: "Tipo inválido para valor maior que",
		})
		.optional()
		.nullable(),
	menorQue: z
		.number({
			required_error: "Valor menor que não informado",
			invalid_type_error: "Tipo inválido para valor menor que",
		})
		.optional()
		.nullable(),
	intervaloMinimo: z
		.number({
			required_error: "Valor mínimo do intervalo não informado",
			invalid_type_error: "Tipo inválido para valor mínimo do intervalo",
		})
		.optional()
		.nullable(),
	intervaloMaximo: z
		.number({
			required_error: "Valor máximo do intervalo não informado",
			invalid_type_error: "Tipo inválido para valor máximo do intervalo",
		})
		.optional()
		.nullable(),
	incluiLista: z
		.array(
			z.string({
				required_error: "Lista de valores não informada",
				invalid_type_error: "Tipo inválido para lista de valores",
			}),
		)
		.optional()
		.nullable(),
	valor: z.string({
		required_error: "Valor não informado",
		invalid_type_error: "Tipo inválido para valor",
	}),
});
export type TContractTemplateVariableComputedCondition = z.infer<typeof ContractTemplateVariableComputedCondition>;
export const ContractTemplateVariableComputedSchema = z.object({
	titulo: z.string({
		required_error: "Título não informado",
		invalid_type_error: "Tipo inválido para título",
	}),
	identificador: z.string({
		required_error: "Identificador não informado",
		invalid_type_error: "Tipo inválido para identificador",
	}),
	descricao: z.string({
		required_error: "Descrição não informada",
		invalid_type_error: "Tipo inválido para descrição",
	}),
	categoria: z.literal("COMPUTADA"),
	fallback: z.string({
		required_error: "Valor padrão não informado",
		invalid_type_error: "Tipo inválido para valor padrão",
	}),
	condicionais: z.array(ContractTemplateVariableComputedCondition),
});
export type TContractTemplateVariableComputed = z.infer<typeof ContractTemplateVariableComputedSchema>;
export const ContractTemplateVariableSchema = z.discriminatedUnion("categoria", [
	ContractTemplateVariableNativeSchema,
	ContractTemplateVariableComputedSchema,
]);
export type TContractTemplateVariable = z.infer<typeof ContractTemplateVariableSchema>;
