import type { ObjectId } from "mongodb";
import { z } from "zod";

export const MaterialUpdateRegistryType = z.union([z.literal("RETIRADA"), z.literal("DEVOLUÇÃO"), z.literal("ENTRADA"), z.literal("ALTERAÇÃO MANUAL")], {
	required_error: "Tipo de atualização do material não informado.",
	invalid_type_error: "Tipo não válido para o tipo de atualização do material.",
});
const GeneralMaterialUpdateRegistry = z.object({
	alteracao: z.number(),
	tipo: MaterialUpdateRegistryType,
	idFormulario: z.string().optional().nullable(),
	idCompra: z.string().optional().nullable(),
	material: z.object({
		id: z.string(),
		nome: z.string(),
	}),
	projeto: z.object({
		id: z.string().optional().nullable(),
		nome: z.string().optional().nullable(),
	}),
	qtdeAnterior: z.number().optional().nullable(),
	qtdeNovo: z.number().optional().nullable(),
	precoAnterior: z.number().optional().nullable(),
	precoNovo: z.number().optional().nullable(),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	dataInsercao: z.string().datetime(),
});

const InsertMaterialUpdateRegistrySchema = z.object({
	alteracao: z.number({ required_error: "Alteração não informada.", invalid_type_error: "Tipo não válido para alteração." }),
	tipo: MaterialUpdateRegistryType,
	idFormulario: z
		.string({ required_error: "Referência do formulário não informada.", invalid_type_error: "Tipo não válido para a referência do formulário." })
		.optional()
		.nullable(),
	idCompra: z.string({ required_error: "Referência da compra não informada.", invalid_type_error: "Tipo não válido para a referência da compra." }).optional().nullable(),
	material: z.object({
		id: z.string({ required_error: "Referência do material não informada.", invalid_type_error: "Tipo não válido para a referência material." }),
		nome: z.string(),
	}),
	projeto: z.object({
		id: z.string({ required_error: "Nome do projeto não informado.", invalid_type_error: "Tipo não válido para o nome do projeto." }).optional().nullable(),
		nome: z.string({ required_error: "Nome do projeto não informado.", invalid_type_error: "Tipo não válido para o nome do projeto." }).optional().nullable(),
	}),
	qtdeAnterior: z.number({ required_error: "Quantidade anterior não informada.", invalid_type_error: "Tipo não válido para quantidade anterior." }).optional().nullable(),
	qtdeNovo: z.number({ required_error: "Nova quantidade não informada.", invalid_type_error: "Tipo não válido para nova quantidade." }).optional().nullable(),
	precoAnterior: z.number({ required_error: "Preço anterior não informada.", invalid_type_error: "Tipo não válido para preço anterior." }).optional().nullable(),
	precoNovo: z.number({ required_error: "Preço novo não informada.", invalid_type_error: "Tipo não válido para preço novo." }).optional().nullable(),
	autor: z.object({
		id: z.string({
			required_error: "Referência do autor da alteração não informado.",
			invalid_type_error: "Tipo não válido para a referência do autor da alteração.",
		}),
		nome: z.string({
			required_error: "Nome do autor da alteração não informado.",
			invalid_type_error: "Tipo não válido para o nome do autor da alteração.",
		}),
		avatar_url: z.string().optional().nullable(),
	}),
	dataInsercao: z.string().datetime(),
});

export type TMaterialUpdateRegistry = z.infer<typeof GeneralMaterialUpdateRegistry>;
export type TMaterialUpdateRegistryDTO = TMaterialUpdateRegistry & { _id: string };
export type TMaterialUpdateRegistryEntity = TMaterialUpdateRegistry & { _id: ObjectId };
