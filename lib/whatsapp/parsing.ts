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
	whatsappPhoneNumberId: string;
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

		const metadata = value?.metadata as Record<string, unknown> | undefined;
		const whatsappPhoneNumberId = metadata?.phone_number_id as string;
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
			case "text": {
				const textObj = message.text as Record<string, unknown> | undefined;
				textContent = textObj?.body as string | undefined;
				break;
			}

			case "image": {
				const imageObj = message.image as Record<string, unknown> | undefined;
				mediaId = imageObj?.id as string | undefined;
				mimeType = imageObj?.mime_type as string | undefined;
				caption = imageObj?.caption as string | undefined;
				break;
			}

			case "document": {
				const documentObj = message.document as Record<string, unknown> | undefined;
				mediaId = documentObj?.id as string | undefined;
				mimeType = documentObj?.mime_type as string | undefined;
				filename = documentObj?.filename as string | undefined;
				caption = documentObj?.caption as string | undefined;
				break;
			}

			case "audio":
			case "video": {
				// For audio and video, we'll handle them similarly to documents for now
				const mediaObj = message[messageType] as Record<string, unknown> | undefined;
				mediaId = mediaObj?.id as string | undefined;
				mimeType = mediaObj?.mime_type as string | undefined;
				break;
			}

			default:
				console.log("[WHATSAPP_WEBHOOK] Unsupported message type received:", messageType);
				return null;
		}

		return {
			whatsappPhoneNumberId: whatsappPhoneNumberId || "",
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

// Template Webhook Event Types
type WhatsAppTemplateStatus = "APPROVED" | "REJECTED" | "PENDING" | "DISABLED" | "PAUSED";
type WhatsAppTemplateQuality = "GREEN" | "YELLOW" | "RED" | "UNKNOWN";

type AppTemplateStatus = "RASCUNHO" | "PENDENTE" | "APROVADO" | "REJEITADO" | "PAUSADO" | "DESABILITADO";
type AppTemplateQuality = "PENDENTE" | "ALTA" | "MEDIA" | "BAIXA";

export function mapWhatsAppTemplateStatusToAppStatus(whatsappStatus: string): AppTemplateStatus {
	switch (whatsappStatus.toUpperCase()) {
		case "APPROVED":
			return "APROVADO";
		case "REJECTED":
			return "REJEITADO";
		case "PENDING":
			return "PENDENTE";
		case "DISABLED":
			return "DESABILITADO";
		case "PAUSED":
			return "PAUSADO";
		default:
			return "PENDENTE";
	}
}

export function mapWhatsAppTemplateQualityToAppQuality(whatsappQuality: string): AppTemplateQuality {
	switch (whatsappQuality.toUpperCase()) {
		case "GREEN":
		case "HIGH":
			return "ALTA";
		case "YELLOW":
		case "MEDIUM":
			return "MEDIA";
		case "RED":
		case "LOW":
			return "BAIXA";
		default:
			return "PENDENTE";
	}
}

export type ParsedTemplateStatusUpdate = {
	event: string;
	messageTemplateId: string;
	messageTemplateName: string;
	messageTemplateLanguage: string;
	status?: AppTemplateStatus;
	reason?: string;
	timestamp: number;
};

export type ParsedTemplateQualityUpdate = {
	event: string;
	messageTemplateId: string;
	messageTemplateName: string;
	messageTemplateLanguage: string;
	currentLimit?: string;
	quality?: AppTemplateQuality;
	previousQuality?: AppTemplateQuality;
	timestamp: number;
};

export type ParsedTemplateCategoryUpdate = {
	event: string;
	messageTemplateId: string;
	messageTemplateName: string;
	messageTemplateLanguage: string;
	category?: string;
	previousCategory?: string;
	timestamp: number;
};

export function isTemplateEvent(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		return field === "message_template_status_update" || field === "message_template_quality_update" || field === "template_category_update";
	} catch (error) {
		return false;
	}
}

export function parseTemplateStatusUpdate(webhookPayload: unknown): ParsedTemplateStatusUpdate | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		if (field !== "message_template_status_update") {
			return null;
		}

		const messageTemplateId = value?.message_template_id as string | undefined;
		const messageTemplateName = value?.message_template_name as string | undefined;
		const messageTemplateLanguage = value?.message_template_language as string | undefined;
		const event = value?.event as string | undefined;

		if (!messageTemplateId || !messageTemplateName || !messageTemplateLanguage) {
			console.error("[WHATSAPP_TEMPLATE_STATUS_PARSE_ERROR] Missing required fields");
			return null;
		}

		// Get status and reason if this is an APPROVED or REJECTED event
		let status: AppTemplateStatus | undefined;
		let reason: string | undefined;

		if (event === "APPROVED") {
			status = "APROVADO";
		} else if (event === "REJECTED") {
			status = "REJEITADO";
			reason = value?.reason as string | undefined;
		} else if (event === "DISABLED") {
			status = "DESABILITADO";
			reason = value?.disable_info as string | undefined;
		} else if (event === "PAUSED") {
			status = "PAUSADO";
		}

		return {
			event: event || "UNKNOWN",
			messageTemplateId,
			messageTemplateName,
			messageTemplateLanguage,
			status,
			reason,
			timestamp: Date.now(),
		};
	} catch (error) {
		console.error("[WHATSAPP_TEMPLATE_STATUS_PARSE_ERROR]", error);
		return null;
	}
}

