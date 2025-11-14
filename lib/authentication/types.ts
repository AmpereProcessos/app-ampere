import { z } from "zod";
import type { TSession } from "@/utils/schemas/session";
import { TEmployee } from "@/utils/schemas/users";

export type TSessionUser = {
	id: string;
	nome: TEmployee["nome"];
	email: TEmployee["nome"];
	telefone: TEmployee["telefone"];
	avatar_url: TEmployee["avatar_url"];
	visualizacao: TEmployee["visualizacao"];
	permissoes: TEmployee["permissoes"];
};

export type TAuthSession = {
	session: TSession;
	user: TSessionUser;
};

export const LoginSchema = z.object({
	email: z.string({
		required_error: "Usuário não informado.",
		invalid_type_error: "Tipo não válido para o usuário.",
	}),
	password: z.string({
		required_error: "Senha não informada.",
		invalid_type_error: "Tipo não válido para a senha.",
	}),
});
export type TLoginSchema = z.infer<typeof LoginSchema>;
