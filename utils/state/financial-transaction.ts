import { TAuthSession } from "@/lib/authentication/types";
import { useCallback, useState } from "react";
import { z } from "zod";
import { FinancialTransactionSchema } from "../schemas/finances";

const FinancialTransactionStateSchema = z.object({
  transaction: FinancialTransactionSchema,
});

export type TFinancialTransactionState = z.infer<typeof FinancialTransactionStateSchema>;

type UseFinancialTransactionStateParams = {
  session: TAuthSession;
  initialState?: Partial<TFinancialTransactionState>;
};

function getDefaultFinancialTransactionState(
  session: TAuthSession,
): TFinancialTransactionState {
  return {
    transaction: {
      lancamentoContabil: {
        id: "",
        nome: "",
      },
      contaFinanceira: {
        id: "",
        nome: "",
        tipo: "BANCO",
      },
      titulo: "",
      tipo: "ENTRADA",
      valor: 0,
      metodo: "A DEFINIR",
      dataPrevisao: new Date().toISOString(),
      dataEfetivacao: null,
      parcela: null,
      totalParcelas: null,
      provedorReferencia: null,
      provedorStatus: null,
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataInsercao: new Date().toISOString(),
    },
  };
}

export function useFinancialTransactionState({
  session,
  initialState,
}: UseFinancialTransactionStateParams) {
  const [state, setState] = useState<TFinancialTransactionState>(
    initialState ?? getDefaultFinancialTransactionState(session),
  );

  const updateTransaction = useCallback(
    (changes: Partial<TFinancialTransactionState["transaction"]>) => {
      setState((prev) => ({
        ...prev,
        transaction: {
          ...prev.transaction,
          ...changes,
        },
      }));
    },
    [],
  );

  const redefineState = useCallback((newState: TFinancialTransactionState) => {
    setState(newState);
  }, []);

  const resetState = useCallback(() => {
    setState(getDefaultFinancialTransactionState(session));
  }, [session]);

  return {
    state,
    updateTransaction,
    redefineState,
    resetState,
  };
}

export type TUseFinancialTransactionState = ReturnType<typeof useFinancialTransactionState>;
