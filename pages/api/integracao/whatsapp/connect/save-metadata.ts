import { validateAuthentication } from "@/utils/api";
import type { NextApiRequest, NextApiResponse } from "next";

interface WhatsAppEmbeddedSignupMetadata {
	phone_number_id?: string;
	waba_id?: string;
	business_id?: string;
	ad_account_ids?: string[];
	page_ids?: string[];
	dataset_ids?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Validate user session
		const session = await validateAuthentication(req, res);

		const metadata: WhatsAppEmbeddedSignupMetadata = req.body;

		console.log("[INFO] [SAVE_METADATA] Received WhatsApp Embedded Signup metadata:", metadata);

		// Store this metadata temporarily or associate it with the user's session
		// This data arrives BEFORE the token exchange, so you might want to:
		// 1. Store it in a temporary cache (Redis, in-memory, etc.)
		// 2. Associate it with the session
		// 3. Update the database record after token exchange completes

		// For now, we'll just log it. You can enhance this based on your needs.
		// The main token exchange happens in exchange-token.ts which fetches
		// this data again from the Graph API, so this is mainly for tracking/debugging.

		/**
		 * OPTIONAL: Store in a temporary cache
		 *
		 * Example with a hypothetical cache:
		 * await cache.set(`whatsapp_metadata:${session.userId}`, metadata, { ttl: 300 });
		 *
		 * Then retrieve it in exchange-token.ts to cross-reference
		 */

		return res.status(200).json({
			success: true,
			message: "Metadata received successfully",
			metadata,
		});
	} catch (error) {
		console.error("[ERROR] [SAVE_METADATA] Error processing metadata:", error);
		return res.status(500).json({
			error: "Internal server error",
			success: false,
		});
	}
}
