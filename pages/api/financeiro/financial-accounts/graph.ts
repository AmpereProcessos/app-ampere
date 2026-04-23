import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, getFirstQueryString, validateAuthenticationWithSession } from "@/utils/api";
import {
  getBestNumberOfPointsBetweenDates,
  getDateBuckets,
  getEvenlySpacedDates,
} from "@/utils/methods/dates";
import { TFinancialTransaction } from "@/utils/schemas/finances";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Collection, type Db } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const GetFinancialAccountGraphInputSchema = z.object({
  contaFinanceiraId: z
    .string({
      required_error: "ID da conta financeira não informado.",
      invalid_type_error: "Tipo inválido para ID da conta financeira.",
    })
    .min(1, "ID da conta financeira não informado."),
  startDate: z.string().datetime({ message: "Formato de data inválido." }).optional().nullable(),
  endDate: z.string().datetime({ message: "Formato de data inválido." }).optional().nullable(),
  comparingStartDate: z
    .string()
    .datetime({ message: "Formato de data inválido." })
    .optional()
    .nullable(),
  comparingEndDate: z
    .string()
    .datetime({ message: "Formato de data inválido." })
    .optional()
    .nullable(),
});
export type TGetFinancialAccountGraphInput = z.infer<typeof GetFinancialAccountGraphInputSchema>;

type DayAggregateRow = { _id: string; entries: number; exits: number };

async function getGraphDataForPeriod({
  period,
  bucketCount,
  groupingFormat,
  contaFinanceiraId,
}: {
  period: { after: Date; before: Date };
  bucketCount: number;
  groupingFormat: string;
  contaFinanceiraId: string;
}): Promise<Array<{ label: string; entries: number; exits: number }>> {
  const periodDates = getEvenlySpacedDates({
    startDate: period.after,
    endDate: period.before,
    points: bucketCount,
  });
  const periodDateBuckets = getDateBuckets(periodDates);

  const startIso = dayjs(period.after).toISOString();
  const endIso = dayjs(period.before).toISOString();

  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransaction> = db.collection("transacoes-financeiras");

  const transactionData = (await collection
    .aggregate<DayAggregateRow>([
      {
        $match: {
          "contaFinanceira.id": contaFinanceiraId,
          dataEfetivacao: { $ne: null, $exists: true, $gte: startIso, $lte: endIso },
        },
      },
      { $addFields: { dayDate: { $toDate: "$dataEfetivacao" } } },
      {
        $group: {
          _id: { $dateToString: { date: "$dayDate", format: "%Y-%m-%d" } },
          entries: { $sum: { $cond: [{ $eq: ["$tipo", "ENTRADA"] }, "$valor", 0] } },
          exits: { $sum: { $cond: [{ $eq: ["$tipo", "SAÍDA"] }, "$valor", 0] } },
        },
      },
    ])
    .toArray()) as DayAggregateRow[];

  const initialData = Object.fromEntries(
    periodDates.map((date) => [dayjs(date).format(groupingFormat), { entries: 0, exits: 0 }]),
  ) as Record<string, { entries: number; exits: number }>;

  const dataReduced = transactionData.reduce(
    (acc, current) => {
      const itemDate = new Date(current._id);
      const itemTime = itemDate.getTime();

      const bucket = periodDateBuckets.find((b) => itemTime >= b.start && itemTime <= b.end);
      if (!bucket) return acc;

      const key = dayjs(bucket.key).format(groupingFormat);
      if (!acc[key]) acc[key] = { entries: 0, exits: 0 };

      acc[key].entries += Number(current.entries);
      acc[key].exits += Number(current.exits);
      return acc;
    },
    { ...initialData },
  );

  return Object.entries(dataReduced).map(([key, value]) => ({
    label: key,
    entries: value.entries,
    exits: value.exits,
  }));
}

async function getFinancialAccountGraph({
  input,
  session: _session,
}: {
  input: TGetFinancialAccountGraphInput;
  session: TAuthSession;
}) {
  const period = {
    after: input.startDate
      ? dayjs(input.startDate).startOf("day").toDate()
      : dayjs().subtract(30, "days").startOf("day").toDate(),
    before: input.endDate
      ? dayjs(input.endDate).endOf("day").toDate()
      : dayjs().endOf("day").toDate(),
  };

  const { points: bucketCount, groupingFormat } = getBestNumberOfPointsBetweenDates({
    startDate: period.after,
    endDate: period.before,
  });

  const mainData = await getGraphDataForPeriod({
    period: { after: period.after, before: period.before },
    bucketCount,
    groupingFormat,
    contaFinanceiraId: input.contaFinanceiraId,
  });

  let comparisonData: Array<{ label: string; entries: number; exits: number }> | null = null;
  if (input.comparingStartDate && input.comparingEndDate) {
    comparisonData = await getGraphDataForPeriod({
      period: {
        after: dayjs(input.comparingStartDate).startOf("day").toDate(),
        before: dayjs(input.comparingEndDate).endOf("day").toDate(),
      },
      bucketCount,
      groupingFormat,
      contaFinanceiraId: input.contaFinanceiraId,
    });
  }

  const mergedData = mainData.map((item, index) => ({
    label: item.label,
    entries: item.entries,
    exits: item.exits,
    comparingEntries: comparisonData?.[index]?.entries,
    comparingExits: comparisonData?.[index]?.exits,
  }));

  return {
    data: mergedData,
    message: "Gráfico da conta financeira recuperado com sucesso.",
  };
}
export type TGetFinancialAccountGraphOutput = Awaited<ReturnType<typeof getFinancialAccountGraph>>;

const getFinancialAccountGraphRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetFinancialAccountGraphInputSchema.parse({
    contaFinanceiraId: getFirstQueryString(req.query.contaFinanceiraId) ?? "",
    startDate: getFirstQueryString(req.query.startDate) ?? null,
    endDate: getFirstQueryString(req.query.endDate) ?? null,
    comparingStartDate: getFirstQueryString(req.query.comparingStartDate) ?? null,
    comparingEndDate: getFirstQueryString(req.query.comparingEndDate) ?? null,
  });
  const result = await getFinancialAccountGraph({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({ GET: getFinancialAccountGraphRoute });
