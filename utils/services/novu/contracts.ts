// Shared notification contracts must not import the workflow runtime.
import { z } from "zod";

export const NOVU_WORKFLOW_IDS = {
	NOTIFY_GENERAL_NOTIFICATION: "notify-general-notification",
};

export const GeneralNotificationPayloadSchema = z.object({
	subject: z.string({
		required_error: "Assunto não informado.",
		invalid_type_error: "Tipo não válido para assunto.",
	}),
	body: z.string({
		required_error: "Corpo não informado.",
		invalid_type_error: "Tipo não válido para corpo.",
	}),
	text: z.string({
		required_error: "Texto não informado.",
		invalid_type_error: "Tipo não válido para texto.",
	}),
	primaryAction: z
		.object({
			label: z.string({
				required_error: "Label não informado.",
				invalid_type_error: "Tipo não válido para label.",
			}),
			redirectUrl: z.string({
				required_error: "URL de redirecionamento não informada.",
				invalid_type_error: "Tipo não válido para URL de redirecionamento.",
			}),
		})
		.optional()
		.nullable(),
	authorAvatarUrl: z
		.string({
			required_error: "URL do avatar do autor não informada.",
			invalid_type_error: "Tipo não válido para URL do avatar do autor.",
		})
		.optional(),
	sendSMS: z
		.boolean({
			invalid_type_error: "Tipo não válido para envio de SMS.",
		})
		.optional(),
	sendEmail: z
		.boolean({
			invalid_type_error: "Tipo não válido para envio de e-mail.",
		})
		.optional(),
});
export type TGeneralNotificationPayload = z.infer<typeof GeneralNotificationPayloadSchema>;
