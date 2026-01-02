import { SESSION_COOKIE_NAME } from "@/config";
import { getCurrentSession, validateSession } from "@/lib/authentication/session";
import type { TAuthSession } from "@/lib/authentication/types";
import type { Method } from "axios";
import createHttpError from "http-errors";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { NextResponse } from "next/server";
import { ZodError } from "zod";

export type UnwrapNextResponse<T> = T extends NextApiResponse<infer U> ? U : never;

export interface ErrorResponse {
	error: {
		message: string;
		err?: any;
	};
	status?: number;
}
export function errorHandler(err: unknown, res: NextResponse<ErrorResponse>) {
	console.log("ERROR", err);
	if (createHttpError.isHttpError(err) && err.expose) {
		// Lidar com os erros lançados pelo módulo http-errors
		return res.status(err.statusCode).json({ error: { message: err.message } }) as NextResponse<ErrorResponse>;
	} else if (err instanceof ZodError) {
		// Lidar com erros vindo de uma validação Zod
		return res.status(400).json({ error: { message: err.errors[0].message } }) as NextResponse<ErrorResponse>;
	} else {
		// Lidar com erros desconhecidos
		return res.status(500).json({
			error: { message: "Oops, algo deu errado!", err: err },
			status: createHttpError.isHttpError(err) ? err.statusCode : 500,
		}) as NextResponse<ErrorResponse>;
	}
}

type ApiMethodHandlers = {
	[key in Uppercase<Method>]?: NextApiHandler;
};
export function apiHandler(handler: ApiMethodHandlers) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const method = req.method ? (req.method.toUpperCase() as keyof ApiMethodHandlers) : undefined;

			// validando se o handler suporta o metodo HTTP requisitado
			if (!method) throw new createHttpError.MethodNotAllowed(`Método não especificado no caminho: ${req.url}`);

			const methodHandler = handler[method];
			if (!methodHandler) throw new createHttpError.MethodNotAllowed(`O método ${req.method} não permitido para o caminho ${req.url}`);

			// Se passou pelas validações, chamar o handler
			await methodHandler(req, res);
		} catch (error) {
			console.log("[API_HANDLER]", error);
			errorHandler(error, res);
		}
	};
}

export async function validateAuthentication(req: NextApiRequest, res: NextApiResponse) {
	const cookies = req.cookies;
	const authCookie = cookies[SESSION_COOKIE_NAME];
	if (!authCookie) return { session: null, user: null };
	const session = await validateSession(authCookie);
	return session as TAuthSession;
}

export async function validateAuthenticationWithSession(req: NextApiRequest, res: NextApiResponse) {
	const cookies = req.cookies;
	const authCookie = cookies[SESSION_COOKIE_NAME];
	if (!authCookie) throw new createHttpError.Unauthorized("Recurso não acessível a usuários não autenticados.");
	const session = await validateSession(authCookie);
	if (!session) throw new createHttpError.Unauthorized("Recurso não acessível a usuários não autenticados.");
	return session as TAuthSession;
}