export function parseTemplateQualityUpdate(webhookPayload: unknown): ParsedTemplateQualityUpdate | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		if (field !== "message_template_quality_update") {
			return null;
		}

		const messageTemplateId = value?.message_template_id as string | undefined;
		const messageTemplateName = value?.message_template_name as string | undefined;
		const messageTemplateLanguage = value?.message_template_language as string | undefined;
		const event = value?.event as string | undefined;

		if (!messageTemplateId || !messageTemplateName || !messageTemplateLanguage) {
			console.error("[WHATSAPP_TEMPLATE_QUALITY_PARSE_ERROR] Missing required fields");
			return null;
		}

		const currentLimit = value?.current_limit as string | undefined;
		const previousQualityRaw = value?.previous_quality as string | undefined;
		const newQualityRaw = value?.new_quality as string | undefined;

		const quality = newQualityRaw ? mapWhatsAppTemplateQualityToAppQuality(newQualityRaw) : undefined;
		const previousQuality = previousQualityRaw ? mapWhatsAppTemplateQualityToAppQuality(previousQualityRaw) : undefined;

		return {
			event: event || "QUALITY_UPDATE",
			messageTemplateId,
			messageTemplateName,
			messageTemplateLanguage,
			currentLimit,
			quality,
			previousQuality,
			timestamp: Date.now(),
		};
	} catch (error) {
		console.error("[WHATSAPP_TEMPLATE_QUALITY_PARSE_ERROR]", error);
		return null;
	}
}

export function parseTemplateCategoryUpdate(webhookPayload: unknown): ParsedTemplateCategoryUpdate | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		if (field !== "template_category_update") {
			return null;
		}

		const messageTemplateId = value?.message_template_id as string | undefined;
		const messageTemplateName = value?.message_template_name as string | undefined;
		const messageTemplateLanguage = value?.message_template_language as string | undefined;
		const event = value?.event as string | undefined;

		if (!messageTemplateId || !messageTemplateName || !messageTemplateLanguage) {
			console.error("[WHATSAPP_TEMPLATE_CATEGORY_PARSE_ERROR] Missing required fields");
			return null;
		}

		const category = value?.category as string | undefined;
		const previousCategory = value?.previous_category as string | undefined;

		return {
			event: event || "CATEGORY_UPDATE",
			messageTemplateId,
			messageTemplateName,
			messageTemplateLanguage,
			category,
			previousCategory,
			timestamp: Date.now(),
		};
	} catch (error) {
		console.error("[WHATSAPP_TEMPLATE_CATEGORY_PARSE_ERROR]", error);
		return null;
	}
}

// ===== COEXISTENCE WEBHOOK EVENT TYPES =====

// Type for historical message from WhatsApp Business app
export type ParsedHistoricalMessage = {
	whatsappPhoneNumberId: string;
	whatsappMessageId: string;
	fromPhoneNumber: string;
	toPhoneNumber: string;
	timestamp: number;
	messageType: "text" | "image" | "video" | "audio" | "document" | "location" | "contacts" | "sticker";
	textContent?: string;
	mediaId?: string;
	mimeType?: string;
	filename?: string;
	caption?: string;
	sha256?: string;
	context?: {
		from: string;
		id: string;
	};
};

export type ParsedHistoryEvent = {
	businessPhoneNumber: string;
	whatsappPhoneNumberId: string;
	messages: ParsedHistoricalMessage[];
	hasError: boolean;
	errorCode?: number;
	errorMessage?: string;
};

// Type for contact sync from WhatsApp Business app
export type ParsedContact = {
	fullName?: string;
	firstName?: string;
	phoneNumber: string;
	action: "add" | "remove";
	timestamp: number;
};

export type ParsedAppStateSync = {
	businessPhoneNumber: string;
	whatsappPhoneNumberId: string;
	contacts: ParsedContact[];
};

