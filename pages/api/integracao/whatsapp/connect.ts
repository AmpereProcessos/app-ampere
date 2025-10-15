import { FacebookOAuth } from "@/lib/oauth";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import * as arctic from "arctic";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

type TWhatsappConnection = {
	token: string;
	dataExpiracao: string;
	metaAutorId: string;
	metaEscopo: string[];
	telefones: {
		whatsappNome: string;
		whatsappBusinessAccountId: string;
		whatsappTelefoneId: string;
		numero: string;
	}[];
};
// Este é um pseudo-código para o banco de dados. Adapte para sua implementação (Prisma, etc.)
async function saveCredentialsToDB(whatsappConnection: TWhatsappConnection) {
	console.log("Salvando no DB:", { whatsappConnection });
	// LÓGICA DO SEU BANCO DE DADOS AQUI
	const db = await connectToAdministrationDatabase();
	const collection = db.collection("whatsapp-conexoes");
	await collection.insertOne(whatsappConnection);
	// Ex: await prisma.whatsappConnection.create({ data: { ... } });
	return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[INFO] [WHATSAPP_CONNECT] Query Params:", req.query);
	console.log("[INFO] [WHATSAPP_CONNECT] Body:", req.body);
	const { code, state } = req.query;
	if (!code) {
		return res.status(400).json({ error: "Authorization code is missing." });
	}

	const appId = process.env.NEXT_PUBLIC_META_APP_ID;
	const appSecret = process.env.META_APP_SECRET;
	// O redirect_uri deve ser um dos URIs configurados no seu painel da Meta
	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integracao/whatsapp/connect`; // A página onde o usuário iniciou o fluxo
	const tokens = await FacebookOAuth.validateAuthorizationCode(code as string);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
	console.log("[INFO] [WHATSAPP_CONNECT] Tokens:", { tokens, accessToken, accessTokenExpiresAt });

	const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
	const debugResponse = await fetch(debugUrl);
	const debugData = await debugResponse.json();

	console.log("[INFO] [WHATSAPP_CONNECT] Debug Data:", debugData);
	console.log("[INFO] [WHATSAPP_CONNECT] Debug Data Granular Scopes:", debugData.data?.granular_scopes);

	const whatsappMessagingTargeIds =
		debugData.data?.granular_scopes.find((scope: any) => scope.scope === "whatsapp_business_messaging")?.target_ids ?? [];
	const phones = (
		await Promise.all(
			whatsappMessagingTargeIds.map(async (targetId: string) => {
				const whatsappBusinessAccountId = targetId;
				const phoneNumbersUrl = `https://graph.facebook.com/v19.0/${whatsappBusinessAccountId}/phone_numbers?access_token=${accessToken}`;
				const phoneNumbersResponse = await fetch(phoneNumbersUrl);
				const phoneNumbersDataResult = await phoneNumbersResponse.json();
				const phoneNumbersData = phoneNumbersDataResult.data[0];
				console.log(`[INFO] [WHATSAPP_CONNECT] Phone Numbers Data for ${whatsappBusinessAccountId}:`, phoneNumbersData);
				if (phoneNumbersData.platform_type !== "CLOUD_API") return null;
				return {
					nome: phoneNumbersData.verified_name as string,
					whatsappBusinessAccountId: whatsappBusinessAccountId,
					whatsappTelefoneId: phoneNumbersData.id,
					numero: phoneNumbersData.display_phone_number,
				};
			}),
		)
	).filter((p) => !!p);

	const whatsappConnection: TWhatsappConnection = {
		token: accessToken,
		dataExpiracao: accessTokenExpiresAt.toISOString(),
		metaAutorId: debugData.data?.user_id,
		metaEscopo: debugData.data?.scopes,
		telefones: phones,
	};
	// --- PASSO 5: Salvar as credenciais no seu banco de dados ---
	await saveCredentialsToDB(whatsappConnection);
	return res.status(200).json({ success: true, message: "Conexão realizada com sucesso !" });
	// try {
	// 	console.log("[INFO] [WHATSAPP_CONNECT] Connecting to WhatsApp...");
	// 	console.log("[INFO] [WHATSAPP_CONNECT] Params:", { appId, appSecret, redirectUri, code });
	// 	// --- PASSO 1: Trocar o código por um token de acesso de curta duração ---
	// 	const tokenUrl = `https://graph.facebook.com/v24.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;
	// 	const tokenResponse = await fetch(tokenUrl);
	// 	const tokenData = await tokenResponse.json();

	// 	if (tokenData.error) {
	// 		throw new Error(`Erro ao obter token: ${tokenData.error.message}`);
	// 	}
	// 	const shortLivedUserToken = tokenData.access_token;

	// 	// --- PASSO 2: Trocar o token de curta duração por um de longa duração ---
	// 	const longLivedTokenUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedUserToken}`;
	// 	const longLivedTokenResponse = await fetch(longLivedTokenUrl);
	// 	const longLivedTokenData = await longLivedTokenResponse.json();
	// 	console.log("[INFO] [WHATSAPP_CONNECT] Long Lived Token Data:", longLivedTokenData);
	// 	if (longLivedTokenData.error) {
	// 		throw new Error(`Erro ao obter token de longa duração: ${longLivedTokenData.error.message}`);
	// 	}
	// 	const longLivedAccessToken = longLivedTokenData.access_token;

	// 	// --- PASSO 3: Obter o WABA ID (ID da Conta do WhatsApp Business) ---
	// 	// A forma mais fácil é "debugar" o token de acesso. A resposta conterá os escopos e IDs concedidos.
	// 	const debugUrl = `https://graph.facebook.com/debug_token?input_token=${shortLivedUserToken}&access_token=${appId}|${appSecret}`;
	// 	const debugResponse = await fetch(debugUrl);
	// 	const debugData = await debugResponse.json();

	// 	console.log("[INFO] [WHATSAPP_CONNECT] Debug Data:", debugData);
	// 	console.log("[INFO] [WHATSAPP_CONNECT] Debug Data Granular Scopes:", debugData.data?.granular_scopes);

	// 	const whatsappMessagingTargeIds =
	// 		debugData.data?.granular_scopes.find((scope: any) => scope.scope === "whatsapp_business_messaging")?.target_ids ?? [];
	// 	const phones = (
	// 		await Promise.all(
	// 			whatsappMessagingTargeIds.map(async (targetId) => {
	// 				const whatsappBusinessAccountId = targetId;
	// 				const phoneNumbersUrl = `https://graph.facebook.com/v19.0/${whatsappBusinessAccountId}/phone_numbers?access_token=${longLivedAccessToken}`;
	// 				const phoneNumbersResponse = await fetch(phoneNumbersUrl);
	// 				const phoneNumbersDataResult = await phoneNumbersResponse.json();
	// 				const phoneNumbersData = phoneNumbersDataResult.data[0];
	// 				console.log(`[INFO] [WHATSAPP_CONNECT] Phone Numbers Data for ${whatsappBusinessAccountId}:`, phoneNumbersData);
	// 				if (phoneNumbersData.platform_type !== "CLOUD_API") return null;
	// 				return {
	// 					nome: phoneNumbersData.verified_name as string,
	// 					whatsappBusinessAccountId: whatsappBusinessAccountId,
	// 					whatsappTelefoneId: phoneNumbersData.id,
	// 					numero: phoneNumbersData.display_phone_number,
	// 				};
	// 			}),
	// 		)
	// 	).filter((p) => !!p);

	// 	const whatsappConnection: TWhatsappConnection = {
	// 		token: longLivedAccessToken,
	// 		dataExpiracao: dayjs()
	// 			.add(longLivedTokenData.expires_in ?? 0, "seconds")
	// 			.toISOString(),
	// 		metaAutorId: debugData.data?.user_id,
	// 		metaEscopo: debugData.data?.scopes,
	// 		telefones: phones,
	// 	};
	// 	// --- PASSO 5: Salvar as credenciais no seu banco de dados ---
	// 	await saveCredentialsToDB(whatsappConnection);

	// 	res.status(200).json({ success: true, message: "Conta conectada com sucesso!" });
	// } catch (error) {
	// 	console.error("Erro na API de conexão do WhatsApp:", error);
	// 	res.status(500).json({ success: false, error: error.message });
	// }
}
