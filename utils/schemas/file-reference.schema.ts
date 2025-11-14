import { ObjectId } from "mongodb";
import z from "zod";

const GeneralFileReferenceSchema = z.object({
	idProjeto: z.string().optional().nullable(),
	idColaborador: z.string().optional().nullable(),
	titulo: z.string(),
	formato: z.string(),
	url: z.string(),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	tamanho: z.number().optional().nullable(),
	dataExclusao: z.string().datetime().optional().nullable(),
	autorIdExclusao: z.string().optional().nullable(),
	dataInsercao: z.string().datetime(),
});

export const InsertFileReferenceSchema = z.object({
	idProjeto: z.string({ invalid_type_error: "Tipo não válido para referência de projeto." }).optional().nullable(),
	idColaborador: z.string({ invalid_type_error: "Tipo não válido para referência de colaborador." }).optional().nullable(),
	titulo: z
		.string({ required_error: "Titulo do arquivo não informado.", invalid_type_error: "Tipo não válido para titulo do arquivo." })
		.min(2, "É necessário que o titulo do arquivo tenha ao menos 2 caracteres."),
	formato: z.string({ required_error: "Formato do arquivo não informado.", invalid_type_error: "Tipo não válido para o formato do arquivo." }),
	url: z.string(),
	autor: z.object({
		id: z.string({
			required_error: "ID do criador do arquivo não informado.",
			invalid_type_error: "Tipo não válido para id do criador do arquivo.",
		}),
		nome: z.string({
			required_error: "Nome do criador do arquivo não informado.",
			invalid_type_error: "Tipo não válido para nome do criador do arquivo.",
		}),
		avatar_url: z.string().optional().nullable(),
	}),
	tamanho: z.number({ invalid_type_error: "Tipo não válido para o tamanho do arquivo." }).optional().nullable(),
	dataExclusao: z
		.string({ invalid_type_error: "Tipo não válido para data de exclusão." })
		.datetime({ message: "Tipo não válido para data de exclusão." })
		.optional()
		.nullable(),
	autorIdExclusao: z.string({ invalid_type_error: "Tipo não válido para o autor da exclusão." }).optional().nullable(),

	dataInsercao: z.string().datetime(),
});

const FileReferenceEntitySchema = z.object({
	_id: z.instanceof(ObjectId),
	idProjeto: z.string().optional().nullable(),
	idColaborador: z.string().optional().nullable(),
	titulo: z.string(),
	formato: z.string(),
	url: z.string(),
	autor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	tamanho: z.number().optional().nullable(),
	dataExclusao: z.string().datetime().optional().nullable(),
	autorIdExclusao: z.string().optional().nullable(),

	dataInsercao: z.string().datetime(),
});

export type TFileReference = z.infer<typeof GeneralFileReferenceSchema>;

export type TFileReferenceEntity = z.infer<typeof FileReferenceEntitySchema>;

export type TFileReferenceDTO = TFileReference & { _id: string };
