import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { useFinancesFinancialAccounts } from "@/utils/methods/query/finances";
import { TUseFinancialTransactionState } from "@/utils/state/financial-transaction";
import { Landmark } from "lucide-react";
import { useMemo } from "react";

type FinancialAccountBlockProps = {
  transaction: TUseFinancialTransactionState["state"]["transaction"];
  updateTransaction: TUseFinancialTransactionState["updateTransaction"];
};

export default function FinancialAccountBlock({
  transaction,
  updateTransaction,
}: FinancialAccountBlockProps) {
  const { data: financialAccountsData } = useFinancesFinancialAccounts({
    initialParams: { activeOnly: true },
  });

  const options = useMemo(() => {
    return (
      financialAccountsData?.accounts.map((account) => ({
        id: account.id,
        value: account.id,
        label: account.nome,
      })) ?? []
    );
  }, [financialAccountsData]);

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="CONTA FINANCEIRA"
      sectionTitleIcon={<Landmark size={15} />}
    >
      <SelectInput
        label="CONTA FINANCEIRA"
        value={transaction.contaFinanceira.id}
        handleChange={(value) => {
          const selectedAccount = financialAccountsData?.accounts.find(
            (account) => account.id === value,
          );
          if (!selectedAccount) {
            return updateTransaction({
              contaFinanceira: { id: "", nome: "", tipo: "BANCO" },
            });
          }
          updateTransaction({
            contaFinanceira: {
              id: selectedAccount.id,
              nome: selectedAccount.nome,
              tipo: selectedAccount.tipo,
            },
          });
        }}
        options={options}
        selectedItemLabel="NÃO DEFINIDA"
        onReset={() =>
          updateTransaction({
            contaFinanceira: { id: "", nome: "", tipo: "BANCO" },
          })
        }
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
