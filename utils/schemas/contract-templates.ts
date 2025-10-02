import z from "zod";
import { AuthorSchema } from "./users";

export const ContractTemplateSchema = z.object({
	titulo: z.string({
		required_error: "Título não informado",
		invalid_type_error: "Tipo inválido para título",
	}),
	descricao: z.string({
		required_error: "Descrição não informada",
		invalid_type_error: "Tipo inválido para descrição",
	}),
	conteudo: z.string({
		required_error: "Conteúdo não informado",
		invalid_type_error: "Tipo inválido para conteúdo",
	}),
	autor: AuthorSchema,
	dataInsercao: z
		.string({
			invalid_type_error: "Tipo inválido para data de inserção",
		})
		.datetime({ message: "Tipo inválido para data de inserção" }),
});
export type TContractTemplate = z.infer<typeof ContractTemplateSchema>;
