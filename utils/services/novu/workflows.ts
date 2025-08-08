import { workflow } from "@novu/framework";
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
	primaryAction: z.object({
		label: z.string({
			required_error: "Label não informado.",
			invalid_type_error: "Tipo não válido para label.",
		}),
		redirectUrl: z.string({
			required_error: "URL de redirecionamento não informada.",
			invalid_type_error: "Tipo não válido para URL de redirecionamento.",
		}),
	}),
	authorAvatarUrl: z
		.string({
			required_error: "URL do avatar do autor não informada.",
			invalid_type_error: "Tipo não válido para URL do avatar do autor.",
		})
		.optional(),
});
export type TGeneralNotificationPayload = z.infer<typeof GeneralNotificationPayloadSchema>;
export const generalNoficationWorkflow = workflow(
	NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
	async ({ step, payload }) => {
		await step.inApp("inbox", async () => {
			console.log("[NOVU WORKFLOW] Running general notification workflow...");
			return {
				subject: payload.subject,
				body: payload.body,
				avatar: payload.authorAvatarUrl,
				redirect: {
					url: payload.primaryAction.redirectUrl,
					target: "_blank",
				},
				primaryAction: {
					label: payload.primaryAction.label,
					redirect: {
						url: payload.primaryAction.redirectUrl,
						target: "_self",
					},
				},
				data: {
					customData: "customValue",
					text: payload.text,
				},
			};
		});
	},
	{ payloadSchema: GeneralNotificationPayloadSchema },
);
