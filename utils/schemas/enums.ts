import z from "zod";

export const ConditionTypesEnumSchema = z.enum(
	["IGUAL_TEXTO", "IGUAL_NÚMERICO", "MAIOR_QUE_NÚMERICO", "MENOR_QUE_NÚMERICO", "INTERVALO_NÚMERICO", "INCLUI_LISTA"],
	{
		required_error: "Tipo de condicional não informado.",
		invalid_type_error: "Tipo não válido para tipo de condicional.",
	},
);
export type TConditionTypesEnum = z.infer<typeof ConditionTypesEnumSchema>;
