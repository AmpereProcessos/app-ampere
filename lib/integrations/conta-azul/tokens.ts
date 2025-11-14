import axios from "axios";
import QueryString from "qs";
import z from "zod";

const GetContaAzulV2TokensReturnSchema = z.object({
	id_token: z.string({ required_error: "ID token não informado.", invalid_type_error: "Tipo não válido para ID token." }),
	access_token: z.string({ required_error: "Access token não informado.", invalid_type_error: "Tipo não válido para Access token." }),
	refresh_token: z.string({ required_error: "Refresh token não informado.", invalid_type_error: "Tipo não válido para Refresh token." }),
	expires_in: z.number({ required_error: "Expiração do token não informada.", invalid_type_error: "Tipo não válido para a expiração do token." }),
	token_type: z.literal("Bearer", { required_error: "Tipo de token não informado.", invalid_type_error: "Tipo não válido para o tipo de token." }),
});

export async function getContaAzulV2Tokens(code: string) {
	const basicAuth = Buffer.from(`${process.env.CONTAAZULV2_CLIENT_ID}:${process.env.CONTAAZULV2_CLIENT_SECRET}`).toString("base64");
	const data = QueryString.stringify({
		client_id: process.env.CONTAAZULV2_CLIENT_ID,
		client_secret: process.env.CONTAAZULV2_CLIENT_SECRET,
		grant_type: "authorization_code",
		code: code,
		redirect_uri: "https://app.ampereenergias.com.br/api/integracao/conta-azul-v2/callback",
	});
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Stringified auth data:", data);
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Basic auth:", basicAuth);
	const response = await axios.post("https://auth.contaazul.com/oauth2/token", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${basicAuth}`,
		},
	});

	const tokens = GetContaAzulV2TokensReturnSchema.parse(response.data);

	return tokens;
}

const RefreshContaAzulV2TokensReturnSchema = z.object({
	access_token: z.string({ required_error: "Access token não informado.", invalid_type_error: "Tipo não válido para Access token." }),
	expires_in: z.number({ required_error: "Expiração do token não informada.", invalid_type_error: "Tipo não válido para a expiração do token." }),
	refresh_token: z.string({ required_error: "Refresh token não informado.", invalid_type_error: "Tipo não válido para Refresh token." }),
	token_type: z.literal("Bearer", { required_error: "Tipo de token não informado.", invalid_type_error: "Tipo não válido para o tipo de token." }),
});

export async function refreshContaAzulV2AccessToken(refreshToken: string) {
	const basicAuth = Buffer.from(`${process.env.CONTAAZULV2_CLIENT_ID}:${process.env.CONTAAZULV2_CLIENT_SECRET}`).toString("base64");
	const data = QueryString.stringify({
		client_id: process.env.CONTAAZULV2_CLIENT_ID,
		client_secret: process.env.CONTAAZULV2_CLIENT_SECRET,
		grant_type: "refresh_token",
		refresh_token: refreshToken,
	});
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Stringified auth data:", data);
	console.log("[INFO] [CONTAAZULV2] [CALLBACK] Basic auth:", basicAuth);
	const response = await axios.post("https://auth.contaazul.com/oauth2/token", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${basicAuth}`,
		},
	});

	const tokens = RefreshContaAzulV2TokensReturnSchema.parse(response.data);

	return tokens;
}
