import { getClientProfile } from "@/repositories/stats/client-profile";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Filter } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

const SegmentValueSchema = z
  .string({ invalid_type_error: "Tipo não válido para o valor de segmento." })
  .optional()
  .nullable();

export const ClientProfileInputSchema = z.object({
  projectTypes: z.array(z.string({ invalid_type_error: "Tipos de projetos inválidos" }), {
    required_error: "Tipos de projetos são obrigatórios",
    invalid_type_error: "Tipos de projetos inválidos",
  }),
  period: z.object({
    after: z
      .string({ invalid_type_error: "Tipo não válido para a data de início." })
      .datetime({ message: "Data de início deve ser uma data válida" })
      .optional()
      .nullable(),
    before: z
      .string({ invalid_type_error: "Tipo não válido para a data de fim." })
      .datetime({ message: "Data de fim deve ser uma data válida" })
      .optional()
      .nullable(),
  }),
  // Segmento de cruzamento: cada dimensão preenchida restringe as demais
  segmento: z
    .object({
      sexo: SegmentValueSchema,
      faixaEtaria: SegmentValueSchema,
      faixaValor: SegmentValueSchema,
      profissao: SegmentValueSchema,
      formaPagamento: SegmentValueSchema,
    })
    .default({}),
});
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
  };

  const profile = await getClientProfile({
    projectsCollection,
    clientsCollection,
    projectsQuery,
    segment: payload.segmento,
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
