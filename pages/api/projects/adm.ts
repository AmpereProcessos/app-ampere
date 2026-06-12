import type { NextApiHandler } from "next";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import { getADMProjectsByFilter } from "@/repositories/projects/adm-queries";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import { formatDateQuery } from "@/utils/methods/dates";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { TRevenue } from "@/utils/schemas/revenues";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import type { Collection, Db, Filter } from "mongodb";
import { z } from "zod";

const commaSeparatedStrings = (label: string) =>
  z
    .string({ invalid_type_error: `Tipo não válido para ${label}.` })
    .optional()
    .nullable()
    .transform((v) => (v ? v.split(",").filter((s) => s.trim().length > 0) : []));

const queryBoolean = (label: string) =>
  z
    .string({ invalid_type_error: `Tipo não válido para ${label}.` })
    .optional()
    .nullable()
    .transform((v) => v === "true");

const nullableQueryString = (label: string) =>
  z
    .string({ invalid_type_error: `Tipo não válido para ${label}.` })
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v : null));

export const GetADMProjectsInputSchema = z
  .object({
    page: z
      .string({ required_error: "Parâmetro de paginação não informado." })
      .optional()
      .nullable()
      .transform((v) => Number(v ?? "1")),
    search: z
      .string({ invalid_type_error: "Tipo não válido para busca." })
      .optional()
      .nullable()
      .transform((v) => v ?? ""),
    contractStatus: commaSeparatedStrings("status do contrato"),
    tagIds: commaSeparatedStrings("IDs de etiquetas"),
    technicalTeam: commaSeparatedStrings("equipe técnica"),
    billingCompany: commaSeparatedStrings("empresa de faturamento"),
    inspectionStatus: commaSeparatedStrings("status da vistoria"),
    sellers: commaSeparatedStrings("vendedores"),
    toCharge: queryBoolean("filtro de cobrança pendente"),
    chargeDone: queryBoolean("filtro de cobrança concluída"),
    toBill: queryBoolean("filtro de faturamento pendente"),
    billingDone: queryBoolean("filtro de faturamento concluído"),
    receiptsUndefined: queryBoolean("filtro de recebimentos indefinidos"),
    receiptToday: queryBoolean("filtro de recebimentos para hoje"),
    receiptThisWeek: queryBoolean("filtro de recebimentos para a semana"),
    receiptThisMonth: queryBoolean("filtro de recebimentos para o mês"),
    dateAfter: nullableQueryString("data inicial"),
    dateBefore: nullableQueryString("data final"),
    dateField: z
      .enum(["obra.saida", "medidor.data", "contrato.dataAssinatura"], {
        invalid_type_error: "Tipo não válido para campo de data.",
      })
      .optional()
      .nullable(),
  })
  .transform(({ dateAfter, dateBefore, dateField, ...filters }) => ({
    ...filters,
    date: {
      after: dateAfter,
      before: dateBefore,
      field: dateField ?? null,
    },
  }));

export type TGetADMProjectsInput = z.infer<typeof GetADMProjectsInputSchema>;

type TADMProjectsDynamicQuery = {
  projectMatchStages: Filter<TProject>[];
  postLookupMatchStages: Filter<TProject>[];
};

const pendingReceiptElemMatch = (unit: "day" | "week" | "month") => ({
  dataPrevisaoRecebimento: {
    $gte: dayjs().startOf(unit).subtract(3, "hour").toISOString(),
    $lte: dayjs().endOf(unit).subtract(3, "hour").toISOString(),
  },
  $or: [{ dataRecebimento: { $exists: false } }, { dataRecebimento: null }],
});

function getDynamicQuery(filters: TGetADMProjectsInput): TADMProjectsDynamicQuery {
  const projectMatchStages: Filter<TProject>[] = [];
  const postLookupMatchStages: Filter<TProject>[] = [];

  if (filters.search.trim().length > 0) {
    projectMatchStages.push({
      $or: [
        { nomeDoContrato: { $regex: filters.search, $options: "i" } },
        { nomeDoContrato: filters.search },
      ],
    });
  }

  if (filters.contractStatus.length > 0) {
    projectMatchStages.push({ "contrato.status": { $in: filters.contractStatus } });
  }

  if (filters.tagIds.length > 0) {
    projectMatchStages.push({ "etiquetas.id": { $in: filters.tagIds } });
  }

  if (filters.technicalTeam.length > 0) {
    projectMatchStages.push({ "obra.equipeResp": { $in: filters.technicalTeam } });
  }

  if (filters.billingCompany.length > 0) {
    projectMatchStages.push({
      "faturamento.empresaFaturamento": {
        $in: filters.billingCompany as NonNullable<TProject["faturamento"]["empresaFaturamento"]>[],
      },
    });
  }

  if (filters.inspectionStatus.length > 0) {
    projectMatchStages.push({ "vistoria.status": { $in: filters.inspectionStatus } });
  }

  if (filters.sellers.length > 0) {
    projectMatchStages.push({ "vendedor.nome": { $in: filters.sellers } });
  }

  if (filters.toCharge) {
    projectMatchStages.push({ "pagamento.cobrancaFeita": { $ne: true } });
  }

  if (filters.chargeDone) {
    projectMatchStages.push({ "pagamento.cobrancaFeita": true });
  }

  if (filters.toBill) {
    projectMatchStages.push({ "faturamento.concluido": { $ne: true } });
  }

  if (filters.billingDone) {
    projectMatchStages.push({ "faturamento.concluido": true });
  }

  if (filters.date.after && filters.date.before && filters.date.field) {
    projectMatchStages.push({
      [filters.date.field]: {
        $gte: formatDateQuery(filters.date.after, "start"),
        $lte: formatDateQuery(filters.date.before, "end"),
      },
    });
  }

  if (filters.receiptsUndefined) {
    postLookupMatchStages.push({
      $or: [
        { receitas: { $size: 0 } },
        {
          receitas: {
            $elemMatch: {
              $or: [{ fracionamento: { $exists: false } }, { fracionamento: { $size: 0 } }],
            },
          },
        },
      ],
    });
  }

  if (filters.receiptToday) {
    postLookupMatchStages.push({
      receitas: {
        $elemMatch: {
          fracionamento: { $elemMatch: pendingReceiptElemMatch("day") },
        },
      },
    });
  }

  if (filters.receiptThisWeek) {
    postLookupMatchStages.push({
      receitas: {
        $elemMatch: {
          fracionamento: { $elemMatch: pendingReceiptElemMatch("week") },
        },
      },
    });
  }

  if (filters.receiptThisMonth) {
    postLookupMatchStages.push({
      receitas: {
        $elemMatch: {
          fracionamento: { $elemMatch: pendingReceiptElemMatch("month") },
        },
      },
    });
  }

  return { projectMatchStages, postLookupMatchStages };
}
export type TProjectADMSimplifiedWithRevenue = TProjectDTO & {
  receita?: {
    total: TRevenue["total"];
    metodo: TRevenue["metodo"];
    fracionamento: TRevenue["fracionamento"];
  };
};

