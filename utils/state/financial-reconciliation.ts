import { TAuthSession } from "@/lib/authentication/types";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import {
  TFinancialReconciliationExtractedLine,
  TFinancialReconciliationMatch,
} from "../schemas/finances";

export type TReconciliationContaFinanceira = {
  id: string;
  nome: string;
  tipo: "CAIXA" | "CARTEIRA_DIGITAL" | "BANCO";
};

export type TReconciliationPdf = {
  url: string;
  nomeOriginal: string;
};

export type TFinancialReconciliationState = {
  contaFinanceira: TReconciliationContaFinanceira | null;
  periodo: { inicio: string; fim: string };
  pdf: TReconciliationPdf | null;
  linhasExtraidas: TFinancialReconciliationExtractedLine[];
  matches: TFinancialReconciliationMatch[];
  /**
   * Step the user is currently on. Drives the view rendering.
   *  - "filters": needs account + period
   *  - "upload": needs PDF
   *  - "extracting": AI is reading the PDF
   *  - "matching": deterministic + AI matching is running
   *  - "review": user reviews matched/ambiguous/unmatched
   *  - "saving": persisting the reconciliation
   *  - "concluded": session was saved
   */
  step:
    | "filters"
    | "upload"
    | "extracting"
    | "matching"
    | "review"
    | "saving"
    | "concluded";
};

type UseFinancialReconciliationStateParams = {
  session: TAuthSession;
};

function getDefaultReconciliationState(
  _session: TAuthSession,
): TFinancialReconciliationState {
  return {
    contaFinanceira: null,
    periodo: {
      inicio: dayjs().startOf("month").toISOString(),
      fim: dayjs().endOf("month").toISOString(),
    },
    pdf: null,
    linhasExtraidas: [],
    matches: [],
    step: "filters",
  };
}

export function useFinancialReconciliationState({
  session,
}: UseFinancialReconciliationStateParams) {
  const [state, setState] = useState<TFinancialReconciliationState>(
    getDefaultReconciliationState(session),
  );

  const updateState = useCallback(
    (changes: Partial<TFinancialReconciliationState>) => {
      setState((prev) => ({ ...prev, ...changes }));
    },
    [],
  );

  const updateMatch = useCallback(
    (linhaId: string, changes: Partial<TFinancialReconciliationMatch>) => {
      setState((prev) => ({
        ...prev,
        matches: prev.matches.map((m) =>
          m.linhaId === linhaId ? { ...m, ...changes } : m,
        ),
      }));
    },
    [],
  );

  const upsertMatch = useCallback((match: TFinancialReconciliationMatch) => {
    setState((prev) => {
      const exists = prev.matches.some((m) => m.linhaId === match.linhaId);
      return {
        ...prev,
        matches: exists
          ? prev.matches.map((m) => (m.linhaId === match.linhaId ? match : m))
          : [...prev.matches, match],
      };
    });
  }, []);

  const unlinkMatch = useCallback((linhaId: string) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.linhaId === linhaId
          ? { ...m, transacaoId: null, score: 0, estrategia: "MANUAL" }
          : m,
      ),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(getDefaultReconciliationState(session));
  }, [session]);

  return {
    state,
    updateState,
    updateMatch,
    upsertMatch,
    unlinkMatch,
    resetState,
  };
}

export type TUseFinancialReconciliationState = ReturnType<
  typeof useFinancialReconciliationState
>;
