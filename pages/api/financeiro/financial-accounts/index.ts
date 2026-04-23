import { TAuthSession } from "@/lib/authentication/types";
import {
  FinancialAccountsSchema,
  TFinancialAccounts,
  TFinancialTransaction,
} from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { type Filter, type WithId, type Collection, type Db, ObjectId } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";
import createHttpError from "http-errors";

const GetFinancialAccountsInputSchema = z.object({
  id: z
    .string({
      required_error: "ID não informado.",
      invalid_type_error: "Tipo inválido para o ID.",
    })
    .optional()
    .nullable(),
  activeOnly: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v === "true"),
  stats: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v === "true"),
  statsPeriodBefore: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v == null || v.trim() === "" ? null : v))
    .pipe(
      z.union([
        z.string().datetime({ message: "Tipo inválido para data (antes) das estatísticas." }),
        z.null(),
      ]),
    ),
  statsPeriodAfter: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v == null || v.trim() === "" ? null : v))
    .pipe(
      z.union([
        z.string().datetime({ message: "Tipo inválido para data (após) das estatísticas." }),
        z.null(),
      ]),
    ),
});
export type TGetFinancialAccountsInput = z.infer<typeof GetFinancialAccountsInputSchema>;

type TFinancialAccountsDoc = WithId<TFinancialAccounts>;

type AccountStats = {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
};

type TransactionStatFields = {
  contaFinanceira: Pick<TFinancialTransaction["contaFinanceira"], "id">;
  tipo: TFinancialTransaction["tipo"];
  valor: number;
  dataEfetivacao: string;
};

function mapAccountToResponse(doc: TFinancialAccountsDoc) {
  return {
    id: doc._id.toString(),
    ativo: doc.ativo,
    nome: doc.nome,
    descricao: doc.descricao,
    tipo: doc.tipo,
    contaContabil: { id: doc.contaContabil.id, nome: doc.contaContabil.nome },
    saldoInicial: doc.saldoInicial,
    metadados: doc.metadados ?? null,
    dataInsercao: doc.dataInsercao,
  };
}

async function getFinancialAccounts({
  input,
  session: _session,
}: {
  input: TGetFinancialAccountsInput;
  session: TAuthSession;
}) {
  const db: Db = await connectToDatabase();
  const accountsCol: Collection<TFinancialAccountsDoc> = db.collection("contas-financeiras");

  const { id, activeOnly, stats, statsPeriodBefore, statsPeriodAfter } = input;

  if (id) {
    if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
    const accountDoc = await accountsCol.findOne({ _id: new ObjectId(id) });
    if (!accountDoc) throw new createHttpError.NotFound("Conta financeira não encontrada.");
    return {
      data: {
        byId: mapAccountToResponse(accountDoc),
        default: null,
      },
    };
  }

  const filter: Filter<TFinancialAccountsDoc> = {};
  if (activeOnly) {
    filter.ativo = true;
  }

  const accountDocs = await accountsCol.find(filter, { sort: { nome: 1 } }).toArray();
  const accounts = accountDocs.map(mapAccountToResponse);

  let statsMap: Record<string, AccountStats> = {};

  if (stats && accountDocs.length > 0) {
    const accountIds = accountDocs.map((a) => a._id.toString());
    const transCol: Collection<TFinancialTransaction> = db.collection("transacoes-financeiras");

    const allTransactions = (await transCol
      .find({
        dataEfetivacao: { $exists: true, $ne: null } as const,
        "contaFinanceira.id": { $in: accountIds },
      } as Filter<Record<string, unknown>>)
      .project<TransactionStatFields>({
        contaFinanceira: 1,
        tipo: 1,
        valor: 1,
        dataEfetivacao: 1,
      })
      .toArray()) as TransactionStatFields[];

    console.log(allTransactions);
    for (const account of accountDocs) {
      const accountId = account._id.toString();
      const accountTxs = allTransactions.filter((t) => t.contaFinanceira.id === accountId);
      const dataSaldoInicial = new Date(account.saldoInicial.data);

      const balanceTxs = accountTxs.filter(
        (t) => t.dataEfetivacao && new Date(t.dataEfetivacao) >= dataSaldoInicial,
      );
      const saldoInicialValor = account.saldoInicial.valor;
      const saldoAtual =
        saldoInicialValor +
        balanceTxs.reduce((sum, t) => sum + (t.tipo === "ENTRADA" ? t.valor : -t.valor), 0);

      const periodTxs = accountTxs.filter((t) => {
        if (!t.dataEfetivacao) return false;
        const date = new Date(t.dataEfetivacao);
        const afterOk = !statsPeriodAfter || date >= new Date(statsPeriodAfter);
        const beforeOk = !statsPeriodBefore || date <= new Date(statsPeriodBefore);
        return afterOk && beforeOk;
      });

      const totalEntradas = periodTxs
        .filter((t) => t.tipo === "ENTRADA")
        .reduce((sum, t) => sum + t.valor, 0);
      const totalSaidas = periodTxs
        .filter((t) => t.tipo === "SAÍDA")
        .reduce((sum, t) => sum + t.valor, 0);

      statsMap[accountId] = { saldoAtual, totalEntradas, totalSaidas };
    }
  }

  const accountsWithStats = accounts.map((acc) => ({
    ...acc,
    estatisticas: stats ? (statsMap[acc.id] ?? null) : null,
  }));

  return {
    data: {
      byId: null,
      default: {
        accounts: accountsWithStats,
      },
    },
  };
}

