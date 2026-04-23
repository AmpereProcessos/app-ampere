import { AccountsChartSchema, TAccountsChart } from "@/utils/schemas/finances";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import createHttpError from "http-errors";
import { ObjectId, WithId } from "mongodb";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { TAuthSession } from "@/lib/authentication/types";

const GetAccountsChartsInputSchema = z.object({
  id: z
    .string({
      required_error: "ID não informado.",
      invalid_type_error: "Tipo inválido para o ID.",
    })
    .optional()
    .nullable(),
});
export type TGetAccountsChartsInput = z.infer<typeof GetAccountsChartsInputSchema>;

function mapAccountChartToResponse(accountChart: WithId<TAccountsChart>) {
  return {
    ...accountChart,
    _id: accountChart._id.toString(),
  };
}

async function getAccountsCharts({
  input,
  session,
}: {
  input: TGetAccountsChartsInput;
  session: TAuthSession;
}) {
  const { id } = input;

  const db = await connectToDatabase();
  const accountsChartsCollection = db.collection<TAccountsChart>("planos-contas");

  if (id) {
    if (!ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");
    const accountChart = await accountsChartsCollection.findOne({ _id: new ObjectId(id) });

    if (!accountChart) throw new createHttpError.NotFound("Plano de contas não encontrado.");

    return {
      data: {
        default: null,
        byId: mapAccountChartToResponse(accountChart),
      },
    };
  }

  const accountCharts = await accountsChartsCollection.find().toArray();
  return {
    data: {
      byId: null,
      default: accountCharts.map(mapAccountChartToResponse),
    },
  };
}
export type TGetAccountsChartsOutput = Awaited<ReturnType<typeof getAccountsCharts>>;
export type TGetAccountsChartsOutputDefault = Exclude<
  TGetAccountsChartsOutput["data"]["default"],
  null
>;
export type TGetAccountsChartsOutputById = Exclude<TGetAccountsChartsOutput["data"]["byId"], null>;

const getAccountsChartsRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetAccountsChartsInputSchema.parse(req.query);
  const result = await getAccountsCharts({ input, session });
  return res.status(200).json(result);
};

const CreateAccountsChartInputSchema = z.object({
  chart: AccountsChartSchema,
});
export type TCreateAccountsChartInput = z.infer<typeof CreateAccountsChartInputSchema>;

async function createAccountsChart({
  input,
  session,
}: {
  input: TCreateAccountsChartInput;
  session: TAuthSession;
}) {
  const { chart } = input;

  const db = await connectToDatabase();
  const accountsChartsCollection = db.collection<TAccountsChart>("planos-contas");

  const newChart = await accountsChartsCollection.insertOne(chart);
  return {
    data: {
      insertedId: newChart.insertedId.toString(),
    },
    message: "Plano de contas criado com sucesso!",
  };
}
export type TCreateAccountsChartOutput = Awaited<ReturnType<typeof createAccountsChart>>;
const createAccountsChartRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = CreateAccountsChartInputSchema.parse(req.body);
  const result = await createAccountsChart({ input, session });
  return res.status(201).json(result);
};

const UpdateAccountsChartInputSchema = z.object({
  chartId: z.string({
    required_error: "ID não informado.",
    invalid_type_error: "Tipo inválido para o ID.",
  }),
  chart: AccountsChartSchema,
});
export type TUpdateAccountsChartInput = z.infer<typeof UpdateAccountsChartInputSchema>;

async function updateAccountsChart({
  input,
  session,
}: {
  input: TUpdateAccountsChartInput;
  session: TAuthSession;
}) {
  const { chartId, chart } = input;
  const db = await connectToDatabase();
  const accountsChartsCollection = db.collection<TAccountsChart>("planos-contas");

  const chartDoc = await accountsChartsCollection.findOne({ _id: new ObjectId(chartId) });
  if (!chartDoc) throw new createHttpError.NotFound("Plano de contas não encontrado.");

  const updatedChart = await accountsChartsCollection.updateOne(
    { _id: new ObjectId(chartId) },
    { $set: { ...chart } },
  );
  if (!updatedChart.acknowledged)
    throw new createHttpError.InternalServerError(
      "Oops, houve um erro desconhecido ao atualizar plano de contas.",
    );
  return {
    data: {
      updatedId: chartId,
    },
    message: "Plano de contas atualizado com sucesso!",
  };
}
export type TUpdateAccountsChartOutput = Awaited<ReturnType<typeof updateAccountsChart>>;

const updateAccountsChartRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = UpdateAccountsChartInputSchema.parse(req.body);
  const result = await updateAccountsChart({ input, session });
  return res.status(200).json(result);
};
export default apiHandler({
  GET: getAccountsChartsRoute,
  POST: createAccountsChartRoute,
});
