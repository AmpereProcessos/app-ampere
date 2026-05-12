import { NOTIFICATION_TRACK_EVENTS_CONFIG } from "@/lib/notifications/configs";
import { getNovuSubscriberId } from "@/utils/services/novu/config";
import { novu } from "@/utils/services/novu";
import { NOVU_WORKFLOW_IDS, type TGeneralNotificationPayload } from "@/utils/services/novu/workflows";

type MaterialQuantityChange = {
	materialId?: string | null;
	materialName: string;
	previousQuantity: number;
	newQuantity: number;
	minimumQuantity?: number | null;
};

function materialCrossedBelowMinimum({ previousQuantity, newQuantity, minimumQuantity }: MaterialQuantityChange) {
	if (minimumQuantity === null || minimumQuantity === undefined) return false;
	return previousQuantity >= minimumQuantity && newQuantity < minimumQuantity;
}

export async function notifyMaterialBelowMinimumIfCrossed(change: MaterialQuantityChange) {
	if (!materialCrossedBelowMinimum(change)) return null;

	const config = NOTIFICATION_TRACK_EVENTS_CONFIG.MATERIAL_QUANTITY_BELOW_THRESHOLD;
	const payloadInput = {
		materialName: change.materialName,
		materialQuantity: change.minimumQuantity as number,
	};
	const payload: TGeneralNotificationPayload = {
		subject: config.subject,
		body: config.body(payloadInput),
		text: config.text(payloadInput),
		primaryAction: config.primaryAction,
	};

	try {
		const response = await novu.trigger({
			to: config.to.map((id) => getNovuSubscriberId(id)),
			workflowId: NOVU_WORKFLOW_IDS.NOTIFY_GENERAL_NOTIFICATION,
			payload,
		});
		console.log("[INFO] [MATERIAL MINIMUM NOTIFICATION] Notification sent.", {
			materialId: change.materialId,
			materialName: change.materialName,
			previousQuantity: change.previousQuantity,
			newQuantity: change.newQuantity,
			minimumQuantity: change.minimumQuantity,
			transactionId: response.result.transactionId,
		});
		return response.result;
	} catch (error) {
		console.error("[ERROR] [MATERIAL MINIMUM NOTIFICATION] Failed to send notification.", {
			materialId: change.materialId,
			materialName: change.materialName,
			error,
		});
		return null;
	}
}

export async function notifyMaterialsBelowMinimumIfCrossed(changes: MaterialQuantityChange[]) {
	return Promise.all(changes.map((change) => notifyMaterialBelowMinimumIfCrossed(change)));
}
