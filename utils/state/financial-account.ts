import { useCallback, useState } from "react";
import { z } from "zod";
import { FinancialAccountsSchema } from "../schemas/finances";

const FinancialAccountState = z.object({
  account: FinancialAccountsSchema,
});

export type TFinancialAccountState = z.infer<typeof FinancialAccountState>;

type UseFinancialAccountStateParams = {
  initialState?: Partial<TFinancialAccountState>;
};
export function useFinancialAccountState({ initialState }: UseFinancialAccountStateParams) {
  const [state, setState] = useState<TFinancialAccountState>({
    account: initialState?.account || {
      ativo: true,
      nome: "",
      descricao: "",
      tipo: "BANCO",
      contaContabil: {
        id: "",
        nome: "",
      },
      saldoInicial: { valor: 0, data: new Date().toISOString() },
      dataInsercao: new Date().toISOString(),
    },
  });

  const updateAccount = useCallback((changes: Partial<TFinancialAccountState["account"]>) => {
    setState((prev) => ({
      ...prev,
      account: { ...prev.account, ...changes },
    }));
  }, []);

  const redefineState = useCallback((newState: TFinancialAccountState) => {
    setState(newState);
  }, []);

  const resetState = useCallback(() => {
    setState({
      account: {
        ativo: true,
        nome: "",
        descricao: "",
        tipo: "BANCO",
        contaContabil: {
          id: "",
          nome: "",
        },
        saldoInicial: { valor: 0, data: new Date().toISOString() },
        dataInsercao: new Date().toISOString(),
      },
    });
  }, []);

  return {
    state,
    updateAccount,
    redefineState,
    resetState,
  };
}
export type TUseFinancialAccountState = ReturnType<typeof useFinancialAccountState>;
