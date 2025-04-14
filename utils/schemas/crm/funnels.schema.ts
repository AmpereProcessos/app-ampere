import { z } from "zod";

export const GeneralFunnelSchema = z.object({
	nome: z.string({
		required_error: "Nome do funil não informado.",
		invalid_type_error: "Tipo não válido para o nome do funil.",
	}),
	descricao: z.string({
		required_error: "Descrição do funil não informada.",
		invalid_type_error: "Tipo não válido para a descrição do funil.",
	}),
	idParceiro: z
		.string({
			required_error: "Referência a parceiro não informada.",
			invalid_type_error: "Tipo não válido para referência a parceiro.",
		})
		.optional()
		.nullable(),
	etapas: z.array(
		z.object({
			id: z.union([z.string(), z.number()]),
			nome: z.string(),
		}),
	),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	dataInsercao: z.string(),
});

export type TFunnel = z.infer<typeof GeneralFunnelSchema>;
export type TFunnelDTO = TFunnel & { _id: string };
