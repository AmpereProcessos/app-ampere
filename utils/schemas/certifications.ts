import z from "zod";
import { AuthorSchema } from "./users";

export const CertificationSchema = z.object(
	{
		titulo: z.string({
			required_error: "Título da certificação não informado.",
			invalid_type_error: "Tipo não válido para o título da certificação.",
		}),
		descricao: z.string({
			required_error: "Descrição da certificação não informada.",
			invalid_type_error: "Tipo não válido para a descrição da certificação.",
		}),
		validade: z.object({
			medida: z.enum(["DIAS", "SEMANAS", "MESES", "ANOS"]),
			valor: z.number({
				required_error: "Valor da validade da certificação não informado.",
				invalid_type_error: "Tipo não válido para o valor da validade da certificação.",
			}),
		}),
		autor: AuthorSchema,
		dataInsercao: z
			.string({
				required_error: "Data de inserção da certificação não informada.",
				invalid_type_error: "Tipo não válido para a data de inserção da certificação.",
			})
			.datetime({ message: "Tipo não válido para a data de inserção da certificação." }),
	},
	{
		required_error: "Dados da certificação não informados.",
		invalid_type_error: "Tipo não válido para os dados da certificação.",
	},
);
export type TCertification = z.infer<typeof CertificationSchema>;

export const CertificationReferenceSchema = z.object(
	{
		certificacao: z.object(
			{
				id: z.string({
					required_error: "ID da certificação não informado.",
					invalid_type_error: "Tipo não válido para o ID da certificação.",
				}),
				titulo: z.string({
					required_error: "Título da certificação não informado.",
					invalid_type_error: "Tipo não válido para o título da certificação.",
				}),
			},
			{
				required_error: "Dados da certificação não informados.",
				invalid_type_error: "Tipo não válido para os dados da certificação.",
			},
		),
		documento: z.object(
			{
				id: z.string({
					required_error: "ID do documento não informado.",
					invalid_type_error: "Tipo não válido para o ID do documento.",
				}),

				titulo: z.string({
					required_error: "Título do documento não informado.",
					invalid_type_error: "Tipo não válido para o título do documento.",
				}),
				formato: z.string({
					required_error: "Formato do documento não informado.",
					invalid_type_error: "Tipo não válido para o formato do documento.",
				}),
				url: z.string({
					required_error: "URL do documento não informada.",
					invalid_type_error: "Tipo não válido para a URL do documento.",
				}),
			},
			{
				required_error: "Dados do documento não informados.",
				invalid_type_error: "Tipo não válido para os dados do documento.",
			},
		),
		dataInicio: z
			.string({
				required_error: "Data de início da certificação não informada.",
				invalid_type_error: "Tipo não válido para a data de início da certificação.",
			})
			.datetime({ message: "Tipo não válido para a data de início da certificação." }),
		dataFim: z
			.string({
				required_error: "Data de fim da certificação não informada.",
				invalid_type_error: "Tipo não válido para a data de fim da certificação.",
			})
			.datetime({ message: "Tipo não válido para a data de fim da certificação." }),
		notificados: z.array(
			z.object({
				id: z.string({
					required_error: "ID do usuário a ser notificado da certificação não informado.",
					invalid_type_error: "Tipo não válido para o ID do usuário a ser notificado da certificação.",
				}),
				nome: z.string({
					required_error: "Nome do usuário a ser notificado da certificação não informado.",
					invalid_type_error: "Tipo não válido para o nome do usuário a ser notificado da certificação.",
				}),
				email: z.string({
					required_error: "Email do usuário a ser notificado da certificação não informado.",
					invalid_type_error: "Tipo não válido para o email do usuário a ser notificado da certificação.",
				}),
				avatar_url: z
					.string({
						invalid_type_error: "Tipo não válido para a URL do avatar do usuário a ser notificado da certificação.",
					})
					.optional()
					.nullable(),
			}),
		),
	},
	{
		required_error: "Dados da referência da certificação não informados.",
		invalid_type_error: "Tipo não válido para os dados da referência da certificação.",
	},
);
export type TCertificationReference = z.infer<typeof CertificationReferenceSchema>;