// Type for message echo (message sent by business via WhatsApp Business app)
export type ParsedMessageEcho = {
	whatsappPhoneNumberId: string;
	whatsappMessageId: string;
	fromPhoneNumber: string; // business phone
	toPhoneNumber: string; // customer phone
	timestamp: number;
	messageType: "text" | "image" | "video" | "audio" | "document" | "location" | "contacts" | "sticker";
	textContent?: string;
	mediaId?: string;
	mimeType?: string;
	filename?: string;
	caption?: string;
};

// Type guards for Coexistence events
export function isHistoryEvent(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		return field === "history";
	} catch (error) {
		return false;
	}
}

export function isAppStateSyncEvent(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		return field === "smb_app_state_sync";
	} catch (error) {
		return false;
	}
}

export function isMessageEchoEvent(webhookPayload: unknown): boolean {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const field = change?.field as string | undefined;

		return field === "smb_message_echoes";
	} catch (error) {
		return false;
	}
}

// Parser for history event
export function parseHistoryEvent(webhookPayload: unknown): ParsedHistoryEvent | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const metadata = value?.metadata as Record<string, unknown> | undefined;
		const whatsappPhoneNumberId = metadata?.phone_number_id as string;
		const businessPhoneNumber = metadata?.display_phone_number as string;

		const history = value?.history as unknown[] | undefined;
		if (!history || !Array.isArray(history)) {
			console.error("[WHATSAPP_HISTORY_PARSE_ERROR] No history array found");
			return null;
		}

		const historyItem = history[0] as Record<string, unknown>;

		// Check for errors (history sharing declined)
		const errors = historyItem?.errors as unknown[] | undefined;
		if (errors && Array.isArray(errors) && errors.length > 0) {
			const error = errors[0] as Record<string, unknown>;
			return {
				businessPhoneNumber,
				whatsappPhoneNumberId,
				messages: [],
				hasError: true,
				errorCode: error.code as number,
				errorMessage: error.message as string,
			};
		}

		// Parse messages
		const conversations = historyItem?.conversations as unknown[] | undefined;
		const messages: ParsedHistoricalMessage[] = [];

		if (conversations && Array.isArray(conversations)) {
			for (const conversation of conversations) {
				const conv = conversation as Record<string, unknown>;
				const messagesArray = conv.messages as unknown[] | undefined;

				if (messagesArray && Array.isArray(messagesArray)) {
					for (const msg of messagesArray) {
						const message = msg as Record<string, unknown>;
						const messageType = message.type as string;

						let textContent: string | undefined;
						let mediaId: string | undefined;
						let mimeType: string | undefined;
						let filename: string | undefined;
						let caption: string | undefined;
						let sha256: string | undefined;

						// Parse based on message type
						switch (messageType) {
							case "text": {
								const textObj = message.text as Record<string, unknown> | undefined;
								textContent = textObj?.body as string | undefined;
								break;
							}
							case "image": {
								const imageObj = message.image as Record<string, unknown> | undefined;
								mediaId = imageObj?.id as string | undefined;
								mimeType = imageObj?.mime_type as string | undefined;
								caption = imageObj?.caption as string | undefined;
								sha256 = imageObj?.sha256 as string | undefined;
								break;
							}
							case "document": {
								const docObj = message.document as Record<string, unknown> | undefined;
								mediaId = docObj?.id as string | undefined;
								mimeType = docObj?.mime_type as string | undefined;
								filename = docObj?.filename as string | undefined;
								caption = docObj?.caption as string | undefined;
								sha256 = docObj?.sha256 as string | undefined;
								break;
							}
							case "audio":
							case "video":
							case "sticker": {
								const mediaObj = message[messageType] as Record<string, unknown> | undefined;
								mediaId = mediaObj?.id as string | undefined;
								mimeType = mediaObj?.mime_type as string | undefined;
								sha256 = mediaObj?.sha256 as string | undefined;
								break;
							}
						}

						// Parse context (for replies)
						let context: { from: string; id: string } | undefined;
						const contextObj = message.context as Record<string, unknown> | undefined;
						if (contextObj) {
							context = {
								from: contextObj.from as string,
								id: contextObj.id as string,
							};
						}

						messages.push({
							whatsappPhoneNumberId,
							whatsappMessageId: message.id as string,
							fromPhoneNumber: formatWhatsappIdAsPhone(message.from as string),
							toPhoneNumber: formatWhatsappIdAsPhone(message.to as string),
							timestamp: message.timestamp ? Number.parseInt(message.timestamp as string) * 1000 : Date.now(),
							messageType: messageType as ParsedHistoricalMessage["messageType"],
							textContent,
							mediaId,
							mimeType,
							filename,
							caption,
							sha256,
							context,
						});
					}
				}
			}
		}

		return {
			businessPhoneNumber,
			whatsappPhoneNumberId,
			messages,
			hasError: false,
		};
	} catch (error) {
		console.error("[WHATSAPP_HISTORY_PARSE_ERROR]", error);
		return null;
	}
}

