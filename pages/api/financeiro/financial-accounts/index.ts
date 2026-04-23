import { TAuthSession } from "@/lib/authentication/types";
import { TFinancialAccounts, TFinancialTransaction } from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { type Filter, type WithId, type Collection, type Db } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const GetFinancialAccountsInputSchema = z.object({
  activeOnly: z.string().transform((v) => v === "true"),
  stats: z.string().transform((v) => v === "true"),
  statsPeriodBefore: z
    .union([
      z.string().datetime({ message: "Tipo inválido para data (antes) das estatísticas." }),
      z.null(),
    ])
    .default(null),
  statsPeriodAfter: z
    .union([
      z.string().datetime({ message: "Tipo inválido para data (após) das estatísticas." }),
      z.null(),
    ])
    .default(null),
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
  const { activeOnly, stats, statsPeriodBefore, statsPeriodAfter } = input;
  const filter: Filter<TFinancialAccountsDoc> = {};
  if (activeOnly) {
    filter.ativo = true;
  }

  const db: Db = await connectToDatabase();
  const accountsCol: Collection<TFinancialAccountsDoc> = db.collection("contas-financeiras");

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
      default: {
        accounts: accountsWithStats,
      },
    },
  };
}

export type TGetFinancialAccountsOutput = Awaited<ReturnType<typeof getFinancialAccounts>>;
export type TGetFinancialAccountsOutputDefault = TGetFinancialAccountsOutput["data"]["default"];

const getFinancialAccountsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetFinancialAccountsInputSchema.parse(req.query);

  const result = await getFinancialAccounts({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({ GET: getFinancialAccountsRoute });
