import { getClientProfile } from "@/repositories/stats/client-profile";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ReportFilterInputSchema } from "@/utils/schemas/report-filter.schema";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";
import type { z } from "zod";

export const ClientProfileInputSchema = ReportFilterInputSchema;
export type TClientProfileInput = z.infer<typeof ClientProfileInputSchema>;

async function getClientProfileReport(payload: TClientProfileInput) {
  const db = await connectToDatabase();
  const projectsCollection = db.collection<TProject>("dados");
  const crmDb = await connectToCRMDatabase();
  const clientsCollection = crmDb.collection<TClient>("clients");

  const projectsQuery: Filter<TProject> = {
    "contrato.status": "ASSINADO",
    "contrato.dataAssinatura":
      payload.period.after && payload.period.before
        ? { $gte: payload.period.after, $lte: payload.period.before }
        : { $ne: null },
    ...(payload.projectTypes.length > 0 ? { tipoDeServico: { $in: payload.projectTypes } } : {}),
    ...(payload.location.estado ? { uf: payload.location.estado } : {}),
    ...(payload.location.cidade ? { cidade: payload.location.cidade } : {}),
  };

  const profile = await getClientProfile({
    projectsCollection,
    clientsCollection,
    projectsQuery,
    segment: payload.segment,
  });
  return { data: profile };
}
export type TClientProfileOutput = Awaited<ReturnType<typeof getClientProfileReport>>;

const getClientProfileHandler: NextApiHandler<TClientProfileOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  console.log("[INFO] [GET_CLIENT_PROFILE] Requested by user", {
    name: session.user.nome,
    email: session.user.email,
  });
  const payload = ClientProfileInputSchema.parse(req.body);
  const report = await getClientProfileReport(payload);
  res.status(200).json(report);
};

export default apiHandler({
  POST: getClientProfileHandler,
});
