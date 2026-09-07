import type { Collection, WithId } from "mongodb";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";

export type ProjectUpdateAutomationContext = {
  previous: WithId<TProject>;
  project: WithId<TProject>;
  updateKeys: readonly string[];
  projectsCollection: Collection<TProject>;
  serviceOrdersCollection: Collection<TServiceOrder>;
  author: TServiceOrder["autor"];
};
