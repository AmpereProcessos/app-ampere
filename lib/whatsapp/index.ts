import axios from "axios";
import createHttpError from "http-errors";

const GRAPH_MESSAGES_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
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
		console.error("[WHATSAPP_SEND_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[WHATSAPP_SEND_ERROR_RESPONSE]", error.response?.data);
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
		console.error("[WHATSAPP_TEMPLATE_SEND_ERROR]", error);
		if (axios.isAxiosError(error)) {
			console.error("[WHATSAPP_TEMPLATE_SEND_ERROR_RESPONSE]", error.response?.data);
		}
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao enviar o template.");
	}
}
