import axios from "axios";
import createHttpError from "http-errors";

const GRAPH_MESSAGES_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const GRAPH_MEDIA_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/media`;
const GRAPH_API_BASE_URL = "https://graph.facebook.com/v22.0";
const WHATSAPP_AUTH_TOKEN = process.env.WHATSAPP_SYSTEM_USER_TOKEN;

type SendBasicWhatsappMessageParams = {
	toPhoneNumber: string;
	content: string;
};

type SendBasicWhatsappMessageResponse = {
	data: {
		messaging_product: string;
		contacts: Array<{ input: string; wa_id: string }>;
		messages: Array<{ id: string }>;
	};
	message: string;
	whatsappMessageId: string;
};

export async function sendBasicWhatsappMessage({
	toPhoneNumber,
	content,
}: SendBasicWhatsappMessageParams): Promise<SendBasicWhatsappMessageResponse> {
	try {
		console.log("[INFO] [WHATSAPP_BASIC_SEND] Sending message:", toPhoneNumber, content);
		if (!WHATSAPP_AUTH_TOKEN) {
			throw new createHttpError.InternalServerError("WhatsApp auth token não configurado.");
		}

		const response = await axios.post(
			GRAPH_MESSAGES_API_URL,
			{
				messaging_product: "whatsapp",
				recipient_type: "individual",
				to: toPhoneNumber,
				type: "text",
				text: {
					preview_url: false,
					body: content,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		const whatsappMessageId = response.data.messages?.[0]?.id;
		if (!whatsappMessageId) {
			throw new createHttpError.InternalServerError("WhatsApp message ID não retornado.");
		}

		return {
			data: response.data,
			message: "Mensagem enviada com sucesso !",
			whatsappMessageId,
		};
	} catch (error) {
		console.error("[ERROR] [WHATSAPP_BASIC_SEND_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[ERROR] [WHATSAPP_BASIC_SEND_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao enviar a mensagem.");
	}
}

type SendTemplateWhatsappMessageParams = {
	templatePayload: {
		messaging_product: string;
		to: string;
		type: string;
		template: {
			name: string;
			language: {
				code: string;
			};
			components: Array<{
				type: string;
				parameters: Array<{
					type: string;
					parameter_name?: string;
					text: string;
				}>;
			}>;
		};
	};
};

type SendTemplateWhatsappMessageResponse = {
	data: {
		messaging_product: string;
		contacts: Array<{ input: string; wa_id: string }>;
		messages: Array<{ id: string }>;
	};
	message: string;
	whatsappMessageId: string;
};

export async function sendTemplateWhatsappMessage({
	templatePayload,
}: SendTemplateWhatsappMessageParams): Promise<SendTemplateWhatsappMessageResponse> {
	try {
		if (!WHATSAPP_AUTH_TOKEN) {
			throw new createHttpError.InternalServerError("WhatsApp auth token não configurado.");
		}
		console.log("[INFO] [WHATSAPP_TEMPLATE_SEND] Sending template:", templatePayload);
		const response = await axios.post(GRAPH_MESSAGES_API_URL, templatePayload, {
			headers: {
				Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		const whatsappMessageId = response.data.messages?.[0]?.id;
		if (!whatsappMessageId) {
			throw new createHttpError.InternalServerError("WhatsApp message ID não retornado.");
		}

		return {
			data: response.data,
			message: "Template enviado com sucesso !",
			whatsappMessageId,
		};
	} catch (error) {
		console.error("[ERROR] [WHATSAPP_TEMPLATE_SEND_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[ERROR] [WHATSAPP_TEMPLATE_SEND_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao enviar o template.");
	}
}

type SendMediaWhatsappMessageParams = {
	toPhoneNumber: string;
	mediaId: string;
	mediaType: "image" | "document";
	caption?: string;
	filename?: string;
};

type SendMediaWhatsappMessageResponse = {
	data: {
		messaging_product: string;
		contacts: Array<{ input: string; wa_id: string }>;
		messages: Array<{ id: string }>;
	};
	message: string;
	whatsappMessageId: string;
};

export async function sendMediaWhatsappMessage({
	toPhoneNumber,
	mediaId,
	mediaType,
	caption,
	filename,
}: SendMediaWhatsappMessageParams): Promise<SendMediaWhatsappMessageResponse> {
	try {
		console.log("[INFO] [WHATSAPP_MEDIA_SEND] Sending media message:", toPhoneNumber, mediaType, mediaId);
		if (!WHATSAPP_AUTH_TOKEN) {
			throw new createHttpError.InternalServerError("WhatsApp auth token não configurado.");
		}

		const payload: any = {
			messaging_product: "whatsapp",
			recipient_type: "individual",
			to: toPhoneNumber,
			type: mediaType,
			[mediaType]: {
				id: mediaId,
			},
		};

		// Add caption for images
		if (mediaType === "image" && caption) {
			payload[mediaType].caption = caption;
		}

		// Add filename for documents
		if (mediaType === "document" && filename) {
			payload[mediaType].filename = filename;
		}

		const response = await axios.post(GRAPH_MESSAGES_API_URL, payload, {
			headers: {
				Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		const whatsappMessageId = response.data.messages?.[0]?.id;
		if (!whatsappMessageId) {
			throw new createHttpError.InternalServerError("WhatsApp message ID não retornado.");
		}

		return {
			data: response.data,
			message: "Mídia enviada com sucesso!",
			whatsappMessageId,
		};
	} catch (error) {
		console.error("[ERROR] [WHATSAPP_MEDIA_SEND_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[ERROR] [WHATSAPP_MEDIA_SEND_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao enviar a mídia.");
	}
}

type UploadMediaToWhatsappParams = {
	fileBuffer: Buffer;
	mimeType: string;
	filename: string;
};

type UploadMediaToWhatsappResponse = {
	mediaId: string;
	message: string;
};

export async function uploadMediaToWhatsapp({ fileBuffer, mimeType, filename }: UploadMediaToWhatsappParams): Promise<UploadMediaToWhatsappResponse> {
	try {
		console.log("[INFO] [WHATSAPP_MEDIA_UPLOAD] Uploading media:", filename, mimeType);
		if (!WHATSAPP_AUTH_TOKEN) {
			throw new createHttpError.InternalServerError("WhatsApp auth token não configurado.");
		}

		const formData = new FormData();
		formData.append("messaging_product", "whatsapp");
		formData.append("file", new Blob([fileBuffer], { type: mimeType }), filename);
		formData.append("type", mimeType);

		const response = await axios.post(GRAPH_MEDIA_API_URL, formData, {
			headers: {
				Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
			},
		});

		const mediaId = response.data.id;
		if (!mediaId) {
			throw new createHttpError.InternalServerError("WhatsApp media ID não retornado.");
		}

		return {
			mediaId,
			message: "Mídia enviada para WhatsApp com sucesso!",
		};
	} catch (error) {
		console.error("[ERROR] [WHATSAPP_MEDIA_UPLOAD_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[ERROR] [WHATSAPP_MEDIA_UPLOAD_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao fazer upload da mídia.");
	}
}

type DownloadMediaFromWhatsappParams = {
	mediaId: string;
};

type DownloadMediaFromWhatsappResponse = {
	fileBuffer: Buffer;
	mimeType: string;
	fileSize: number;
};

export async function downloadMediaFromWhatsapp({ mediaId }: DownloadMediaFromWhatsappParams): Promise<DownloadMediaFromWhatsappResponse> {
	try {
		console.log("[INFO] [WHATSAPP_MEDIA_DOWNLOAD] Downloading media:", mediaId);
		if (!WHATSAPP_AUTH_TOKEN) {
			throw new createHttpError.InternalServerError("WhatsApp auth token não configurado.");
		}

		// First, get the media URL
		const mediaInfoResponse = await axios.get(`${GRAPH_API_BASE_URL}/${mediaId}`, {
			headers: {
				Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
			},
		});

		const mediaUrl = mediaInfoResponse.data.url;
		const mimeType = mediaInfoResponse.data.mime_type;
		const fileSize = mediaInfoResponse.data.file_size;

		if (!mediaUrl) {
			throw new createHttpError.InternalServerError("URL da mídia não encontrada.");
		}

		// Then download the actual file
		const fileResponse = await axios.get(mediaUrl, {
			headers: {
				Authorization: `Bearer ${WHATSAPP_AUTH_TOKEN}`,
			},
			responseType: "arraybuffer",
		});

		return {
			fileBuffer: Buffer.from(fileResponse.data),
			mimeType,
			fileSize,
		};
	} catch (error) {
		console.error("[ERROR] [WHATSAPP_MEDIA_DOWNLOAD_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[ERROR] [WHATSAPP_MEDIA_DOWNLOAD_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao baixar a mídia.");
	}
}
