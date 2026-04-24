import { TAuthSession } from "@/lib/authentication/types";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";
import {
  FinancialReconciliationExtractedLineSchema,
  TFinancialReconciliationExtractedLine,
} from "@/utils/schemas/finances";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import createHttpError from "http-errors";
import { randomUUID } from "node:crypto";
import { type NextApiHandler, type NextApiRequest, type NextApiResponse } from "next";
import z from "zod";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
  // PDF parsing + LLM call can take a while.
  maxDuration: 120,
};

const ExtractReconciliationInputSchema = z.object({
  pdfUrl: z
    .string({
      required_error: "URL do PDF não informada.",
      invalid_type_error: "Tipo inválido para a URL do PDF.",
    })
    .url({ message: "URL do PDF inválida." }),
});
export type TExtractReconciliationInput = z.infer<typeof ExtractReconciliationInputSchema>;

/**
 * AI SDK structured-output schema. The model returns the extracted lines without an `id`;
 * we generate a UUID server-side so the client always has a stable reference.
 */
const ModelExtractedLineSchema = FinancialReconciliationExtractedLineSchema.omit({ id: true });

const SYSTEM_PROMPT = `Você é um assistente especializado em ler extratos bancários (PDFs) em português brasileiro.
Extraia TODAS as transações listadas no extrato, com a maior precisão possível.

Regras:
- Use o tipo "ENTRADA" para créditos (recebimentos) e "SAÍDA" para débitos (pagamentos/saques).
- O campo "valor" deve ser sempre um número positivo (não use sinal negativo). O sinal é dado pelo campo "tipo".
- O campo "data" deve estar em ISO 8601 com timezone UTC (formato: YYYY-MM-DDTHH:mm:ss.sssZ). Use 12:00:00 UTC se o horário não estiver disponível.
- O campo "descricao" deve conter uma descrição limpa, removendo códigos internos do banco quando possível.
- O campo "documento" é opcional — preencha com o número do documento, cheque, NSU ou referência se houver.
- Se a mesma transação aparecer duas vezes (ex: "valor previsto" + "valor lançado"), liste-a apenas UMA vez.
- Ignore linhas de saldo (saldo anterior, saldo do dia, saldo total).`;

async function fetchPdfBytes(pdfUrl: string): Promise<Uint8Array> {
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new createHttpError.BadGateway(
      `Falha ao baixar o PDF (${response.status} ${response.statusText}).`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function extractReconciliation({
  input,
  session: _session,
}: {
  input: TExtractReconciliationInput;
  session: TAuthSession;
}) {
  const { pdfUrl } = input;

  console.log("[INFO] [EXTRACT_RECONCILIATION] [URL]", pdfUrl);
  const pdfBytes = await fetchPdfBytes(pdfUrl);

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      linhas: z.array(ModelExtractedLineSchema),
    }),
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extraia todas as transações deste extrato bancário no formato solicitado.",
          },
          {
            type: "file",
            data: pdfBytes,
            mediaType: "application/pdf",
          },
        ],
      },
    ],
  });

  const linhasExtraidas: TFinancialReconciliationExtractedLine[] = object.linhas.map(
    (linha) => ({
      ...linha,
      id: randomUUID(),
    }),
  );

  console.log(
    "[INFO] [EXTRACT_RECONCILIATION] [LINES]",
    linhasExtraidas.length,
    "linhas extraídas.",
  );

  return {
    data: {
      linhasExtraidas,
    },
    message: `Foram extraídas ${linhasExtraidas.length} transações do extrato.`,
  };
}

export type TExtractReconciliationOutput = Awaited<ReturnType<typeof extractReconciliation>>;

const extractReconciliationRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await validateAuthenticationWithSession(req, res);
  const input = ExtractReconciliationInputSchema.parse(req.body);
  const result = await extractReconciliation({ input, session });
  return res.status(200).json(result);
};

export default apiHandler({
  POST: extractReconciliationRoute,
});
