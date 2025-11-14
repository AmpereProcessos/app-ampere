import { z } from "zod";

export const AllocatorSchema = z.object({
	nome: z.string({
		required_error: "Nome do alocador não fornecido",
		invalid_type_error: "Tipo não válido para nome do alocador",
	}),
	descricao: z.string({
		required_error: "Descrição do alocador não fornecida",
		invalid_type_error: "Tipo não válido para descrição do alocador",
	}),
	localizacao: z.object({
		cep: z.string({ invalid_type_error: "Tipo não válido para cep do alocador" }).optional().nullable(),
		uf: z.string({ required_error: "UF do alocador não fornecida", invalid_type_error: "Tipo não válido para uf do alocador" }),
		cidade: z.string({ required_error: "Cidade do alocador não fornecida", invalid_type_error: "Tipo não válido para cidade do alocador" }),
		bairro: z.string({ invalid_type_error: "Tipo não válido para bairro do alocador" }).optional().nullable(),
		endereco: z.string({ invalid_type_error: "Tipo não válido para endereço do alocador" }).optional().nullable(),
		numeroOuIdentificador: z.string({ invalid_type_error: "Tipo não válido para número ou identificador do alocador" }).optional().nullable(),
		complemento: z.string({ invalid_type_error: "Tipo não válido para complemento do alocador" }).optional().nullable(),
		latitude: z.string({ invalid_type_error: "Tipo não válido para latitude do alocador" }).optional().nullable(),
		longitude: z.string({ invalid_type_error: "Tipo não válido para longitude do alocador" }).optional().nullable(),
	}),
	dataInsercao: z.string({ invalid_type_error: "Tipo não válido para data de inserção do alocador" }),
});

export type TAllocator = z.infer<typeof AllocatorSchema>;
export type TAllocatorDTO = TAllocator & { _id: string };
