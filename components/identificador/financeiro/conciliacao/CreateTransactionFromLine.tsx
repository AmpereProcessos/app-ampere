import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import { TAuthSession } from "@/lib/authentication/types";
import { createFinancialTransaction } from "@/utils/methods/mutation/finances";
import { getErrorMessage } from "@/utils/methods/handlers";
import {
  TFinancialReconciliationExtractedLine,
  TFinancialTransaction,
} from "@/utils/schemas/finances";
import { useFinancialTransactionState } from "@/utils/state/financial-transaction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import FinancialAccountBlock from "../transacoes-financeiras/blocos/FinancialAccount";
import GeneralBlock from "../transacoes-financeiras/blocos/General";
import MetadataBlock from "../transacoes-financeiras/blocos/Metadata";

type CreateTransactionFromLineProps = {
  session: TAuthSession;
  contaFinanceira: TFinancialTransaction["contaFinanceira"];
  linha: TFinancialReconciliationExtractedLine;
  closeModal: () => void;
  onCreated: (createdId: string) => void;
};

export default function CreateTransactionFromLine({
  session,
  contaFinanceira,
  linha,
  closeModal,
  onCreated,
}: CreateTransactionFromLineProps) {
  const { state, updateTransaction } = useFinancialTransactionState({
    session,
    initialState: {
      transaction: {
        lancamentoContabil: { id: "", nome: "" },
        contaFinanceira,
        titulo: linha.descricao,
        tipo: linha.tipo,
        valor: linha.valor,
        metodo: "A DEFINIR",
        dataPrevisao: linha.data,
        dataEfetivacao: linha.data,
        parcela: null,
        totalParcelas: null,
        provedorReferencia: linha.documento ?? null,
        provedorStatus: null,
        conciliado: false,
        conciliacaoId: null,
        dataReconciliacao: null,
        referenciaExterno: linha.documento ?? null,
        autor: {
          id: session.user.id,
          nome: session.user.nome,
          avatar_url: session.user.avatar_url,
        },
        dataInsercao: new Date().toISOString(),
      },
    },
  });

  const { mutate: handleCreate, isPending } = useMutation({
    mutationKey: ["create-financial-transaction-from-reconciliation"],
    mutationFn: createFinancialTransaction,
    onSuccess: (data) => {
      toast.success(data.message);
      onCreated(data.data.createdId);
      closeModal();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <ResponsiveDialogDrawer
      menuTitle="CRIAR TRANSAÇÃO A PARTIR DA LINHA"
      menuDescription="Os campos foram preenchidos com base no extrato. Ajuste o que for necessário antes de salvar."
      menuActionButtonText="CRIAR E VINCULAR"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreate({ transaction: state.transaction })}
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
