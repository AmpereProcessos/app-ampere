import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { createFinancialTransaction } from "@/utils/methods/mutation/finances";
import { getErrorMessage } from "@/utils/methods/handlers";
import { TMutationCallbacks } from "@/utils/methods/shared";
import { useFinancialTransactionState } from "@/utils/state/financial-transaction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import FinancialAccountBlock from "./blocos/FinancialAccount";
import GeneralBlock from "./blocos/General";
import MetadataBlock from "./blocos/Metadata";

type NewFinancialTransactionProps = {
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: TMutationCallbacks;
};

export default function NewFinancialTransaction({
  session,
  closeModal,
  callbacks,
}: NewFinancialTransactionProps) {
  const { state, updateTransaction, resetState } = useFinancialTransactionState({ session });

  const { mutate: handleCreateFinancialTransaction, isPending } = useMutation({
    mutationKey: ["create-financial-transaction"],
    mutationFn: createFinancialTransaction,
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
      menuTitle="NOVA TRANSAÇÃO FINANCEIRA"
      menuDescription="Preencha os campos abaixo para criar uma nova transação financeira."
      menuActionButtonText="CRIAR TRANSAÇÃO FINANCEIRA"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreateFinancialTransaction({ transaction: state.transaction })}
      stateIsLoading={false}
      closeMenu={closeModal}
      actionIsPending={isPending}
    >
      <GeneralBlock transaction={state.transaction} updateTransaction={updateTransaction} />
      <FinancialAccountBlock
        transaction={state.transaction}
        updateTransaction={updateTransaction}
      />
      <MetadataBlock transaction={state.transaction} updateTransaction={updateTransaction} />
    </ResponsiveDialogDrawer>
  );
}
