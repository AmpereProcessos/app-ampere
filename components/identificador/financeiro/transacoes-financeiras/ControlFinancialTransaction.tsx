import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { updateFinancialTransaction } from "@/utils/methods/mutation/finances";
import { useFinancialTransactionById } from "@/utils/methods/query/finances";
import { getErrorMessage } from "@/utils/methods/handlers";
import { TMutationCallbacks } from "@/utils/methods/shared";
import { useFinancialTransactionState } from "@/utils/state/financial-transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import FinancialAccountBlock from "./blocos/FinancialAccount";
import GeneralBlock from "./blocos/General";
import MetadataBlock from "./blocos/Metadata";

type ControlFinancialTransactionProps = {
  transactionId: string;
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: TMutationCallbacks;
};

export default function ControlFinancialTransaction({
  transactionId,
  session,
  closeModal,
  callbacks,
}: ControlFinancialTransactionProps) {
  const queryClient = useQueryClient();
  const {
    data: transactionData,
    queryKey: transactionQueryKey,
    isLoading: isLoadingTransaction,
    isError: isErrorTransaction,
    error: transactionError,
  } = useFinancialTransactionById(transactionId);
  const { state, updateTransaction, redefineState, resetState } = useFinancialTransactionState({
    session,
  });

  useEffect(() => {
    if (!transactionData) return;
    redefineState({
      transaction: {
        lancamentoContabil: transactionData.lancamentoContabil,
        contaFinanceira: {
          id: transactionData.contaFinanceira.id,
          nome: transactionData.contaFinanceira.nome,
          tipo: transactionData.contaFinanceira.tipo ?? "BANCO",
        },
        titulo: transactionData.titulo,
        tipo: transactionData.tipo,
        valor: transactionData.valor,
        metodo: transactionData.metodo,
        dataPrevisao: transactionData.dataPrevisao,
        dataEfetivacao: transactionData.dataEfetivacao,
        parcela: transactionData.parcela,
        totalParcelas: transactionData.totalParcelas,
        provedorReferencia: transactionData.provedorReferencia,
        provedorStatus: transactionData.provedorStatus,
        autor: {
          id: transactionData.autor.id,
          nome: transactionData.autor.nome,
          avatar_url: transactionData.autor.avatarUrl ?? null,
        },
        dataInsercao: transactionData.dataInsercao,
      },
    });
  }, [transactionData, redefineState]);

  const { mutate: handleUpdateFinancialTransaction, isPending } = useMutation({
    mutationKey: ["update-financial-transaction", transactionId],
    mutationFn: updateFinancialTransaction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: transactionQueryKey });
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
      await queryClient.invalidateQueries({ queryKey: transactionQueryKey });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError();
      return toast.error(getErrorMessage(error));
    },
  });

  return (
    <ResponsiveDialogDrawer
      menuTitle="EDITAR TRANSAÇÃO FINANCEIRA"
      menuDescription="Preencha os campos abaixo para editar a transação financeira."
      menuActionButtonText="ATUALIZAR TRANSAÇÃO FINANCEIRA"
      menuCancelButtonText="CANCELAR"
      actionFunction={() =>
        handleUpdateFinancialTransaction({
          transactionId,
          transaction: state.transaction,
        })
      }
      stateIsLoading={isLoadingTransaction}
      stateError={isErrorTransaction ? getErrorMessage(transactionError) : null}
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
