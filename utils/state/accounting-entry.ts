import { TAuthSession } from "@/lib/authentication/types";
import { useCallback, useState } from "react";
import { z } from "zod";
import { AccountingEntriesSchema } from "../schemas/finances";

const AccountingEntryStateSchema = z.object({
  entry: AccountingEntriesSchema,
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
  };
}

export function useAccountingEntryState({
  session,
  initialState,
}: UseAccountingEntryStateParams) {
  const [state, setState] = useState<TAccountingEntryState>(
    initialState ?? getDefaultEntryState(session),
  );

  const updateEntry = useCallback((changes: Partial<TAccountingEntryState["entry"]>) => {
    setState((prev) => ({
      ...prev,
      entry: { ...prev.entry, ...changes },
    }));
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
    redefineState,
    resetState,
  };
}

export type TUseAccountingEntryState = ReturnType<typeof useAccountingEntryState>;