export type TGetFinancialAccountsOutput = Awaited<ReturnType<typeof getFinancialAccounts>>;
export type TGetFinancialAccountsOutputDefault = Exclude<
  TGetFinancialAccountsOutput["data"]["default"],
  null
>;
export type TGetFinancialAccountsOutputById = Exclude<
  TGetFinancialAccountsOutput["data"]["byId"],
  null
>;

const getFinancialAccountsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetFinancialAccountsInputSchema.parse(req.query);

  const result = await getFinancialAccounts({ input, session });
  return res.status(200).json(result);
};

const UpdateFinancialAccountInputSchema = z.object({
  accountId: z.string({
    required_error: "ID da conta financeira não informado.",
    invalid_type_error: "Tipo inválido para o ID da conta financeira.",
  }),
  account: FinancialAccountsSchema,
});

export type TUpdateFinancialAccountInput = z.infer<typeof UpdateFinancialAccountInputSchema>;
async function updateFinancialAccount({
  input,
  session,
}: {
  input: TUpdateFinancialAccountInput;
  session: TAuthSession;
}) {
  const { accountId, account } = input;

  const db: Db = await connectToDatabase();
  const accountsCol: Collection<TFinancialAccounts> = db.collection("contas-financeiras");

  const accountDoc = await accountsCol.findOne({ _id: new ObjectId(accountId) });
  if (!accountDoc) {
    throw new Error("Conta financeira não encontrada.");
  }

  const updateResponse = await accountsCol.updateOne(
    { _id: new ObjectId(accountId) },
    { $set: { ...account } },
  );
  if (!updateResponse.acknowledged) {
    throw new Error("Oops, houve um erro desconhecido ao atualizar conta financeira.");
  }

  return {
    data: {
      updatedId: accountId,
    },
    message: "Conta financeira atualizada com sucesso!",
  };
}
export type TUpdateFinancialAccountOutput = Awaited<ReturnType<typeof updateFinancialAccount>>;

const updateFinancialAccountRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = UpdateFinancialAccountInputSchema.parse(req.body);

  const result = await updateFinancialAccount({ input, session });
  return res.status(200).json(result);
};

const CreateFinancialAccountInputSchema = z.object({
  account: FinancialAccountsSchema,
});

export type TCreateFinancialAccountInput = z.infer<typeof CreateFinancialAccountInputSchema>;
async function createFinancialAccount({
  input,
  session,
}: {
  input: TCreateFinancialAccountInput;
  session: TAuthSession;
}) {
  const { account } = input;

  const db: Db = await connectToDatabase();
  const accountsCol: Collection<TFinancialAccounts> = db.collection("contas-financeiras");

  const accountDoc = await accountsCol.insertOne(account);
  if (!accountDoc.acknowledged) {
    throw new Error("Oops, houve um erro desconhecido ao criar conta financeira.");
  }

  return {
    data: {
      createdId: accountDoc.insertedId.toString(),
    },
    message: "Conta financeira criada com sucesso!",
  };
}
export type TCreateFinancialAccountOutput = Awaited<ReturnType<typeof createFinancialAccount>>;

const createFinancialAccountRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = CreateFinancialAccountInputSchema.parse(req.body);

  const result = await createFinancialAccount({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  GET: getFinancialAccountsRoute,
  PUT: updateFinancialAccountRoute,
  POST: createFinancialAccountRoute,
});
