import { z } from "zod";
import { AuthorSchema } from "./users";

// Engineering Calls schema
export const EngineeringCallsSchema = z.object({
	abertura: z.string({
		required_error: "Data de abertura não informada.",
		invalid_type_error: "Tipo não válido para data de abertura",
	}),
	anotacoes: z
		.string({
			invalid_type_error: "Tipo não válido para anotações",
		})
		.optional(),
	fechamento: z
		.string({
			invalid_type_error: "Tipo não válido para data de fechamento",
		})
		.optional(),
	observacoes: z.string({
		required_error: "Observações não informadas.",
		invalid_type_error: "Tipo não válido para observações",
	}),
	projeto: z.string({
		required_error: "Projeto não informado.",
		invalid_type_error: "Tipo não válido para projeto",
	}),
	responsavel: z.string({
		required_error: "Responsável não informado.",
		invalid_type_error: "Tipo não válido para responsável",
	}),
	status: z
		.string({
			invalid_type_error: "Tipo não válido para status",
		})
		.optional(),
	responsavelUsuario: AuthorSchema.optional().nullable(),
	tipoDoChamado: z.string({
		required_error: "Tipo do chamado não informado.",
		invalid_type_error: "Tipo não válido para tipo do chamado",
	}),
});

export type TEngineeringCall = z.infer<typeof EngineeringCallsSchema>;
