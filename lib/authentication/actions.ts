"use server";
import { redirect } from "next/navigation";
import { createSession, generateSessionToken, setSetSessionCookie } from "@/lib/authentication/session";

import { LoginSchema } from "./types";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import { TEmployee } from "@/utils/schemas/users";

export async function login(formData: FormData): Promise<void> {
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};
	const validationParsed = LoginSchema.safeParse(data);
	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		const errorMessage = err.fieldErrors.email?.[0] || "Dados inválidos.";
		return redirect(`/auth/signin?error=${encodeURIComponent(errorMessage)}`);
	}

	const { email, password } = validationParsed.data;

	const admDb = await connectToAdministrationDatabase();
	const usersCollection = admDb.collection<TEmployee>("colaboradores");

	const user = await usersCollection.findOne({ email: email });

	if (!user) {
		return redirect(`/auth/signin?error=${encodeURIComponent("Usuário ou senha incorretos.")}`);
	}

	if (password !== user.senha) {
		return redirect(`/auth/signin?error=${encodeURIComponent("Usuário ou senha incorretos.")}`);
	}
	const sessionToken = await generateSessionToken();
	const session = await createSession({
		token: sessionToken,
		userId: user._id.toString(),
	});
	try {
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
	} catch (error) {
		console.log("Error setting session cookie", error);
	}
	return redirect("/");
}
