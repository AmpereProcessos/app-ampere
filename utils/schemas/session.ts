import { z } from "zod";

export const SessionSchema = z.object({
	sessaoId: z.string({ required_error: "Sessão não informada.", invalid_type_error: "Tipo não válido para sessão." }),
	usuarioId: z.string({ required_error: "Usuário não informado.", invalid_type_error: "Tipo não válido para o usuário." }),
	dataExpiracao: z
		.string({ required_error: "Data de expiração não informada.", invalid_type_error: "Tipo não válido para data de expiração." })
		.datetime({ message: "Formato inválido para data de expiração." }),
});

export type TSession = z.infer<typeof SessionSchema>;
