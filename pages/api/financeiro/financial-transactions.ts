import { TAuthSession } from "@/lib/authentication/types";
import {
  FinancialTransactionMethodEnumSchema,
  FinancialTransactionSchema,
  FinancialTransactionTypeEnumSchema,
  TFinancialTransaction,
  TFinancialTransactionMethodEnum,
  TFinancialTransactionTypeEnum,
} from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Filter, type WithId, type Collection, type Db, ObjectId } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const PAGE_SIZE = 25;

const StatusEnumSchema = z.enum(["pendente", "efetivada", "em-atraso"]);
export type TFinancialTransactionStatus = z.infer<typeof StatusEnumSchema>;

const notEfetivada: Filter<Record<string, unknown>> = {
  $or: [{ dataEfetivacao: null }, { dataEfetivacao: { $exists: false } }],
};

const GetFinancialTransactionsInputSchema = z.object({
  id: z.string().optional().nullable(),
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
    .transform((v) => {
      if (v == null || v.trim() === "") return [];
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .refine((v) => v.every((v) => FinancialTransactionTypeEnumSchema.safeParse(v).success), {
      message: "Tipos inválidos.",
    }),
  paymentMethods: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v == null || v.trim() === "") return [];
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .refine((v) => v.every((v) => FinancialTransactionMethodEnumSchema.safeParse(v).success), {
      message: "Métodos de pagamento inválidos.",
    }),
  statuses: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v == null || v.trim() === "") return [];
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })
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

  console.log("[INFO] [GET_FINANCIAL_TRANSACTIONS] [INPUT]", JSON.stringify(input, null, 2));
  const nowIso = new Date().toISOString();

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
  const { id, page } = input;
  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransactionDoc> = db.collection("transacoes-financeiras");

  if (id) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido.");
    const transactionDoc = await collection.findOne({ _id: new ObjectId(id) });
    if (!transactionDoc) throw new Error("Transação financeira não encontrada.");
    return {
      data: {
        byId: mapTransactionToResponse(transactionDoc),
        default: null,
      },
    };
  }

  const filter = buildFilter(input);
  console.log("[INFO] [GET_FINANCIAL_TRANSACTIONS] [FILTER]", JSON.stringify(filter, null, 2));
  const skip = PAGE_SIZE * (page - 1);

  const [transactionsMatched, raw] = await Promise.all([
    collection.countDocuments(filter),
    collection.find(filter, { sort: { dataPrevisao: -1 }, skip, limit: PAGE_SIZE }).toArray(),
  ]);

  const totalPages = Math.ceil(transactionsMatched / PAGE_SIZE);
  const transactions = raw.map(mapTransactionToResponse);

  return {
    data: {
      byId: null,
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
  Exclude<TGetFinancialTransactionsOutput["data"]["default"], null>;
export type TGetFinancialTransactionsOutputById = Exclude<
  TGetFinancialTransactionsOutput["data"]["byId"],
  null
>;

const getFinancialTransactionsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  console.log("[INFO] [GET_FINANCIAL_TRANSACTIONS] [REQUEST]", JSON.stringify(req.query, null, 2));
  const input = GetFinancialTransactionsInputSchema.parse(req.query);
  console.log("[INFO] [GET_FINANCIAL_TRANSACTIONS] [INPUT]", JSON.stringify(input, null, 2));
  const result = await getFinancialTransactions({ input, session });
  return res.status(200).json(result);
};

const UpdateFinancialTransactionInputSchema = z.object({
  transactionId: z.string({
    required_error: "ID da transação financeira não informado.",
    invalid_type_error: "Tipo inválido para o ID da transação financeira.",
  }),
  transaction: FinancialTransactionSchema,
});
export type TUpdateFinancialTransactionInput = z.infer<
  typeof UpdateFinancialTransactionInputSchema
>;
async function updateFinancialTransaction({
  input,
  session,
}: {
  input: TUpdateFinancialTransactionInput;
  session: TAuthSession;
}) {
  const { transactionId, transaction } = input;

  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransaction> = db.collection("transacoes-financeiras");
  const transactionDoc = await collection.findOne({ _id: new ObjectId(transactionId) });
  if (!transactionDoc) {
    throw new Error("Transação financeira não encontrada.");
  }

  const updateResponse = await collection.updateOne(
    { _id: new ObjectId(transactionId) },
    { $set: { ...transaction } },
  );
  if (!updateResponse.acknowledged) {
    throw new Error("Oops, houve um erro desconhecido ao atualizar transação financeira.");
  }

  return {
    data: {
      updatedId: transactionId,
    },
    message: "Transação financeira atualizada com sucesso!",
  };
}
export type TUpdateFinancialTransactionOutput = Awaited<
  ReturnType<typeof updateFinancialTransaction>
>;

const updateFinancialTransactionRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = UpdateFinancialTransactionInputSchema.parse(req.body);
  const result = await updateFinancialTransaction({ input, session });
  return res.status(200).json(result);
};

const CreateFinancialTransactionInputSchema = z.object({
  transaction: FinancialTransactionSchema,
});
export type TCreateFinancialTransactionInput = z.infer<
  typeof CreateFinancialTransactionInputSchema
>;
async function createFinancialTransaction({
  input,
  session,
}: {
  input: TCreateFinancialTransactionInput;
  session: TAuthSession;
}) {
  const { transaction } = input;

  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransaction> = db.collection("transacoes-financeiras");
  const transactionDoc = await collection.insertOne(transaction);

  return {
    data: {
      createdId: transactionDoc.insertedId.toString(),
    },
    message: "Transação financeira criada com sucesso!",
  };
}
export type TCreateFinancialTransactionOutput = Awaited<
  ReturnType<typeof createFinancialTransaction>
>;

const createFinancialTransactionRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = CreateFinancialTransactionInputSchema.parse(req.body);
  const result = await createFinancialTransaction({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  GET: getFinancialTransactionsRoute,
  PUT: updateFinancialTransactionRoute,
  POST: createFinancialTransactionRoute,
});
