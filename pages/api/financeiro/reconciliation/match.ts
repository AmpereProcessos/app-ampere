import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
  FinancialReconciliationExtractedLineSchema,
  TFinancialReconciliationExtractedLine,
  TFinancialReconciliationMatch,
  TFinancialTransaction,
} from "@/utils/schemas/finances";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dayjs from "dayjs";
import { type Collection, type Db, type Filter, type WithId } from "mongodb";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
  maxDuration: 90,
};

const MatchReconciliationInputSchema = z.object({
  contaFinanceiraId: z.string({
    required_error: "ID da conta financeira não informado.",
    invalid_type_error: "Tipo inválido para o ID da conta financeira.",
  }),
  periodo: z.object({
    inicio: z
      .string({
        required_error: "Data de início do período não informada.",
        invalid_type_error: "Tipo inválido para a data de início do período.",
      })
      .datetime({ message: "Tipo inválido para a data de início do período." }),
    fim: z
      .string({
        required_error: "Data de fim do período não informada.",
        invalid_type_error: "Tipo inválido para a data de fim do período.",
      })
      .datetime({ message: "Tipo inválido para a data de fim do período." }),
  }),
  linhasExtraidas: z.array(FinancialReconciliationExtractedLineSchema),
});
export type TMatchReconciliationInput = z.infer<typeof MatchReconciliationInputSchema>;

type TFinancialTransactionDoc = WithId<TFinancialTransaction>;
type TCandidateTransaction = {
  id: string;
  titulo: string;
  tipo: TFinancialTransaction["tipo"];
  valor: number;
  metodo: TFinancialTransaction["metodo"];
  dataPrevisao: string;
  dataEfetivacao: string | null;
};

type TMatchedResultRow = {
  linha: TFinancialReconciliationExtractedLine;
  match: TFinancialReconciliationMatch;
  candidatos?: TCandidateTransaction[];
};

const VALOR_EPSILON = 0.01;
const DETERMINISTIC_DATE_TOLERANCE_DAYS = 3;

function mapTxToCandidate(doc: TFinancialTransactionDoc): TCandidateTransaction {
  return {
    id: doc._id.toString(),
    titulo: doc.titulo,
    tipo: doc.tipo,
    valor: doc.valor,
    metodo: doc.metodo,
    dataPrevisao: doc.dataPrevisao,
    dataEfetivacao: doc.dataEfetivacao ?? null,
  };
}

function valuesAreEqual(a: number, b: number) {
  return Math.abs(a - b) <= VALOR_EPSILON;
}

function daysBetween(a: string, b: string) {
  return Math.abs(dayjs(a).diff(dayjs(b), "day"));
}

/**
 * Pure function — exposed (and exported) so it can be unit-tested with fixtures.
 * For each PDF line, find DB transactions where:
 *   - amount matches (within VALOR_EPSILON)
 *   - tipo matches (ENTRADA / SAÍDA)
 *   - the closest of dataEfetivacao / dataPrevisao is within DETERMINISTIC_DATE_TOLERANCE_DAYS
 *
 * Outcome buckets:
 *   - "exata"      — exactly one candidate, score 1.0, strategy EXATA
 *   - "ambigua"    — multiple candidates, no auto-pick, sent to AI pass for resolution
 *   - "naoEncontrada" — zero candidates, will be shown as unmatched in the UI
 */
export function runDeterministicMatch({
  linhas,
  candidatos,
  usadosIds = new Set<string>(),
}: {
  linhas: TFinancialReconciliationExtractedLine[];
  candidatos: TCandidateTransaction[];
  usadosIds?: Set<string>;
}): {
  exatas: TMatchedResultRow[];
  ambiguas: TMatchedResultRow[];
  naoEncontradas: TMatchedResultRow[];
  candidatosRestantes: TCandidateTransaction[];
} {
  const exatas: TMatchedResultRow[] = [];
  const ambiguas: TMatchedResultRow[] = [];
  const naoEncontradas: TMatchedResultRow[] = [];
  const used = new Set<string>(usadosIds);

  for (const linha of linhas) {
    const possiveis = candidatos.filter((c) => {
      if (used.has(c.id)) return false;
      if (c.tipo !== linha.tipo) return false;
      if (!valuesAreEqual(c.valor, linha.valor)) return false;
      const dataReferencia = c.dataEfetivacao ?? c.dataPrevisao;
      const distancia = daysBetween(dataReferencia, linha.data);
      return distancia <= DETERMINISTIC_DATE_TOLERANCE_DAYS;
    });

    if (possiveis.length === 1) {
      const escolhida = possiveis[0];
      used.add(escolhida.id);
      exatas.push({
        linha,
        match: {
          linhaId: linha.id,
          transacaoId: escolhida.id,
          score: 1,
          estrategia: "EXATA",
        },
        candidatos: possiveis,
      });
    } else if (possiveis.length > 1) {
      ambiguas.push({
        linha,
        match: {
          linhaId: linha.id,
          transacaoId: null,
          score: 0,
          estrategia: "APROXIMADA",
        },
        candidatos: possiveis,
      });
    } else {
      naoEncontradas.push({
        linha,
        match: {
          linhaId: linha.id,
          transacaoId: null,
          score: 0,
          estrategia: "MANUAL",
        },
      });
    }
  }

  const candidatosRestantes = candidatos.filter((c) => !used.has(c.id));

  return { exatas, ambiguas, naoEncontradas, candidatosRestantes };
}

