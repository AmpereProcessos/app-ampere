import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { updateAccountingEntry } from "@/utils/methods/mutation/finances";
import { useAccountingEntryById } from "@/utils/methods/query/finances";
import { getErrorMessage } from "@/utils/methods/handlers";
import { TMutationCallbacks } from "@/utils/methods/shared";
import { useAccountingEntryState } from "@/utils/state/accounting-entry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import AccountsBlock from "./blocos/Accounts";
import GeneralBlock from "./blocos/General";
import ProjectBlock from "./blocos/Project";
import ValuesBlock from "./blocos/Values";
import FinancialTransactionsBlock from "./blocos/FinancialTransactions";

type ControlAccountingEntryProps = {
  entryId: string;
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: TMutationCallbacks;
};

export default function ControlAccountingEntry({
  entryId,
  session,
  closeModal,
  callbacks,
}: ControlAccountingEntryProps) {
  const queryClient = useQueryClient();
  const {
    data: entryData,
    queryKey: entryQueryKey,
    isLoading: isLoadingEntry,
    isError: isErrorEntry,
    error: entryError,
  } = useAccountingEntryById(entryId);
  const {
    state,
    updateEntry,
    redefineState,
    resetState,
    addFinancialTransaction,
    updateFinancialTransaction,
    removeFinancialTransaction,
  } = useAccountingEntryState({ session });

  useEffect(() => {
    if (!entryData) return;
    redefineState({
      entry: {
        titulo: entryData.titulo,
        anotacoes: entryData.anotacoes,
        contaDebito: entryData.contaDebito,
        contaCredito: entryData.contaCredito,
        valor: entryData.valor,
        valorPrevisto: entryData.valorPrevisto,
        dataCompetencia: entryData.dataCompetencia,
        autor: {
          id: entryData.autor.id,
          nome: entryData.autor.nome,
          avatar_url: entryData.autor.avatarUrl ?? null,
        },
        dataInsercao: entryData.dataInsercao,
        projeto: entryData.projeto ?? null,
      },
      entryFinancialTransactions: entryData.transacoesFinanceiras.map((transaction) => ({
        id: transaction._id,
        deletar: false,
        ...transaction,
      })),
    });
  }, [entryData, redefineState]);

  const { mutate: handleUpdateAccountingEntry, isPending } = useMutation({
    mutationKey: ["update-accounting-entry", entryId],
    mutationFn: updateAccountingEntry,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: entryQueryKey });
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
      await queryClient.invalidateQueries({ queryKey: entryQueryKey });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError();
      return toast.error(getErrorMessage(error));
    },
  });

  return (
    <ResponsiveDialogDrawer
      menuTitle="EDITAR LANÇAMENTO CONTÁBIL"
      menuDescription="Preencha os campos abaixo para editar o lançamento contábil."
      menuActionButtonText="ATUALIZAR LANÇAMENTO CONTÁBIL"
      menuCancelButtonText="CANCELAR"
      actionFunction={() =>
        handleUpdateAccountingEntry({
          entryId,
          entry: state.entry,
          entryFinancialTransactions: state.entryFinancialTransactions,
        })
      }
      stateIsLoading={isLoadingEntry}
      stateError={isErrorEntry ? getErrorMessage(entryError) : null}
      closeMenu={closeModal}
      actionIsPending={isPending}
    >
      <GeneralBlock entry={state.entry} updateEntry={updateEntry} />
      <ProjectBlock entry={state.entry} updateEntry={updateEntry} />
      <AccountsBlock entry={state.entry} updateEntry={updateEntry} />
      <ValuesBlock entry={state.entry} updateEntry={updateEntry} />
      <FinancialTransactionsBlock
        entryFinancialTransactions={state.entryFinancialTransactions}
        addFinancialTransaction={addFinancialTransaction}
        updateFinancialTransaction={updateFinancialTransaction}
        removeFinancialTransaction={removeFinancialTransaction}
      />
    </ResponsiveDialogDrawer>
  );
}
