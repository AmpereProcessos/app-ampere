import { api } from "@/convex/_generated/api";
import { validateAuthentication } from "@/utils/api";
import type { TWhatsappIntegrationData } from "@/utils/schemas/integrations";
import { ConvexHttpClient } from "convex/browser";
import type { NextApiRequest, NextApiResponse } from "next";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL as string;

async function saveCredentialsToDB(whatsappConnection: TWhatsappIntegrationData) {
	console.log("Salvando no DB:", { whatsappConnection });
	const convex = new ConvexHttpClient(CONVEX_URL);
	await convex.mutation(api.mutations.connections.syncWhatsappConnection, {
		token: whatsappConnection.token,
		dataExpiracao: new Date(whatsappConnection.dataExpiracao).getTime(),
		metaAutorAppId: whatsappConnection.metaAutorAppId,
		metaEscopo: whatsappConnection.metaEscopo,
		telefones: whatsappConnection.telefones,
	});
	return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Validate user session
		const session = await validateAuthentication(req, res);

		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ error: "Authorization code is missing.", success: false });
		}

		console.log("[INFO] [EXCHANGE_TOKEN] Exchanging code for access token");

		const appId = process.env.NEXT_PUBLIC_META_APP_ID;
		const appSecret = process.env.META_APP_SECRET;
		const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integracao/whatsapp/connect/callback`;

		// Exchange code for access token
		const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`;

		const tokenResponse = await fetch(tokenUrl, { method: "GET" });
		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			console.error("[ERROR] [EXCHANGE_TOKEN] Token exchange failed:", tokenData.error);
			return res.status(400).json({
				error: tokenData.error.message || "Token exchange failed",
				success: false,
			});
		}

		const accessToken = tokenData.access_token;
		const expiresIn = tokenData.expires_in; // seconds until expiration
		const accessTokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

		console.log("[INFO] [EXCHANGE_TOKEN] Access token obtained successfully");

		// Debug token to get user info and scopes
		const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
		const debugResponse = await fetch(debugUrl);
		const debugData = await debugResponse.json();

		console.log("[INFO] [EXCHANGE_TOKEN] Debug Data:", debugData);
		console.log("[INFO] [EXCHANGE_TOKEN] Granular Scopes:", debugData.data?.granular_scopes);

		// Get WhatsApp Business Account IDs from granular scopes
		interface GranularScope {
			scope: string;
			target_ids?: string[];
		}
		const whatsappMessagingTargetIds =
			debugData.data?.granular_scopes?.find((scope: GranularScope) => scope.scope === "whatsapp_business_messaging")?.target_ids ?? [];

		// Fetch phone numbers for each WABA
		const phones = (
			await Promise.all(
				whatsappMessagingTargetIds.map(async (targetId: string) => {
					try {
						const whatsappBusinessAccountId = targetId;
						const phoneNumbersUrl = `https://graph.facebook.com/v21.0/${whatsappBusinessAccountId}/phone_numbers?access_token=${accessToken}`;
						const phoneNumbersResponse = await fetch(phoneNumbersUrl);
						const phoneNumbersDataResult = await phoneNumbersResponse.json();

						if (!phoneNumbersDataResult.data || phoneNumbersDataResult.data.length === 0) {
							console.log(`[WARN] [EXCHANGE_TOKEN] No phone numbers found for WABA ${whatsappBusinessAccountId}`);
							return null;
						}

						const phoneNumbersData = phoneNumbersDataResult.data[0];
						console.log(`[INFO] [EXCHANGE_TOKEN] Phone Numbers Data for ${whatsappBusinessAccountId}:`, phoneNumbersData);

						if (phoneNumbersData.platform_type !== "CLOUD_API") {
							console.log(`[WARN] [EXCHANGE_TOKEN] Skipping non-Cloud API phone: ${phoneNumbersData.id}`);
							return null;
						}

						return {
							nome: phoneNumbersData.verified_name as string,
							whatsappBusinessAccountId: whatsappBusinessAccountId,
							whatsappTelefoneId: phoneNumbersData.id,
							numero: phoneNumbersData.display_phone_number,
						};
					} catch (error) {
						console.error(`[ERROR] [EXCHANGE_TOKEN] Error fetching phone numbers for WABA ${targetId}:`, error);
						return null;
					}
				}),
			)
		).filter((p) => p !== null);

		// Save to database
		const whatsappConnection: TWhatsappIntegrationData = {
			tipo: "WHATSAPP",
			token: accessToken,
			dataExpiracao: accessTokenExpiresAt.toISOString(),
			metaAutorAppId: debugData.data?.user_id,
			metaEscopo: debugData.data?.scopes,
			telefones: phones,
		};

		await saveCredentialsToDB(whatsappConnection);

		console.log("[INFO] [EXCHANGE_TOKEN] WhatsApp connection saved successfully");

		return res.status(200).json({
			success: true,
			message: "WhatsApp connected successfully",
			phones: phones.length,
		});
	} catch (error) {
		console.error("[ERROR] [EXCHANGE_TOKEN] Unexpected error:", error);
		return res.status(500).json({
			error: "Internal server error",
			success: false,
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
