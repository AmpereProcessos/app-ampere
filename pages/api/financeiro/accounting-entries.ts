import { TAuthSession } from "@/lib/authentication/types";
import { AccountingEntriesSchema, TAccountingEntry } from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Filter, type WithId, type Collection, type Db, ObjectId } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const PAGE_SIZE = 25;

const GetAccountingEntriesInputSchema = z.object({
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
});
export type TGetAccountingEntriesInput = z.infer<typeof GetAccountingEntriesInputSchema>;

type TAccountingEntryDoc = WithId<TAccountingEntry>;

function mapEntryToResponse(doc: TAccountingEntryDoc) {
  return {
    id: doc._id.toString(),
    titulo: doc.titulo,
    anotacoes: doc.anotacoes,
    contaDebito: { id: doc.contaDebito.id, nome: doc.contaDebito.nome },
    contaCredito: { id: doc.contaCredito.id, nome: doc.contaCredito.nome },
    valor: doc.valor,
    valorPrevisto: doc.valorPrevisto,
    dataCompetencia: doc.dataCompetencia,
    autor: { id: doc.autor.id, nome: doc.autor.nome, avatarUrl: doc.autor.avatar_url ?? null },
    dataInsercao: doc.dataInsercao,
  };
}

async function getAccountingEntries({
  input,
  session: _session,
}: {
  input: TGetAccountingEntriesInput;
  session: TAuthSession;
}) {
  const { id, page, search, periodAfter, periodBefore } = input;
  const db: Db = await connectToDatabase();
  const collection: Collection<TAccountingEntryDoc> = db.collection("lancamentos-contabeis");

  if (id) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido.");
    const entryDoc = await collection.findOne({ _id: new ObjectId(id) });
    if (!entryDoc) throw new Error("Lançamento contábil não encontrado.");
    return {
      data: {
        byId: mapEntryToResponse(entryDoc),
        default: null,
      },
    };
  }

  const filter: Filter<TAccountingEntryDoc> = {};

  if (search && search.trim().length > 0) {
    filter.titulo = { $regex: search, $options: "i" };
  }

  if (periodAfter != null || periodBefore != null) {
    const comp: { $gte?: string; $lte?: string } = {};
    if (periodAfter) comp.$gte = dayjs(periodAfter).toISOString();
    if (periodBefore) comp.$lte = dayjs(periodBefore).toISOString();
    filter.dataCompetencia = comp;
  }

  const skip = PAGE_SIZE * (page - 1);
  const [entriesMatched, rawEntries] = await Promise.all([
    collection.countDocuments(filter),
    collection.find(filter, { sort: { dataInsercao: -1 }, skip, limit: PAGE_SIZE }).toArray(),
  ]);

  const totalPages = Math.ceil(entriesMatched / PAGE_SIZE);
  const entries = rawEntries.map(mapEntryToResponse);

  return {
    data: {
      byId: null,
      default: {
        entries,
        entriesMatched,
        totalPages,
      },
    },
  };
}

export type TGetAccountingEntriesOutput = Awaited<ReturnType<typeof getAccountingEntries>>;
export type TGetAccountingEntriesOutputDefault = Exclude<
  TGetAccountingEntriesOutput["data"]["default"],
  null
>;
export type TGetAccountingEntriesOutputById = Exclude<
  TGetAccountingEntriesOutput["data"]["byId"],
  null
>;

const getAccountingEntriesRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetAccountingEntriesInputSchema.parse(req.query);

  const result = await getAccountingEntries({ input, session });
  return res.status(200).json(result);
};

const UpdateAccountingEntryInputSchema = z.object({
  entryId: z.string({
    required_error: "ID do lançamento contábil não informado.",
    invalid_type_error: "Tipo inválido para o ID do lançamento contábil.",
  }),
  entry: AccountingEntriesSchema,
});
export type TUpdateAccountingEntryInput = z.infer<typeof UpdateAccountingEntryInputSchema>;
async function updateAccountingEntry({
  input,
  session,
}: {
  input: TUpdateAccountingEntryInput;
  session: TAuthSession;
}) {
  const { entryId, entry } = input;

  const db: Db = await connectToDatabase();
  const collection: Collection<TAccountingEntry> = db.collection("lancamentos-contabeis");
  const entryDoc = await collection.findOne({ _id: new ObjectId(entryId) });
  if (!entryDoc) {
    throw new Error("Lançamento contábil não encontrado.");
  }
  const updateResponse = await collection.updateOne(
    { _id: new ObjectId(entryId) },
    { $set: { ...entry } },
  );
  if (!updateResponse.acknowledged) {
    throw new Error("Oops, houve um erro desconhecido ao atualizar lançamento contábil.");
  }

  return {
    data: {
      updatedId: entryId,
    },
    message: "Lançamento contábil atualizado com sucesso!",
  };
}
export type TUpdateAccountingEntryOutput = Awaited<ReturnType<typeof updateAccountingEntry>>;

const updateAccountingEntryRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = UpdateAccountingEntryInputSchema.parse(req.body);
  const result = await updateAccountingEntry({ input, session });
  return res.status(200).json(result);
};

const CreateAccountingEntryInputSchema = z.object({
  entry: AccountingEntriesSchema,
});
export type TCreateAccountingEntryInput = z.infer<typeof CreateAccountingEntryInputSchema>;
async function createAccountingEntry({
  input,
  session,
}: {
  input: TCreateAccountingEntryInput;
  session: TAuthSession;
}) {
  const { entry } = input;
  const db: Db = await connectToDatabase();
  const collection: Collection<TAccountingEntry> = db.collection("lancamentos-contabeis");
  const entryDoc = await collection.insertOne(entry);
  if (!entryDoc.acknowledged) {
    throw new Error("Oops, houve um erro desconhecido ao criar lançamento contábil.");
  }

  return {
    data: {
      createdId: entryDoc.insertedId.toString(),
    },
    message: "Lançamento contábil criado com sucesso!",
  };
}
export type TCreateAccountingEntryOutput = Awaited<ReturnType<typeof createAccountingEntry>>;

const createAccountingEntryRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = CreateAccountingEntryInputSchema.parse(req.body);
  const result = await createAccountingEntry({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  GET: getAccountingEntriesRoute,
  PUT: updateAccountingEntryRoute,
  POST: createAccountingEntryRoute,
});
