import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { NextApiRequest, NextApiResponse } from "next";

// Este é um pseudo-código para o banco de dados. Adapte para sua implementação (Prisma, etc.)
async function saveCredentialsToDB(wabaId: string, phoneNumberId: string, accessToken: string) {
	console.log("Salvando no DB:", { wabaId, phoneNumberId, accessToken });
	// LÓGICA DO SEU BANCO DE DADOS AQUI
	const db = await connectToAdministrationDatabase();
	const collection = db.collection("whatsapp-conexoes");
	await collection.insertOne({ wabaId, phoneNumberId, accessToken });
	// Ex: await prisma.whatsappConnection.create({ data: { ... } });
	return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	const { code } = req.body;
	if (!code) {
		return res.status(400).json({ error: "Authorization code is missing." });
	}

	const appId = process.env.NEXT_PUBLIC_META_APP_ID;
	const appSecret = process.env.WHATSAPP_SYSTEM_USER_TOKEN;
	// O redirect_uri deve ser um dos URIs configurados no seu painel da Meta
	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integracao/whatsapp/connect`; // A página onde o usuário iniciou o fluxo

	try {
		console.log("[INFO] [WHATSAPP_CONNECT] Connecting to WhatsApp...");
		console.log("[INFO] [WHATSAPP_CONNECT] Params:", { appId, appSecret, redirectUri, code });
		// --- PASSO 1: Trocar o código por um token de acesso de curta duração ---
		const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;
		const tokenResponse = await fetch(tokenUrl);
		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			throw new Error(`Erro ao obter token: ${tokenData.error.message}`);
		}
		const shortLivedUserToken = tokenData.access_token;

		// --- PASSO 2: Trocar o token de curta duração por um de longa duração ---
		const longLivedTokenUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedUserToken}`;
		const longLivedTokenResponse = await fetch(longLivedTokenUrl);
		const longLivedTokenData = await longLivedTokenResponse.json();

		if (longLivedTokenData.error) {
			throw new Error(`Erro ao obter token de longa duração: ${longLivedTokenData.error.message}`);
		}
		const longLivedAccessToken = longLivedTokenData.access_token;

		// --- PASSO 3: Obter o WABA ID (ID da Conta do WhatsApp Business) ---
		// A forma mais fácil é "debugar" o token de acesso. A resposta conterá os escopos e IDs concedidos.
		const debugUrl = `https://graph.facebook.com/debug_token?input_token=${shortLivedUserToken}&access_token=${appId}|${appSecret}`;
		const debugResponse = await fetch(debugUrl);
		const debugData = await debugResponse.json();

		const wabaId = debugData.data?.granular_scopes?.find((scope) => scope.scope === "whatsapp_business_management")?.target_ids[0];

		if (!wabaId) {
			throw new Error("Não foi possível encontrar o WABA ID. O usuário concedeu as permissões necessárias?");
		}

		// --- PASSO 4: Obter os IDs dos números de telefone associados a essa WABA ---
		const phoneNumbersUrl = `https://graph.facebook.com/v19.0/${wabaId}/phone_numbers?access_token=${longLivedAccessToken}`;
		const phoneNumbersResponse = await fetch(phoneNumbersUrl);
		const phoneNumbersData = await phoneNumbersResponse.json();

		if (!phoneNumbersData.data || phoneNumbersData.data.length === 0) {
			throw new Error("Nenhum número de telefone encontrado para esta conta.");
		}

		// Por simplicidade, estamos pegando o primeiro número. Você pode criar uma lógica para o usuário escolher.
		const phoneNumberId = phoneNumbersData.data[0].id;

		// --- PASSO 5: Salvar as credenciais no seu banco de dados ---
		await saveCredentialsToDB(wabaId, phoneNumberId, longLivedAccessToken);

		res.status(200).json({ success: true, message: "Conta conectada com sucesso!" });
	} catch (error) {
		console.error("Erro na API de conexão do WhatsApp:", error);
		res.status(500).json({ success: false, error: error.message });
	}
}
