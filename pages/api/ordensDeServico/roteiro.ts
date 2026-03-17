import { TAuthSession } from "@/lib/authentication/types";
import { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import { TServiceOrder } from "@/utils/schemas/service-order";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import createHttpError from "http-errors";
import { Filter } from "mongodb";
import z from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
const GetServiceOrdersItinerarySchema = z.object({
  search: z
    .string({
      invalid_type_error: "Tipo não válido para busca.",
    })
    .optional()
    .nullable(),
  page: z
    .string({
      required_error: "Página não informada.",
      invalid_type_error: "Tipo não válido para página.",
    })
    .transform((v) => Number(v)),
  responsibleNames: z
    .string({
      invalid_type_error: "Tipo não válido para lista de nomes de responsáveis.",
    })
    .optional()
    .nullable()
    .transform((v) => (v ? v.split(",") : [])),
  pendingConclusionOnly: z
    .string({
      invalid_type_error: "Tipo não válido para filtro de conclusão pendente.",
    })
    .optional()
    .nullable()
    .transform((v) => v === "true"),
});
export type TGetServiceOrdersItineraryInput = z.infer<typeof GetServiceOrdersItinerarySchema>;

async function getServiceOrdersItinerary({
  params,
  session,
}: {
  params: TGetServiceOrdersItineraryInput;
  session: TAuthSession;
}) {
  const { search, responsibleNames, pendingConclusionOnly } = params;
  const userViewMode = session.user.visualizacao.tipo;

  // Checking for attempts to see beyond user reference scope
  if (
    userViewMode === "EXECUÇÃO" &&
    !responsibleNames?.includes(session.user.visualizacao.referencia ?? "")
  )
    throw new createHttpError.BadRequest("Você não tem permissão para acessar esta página.");

  const appDb = await connectToDatabase();
  const serviceOrdersCollection = appDb.collection<TServiceOrder>("ordensDeServico");

  const crmDb = await connectToCRMDatabase();
  const fileReferencesCollection = crmDb.collection<TFileReference>("file-references");

  const searchQuery =
    search && search.trim().length > 0
      ? {
          $or: [
            { descricao: { $regex: search, $options: "i" } },
            { descricao: search },

            { "favorecido.nome": { $regex: search, $options: "i" } },
            { "favorecido.nome": search },

            { "projeto.nome": { $regex: search, $options: "i" } },
            { "projeto.nome": search },

            { "responsavel.nome": { $regex: search, $options: "i" } },
            { "responsavel.nome": search },
          ],
        }
      : {};

  const responsibleQuery =
    responsibleNames && responsibleNames.length > 0
      ? { "responsavel.id": { $in: responsibleNames } }
      : {};

  const pendingConclusionQuery = pendingConclusionOnly ? { dataEfetivacao: null } : {};

  const query: Filter<TServiceOrder> = {
    $and: [searchQuery, responsibleQuery, pendingConclusionQuery].filter(
      (r) => Object.keys(r).length > 0,
    ),
  };

  const serviceOrdersMatched = await serviceOrdersCollection.countDocuments(query);

  const totalPages = 1;
  const serviceOrdersUnsorted = await serviceOrdersCollection.find(query).toArray();
  const serviceOrders = serviceOrdersUnsorted.sort((a, b) => {
    const dateA = a.agendamento?.inicio
      ? new Date(a.agendamento.inicio).getTime()
      : Number.POSITIVE_INFINITY;
    const dateB = b.agendamento?.inicio
      ? new Date(b.agendamento.inicio).getTime()
      : Number.POSITIVE_INFINITY;

    if (dateA !== dateB) return dateA - dateB;

    const createdA = a.dataInsercao ? new Date(a.dataInsercao).getTime() : Number.POSITIVE_INFINITY;
    const createdB = b.dataInsercao ? new Date(b.dataInsercao).getTime() : Number.POSITIVE_INFINITY;
    return createdA - createdB;
  });
  const serviceOrdersIds = serviceOrders.map((s) => s._id.toString());
  const technicalAnalysisIds = serviceOrders
    .map((s) => s.idAnaliseTecnica)
    .filter((id) => !!id) as string[];
  // Enriching service orders
  const fileReferences = await fileReferencesCollection
    .find({
      $or: [
        {
          idAnaliseTecnica: {
            $in: technicalAnalysisIds,
          },
        },
        {
          idOrdemServico: {
            $in: serviceOrdersIds,
          },
        },
      ],
    })
    .toArray();

  const serviceOrdersEnriched = serviceOrders.map((s) => {
    const fileReferencesMatched = fileReferences.filter(
      (f) => f.idOrdemServico === s._id.toString() || f.idAnaliseTecnica === s.idAnaliseTecnica,
    );

    return {
      ...s,
      _id: s._id.toString(),
      arquivos: fileReferencesMatched.map((f) => ({ ...f, _id: f._id.toString() })),
    };
  });

  return {
    data: {
      default: {
        serviceOrders: serviceOrdersEnriched,
        serviceOrdersMatched,
        totalPages,
      },
    },
  };
}
export type TGetServiceOrdersItineraryOutput = Awaited<
  ReturnType<typeof getServiceOrdersItinerary>
>;
export type TGetServiceOrdersItineraryOutputDefault = Exclude<
  TGetServiceOrdersItineraryOutput["data"]["default"],
  undefined
>;
async function getServiceOrdersItineraryRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await validateAuthenticationWithSession(req, res);
  const params = await GetServiceOrdersItinerarySchema.parseAsync(req.query);
  const data = await getServiceOrdersItinerary({ params, session });
  return res.status(200).json(data);
}

export default apiHandler({
  GET: getServiceOrdersItineraryRoute,
});
