import { ObjectId, type ClientSession, type Collection, type WithId } from "mongodb";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";

export function getProjectDeliveryReleaseDate(project: Pick<TProject, "compra">) {
  return project.compra?.dataEntrega || null;
}

/** Standalone orders retain manual release dates; project orders follow delivery. */
export async function resolveServiceOrderReleaseDate({ projectId, manualDate, projectsCollection }: {
  projectId?: string | null;
  manualDate?: string | null;
  projectsCollection: Collection<TProject>;
}) {
  if (!projectId || !ObjectId.isValid(projectId)) return manualDate;
  const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
  return project ? getProjectDeliveryReleaseDate(project) : manualDate;
}

/** Delivery changes apply to every associated order, regardless of completion. */
export async function syncServiceOrdersDeliveryRelease({
  project,
  serviceOrdersCollection,
  session,
}: {
  project: WithId<TProject>;
  serviceOrdersCollection: Collection<TServiceOrder>;
  session?: ClientSession;
}) {
  const deliveryDate = getProjectDeliveryReleaseDate(project);
  return serviceOrdersCollection.updateMany(
    { "projeto.id": project._id.toString() },
    { $set: { dataLiberacao: deliveryDate, "projeto.compraEntregaDataEfetivacao": deliveryDate } },
    { session },
  );
}
