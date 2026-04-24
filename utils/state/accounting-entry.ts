import { TAuthSession } from "@/lib/authentication/types";
import { useCallback, useState } from "react";
import { z } from "zod";
import { AccountingEntriesSchema, FinancialTransactionSchema } from "../schemas/finances";

const AccountingEntryStateSchema = z.object({
  entry: AccountingEntriesSchema,
  entryFinancialTransactions: z.array(
    FinancialTransactionSchema.omit({ lancamentoContabil: true, autor: true }).extend({
      id: z
        .string({
          required_error: "ID da transação financeira não informado.",
          invalid_type_error: "Tipo inválido para o ID da transação financeira.",
        })
        .optional()
        .nullable(),
      deletar: z
        .boolean({
          required_error: "Deletar não informado.",
          invalid_type_error: "Tipo inválido para o deletar.",
        })
        .optional()
        .nullable(),
    }),
  ),
});

export type TAccountingEntryState = z.infer<typeof AccountingEntryStateSchema>;

type UseAccountingEntryStateParams = {
  session: TAuthSession;
  initialState?: Partial<TAccountingEntryState>;
};

function getDefaultEntryState(session: TAuthSession): TAccountingEntryState {
  return {
    entry: {
      titulo: "",
      anotacoes: "",
      contaDebito: {
        id: "",
        nome: "",
      },
      contaCredito: {
        id: "",
        nome: "",
      },
      valor: 0,
      valorPrevisto: 0,
      dataCompetencia: new Date().toISOString(),
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataInsercao: new Date().toISOString(),
    },
    entryFinancialTransactions: [],
  };
}

export function useAccountingEntryState({ session, initialState }: UseAccountingEntryStateParams) {
  const defaultState = getDefaultEntryState(session);
  const [state, setState] = useState<TAccountingEntryState>({
    entry: initialState?.entry ?? defaultState.entry,
    entryFinancialTransactions:
      initialState?.entryFinancialTransactions ?? defaultState.entryFinancialTransactions,
  });

  const updateEntry = useCallback((changes: Partial<TAccountingEntryState["entry"]>) => {
    setState((prev) => ({
      ...prev,
      entry: { ...prev.entry, ...changes },
    }));
  }, []);

  const addFinancialTransaction = useCallback(
    (transaction: TAccountingEntryState["entryFinancialTransactions"][number]) => {
      setState((prev) => ({
        ...prev,
        entryFinancialTransactions: [...prev.entryFinancialTransactions, transaction],
      }));
    },
    [],
  );

  const updateFinancialTransaction = useCallback(
    ({
      index,
      changes,
    }: {
      index: number;
      changes: Partial<TAccountingEntryState["entryFinancialTransactions"][number]>;
    }) => {
      setState((prev) => ({
        ...prev,
        entryFinancialTransactions: prev.entryFinancialTransactions.map((t, i) =>
          i === index ? { ...t, ...changes } : t,
        ),
      }));
    },
    [],
  );

  const removeFinancialTransaction = useCallback((index: number) => {
    setState((prev) => {
      // Validating db existence (id defined)
      const isExistingTransaction = state.entryFinancialTransactions.find(
        (t, index) => index === index && !!t.id,
      );
      // If not an existing instance, just filtering it out
      if (!isExistingTransaction)
        return {
          ...state,
          entryFinancialTransactions: state.entryFinancialTransactions.filter(
            (_, index) => index !== index,
          ),
        };
      // Else, marking it with a deletar flag
      return {
        ...state,
        entryFinancialTransactions: state.entryFinancialTransactions.map((item, index) =>
          index === index ? { ...item, deletar: true } : item,
        ),
      };
    });
  }, []);
  const redefineState = useCallback((newState: TAccountingEntryState) => {
    setState(newState);
  }, []);

  const resetState = useCallback(() => {
    setState(getDefaultEntryState(session));
  }, [session]);

  return {
    state,
    updateEntry,
    addFinancialTransaction,
    updateFinancialTransaction,
    removeFinancialTransaction,
    redefineState,
    resetState,
  };
}

export type TUseAccountingEntryState = ReturnType<typeof useAccountingEntryState>;
