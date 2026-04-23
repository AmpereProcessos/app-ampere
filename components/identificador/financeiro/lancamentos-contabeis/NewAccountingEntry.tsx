import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { createAccountingEntry } from "@/utils/methods/mutation/finances";
import { getErrorMessage } from "@/utils/methods/handlers";
import { TMutationCallbacks } from "@/utils/methods/shared";
import { useAccountingEntryState } from "@/utils/state/accounting-entry";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import AccountsBlock from "./blocos/Accounts";
import GeneralBlock from "./blocos/General";
import ValuesBlock from "./blocos/Values";

type NewAccountingEntryProps = {
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: TMutationCallbacks;
};

export default function NewAccountingEntry({
  session,
  closeModal,
  callbacks,
}: NewAccountingEntryProps) {
  const { state, updateEntry, resetState } = useAccountingEntryState({ session });

  const { mutate: handleCreateAccountingEntry, isPending } = useMutation({
    mutationKey: ["create-accounting-entry"],
    mutationFn: createAccountingEntry,
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
      menuTitle="NOVO LANÇAMENTO CONTÁBIL"
      menuDescription="Preencha os campos abaixo para criar um novo lançamento contábil."
      menuActionButtonText="CRIAR LANÇAMENTO CONTÁBIL"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreateAccountingEntry({ entry: state.entry })}
      stateIsLoading={false}
      closeMenu={closeModal}
      actionIsPending={isPending}
    >
      <GeneralBlock entry={state.entry} updateEntry={updateEntry} />
      <AccountsBlock entry={state.entry} updateEntry={updateEntry} />
      <ValuesBlock entry={state.entry} updateEntry={updateEntry} />
    </ResponsiveDialogDrawer>
  );
}