// Parser for smb_app_state_sync event (contacts)
export function parseAppStateSyncEvent(webhookPayload: unknown): ParsedAppStateSync | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const metadata = value?.metadata as Record<string, unknown> | undefined;
		const whatsappPhoneNumberId = metadata?.phone_number_id as string;
		const businessPhoneNumber = metadata?.display_phone_number as string;

		const stateSync = value?.state_sync as unknown[] | undefined;
		if (!stateSync || !Array.isArray(stateSync)) {
			console.error("[WHATSAPP_STATE_SYNC_PARSE_ERROR] No state_sync array found");
			return null;
		}

		const contacts: ParsedContact[] = [];

		for (const syncItem of stateSync) {
			const item = syncItem as Record<string, unknown>;
			if (item.type === "contact") {
				const contact = item.contact as Record<string, unknown> | undefined;
				const metadataObj = item.metadata as Record<string, unknown> | undefined;
				const action = item.action as string;

				if (contact) {
					contacts.push({
						fullName: contact.full_name as string | undefined,
						firstName: contact.first_name as string | undefined,
						phoneNumber: formatWhatsappIdAsPhone(contact.phone_number as string),
						action: action === "remove" ? "remove" : "add",
						timestamp: metadataObj?.timestamp ? Number.parseInt(metadataObj.timestamp as string) * 1000 : Date.now(),
					});
				}
			}
		}

		return {
			businessPhoneNumber,
			whatsappPhoneNumberId,
			contacts,
		};
	} catch (error) {
		console.error("[WHATSAPP_STATE_SYNC_PARSE_ERROR]", error);
		return null;
	}
}

// Parser for smb_message_echoes event
export function parseMessageEchoEvent(webhookPayload: unknown): ParsedMessageEcho[] | null {
	try {
		const payload = webhookPayload as Record<string, unknown>;
		const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
		const change = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
		const value = change?.value as Record<string, unknown> | undefined;

		const metadata = value?.metadata as Record<string, unknown> | undefined;
		const whatsappPhoneNumberId = metadata?.phone_number_id as string;

		const messageEchoes = value?.message_echoes as unknown[] | undefined;
		if (!messageEchoes || !Array.isArray(messageEchoes)) {
			console.error("[WHATSAPP_MESSAGE_ECHO_PARSE_ERROR] No message_echoes array found");
			return null;
		}

		const echoes: ParsedMessageEcho[] = [];

		for (const echoMsg of messageEchoes) {
			const message = echoMsg as Record<string, unknown>;
			const messageType = message.type as string;

			let textContent: string | undefined;
			let mediaId: string | undefined;
			let mimeType: string | undefined;
			let filename: string | undefined;
			let caption: string | undefined;

			// Parse based on message type
			switch (messageType) {
				case "text": {
					const textObj = message.text as Record<string, unknown> | undefined;
					textContent = textObj?.body as string | undefined;
					break;
				}
				case "image": {
					const imageObj = message.image as Record<string, unknown> | undefined;
					mediaId = imageObj?.id as string | undefined;
					mimeType = imageObj?.mime_type as string | undefined;
					caption = imageObj?.caption as string | undefined;
					break;
				}
				case "document": {
					const docObj = message.document as Record<string, unknown> | undefined;
					mediaId = docObj?.id as string | undefined;
					mimeType = docObj?.mime_type as string | undefined;
					filename = docObj?.filename as string | undefined;
					caption = docObj?.caption as string | undefined;
					break;
				}
				case "audio":
				case "video":
				case "sticker": {
					const mediaObj = message[messageType] as Record<string, unknown> | undefined;
					mediaId = mediaObj?.id as string | undefined;
					mimeType = mediaObj?.mime_type as string | undefined;
					break;
				}
			}

			echoes.push({
				whatsappPhoneNumberId,
				whatsappMessageId: message.id as string,
				fromPhoneNumber: formatWhatsappIdAsPhone(message.from as string),
				toPhoneNumber: formatWhatsappIdAsPhone(message.to as string),
				timestamp: message.timestamp ? Number.parseInt(message.timestamp as string) * 1000 : Date.now(),
				messageType: messageType as ParsedMessageEcho["messageType"],
				textContent,
				mediaId,
				mimeType,
				filename,
				caption,
			});
		}

		return echoes;
	} catch (error) {
		console.error("[WHATSAPP_MESSAGE_ECHO_PARSE_ERROR]", error);
		return null;
	}
}
