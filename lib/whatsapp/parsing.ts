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
