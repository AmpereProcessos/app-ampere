import { z } from "zod";
import { AuthorSchema } from "./users";

export const TagSchema = z.object({
	titulo: z.string({
		required_error: "Título da tag não informado.",
		invalid_type_error: "Tipo não válido para o título da tag.",
	}),
	cores: z.object({
		primaria: z.string({
			required_error: "Código da cor da etiqueta não fornecido.",
			invalid_type_error: "Tipo não válido para o código de cor da etiqueta.",
		}),
		secundaria: z.string({
			required_error: "Código da cor secundária da etiqueta não fornecido.",
			invalid_type_error: "Tipo não válido para o código de cor secundária da etiqueta.",
		}),
	}),
	entidades: z.object({
		oportunidades: z
			.boolean({
				required_error: "Flag para liberação da etiqueta à oportunidades não definida.",
				invalid_type_error: "Tipo não válido para a flag de liberação da etiqueta à oportunidades.",
			})
			.optional()
			.nullable(),
		propostas: z
			.boolean({
				required_error: "Flag para liberação da etiqueta à propostas não definida.",
				invalid_type_error: "Tipo não válido para a flag de liberação da etiqueta à propostas.",
			})
			.optional()
			.nullable(),
		compras: z
			.boolean({
				required_error: "Flag para liberação da etiqueta à compras não definida.",
				invalid_type_error: "Tipo não válido para a flag de liberação da etiqueta à compras.",
			})
			.optional()
			.nullable(),
		projetos: z
			.boolean({
				required_error: "Flag para liberação da etiqueta à projetos não definida.",
				invalid_type_error: "Tipo não válido para a flag de liberação da etiqueta à projetos.",
			})
			.optional()
			.nullable(),
		ordensServico: z
			.boolean({
				required_error: "Flag para liberação da etiqueta à ordens de serviço não definida.",
				invalid_type_error: "Tipo não válido para a flag de liberação da etiqueta à ordens de serviço.",
			})
			.optional()
			.nullable(),
	}),
	autor: AuthorSchema,
	dataInsercao: z.string({
		required_error: "Data de inserção da tag não informada.",
		invalid_type_error: "Tipo não válido para a data de inserção.",
	}),
});

export type TTag = z.infer<typeof TagSchema>;
export type TTagDTO = TTag & { _id: string };