export type TADMProjectsByFiltersResult = {
  projects: TProjectADMSimplifiedWithRevenue[];
  projectsMatched: number;
  totalPages: number;
};

const getADMProjectsRoute: NextApiHandler<{ data: TADMProjectsByFiltersResult }> = async (
  req,
  res,
) => {
  const PAGE_SIZE = 50;

  await validateAuthenticationWithSession(req, res);
  const filters = GetADMProjectsInputSchema.parse(req.query);

  if (!filters.page || Number.isNaN(filters.page)) {
    throw new createHttpError.BadRequest("Parâmetro de paginação inválido ou não informado.");
  }

  const { projectMatchStages, postLookupMatchStages } = getDynamicQuery(filters);
  const skip = PAGE_SIZE * (filters.page - 1);
  const limit = PAGE_SIZE;

  const db: Db = await connectToDatabase();
  const collection: Collection<TProject> = db.collection("dados");

  const baseADMQuery: Filter<TProject> = {
    "contrato.status": { $ne: "RESCISÃO DE CONTRATO" },
    $and: [
      {
        $or: [
          {
            tipoDeServico: {
              $nin: ["OPERAÇÃO E MANUTENÇÃO", "MONTAGEM E DESMONTAGEM"],
            },
            "obra.statusDaObra": "CONCLUÍDA",
          },
          {
            tipoDeServico: {
              $in: [
                "OPERAÇÃO E MANUTENÇÃO",
                "MONTAGEM E DESMONTAGEM",
                "SEGURO DE SISTEMA FOTOVOLTAICO",
              ],
            },
            "contrato.status": "ASSINADO",
          },
        ],
      },
      {
        $or: [
          { "pagamento.cobrancaFeita": { $ne: true } },
          { "faturamento.concluido": { $ne: true } },
        ],
      },
    ],
  };

  const match: Filter<TProject> = {
    $and: [baseADMQuery, ...projectMatchStages],
  };

  console.log(JSON.stringify(match, null, 2));
  const { projects, projectsMatched } = await getADMProjectsByFilter({
    collection,
    match,
    postLookupMatchStages,
    skip,
    limit,
  });
  const totalPages = Math.ceil(projectsMatched / PAGE_SIZE);

  return res.status(200).json({ data: { projects, projectsMatched, totalPages } });
};

export default apiHandler({
  GET: getADMProjectsRoute,
});
// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const db = await connectToDatabase(process.env.DB_KEY, 'projetos')
//     const collection = db.collection('dados')
//     let adm = await collection
//       .aggregate([
//         {
//           $match: {
//             'contrato.status': { $ne: 'RESCISÃO DE CONTRATO' },
//             $or: [
//               {
//                 tipoDeServico: {
//                   $nin: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM'],
//                 },
//                 'obra.statusDaObra': 'CONCLUÍDA',
//               },
//               {
//                 tipoDeServico: {
//                   $in: ['OPERAÇÃO E MANUTENÇÃO', 'MONTAGEM E DESMONTAGEM', 'SEGURO DE SISTEMA FOTOVOLTAICO'],
//                 },
//                 'contrato.status': 'ASSINADO',
//               },
//             ],
//             $or: [{ 'pagamento.cobrancaFeita': { $ne: true } }, { 'faturamento.concluido': { $ne: true } }],
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             qtde: 1,
//             nomeDoContrato: 1,
//             tipoDeServico: 1,
//             'vendedor.nome': 1,
//             'pagamento.forma': 1,
//             'pagamento.status': 1,
//             'pagamento.cobrancaFeita': 1,
//             'faturamento.concluido': 1,
//             'faturamento.empresaFaturamento': 1,
//             'contrato.status': 1,
//             'contrato.dataAssinatura': 1,
//             'compra.statusLiberacao': 1,
//             'obra.equipeResp': 1,
//             'obra.saida': 1,
//             'medidor.data': 1,
//             'vistoria.status': 1,
//           },
//         },
//         {
//           $sort: {
//             qtde: -1,
//           },
//         },
//       ])
//       .toArray()
//     res.json(adm)
//   }
// }
