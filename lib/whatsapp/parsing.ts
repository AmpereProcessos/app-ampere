import { formatWhatsappIdAsPhone } from "./utils";

type WhatsAppMessageStatus = "sent" | "delivered" | "read" | "failed";

type AppMessageStatus = "ENVIADO" | "RECEBIDO" | "LIDO";
type AppWhatsappStatus = "PENDENTE" | "ENVIADO" | "ENTREGUE" | "FALHOU";

type StatusUpdateResult = {
	status: AppMessageStatus;
	whatsappStatus: AppWhatsappStatus;
};

export function mapWhatsAppStatusToAppStatus(whatsappStatus: WhatsAppMessageStatus): StatusUpdateResult {
	switch (whatsappStatus) {
		case "sent":
			return {
				status: "ENVIADO",
				whatsappStatus: "ENVIADO",
			};
		case "delivered":
			return {
				status: "RECEBIDO",
				whatsappStatus: "ENTREGUE",
			};
		case "read":
			return {
				status: "LIDO",
				whatsappStatus: "ENTREGUE",
			};
		case "failed":
			return {
				status: "ENVIADO",
				whatsappStatus: "FALHOU",
			};
		default:
			return {
				status: "ENVIADO",
				whatsappStatus: "PENDENTE",
			};
	}
}
export type ParsedStatusUpdate = {
	whatsappMessageId: string;
	status: WhatsAppMessageStatus;
	timestamp: number;
};

export function parseStatusUpdate(statusPayload: unknown): ParsedStatusUpdate | null {
	try {
		// Type assertion for webhook payload structure
		const payload = statusPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const statuses = value?.statuses as unknown[] | undefined;
		if (statuses && Array.isArray(statuses) && statuses.length > 0) {
			const status = statuses[0] as Record<string, unknown>;
			return {
				whatsappMessageId: status.id as string,
				status: status.status as WhatsAppMessageStatus,
				timestamp: status.timestamp ? Number.parseInt(status.timestamp as string) * 1000 : Date.now(),
			};
		}

		return null;
	} catch (error) {
		console.error("[WHATSAPP_STATUS_PARSE_ERROR]", error);
		return null;
	}
}

export type ParsedIncomingMessage = {
	whatsappMessageId: string;
	fromPhoneNumber: string;
	profileName: string;
	messageType: "text" | "image" | "video" | "audio" | "document";
	textContent?: string;
	mediaId?: string;
	mimeType?: string;
	filename?: string;
	caption?: string;
	timestamp: number;
};

export function parseWebhookIncomingMessage(webhookPayload: unknown): ParsedIncomingMessage | null {
	try {
		// Type assertion for webhook payload structure
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		// Check if this is a message event
		const messages = value?.messages as unknown[] | undefined;
		if (!messages || !Array.isArray(messages) || messages.length === 0) {
			return null;
		}

		const message = messages[0] as Record<string, unknown>;
		const contacts = value?.contacts as unknown[] | undefined;
		const contact = (Array.isArray(contacts) ? contacts[0] : undefined) as Record<string, unknown> | undefined;

		const profile = contact?.profile as Record<string, unknown> | undefined;
		const messageType = message.type as string;

		let textContent: string | undefined;
		let mediaId: string | undefined;
		let mimeType: string | undefined;
		let filename: string | undefined;
		let caption: string | undefined;

		// Handle different message types
		switch (messageType) {
			case "text":
				const textObj = message.text as Record<string, unknown> | undefined;
				textContent = textObj?.body as string | undefined;
				break;

			case "image":
				const imageObj = message.image as Record<string, unknown> | undefined;
				mediaId = imageObj?.id as string | undefined;
				mimeType = imageObj?.mime_type as string | undefined;
				caption = imageObj?.caption as string | undefined;
				break;

			case "document":
				const documentObj = message.document as Record<string, unknown> | undefined;
				mediaId = documentObj?.id as string | undefined;
				mimeType = documentObj?.mime_type as string | undefined;
				filename = documentObj?.filename as string | undefined;
				caption = documentObj?.caption as string | undefined;
				break;

			case "audio":
			case "video":
				// For audio and video, we'll handle them similarly to documents for now
				const mediaObj = message[messageType] as Record<string, unknown> | undefined;
				mediaId = mediaObj?.id as string | undefined;
				mimeType = mediaObj?.mime_type as string | undefined;
				break;

			default:
				console.log("[WHATSAPP_WEBHOOK] Unsupported message type received:", messageType);
				return null;
		}

		return {
			whatsappMessageId: message.id as string,
			fromPhoneNumber: formatWhatsappIdAsPhone(message.from as string),
			profileName: (profile?.name as string) || "Cliente",
			messageType: messageType as "text" | "image" | "video" | "audio" | "document",
			textContent,
			mediaId,
			mimeType,
			filename,
			caption,
			timestamp: message.timestamp ? Number.parseInt(message.timestamp as string) * 1000 : Date.now(),
		};
	} catch (error) {
		console.error("[WHATSAPP_MESSAGE_PARSE_ERROR]", error);
		return null;
	}
}

export function isStatusUpdate(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const statuses = value?.statuses as unknown[] | undefined;
		return !!(statuses && Array.isArray(statuses) && statuses.length > 0);
	} catch (error) {
		return false;
	}
}

export function isMessageEvent(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const messages = value?.messages as unknown[] | undefined;
		return !!(messages && Array.isArray(messages) && messages.length > 0);
	} catch (error) {
		return false;
	}
}
