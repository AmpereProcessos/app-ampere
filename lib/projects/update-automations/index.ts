import { handleProjectUpdateJourneyStepsTracking } from "@/lib/project-journeys/tracking";
import { syncProjectServiceOrder, createProjectServiceOrder } from "./service-orders";
import { syncProjectCommission } from "./commissions";
import {
  handleProjectSigningAutomation,
  handleProjectRescissionAutomation,
  handleProjectUnsigningAutomation,
} from "./contract-status";
import type { ProjectUpdateAutomationContext } from "./types";
import { syncServiceOrdersDeliveryRelease } from "@/lib/service-orders/delivery-release";

/** Runs POST update side effects in their existing order using the persisted project snapshot. */
export async function runProjectUpdateAutomations(context: ProjectUpdateAutomationContext) {
  await syncProjectServiceOrder(context);
  await createProjectServiceOrder(context);
  if (context.updateKeys.includes("compra.dataEntrega") || context.updateKeys.includes("compra")) {
    await syncServiceOrdersDeliveryRelease(context);
  }
  await syncProjectCommission(context);
  await handleProjectSigningAutomation(context);
  await handleProjectRescissionAutomation(context);
  await handleProjectUnsigningAutomation(context);

  // Tracking is best effort, but must settle before the request finishes.
  try {
    await handleProjectUpdateJourneyStepsTracking({
      projectId: context.project._id.toString(),
      previous: context.previous,
      updated: context.project,
      collection: context.projectsCollection,
    });
  } catch (error) {
    console.error("[PROJECT UPDATE] Journey tracking failed", error);
  }
}
