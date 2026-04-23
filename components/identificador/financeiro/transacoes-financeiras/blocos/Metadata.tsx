import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { TUseFinancialTransactionState } from "@/utils/state/financial-transaction";
import { Tags } from "lucide-react";

type MetadataBlockProps = {
  transaction: TUseFinancialTransactionState["state"]["transaction"];
  updateTransaction: TUseFinancialTransactionState["updateTransaction"];
};

export default function MetadataBlock({ transaction, updateTransaction }: MetadataBlockProps) {
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="COMPLEMENTOS"
      sectionTitleIcon={<Tags size={15} />}
    >
      <NumberInput
        label="PARCELA"
        value={transaction.parcela ?? 0}
        handleChange={(value) => updateTransaction({ parcela: value > 0 ? value : null })}
        placeholder="Informe o número da parcela..."
        width="100%"
      />
      <NumberInput
        label="TOTAL DE PARCELAS"
        value={transaction.totalParcelas ?? 0}
        handleChange={(value) => updateTransaction({ totalParcelas: value > 0 ? value : null })}
        placeholder="Informe o total de parcelas..."
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
