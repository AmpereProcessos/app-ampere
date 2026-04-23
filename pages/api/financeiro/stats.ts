import { TAuthSession } from "@/lib/authentication/types";
import { getDayStringsBetweenDates, isDateOverdue } from "@/utils/methods/dates";
import { formatAsNumber } from "@/utils/methods/formatting";
import { TAccountingEntry, TAccountsChart, TFinancialTransaction } from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Collection, type Db, type WithId } from "mongodb";
import { type NextApiHandler } from "next";
import z from "zod";

type TGeneralFinancesStatsReduced = {
  totalPendingTransactions: { inflow: number; outflow: number };
  totalPendingTransactionsForToday: { inflow: number; outflow: number };
  totalPendingTransactionsOverdue: { inflow: number; outflow: number };
  daily: { [key: string]: { expected: number; effective: number } };
};

type TAccountResult = {
  accountId: string;
  accountName: string;
  totalCredited: number;
  totalDebited: number;
  netBalance: number;
};

type TAccountsChartDoc = WithId<TAccountsChart>;

const GetFinancesOverallStatsInputSchema = z.object({
  periodAfter: z
    .string({
      required_error: "Período não informado.",
      invalid_type_error: "Tipo inválido para período.",
    })
    .datetime({ message: "Tipo inválido para período." }),
  periodBefore: z
    .string({
      required_error: "Período não informado.",
      invalid_type_error: "Tipo inválido para período.",
    })
    .datetime({ message: "Tipo inválido para período." }),
});
export type TGetFinancesOverallStatsInput = z.infer<typeof GetFinancesOverallStatsInputSchema>;

function getAccountChartIdsByNatureza(
  accounts: TAccountsChartDoc[],
  natureza: TAccountsChart["natureza"],
) {
  return accounts.filter((a) => a.natureza === natureza).map((a) => a._id.toString());
}

