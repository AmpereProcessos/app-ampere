import NumberInput from "@/components/inputs/Number";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import { DollarSign } from "lucide-react";

type ValuesBlockProps = {
  entry: TUseAccountingEntryState["state"]["entry"];
  updateEntry: TUseAccountingEntryState["updateEntry"];
};

export default function ValuesBlock({ entry, updateEntry }: ValuesBlockProps) {
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="VALORES"
      sectionTitleIcon={<DollarSign size={15} />}
    >
      <NumberInput
        label="VALOR"
        value={entry.valor}
        handleChange={(value) => updateEntry({ valor: value })}
        placeholder="Preencha o valor realizado..."
        width="100%"
      />
      <NumberInput
        label="VALOR PREVISTO"
        value={entry.valorPrevisto}
        handleChange={(value) => updateEntry({ valorPrevisto: value })}
        placeholder="Preencha o valor previsto..."
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
