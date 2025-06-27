import NextAuth, { type Awaitable, type Session, type SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../utils/services/mongodb/users";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { Collection } from "mongodb";
import type { TEmployee } from "@/utils/schemas/users";
import createHttpError from "http-errors";
export const authOptions = {
	session: {
		strategy: "jwt" as SessionStrategy,
		maxAge: 60 * 60 * 5,
	},
	jwt: {
		maxAge: 60 * 60 * 5,
	},
	providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
			async authorize(credentials, req) {
				const email = credentials?.email;
				const password = credentials?.password;
				// console.log(userInDb);
				// console.log("ID", userInDb._id);
				try {
					const db = await connectToAdministrationDatabase(process.env.DB_KEY);
					const collection: Collection<TEmployee> = db.collection("colaboradores");
					const userInDb = await collection.findOne({ email: email });
					if (!userInDb) throw new createHttpError.NotFound("Usuário inexistente");
					if (!userInDb.acessoAtivo) throw new createHttpError.Unauthorized("Usuário inativo.");
					if (password !== userInDb?.senha) throw new createHttpError.BadRequest("Senha inválida");
					return {
						id: userInDb._id.toString(),
						nome: userInDb.usuario,
						email: userInDb.email,
						telefone: userInDb.telefone,
						avatar_url: userInDb.avatar_url,
						visualizacao: userInDb.visualizacao,
						permissoes: userInDb.permissoes,
					};
				} catch (error) {
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async signIn({ user }: { user: Session }) {
			// console.log("USER", user);
			// console.log("ACCOUNT", account);
			// console.log("PROFILE", profile);
			// console.log("EMAIL", email);
			// console.log("CREDENTIALS", credentials);
			return user;
		},
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			return baseUrl;
		},
		async session({ session, user, token }) {
			// console.log("SESSAO", session);
			// console.log("USER", user);
			// console.log("TOKEN", token);
			if (session?.user) {
				session.user.id = token.sub;
				session.user.nome = token.nome;
				session.user.email = token.email;
				session.user.telefone = token.telefone;
				session.user.avatar_url = token.avatar_url;
				session.user.visualizacao = token.visualizacao;
				session.user.permissoes = token.permissoes;

				// session.user.id = token.sub
				// session?.user.permissoes.rotas = token.accessibleRoutes
				// session.user.controller = token.controller
				// session.user.manager = token.manager
				// session.user.visualizacao = token.visualizacao
				// session.user.vendedor = token.vendedor
				// session.user.regional = token.regional
				// session.user.equipe = token.equipe
			}
			return session;
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			// console.log("USER", user);
			// console.log("ACCOUNT", account);
			// console.log("PROFILE", profile);
			// console.log(token);
			if (user) {
				token.nome = user.nome;
				token.email = user.email;
				token.telefone = user.telefone;
				token.avatar_url = user.avatar_url;
				token.visualizacao = user.visualizacao;
				token.permissoes = user.permissoes;
				// token.accessibleRoutes = user.accessibleRoutes
				// token.controller = user.controller
				// token.manager = user.manager
				// token.visualizacao = user.visualizacao
				// token.vendedor = user.vendedor
				// token.regional = user.regional
				// token.equipe = user.equipe
			}
			return token;
		},
	},

	secret: process.env.SECRET_NEXT_AUTH,
	pages: {
		signIn: "/auth/signin",
	},
};

export default NextAuth(authOptions);
