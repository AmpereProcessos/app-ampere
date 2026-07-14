import { getSegmentedProjectIds } from "@/repositories/stats/client-profile";
import { resolveMunicipalityCoordinates } from "@/utils/geography/brazil";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { ReportFilterInputSchema, hasActiveSegment } from "@/utils/schemas/report-filter.schema";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import type { Filter, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";
import { z } from "zod";

export const GeographicMetricSchema = z.enum(["SALES", "EXECUTIONS", "HOMOLOGATIONS", "SUPPLIES"]);
export type TGeographicMetric = z.infer<typeof GeographicMetricSchema>;

export const GeographicReportSchema = ReportFilterInputSchema.extend({
  metric: GeographicMetricSchema,
});
export type TGeographicReportInput = z.infer<typeof GeographicReportSchema>;

type TGeographicAggregationRow = {
  _id: { cidade?: string | null; estado?: string | null };
  quantidade: number;
  valor?: number;
  potencia?: number;
  pedidos?: number;
  entregas?: number;
};

function getDateCondition(field: string, period: TGeographicReportInput["period"]) {
  if (period.after && period.before) return { [field]: { $gte: period.after, $lte: period.before } };
  return { [field]: { $ne: null } };
}

function getMetricMatch(input: TGeographicReportInput): Filter<TProject> {
  const projectTypes = {
    ...(input.projectTypes.length ? { tipoDeServico: { $in: input.projectTypes } } : {}),
    ...(input.location.estado ? { uf: input.location.estado } : {}),
    ...(input.location.cidade ? { cidade: input.location.cidade } : {}),
  };
  const signedContract = { "contrato.status": "ASSINADO", "contrato.dataAssinatura": { $ne: null } };

  switch (input.metric) {
    case "SALES":
      return { ...projectTypes, "contrato.status": "ASSINADO", ...getDateCondition("contrato.dataAssinatura", input.period) };
    case "EXECUTIONS":
      return { ...projectTypes, ...signedContract, ...getDateCondition("obra.saida", input.period) };
    case "HOMOLOGATIONS":
      return { ...projectTypes, ...signedContract, ...getDateCondition("homologacao.acesso.dataResposta", input.period) };
    case "SUPPLIES":
      return {
        ...projectTypes,
        ...signedContract,
        "compra.dataLiberacao": { $ne: null },
        $or: [getDateCondition("compra.dataPedido", input.period), getDateCondition("compra.dataEntrega", input.period)],
      };
  }
}

function getSupplyCondition(field: string, period: TGeographicReportInput["period"]) {
  if (period.after && period.before) {
    return { $and: [{ $gte: [`$${field}`, period.after] }, { $lte: [`$${field}`, period.before] }] };
  }
  return { $ne: [`$${field}`, null] };
}

function getGroupStage(input: TGeographicReportInput) {
  const base = { _id: { cidade: "$cidade", estado: "$uf" }, quantidade: { $sum: 1 } };

  switch (input.metric) {
    case "SALES":
      return {
        $group: {
          ...base,
          valor: {
            $sum: {
              $add: [
                { $ifNull: ["$sistema.valorProjeto", 0] },
                { $ifNull: ["$oem.valor", 0] },
                { $ifNull: ["$padrao.valor", 0] },
                { $ifNull: ["$estruturaPersonalizada.valor", 0] },
                { $ifNull: ["$seguro.valor", 0] },
              ],
            },
          },
        },
      };
    case "HOMOLOGATIONS":
      return { $group: { ...base, potencia: { $sum: { $ifNull: ["$sistema.potPico", 0] } } } };
    case "SUPPLIES":
      return {
        $group: {
          ...base,
          pedidos: { $sum: { $cond: [getSupplyCondition("compra.dataPedido", input.period), 1, 0] } },
          entregas: { $sum: { $cond: [getSupplyCondition("compra.dataEntrega", input.period), 1, 0] } },
        },
      };
    default:
      return { $group: base };
  }
}

async function getGeographicReport(input: TGeographicReportInput) {
  const db = await connectToDatabase();
  const collection = db.collection<TProject>("dados");

  // Recorte de segmento do Perfil: restringe o mapa e o ranking aos mesmos
  // projetos que o Perfil considera para o segmento ativo.
  let segmentIdFilter: Filter<TProject> = {};
  if (hasActiveSegment(input.segment)) {
    const crmDb = await connectToCRMDatabase();
    const clientsCollection = crmDb.collection<TClient>("clients");
    const ids: ObjectId[] = await getSegmentedProjectIds({
      projectsCollection: collection,
      clientsCollection,
      baseQuery: {
        "contrato.status": "ASSINADO",
        "contrato.dataAssinatura": { $ne: null },
        ...(input.projectTypes.length ? { tipoDeServico: { $in: input.projectTypes } } : {}),
        ...(input.location.estado ? { uf: input.location.estado } : {}),
        ...(input.location.cidade ? { cidade: input.location.cidade } : {}),
      },
      segment: input.segment,
    });
    segmentIdFilter = { _id: { $in: ids } };
  }

  const rows = (await collection.aggregate([
    { $match: { ...getMetricMatch(input), ...segmentIdFilter } },
    getGroupStage(input),
    { $sort: { quantidade: -1 } },
  ]).toArray()) as TGeographicAggregationRow[];

  const locations = rows.map((row) => {
    const cidade = row._id.cidade?.trim() ?? "";
    const estado = row._id.estado?.trim() ?? "";
    const coordinates = cidade && estado ? resolveMunicipalityCoordinates(cidade, estado) : null;
    const score = input.metric === "SALES" ? row.valor ?? 0 : input.metric === "HOMOLOGATIONS" ? row.potencia ?? 0 : input.metric === "SUPPLIES" ? (row.pedidos ?? 0) + (row.entregas ?? 0) : row.quantidade;

    return {
      cidade: cidade || "NÃO INFORMADO",
      estado: estado || "NÃO INFORMADO",
      quantidade: row.quantidade,
      valor: row.valor ?? null,
      potencia: row.potencia ?? null,
      pedidos: row.pedidos ?? null,
      entregas: row.entregas ?? null,
      score,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      mapeada: Boolean(coordinates),
    };
  });

  const mapped = locations.filter((location) => location.mapeada);
  const withoutCityOrState = locations.filter((location) => location.cidade === "NÃO INFORMADO" || location.estado === "NÃO INFORMADO");

  return {
    data: {
      metric: input.metric,
      locations: locations.sort((a, b) => b.score - a.score),
      points: mapped,
      summary: {
        localidades: locations.length,
        localidadesMapeadas: mapped.length,
        localidadesSemCoordenadas: locations.length - mapped.length - withoutCityOrState.length,
        localidadesSemCidadeOuUf: withoutCityOrState.length,
        registros: locations.reduce((total, location) => total + location.quantidade, 0),
      },
    },
  };
}
export type TGeographicReportOutput = Awaited<ReturnType<typeof getGeographicReport>>;

const geographicReportHandler: NextApiHandler<TGeographicReportOutput> = async (req, res) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GeographicReportSchema.parse(req.body);
  console.log("[INFO] [GET_GEOGRAPHIC_REPORT] Requested by user", { name: session.user.nome, email: session.user.email, metric: input.metric });
  res.status(200).json(await getGeographicReport(input));
};

export default apiHandler({ POST: geographicReportHandler });
