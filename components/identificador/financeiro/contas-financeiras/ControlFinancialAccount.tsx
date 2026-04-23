import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateFinancialAccount } from "@/utils/methods/mutation/finances";
import { useFinancialAccountState } from "@/utils/state/financial-account";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import GeneralBlock from "./blocos/General";
import MetadataBlock from "./blocos/Metadata";
import InitialBalanceBlock from "./blocos/InitialBalance";
import { useFinancialAccountById } from "@/utils/methods/query/finances";

type ControlFinancialAccountProps = {
  accountId: string;
  session: TAuthSession;
  closeModal: () => void;

  callbacks?: {
    onMutate?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onSettled?: () => void;
  };
};

export default function ControlFinancialAccount({
  accountId,
  session: _session,
  closeModal,
  callbacks,
}: ControlFinancialAccountProps) {
  const queryClient = useQueryClient();
  const {
    data: accountData,
    queryKey: accountQueryKey,
    isLoading: isLoadingAccount,
    isError: isErrorAccount,
    error: accountError,
  } = useFinancialAccountById(accountId);
  const { state, updateAccount, redefineState, resetState } = useFinancialAccountState({});

  const { mutate: handleUpdateFinancialAccount, isPending } = useMutation({
    mutationKey: ["update-financial-account"],
    mutationFn: updateFinancialAccount,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: accountQueryKey });
      if (callbacks?.onMutate) callbacks.onMutate();
    },
    onSuccess: async (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      resetState();
      toast.success(data.message);
      return closeModal();
    },
    onSettled: async () => {
      if (callbacks?.onSettled) callbacks.onSettled();
      await queryClient.invalidateQueries({ queryKey: accountQueryKey });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError();
      return toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!accountData) return;
    redefineState({
      account: {
        ativo: accountData.ativo,
        nome: accountData.nome,
        descricao: accountData.descricao,
        tipo: accountData.tipo,
        contaContabil: accountData.contaContabil,
        saldoInicial: accountData.saldoInicial,
        metadados: accountData.metadados,
        dataInsercao: accountData.dataInsercao,
      },
    });
  }, [accountData, redefineState]);
  return (
    <ResponsiveDialogDrawer
      menuTitle="EDITAR CONTA FINANCEIRA"
      menuDescription="Preencha os campos abaixo para editar a conta financeira."
      menuActionButtonText="ATUALIZAR CONTA FINANCEIRA"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => {
        return handleUpdateFinancialAccount({ accountId, account: state.account });
      }}
      stateIsLoading={isLoadingAccount}
      stateError={isErrorAccount ? getErrorMessage(accountError) : null}
      closeMenu={closeModal}
      actionIsPending={isPending}
    >
      <GeneralBlock account={state.account} updateAccount={updateAccount} />
      <InitialBalanceBlock account={state.account} updateAccount={updateAccount} />
      <MetadataBlock account={state.account} updateAccount={updateAccount} />
    </ResponsiveDialogDrawer>
  );
}
