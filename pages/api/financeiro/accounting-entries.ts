import { TAuthSession } from "@/lib/authentication/types";
import { TAccountingEntry } from "@/utils/schemas/finances";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import connectToDatabase from "@/utils/services/mongodb/projects";
import dayjs from "dayjs";
import { type Filter, type WithId, type Collection, type Db } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

const PAGE_SIZE = 25;

const GetAccountingEntriesInputSchema = z.object({
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
  const { page, search, periodAfter, periodBefore } = input;
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
  const db: Db = await connectToDatabase();
  const collection: Collection<TAccountingEntryDoc> = db.collection("lancamentos-contabeis");

  const [entriesMatched, rawEntries] = await Promise.all([
    collection.countDocuments(filter),
    collection.find(filter, { sort: { dataInsercao: -1 }, skip, limit: PAGE_SIZE }).toArray(),
  ]);

  const totalPages = Math.ceil(entriesMatched / PAGE_SIZE);
  const entries = rawEntries.map(mapEntryToResponse);

  return {
    data: {
      default: {
        entries,
        entriesMatched,
        totalPages,
      },
    },
  };
}

export type TGetAccountingEntriesOutput = Awaited<ReturnType<typeof getAccountingEntries>>;
export type TGetAccountingEntriesOutputDefault = TGetAccountingEntriesOutput["data"]["default"];

const getAccountingEntriesRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = GetAccountingEntriesInputSchema.parse(req.query);

  const result = await getAccountingEntries({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({ GET: getAccountingEntriesRoute });
