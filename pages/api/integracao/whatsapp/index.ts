import type { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Webhook verification (GET request)
	if (req.method === "GET") {
		console.log("[INFO] [WHATSAPP_WEBHOOK] [VERIFY] Query received:", req.query);
		const mode = req.query["hub.mode"];
		const token = req.query["hub.verify_token"];
		const challenge = req.query["hub.challenge"];

		// Check if a token and mode were sent
		if (mode && token) {
			// Check the mode and token sent are correct
			if (mode === "subscribe" && token === VERIFY_TOKEN) {
				// Respond with 200 OK and challenge token from the request
				console.log("WEBHOOK_VERIFIED");
				return res.status(200).send(challenge);
			}

			// Responds with '403 Forbidden' if verify tokens do not match
			console.log("WEBHOOK_VERIFICATION_FAILED");
			return res.status(403).json({ error: "Verification failed" });
		}

		return res.status(400).json({ error: "Missing parameters" });
	}

	// Webhook events (POST request)
	if (req.method === "POST") {
		const body = req.body;

		// Log incoming messages
		console.log("[INFO] [WHATSAPP_WEBHOOK] [POST] Incoming webhook message:", JSON.stringify(body, null, 2));

		// Check if this is a message event
		if (body.object === "whatsapp_business_account") {
			// Process the webhook payload here
			// For now, just acknowledge receipt

			// Return a '200 OK' response to all events
			return res.status(200).json({ success: true });
		}

		// Return a '404 Not Found' if event is not from a WhatsApp Business Account
		return res.status(404).json({ error: "Event not supported" });
	}

	// Handle other HTTP methods
	return res.status(405).json({ error: "Method not allowed" });
}
