import { z } from "zod";
import { AuthorSchema } from "./users";

const IntegrationIdentifierEnumSchema = z.enum(["CONTA_AZUL", "WHATSAPP"]);

export const ContaAzulIntegrationDataSchema = z.object({
	tipo: z.enum(["CONTA_AZUL"]),
	tokenRefresh: z.string({ required_error: "Token de atualização não informado.", invalid_type_error: "Tipo não válido para token de atualização." }),
	tokenAcesso: z.string({ required_error: "Token de acesso não informado.", invalid_type_error: "Tipo não válido para token de acesso." }),
	dataExpiracao: z.string({ required_error: "Expiração do token não informada.", invalid_type_error: "Tipo não válido para a expiração do token." }),
});

export const WhatsappIntegrationDataSchema = z.object({
	tipo: z.enum(["WHATSAPP"]),
	token: z.string({ required_error: "Token não informado.", invalid_type_error: "Tipo não válido para token." }),
	dataExpiracao: z.string({ required_error: "Expiração do token não informada.", invalid_type_error: "Tipo não válido para a expiração do token." }),
	metaAutorAppId: z.string({ required_error: "ID do autor não informado.", invalid_type_error: "Tipo não válido para ID do autor." }),
	metaEscopo: z.array(z.string({ required_error: "Escopo não informado.", invalid_type_error: "Tipo não válido para escopo." })),
	telefones: z.array(
		z.object({
			nome: z.string({ required_error: "Nome não informado.", invalid_type_error: "Tipo não válido para nome." }),
			whatsappBusinessAccountId: z.string({
				required_error: "ID da conta do WhatsApp Business não informado.",
				invalid_type_error: "Tipo não válido para ID da conta do WhatsApp Business.",
			}),
			whatsappTelefoneId: z.string({
				required_error: "ID do telefone do WhatsApp não informado.",
				invalid_type_error: "Tipo não válido para ID do telefone do WhatsApp.",
			}),
			numero: z.string({ required_error: "Número não informado.", invalid_type_error: "Tipo não válido para número." }),
		}),
	),
});
export type TWhatsappIntegrationData = z.infer<typeof WhatsappIntegrationDataSchema>;
export const IntegrationSchema = z.object({
	identificador: IntegrationIdentifierEnumSchema,
	dados: z.discriminatedUnion("tipo", [ContaAzulIntegrationDataSchema, WhatsappIntegrationDataSchema]),
	autor: AuthorSchema,
	dataInsercao: z
		.string({ required_error: "Data de inserção não informada.", invalid_type_error: "Tipo não válido para a data de inserção." })
		.datetime({ message: "Formato inválido para a data de inserção." }),
});
export type TIntegration = z.infer<typeof IntegrationSchema>;
