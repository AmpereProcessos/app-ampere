import { FacebookOAuth } from "@/lib/oauth";
import type { TIntegration, TWhatsappIntegrationData } from "@/utils/schemas/integrations";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToDatabase from "@/utils/services/mongodb/projects";
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
async function saveCredentialsToDB(whatsappConnection: TWhatsappIntegrationData) {
	console.log("Salvando no DB:", { whatsappConnection });
	// LÓGICA DO SEU BANCO DE DADOS AQUI
	const db = await connectToDatabase();
	const collection = db.collection<TIntegration>("integracoes");
	const existingIntegration = await collection.findOne({ identificador: "WHATSAPP" });
	if (existingIntegration) {
		await collection.updateOne(
			{ _id: existingIntegration._id },
			{
				$set: {
					dados: whatsappConnection,
				},
			},
		);
	} else {
		await collection.insertOne({
			identificador: "WHATSAPP",
			dados: whatsappConnection,
			autor: {
				id: "6463ccaa8c5e3e227af54d89",
				nome: "LUCAS FERNANDES",
				avatar_url:
					"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=4a2959af-2fd0-4448-92f6-57af64a3bae1",
			},
			dataInsercao: new Date().toISOString(),
		});
	}
	return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[INFO] [WHATSAPP_CONNECT_CALLBACK] Query Params:", req.query);
	console.log("[INFO] [WHATSAPP_CONNECT_CALLBACK] Body:", req.body);
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
	console.log("[INFO] [WHATSAPP_CONNECT_CALLBACK] Tokens:", { tokens, accessToken, accessTokenExpiresAt });

	const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
	const debugResponse = await fetch(debugUrl);
	const debugData = await debugResponse.json();

	console.log("[INFO] [WHATSAPP_CONNECT_CALLBACK] Debug Data:", debugData);
	console.log("[INFO] [WHATSAPP_CONNECT_CALLBACK] Debug Data Granular Scopes:", debugData.data?.granular_scopes);

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

	const whatsappConnection: TWhatsappIntegrationData = {
		tipo: "WHATSAPP",
		token: accessToken,
		dataExpiracao: accessTokenExpiresAt.toISOString(),
		metaAutorId: debugData.data?.user_id,
		metaEscopo: debugData.data?.scopes,
		telefones: phones,
	};

	await saveCredentialsToDB(whatsappConnection);
	return res.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracoes?mode=whatsapp-connection`);
}
