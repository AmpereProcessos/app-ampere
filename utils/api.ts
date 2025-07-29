import { Method } from "axios";
import createHttpError from "http-errors";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import type { NextResponse } from "next/server";

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
		return res.status(err.statusCode).json({ error: { message: err.message } });
	} else if (err instanceof ZodError) {
		// Lidar com erros vindo de uma validação Zod
		return res.status(400).json({ error: { message: err.errors[0].message } });
	} else {
		// Lidar com erros desconhecidos
		return res.status(500).json({
			error: { message: "Oops, algo deu errado!", err: err },
			status: createHttpError.isHttpError(err) ? err.statusCode : 500,
		});
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
			errorHandler(error, res);
		}
	};
}

export async function validateAuthenticationWithSession(req: NextApiRequest, res: NextApiResponse) {
	// @ts-ignore
	const session = await getServerSession(req, res, authOptions);
	if (!session) throw new createHttpError.Unauthorized("Recurso não acessível a usuários não autenticados.");
	return session as Session;
}
