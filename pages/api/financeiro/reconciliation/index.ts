import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
  FinancialReconciliationExtractedLineSchema,
  FinancialReconciliationMatchSchema,
  FinancialReconciliationStatusEnumSchema,
  TFinancialReconciliation,
  TFinancialTransaction,
} from "@/utils/schemas/finances";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import createHttpError from "http-errors";
import { type Collection, type Db, type Filter, ObjectId, type WithId } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const PAGE_SIZE = 20;

type TReconciliationDoc = WithId<TFinancialReconciliation>;

function mapReconciliationToResponse(doc: TReconciliationDoc) {
  return {
    id: doc._id.toString(),
    contaFinanceira: doc.contaFinanceira,
    periodo: doc.periodo,
    pdf: doc.pdf,
    status: doc.status,
    linhasExtraidas: doc.linhasExtraidas,
    matches: doc.matches,
    autor: {
      id: doc.autor.id,
      nome: doc.autor.nome,
      avatarUrl: doc.autor.avatar_url ?? null,
    },
    dataInsercao: doc.dataInsercao,
  };
}

/* -------------------------------------------------------------------------- */
/* GET                                                                        */
/* -------------------------------------------------------------------------- */

const GetReconciliationsInputSchema = z.object({
  id: z.string().optional().nullable(),
  page: z.coerce.number().min(1).default(1),
  contaFinanceiraId: z.string().optional().nullable(),
});
export type TGetReconciliationsInput = z.infer<typeof GetReconciliationsInputSchema>;

async function getReconciliations({
  input,
  session: _session,
}: {
  input: TGetReconciliationsInput;
  session: TAuthSession;
}) {
  const db: Db = await connectToDatabase();
  const collection: Collection<TReconciliationDoc> = db.collection(
    "conciliacoes-financeiras",
  );

  if (input.id) {
    if (!ObjectId.isValid(input.id)) throw new createHttpError.BadRequest("ID inválido.");
    const doc = await collection.findOne({ _id: new ObjectId(input.id) });
    if (!doc) throw new createHttpError.NotFound("Conciliação não encontrada.");
    return {
      data: {
        byId: mapReconciliationToResponse(doc),
        default: null,
      },
    };
  }

  const filter: Filter<TReconciliationDoc> = {};
  if (input.contaFinanceiraId) {
    filter["contaFinanceira.id"] = input.contaFinanceiraId;
  }

  const skip = (input.page - 1) * PAGE_SIZE;
  const [matched, raw] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter, { sort: { dataInsercao: -1 }, skip, limit: PAGE_SIZE })
      .toArray(),
  ]);

  return {
    data: {
      byId: null,
      default: {
        reconciliations: raw.map(mapReconciliationToResponse),
        reconciliationsMatched: matched,
        totalPages: Math.ceil(matched / PAGE_SIZE),
      },
    },
  };
}

export type TGetReconciliationsOutput = Awaited<ReturnType<typeof getReconciliations>>;
export type TGetReconciliationsOutputDefault = Exclude<
  TGetReconciliationsOutput["data"]["default"],
  null
>;
export type TGetReconciliationsOutputById = Exclude<
  TGetReconciliationsOutput["data"]["byId"],
  null
>;

const getReconciliationsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetReconciliationsInputSchema.parse(req.query);
  const result = await getReconciliations({ input, session });
  return res.status(200).json(result);
};

/* -------------------------------------------------------------------------- */
/* POST — save a reconciliation session and stamp matched transactions        */
/* -------------------------------------------------------------------------- */

const CreateReconciliationInputSchema = z.object({
  contaFinanceira: z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(["CAIXA", "CARTEIRA_DIGITAL", "BANCO"]),
  }),
  periodo: z.object({
    inicio: z.string().datetime(),
    fim: z.string().datetime(),
  }),
  pdf: z.object({
    url: z.string().url(),
    nomeOriginal: z.string(),
  }),
  status: FinancialReconciliationStatusEnumSchema.default("CONCLUIDA"),
  linhasExtraidas: z.array(FinancialReconciliationExtractedLineSchema),
  matches: z.array(FinancialReconciliationMatchSchema),
});
export type TCreateReconciliationInput = z.infer<typeof CreateReconciliationInputSchema>;

async function createReconciliation({
  input,
  session,
}: {
  input: TCreateReconciliationInput;
  session: TAuthSession;
}) {
  const db: Db = await connectToDatabase();
  const reconciliationsCol: Collection<TFinancialReconciliation> = db.collection(
    "conciliacoes-financeiras",
  );
  const transactionsCol: Collection<TFinancialTransaction> = db.collection(
    "transacoes-financeiras",
  );

  const nowIso = dayjs().toISOString();

  const reconciliationDoc: TFinancialReconciliation = {
    contaFinanceira: input.contaFinanceira,
    periodo: input.periodo,
    pdf: input.pdf,
    status: input.status,
    linhasExtraidas: input.linhasExtraidas,
    matches: input.matches,
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: nowIso,
  };

  const insertResult = await reconciliationsCol.insertOne(reconciliationDoc);
  if (!insertResult.acknowledged) {
    throw new Error("Oops, não foi possível salvar a conciliação.");
  }
  const reconciliacaoId = insertResult.insertedId.toString();

  // Stamp each matched DB transaction. We DO NOT touch transactions whose match
  // strategy is "CRIADA" (those are new transactions that should already have been
  // created with conciliado=true and conciliacaoId="<this id>" by the client flow,
  // OR — fallback — we stamp them here using transacaoCriadaId).
  const updates = input.matches
    .map((m) => {
      const transactionId = m.transacaoCriadaId ?? m.transacaoId;
      if (!transactionId) return null;
      if (!ObjectId.isValid(transactionId)) return null;
      const linha = input.linhasExtraidas.find((l) => l.id === m.linhaId);
      return transactionsCol.updateOne(
        { _id: new ObjectId(transactionId) },
        {
          $set: {
            conciliado: true,
            conciliacaoId: reconciliacaoId,
            dataReconciliacao: nowIso,
            referenciaExterno: linha?.documento ?? null,
          },
        },
      );
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  await Promise.all(updates);

  return {
    data: {
      createdId: reconciliacaoId,
      stampedTransactions: updates.length,
    },
    message: `Conciliação concluída. ${updates.length} transações marcadas como conciliadas.`,
  };
}

export type TCreateReconciliationOutput = Awaited<ReturnType<typeof createReconciliation>>;

const createReconciliationRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = CreateReconciliationInputSchema.parse(req.body);
  const result = await createReconciliation({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  GET: getReconciliationsRoute,
  POST: createReconciliationRoute,
});
