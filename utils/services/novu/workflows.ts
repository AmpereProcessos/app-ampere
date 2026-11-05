import { workflow } from "@novu/framework";
import { GeneralNotificationPayloadSchema, NOVU_WORKFLOW_IDS } from "./contracts";

export const generalNoficationWorkflow = workflow(
	NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
	async ({ step, payload }) => {
		await step.inApp("inbox", async () => {
			console.log("[NOVU WORKFLOW] Running general notification workflow...");
			return {
				subject: payload.subject,
				body: payload.body,
				avatar: payload.authorAvatarUrl,
				redirect: payload.primaryAction
					? {
							url: payload.primaryAction.redirectUrl,
							target: "_blank",
						}
					: undefined,
				primaryAction: payload.primaryAction
					? {
							label: payload.primaryAction.label,
							redirect: {
								url: payload.primaryAction.redirectUrl,
								target: "_self",
							},
						}
					: undefined,
				data: {
					customData: "customValue",
					text: payload.text,
				},
			};
		});

		await step.email("email", async () => {
			console.log("[NOVU WORKFLOW] Running email workflow...");
			return {
				subject: payload.subject,
				body: payload.body,
			};
		});
	},
	{ payloadSchema: GeneralNotificationPayloadSchema },
);
