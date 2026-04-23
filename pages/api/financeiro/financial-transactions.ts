import { TAuthSession } from "@/lib/authentication/types";
import {
  FinancialTransactionMethodEnumSchema,
  FinancialTransactionTypeEnumSchema,
  TFinancialTransaction,
  TFinancialTransactionMethodEnum,
  TFinancialTransactionTypeEnum,
} from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Filter, type WithId, type Collection, type Db } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const PAGE_SIZE = 25;

const StatusEnumSchema = z.enum(["pendente", "efetivada", "em-atraso"]);
export type TFinancialTransactionStatus = z.infer<typeof StatusEnumSchema>;

const notEfetivada: Filter<Record<string, unknown>> = {
  $or: [{ dataEfetivacao: null }, { dataEfetivacao: { $exists: false } }],
};

const GetFinancialTransactionsInputSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  search: z.string().optional().nullable(),
  periodAfter: z
    .string()
    .datetime({ message: "Tipo inválido para período." })
    .optional()
    .nullable(),
  periodBefore: z
    .string()
    .datetime({ message: "Tipo inválido para período." })
    .optional()
    .nullable(),
  types: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.split(",").map((v) => v.trim()) ?? [])
    .refine((v) => v.every((v) => FinancialTransactionTypeEnumSchema.safeParse(v).success), {
      message: "Tipos inválidos.",
    }),
  paymentMethods: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.split(",").map((v) => v.trim()) ?? [])
    .refine((v) => v.every((v) => FinancialTransactionMethodEnumSchema.safeParse(v).success), {
      message: "Métodos de pagamento inválidos.",
    }),
  statuses: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.split(",").map((v) => v.trim()) ?? [])
    .refine((v) => v.every((v) => StatusEnumSchema.safeParse(v).success), {
      message: "Statuses inválidos.",
    }),
});
export type TGetFinancialTransactionsInput = z.infer<typeof GetFinancialTransactionsInputSchema>;

type TFinancialTransactionDoc = WithId<TFinancialTransaction>;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mapTransactionToResponse(doc: TFinancialTransactionDoc) {
  return {
    id: doc._id.toString(),
    lancamentoContabil: { id: doc.lancamentoContabil.id, nome: doc.lancamentoContabil.nome },
    contaFinanceira: {
      id: doc.contaFinanceira.id,
      nome: doc.contaFinanceira.nome,
      tipo: doc.contaFinanceira.tipo ?? null,
    },
    titulo: doc.titulo,
    tipo: doc.tipo,
    valor: doc.valor,
    metodo: doc.metodo,
    dataPrevisao: doc.dataPrevisao,
    dataEfetivacao: doc.dataEfetivacao ?? null,
    parcela: doc.parcela ?? null,
    totalParcelas: doc.totalParcelas ?? null,
    provedorReferencia: doc.provedorReferencia ?? null,
    provedorStatus: doc.provedorStatus ?? null,
    autor: { id: doc.autor.id, nome: doc.autor.nome, avatarUrl: doc.autor.avatar_url ?? null },
    dataInsercao: doc.dataInsercao,
  };
}

function buildFilter(input: TGetFinancialTransactionsInput): Filter<TFinancialTransaction> {
  const { search, periodAfter, periodBefore, types, paymentMethods, statuses } = input;
  const nowIso = new Date().toISOString();

  const base: Filter<TFinancialTransaction> = {};

  const searchClauses: Filter<TFinancialTransaction>[] | null =
    search && search.trim().length > 0
      ? [
          { titulo: { $regex: escapeRegExp(search.trim()), $options: "i" } },
          { "contaFinanceira.nome": { $regex: escapeRegExp(search.trim()), $options: "i" } },
          { "contaFinanceira.tipo": { $regex: escapeRegExp(search.trim()), $options: "i" } },
          { "contaFinanceira.tipo": { $regex: escapeRegExp(search.trim()), $options: "i" } },
          { "contaFinanceira.tipo": { $regex: escapeRegExp(search.trim()), $options: "i" } },
        ]
      : null;

  const periodFilter: Filter<TFinancialTransaction> | null =
    periodAfter != null || periodBefore != null
      ? {
          dataPrevisao: {
            $gte: periodAfter ? dayjs(periodAfter).toISOString() : undefined,
            $lte: periodBefore ? dayjs(periodBefore).toISOString() : undefined,
          },
        }
      : null;

  const typeFilter: Filter<TFinancialTransaction> | null =
    types.length > 0 ? { tipo: { $in: types as TFinancialTransactionTypeEnum[] } } : null;
  const paymentMethodFilter: Filter<TFinancialTransaction> | null =
    paymentMethods && paymentMethods.length > 0
      ? { metodo: { $in: paymentMethods as TFinancialTransactionMethodEnum[] } }
      : null;

  const statusClauses: Filter<TFinancialTransaction>[] = [];
  if (statuses.includes("pendente")) {
    statusClauses.push({
      $and: [notEfetivada, { dataPrevisao: { $gte: nowIso } } as Filter<TFinancialTransactionDoc>],
    });
  }
  if (statuses.includes("efetivada")) {
    statusClauses.push({
      $and: [{ dataEfetivacao: { $exists: true } }, { dataEfetivacao: { $ne: null } }],
    });
  }
  if (statuses.includes("em-atraso")) {
    statusClauses.push({
      $and: [notEfetivada, { dataPrevisao: { $lte: nowIso } } as Filter<TFinancialTransactionDoc>],
    });
  }

  const finalQueries: Filter<TFinancialTransaction>[] = [];
  if (searchClauses) finalQueries.push({ $or: searchClauses });
  if (periodFilter) finalQueries.push(periodFilter);
  if (typeFilter) finalQueries.push(typeFilter);
  if (paymentMethodFilter) finalQueries.push(paymentMethodFilter);
  if (statusClauses.length > 0) finalQueries.push({ $or: statusClauses });

  return { $and: finalQueries };
}

async function getFinancialTransactions({
  input,
  session: _session,
}: {
  input: TGetFinancialTransactionsInput;
  session: TAuthSession;
}) {
  const { page } = input;
  const filter = buildFilter(input);
  const skip = PAGE_SIZE * (page - 1);
  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransactionDoc> = db.collection("transacoes-financeiras");

  const [transactionsMatched, raw] = await Promise.all([
    collection.countDocuments(filter),
    collection.find(filter, { sort: { dataPrevisao: -1 }, skip, limit: PAGE_SIZE }).toArray(),
  ]);

  const totalPages = Math.ceil(transactionsMatched / PAGE_SIZE);
  const transactions = raw.map(mapTransactionToResponse);

  return {
    data: {
      default: {
        transactions,
        transactionsMatched,
        totalPages,
      },
    },
  };
}

export type TGetFinancialTransactionsOutput = Awaited<ReturnType<typeof getFinancialTransactions>>;
export type TGetFinancialTransactionsOutputDefault =
  TGetFinancialTransactionsOutput["data"]["default"];

const getFinancialTransactionsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);

  const input = GetFinancialTransactionsInputSchema.parse(req.query);

  const result = await getFinancialTransactions({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({ GET: getFinancialTransactionsRoute });