async function getFinancesOverallStats({
  input,
  session: _session,
}: {
  input: TGetFinancesOverallStatsInput;
  session: TAuthSession;
}) {
  const { periodAfter, periodBefore } = input;
  const initialDate = dayjs(periodAfter).toISOString();
  const endDate = dayjs(periodBefore).toISOString();
  const datesStrs = getDayStringsBetweenDates({ initialDate, endDate });

  const db: Db = await connectToDatabase();
  const accountChartsCollection: Collection<TAccountsChartDoc> = db.collection("planos-contas");
  const accountingEntriesCollection: Collection<TAccountingEntry> =
    db.collection("lancamentos-contabeis");
  const financialTransactionsCollection: Collection<TFinancialTransaction> =
    db.collection("transacoes-financeiras");

  const [creditedByAccount, debitedByAccount, accounts] = await Promise.all([
    accountingEntriesCollection
      .aggregate<{ _id: string; totalCredited: number }>([
        {
          $match: {
            "contaCredito.id": { $exists: true, $ne: "" },
            dataCompetencia: { $gte: initialDate, $lte: endDate },
          },
        },
        { $group: { _id: "$contaCredito.id", totalCredited: { $sum: "$valor" } } },
      ])
      .toArray(),
    accountingEntriesCollection
      .aggregate<{ _id: string; totalDebited: number }>([
        {
          $match: {
            "contaDebito.id": { $exists: true, $ne: "" },
            dataCompetencia: { $gte: initialDate, $lte: endDate },
          },
        },
        { $group: { _id: "$contaDebito.id", totalDebited: { $sum: "$valor" } } },
      ])
      .toArray(),
    accountChartsCollection.find().toArray(),
  ]);

  const accountMap = new Map(accounts.map((account) => [account._id.toString(), account.nome]));
  const revenueAccountIds = getAccountChartIdsByNatureza(accounts, "RECEITA");
  const expenseAccountIds = getAccountChartIdsByNatureza(accounts, "DESPESA");
  const costAccountIds = getAccountChartIdsByNatureza(accounts, "CUSTO");

  const resultMap = new Map<string, TAccountResult>();

  for (const item of creditedByAccount) {
    const id = item._id;
    const accountName = accountMap.get(id) || "Conta desconhecida";
    resultMap.set(id, {
      accountId: id,
      accountName,
      totalCredited: formatAsNumber(item.totalCredited),
      totalDebited: 0,
      netBalance: formatAsNumber(item.totalCredited),
    });
  }

  for (const item of debitedByAccount) {
    const id = item._id;
    const accountName = accountMap.get(id) || "Conta desconhecida";
    if (resultMap.has(id)) {
      const account = resultMap.get(id);
      if (!account) continue;
      const debited = formatAsNumber(item.totalDebited);
      const credited = formatAsNumber(account.totalCredited);
      account.totalDebited = debited;
      account.netBalance = credited - debited;
    } else {
      const debited = formatAsNumber(item.totalDebited);
      resultMap.set(id, {
        accountId: id,
        accountName,
        totalCredited: 0,
        totalDebited: debited,
        netBalance: -debited,
      });
    }
  }

  const resultByAccounts = Array.from(resultMap.values());

  const totalRevenueResult =
    revenueAccountIds.length > 0
      ? await accountingEntriesCollection
          .aggregate<{ total: number }>([
            {
              $match: {
                "contaCredito.id": { $in: revenueAccountIds },
                dataCompetencia: { $gte: initialDate, $lte: endDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$valor" } } },
          ])
          .toArray()
      : [{ total: 0 }];

  const totalRevenueResultValue = formatAsNumber(totalRevenueResult[0]?.total ?? 0);

  const totalExpenseResult =
    expenseAccountIds.length > 0
      ? await accountingEntriesCollection
          .aggregate<{ total: number }>([
            {
              $match: {
                "contaDebito.id": { $in: expenseAccountIds },
                dataCompetencia: { $gte: initialDate, $lte: endDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$valor" } } },
          ])
          .toArray()
      : [{ total: 0 }];

  const totalExpenseResultValue = formatAsNumber(totalExpenseResult[0]?.total ?? 0);

  const totalCostResult =
    costAccountIds.length > 0
      ? await accountingEntriesCollection
          .aggregate<{ total: number }>([
            {
              $match: {
                "contaDebito.id": { $in: costAccountIds },
                dataCompetencia: { $gte: initialDate, $lte: endDate },
              },
            },
            { $group: { _id: null, total: { $sum: "$valor" } } },
          ])
          .toArray()
      : [{ total: 0 }];

  const totalCostResultValue = formatAsNumber(totalCostResult[0]?.total ?? 0);

  const totalInFlowResult = await financialTransactionsCollection
    .aggregate<{ total: number }>([
      {
        $match: {
          tipo: "ENTRADA" as TFinancialTransaction["tipo"],
          dataEfetivacao: { $gte: initialDate, $lte: endDate, $ne: null },
        },
      },
      { $group: { _id: null, total: { $sum: "$valor" } } },
    ])
    .toArray();
  const totalInFlow = totalInFlowResult[0]?.total ?? 0;

  const totalOutFlowResult = await financialTransactionsCollection
    .aggregate<{ total: number }>([
      {
        $match: {
          tipo: "SAÍDA" as TFinancialTransaction["tipo"],
          dataEfetivacao: { $gte: initialDate, $lte: endDate, $ne: null },
        },
      },
      { $group: { _id: null, total: { $sum: "$valor" } } },
    ])
    .toArray();
  const totalOutFlow = totalOutFlowResult[0]?.total ?? 0;

  const transactions = await financialTransactionsCollection
    .find({
      $or: [
        { $or: [{ dataEfetivacao: null }, { dataEfetivacao: { $exists: false } }] },
        { dataEfetivacao: { $gte: initialDate, $lte: endDate } },
      ],
    })
    .project<{
      tipo: TFinancialTransaction["tipo"];
      valor: number;
      dataPrevisao: string;
      dataEfetivacao: string | null;
    }>({
      tipo: 1,
      valor: 1,
      dataPrevisao: 1,
      dataEfetivacao: 1,
    })
    .toArray();

  const initialReducedAcc: TGeneralFinancesStatsReduced = {
    totalPendingTransactions: { inflow: 0, outflow: 0 },
    totalPendingTransactionsForToday: { inflow: 0, outflow: 0 },
    totalPendingTransactionsOverdue: { inflow: 0, outflow: 0 },
    daily: datesStrs.reduce((acc: TGeneralFinancesStatsReduced["daily"], current) => {
      acc[current] = { expected: 0, effective: 0 };
      return acc;
    }, {}),
  };

  const now = dayjs();
  const reduced = transactions.reduce((acc: TGeneralFinancesStatsReduced, current) => {
    const transactionType = current.tipo;
    const transactionValue = current.valor;
    const transactionExpectedDate = current.dataPrevisao;
    const transactionExpectedDay = dayjs(transactionExpectedDate).format("DD/MM");
    const transactionEffectiveDate = current.dataEfetivacao;
    const transactionEffectiveDay = transactionEffectiveDate
      ? dayjs(transactionEffectiveDate).format("DD/MM")
      : "";

    if (transactionEffectiveDate) {
      if (acc.daily[transactionEffectiveDay])
        acc.daily[transactionEffectiveDay].effective +=
          transactionType === "ENTRADA" ? +transactionValue : -transactionValue;
    } else {
      const transactionIsForToday =
        transactionExpectedDate && dayjs(transactionExpectedDate).isSame(new Date(), "day");
      const transactionIsOverdue = Boolean(
        transactionExpectedDate &&
        isDateOverdue({ date: transactionExpectedDate, inRelationTo: now, useEndOfDay: true }),
      );

      if (transactionType === "ENTRADA") {
        acc.totalPendingTransactions.inflow += transactionValue;
        if (acc.daily[transactionExpectedDay])
          acc.daily[transactionExpectedDay].expected += +transactionValue;
        if (transactionIsForToday) acc.totalPendingTransactionsForToday.inflow += transactionValue;
        if (transactionIsOverdue) acc.totalPendingTransactionsOverdue.inflow += transactionValue;
      } else {
        acc.totalPendingTransactions.outflow += transactionValue;
        if (acc.daily[transactionExpectedDay])
          acc.daily[transactionExpectedDay].expected += -transactionValue;
        if (transactionIsForToday) acc.totalPendingTransactionsForToday.outflow += transactionValue;
        if (transactionIsOverdue) acc.totalPendingTransactionsOverdue.outflow += transactionValue;
      }
    }
    return acc;
  }, initialReducedAcc);

  return {
    resultByAccounts,
    totalRevenue: totalRevenueResultValue,
    totalExpense: totalExpenseResultValue,
    totalCost: totalCostResultValue,
    totalInFlow,
    totalOutFlow,
    totalPendingTransactions: reduced.totalPendingTransactions,
    totalPendingTransactionsForToday: reduced.totalPendingTransactionsForToday,
    totalPendingTransactionsOverdue: reduced.totalPendingTransactionsOverdue,
    daily: Object.entries(reduced.daily).map(([key, value]) => ({ day: key, ...value })),
  };
}

export type TGetFinancesOverallStatsOutput = Awaited<ReturnType<typeof getFinancesOverallStats>>;

const getFinancesOverallStatsRoute: NextApiHandler<TGetFinancesOverallStatsOutput> = async (
  req,
  res,
) => {
  const session = await validateAuthenticationWithSession(req, res);

  const input = GetFinancesOverallStatsInputSchema.parse(req.query);
  const data = await getFinancesOverallStats({ input, session });
  return res.status(200).json(data);
};

export default apiHandler({ GET: getFinancesOverallStatsRoute });