const AiMatchSchema = z.object({
  matches: z.array(
    z.object({
      linhaId: z.string(),
      transacaoId: z.string().nullable(),
      score: z.number().min(0).max(1),
      justificativa: z.string().optional().nullable(),
    }),
  ),
});

const AI_SYSTEM_PROMPT = `Você é um assistente financeiro especializado em reconciliação bancária.
Você recebe duas listas em JSON:
  1. "linhas": linhas de um extrato bancário (id, data, descricao, valor, tipo, documento)
  2. "transacoes": transações registradas no sistema interno (id, titulo, valor, tipo, dataPrevisao, dataEfetivacao, metodo)

Sua tarefa: para cada linha, escolha a transação que melhor corresponde a ela, OU retorne transacaoId=null se nenhuma corresponder.

Regras:
- Mesmo tipo (ENTRADA/SAÍDA) é OBRIGATÓRIO.
- Diferença de valor maior que R$ 1,00 é improvável corresponder (a menos que a descrição seja idêntica).
- Diferença de data superior a 7 dias só é aceitável com descrição muito semelhante.
- Score: 0.0 (sem confiança) a 1.0 (correspondência certa). Use >0.7 para correspondências confiáveis.
- Cada transacaoId pode ser usada NO MÁXIMO uma vez (não duplique correspondências).
- Se incerto, prefira null com score 0.`;

async function runAiMatch({
  ambiguas,
  naoEncontradas,
  candidatosRestantes,
}: {
  ambiguas: TMatchedResultRow[];
  naoEncontradas: TMatchedResultRow[];
  candidatosRestantes: TCandidateTransaction[];
}): Promise<Map<string, { transacaoId: string | null; score: number }>> {
  const result = new Map<string, { transacaoId: string | null; score: number }>();
  const linhasParaIA = [...ambiguas, ...naoEncontradas];
  if (linhasParaIA.length === 0 || candidatosRestantes.length === 0) {
    return result;
  }

  // For ambiguous lines, restrict the candidate pool to that line's deterministic candidates;
  // for "not found", let the AI consider all remaining candidates.
  const linhasPayload = linhasParaIA.map((row) => ({
    id: row.linha.id,
    data: row.linha.data,
    descricao: row.linha.descricao,
    valor: row.linha.valor,
    tipo: row.linha.tipo,
    documento: row.linha.documento ?? null,
  }));
  const transacoesPayload = candidatosRestantes.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    valor: c.valor,
    tipo: c.tipo,
    metodo: c.metodo,
    dataPrevisao: c.dataPrevisao,
    dataEfetivacao: c.dataEfetivacao,
  }));

  console.log(
    "[INFO] [MATCH_RECONCILIATION] [AI_INPUT]",
    `linhas=${linhasPayload.length}, candidatos=${transacoesPayload.length}`,
  );

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: AiMatchSchema,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          linhas: linhasPayload,
          transacoes: transacoesPayload,
        }),
      },
    ],
  });

  for (const m of object.matches) {
    result.set(m.linhaId, { transacaoId: m.transacaoId, score: m.score });
  }
  return result;
}

