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

		// For now, we only support text messages
		if (message.type !== "text") {
			console.log("[WHATSAPP_WEBHOOK] Non-text message received, skipping for now:", message.type);
			return null;
		}

		const profile = contact?.profile as Record<string, unknown> | undefined;
		const textObj = message.text as Record<string, unknown> | undefined;

		return {
			whatsappMessageId: message.id as string,
			fromPhoneNumber: formatWhatsappIdAsPhone(message.from as string),
			profileName: (profile?.name as string) || "Cliente",
			messageType: message.type as "text",
			textContent: textObj?.body as string | undefined,
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
