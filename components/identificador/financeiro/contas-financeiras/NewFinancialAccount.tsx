import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createFinancialAccount } from "@/utils/methods/mutation/finances";
import { TFinancialAccounts } from "@/utils/schemas/finances";
import { useFinancialAccountState } from "@/utils/state/financial-account";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import GeneralBlock from "./blocos/General";
import MetadataBlock from "./blocos/Metadata";
import InitialBalanceBlock from "./blocos/InitialBalance";

type NewFinancialAccountProps = {
  session: TAuthSession;
  closeModal: () => void;

  callbacks?: {
    onMutate?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onSettled?: () => void;
  };
};

export default function NewFinancialAccount({
  session,
  closeModal,
  callbacks,
}: NewFinancialAccountProps) {
  const { state, updateAccount, redefineState, resetState } = useFinancialAccountState({});

  const { mutate: handleCreateFinancialAccount, isPending } = useMutation({
    mutationKey: ["create-financial-account"],
    mutationFn: createFinancialAccount,
    onMutate: async () => {
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
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError();
      return toast.error(getErrorMessage(error));
    },
  });
  return (
    <ResponsiveDialogDrawer
      menuTitle="NOVA CONTA FINANCEIRA"
      menuDescription="Preencha os campos abaixo para criar uma nova conta financeira."
      menuActionButtonText="CRIAR CONTA FINANCEIRA"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => {
        return handleCreateFinancialAccount(state);
      }}
      stateIsLoading={false}
      closeMenu={closeModal}
      actionIsPending={isPending}
    >
      <GeneralBlock account={state.account} updateAccount={updateAccount} />
      <InitialBalanceBlock account={state.account} updateAccount={updateAccount} />
      <MetadataBlock account={state.account} updateAccount={updateAccount} />
    </ResponsiveDialogDrawer>
  );
}