async function matchReconciliation({
  input,
  session: _session,
}: {
  input: TMatchReconciliationInput;
  session: TAuthSession;
}) {
  const { contaFinanceiraId, periodo, linhasExtraidas } = input;

  const db: Db = await connectToDatabase();
  const collection: Collection<TFinancialTransactionDoc> =
    db.collection("transacoes-financeiras");

  // Pull the candidate transactions (the account+period universe).
  const filter: Filter<TFinancialTransactionDoc> = {
    "contaFinanceira.id": contaFinanceiraId,
    dataPrevisao: { $gte: periodo.inicio, $lte: periodo.fim },
    // Only consider not-yet-reconciled transactions to avoid double-attribution.
    $or: [
      { conciliado: { $exists: false } },
      { conciliado: false },
      { conciliado: null },
    ],
  };
  const txDocs = await collection.find(filter).toArray();
  const candidatos = txDocs.map(mapTxToCandidate);

  console.log(
    "[INFO] [MATCH_RECONCILIATION] [INPUT]",
    `linhas=${linhasExtraidas.length}, candidatos=${candidatos.length}`,
  );

  const { exatas, ambiguas, naoEncontradas, candidatosRestantes } = runDeterministicMatch({
    linhas: linhasExtraidas,
    candidatos,
  });

  let aiResults: Map<string, { transacaoId: string | null; score: number }> = new Map();
  try {
    aiResults = await runAiMatch({ ambiguas, naoEncontradas, candidatosRestantes });
  } catch (error) {
    // Don't fail the whole match if the AI call errors — the user can still match manually.
    console.error("[ERROR] [MATCH_RECONCILIATION] [AI]", error);
  }

  const usedByAi = new Set<string>();

  function applyAiResult(row: TMatchedResultRow): TMatchedResultRow {
    const aiResult = aiResults.get(row.linha.id);
    if (!aiResult || aiResult.transacaoId == null) return row;
    if (usedByAi.has(aiResult.transacaoId)) return row;
    usedByAi.add(aiResult.transacaoId);
    return {
      ...row,
      match: {
        linhaId: row.linha.id,
        transacaoId: aiResult.transacaoId,
        score: aiResult.score,
        estrategia: "IA",
      },
    };
  }

  const ambiguasComIa = ambiguas.map(applyAiResult);
  const naoEncontradasComIa = naoEncontradas.map(applyAiResult);

  // Re-bucket: AI may have resolved an ambiguous line into a confident match,
  // or may have found a hit for a previously "not found" line.
  const matchedFinal: TMatchedResultRow[] = [...exatas];
  const ambiguasFinal: TMatchedResultRow[] = [];
  const unmatchedFinal: TMatchedResultRow[] = [];

  for (const row of ambiguasComIa) {
    if (row.match.transacaoId && row.match.score >= 0.7) {
      matchedFinal.push(row);
    } else {
      ambiguasFinal.push(row);
    }
  }
  for (const row of naoEncontradasComIa) {
    if (row.match.transacaoId && row.match.score >= 0.7) {
      matchedFinal.push(row);
    } else {
      unmatchedFinal.push(row);
    }
  }

  // For the UI, attach a "candidatos preview" payload so the user can see what we
  // considered for ambiguous lines.
  const txById = new Map(txDocs.map((d) => [d._id.toString(), d]));

  function packageRow(row: TMatchedResultRow) {
    return {
      linha: row.linha,
      match: row.match,
      candidatos: (row.candidatos ?? []).map((c) => ({
        id: c.id,
        titulo: c.titulo,
        valor: c.valor,
        tipo: c.tipo,
        dataPrevisao: c.dataPrevisao,
        dataEfetivacao: c.dataEfetivacao,
      })),
      transacaoCorrespondente: row.match.transacaoId
        ? (() => {
            const doc = txById.get(row.match.transacaoId);
            if (!doc) return null;
            return {
              id: doc._id.toString(),
              titulo: doc.titulo,
              valor: doc.valor,
              tipo: doc.tipo,
              dataPrevisao: doc.dataPrevisao,
              dataEfetivacao: doc.dataEfetivacao ?? null,
            };
          })()
        : null,
    };
  }

  return {
    data: {
      matched: matchedFinal.map(packageRow),
      ambiguous: ambiguasFinal.map(packageRow),
      unmatched: unmatchedFinal.map(packageRow),
      candidateCount: candidatos.length,
    },
    message: `Matching concluído: ${matchedFinal.length} confirmadas, ${ambiguasFinal.length} ambíguas, ${unmatchedFinal.length} sem correspondência.`,
  };
}

export type TMatchReconciliationOutput = Awaited<ReturnType<typeof matchReconciliation>>;
export type TMatchReconciliationOutputData = TMatchReconciliationOutput["data"];
export type TMatchReconciliationRow = TMatchReconciliationOutputData["matched"][number];

const matchReconciliationRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = MatchReconciliationInputSchema.parse(req.body);
  const result = await matchReconciliation({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  POST: matchReconciliationRoute,
});
