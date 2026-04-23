import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { useAccountsCharts } from "@/utils/methods/query/finances";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import { ArrowRightLeft } from "lucide-react";

type AccountsBlockProps = {
  entry: TUseAccountingEntryState["state"]["entry"];
  updateEntry: TUseAccountingEntryState["updateEntry"];
};

export default function AccountsBlock({ entry, updateEntry }: AccountsBlockProps) {
  const { data: accountsCharts } = useAccountsCharts();

  const options =
    accountsCharts?.map((chart) => ({
      id: chart._id,
      value: chart._id,
      label: `${chart.codigo} - ${chart.nome}`,
    })) ?? [];

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="CONTAS CONTÁBEIS"
      sectionTitleIcon={<ArrowRightLeft size={15} />}
    >
      <SelectInput
        label="CONTA DE DÉBITO"
        value={entry.contaDebito.id}
        handleChange={(value) => {
          const selectedChart = accountsCharts?.find((chart) => chart._id === value);
          if (!selectedChart) return updateEntry({ contaDebito: { id: "", nome: "" } });
          updateEntry({
            contaDebito: {
              id: selectedChart._id,
              nome: selectedChart.nome,
            },
          });
        }}
        options={options}
        selectedItemLabel="NÃO DEFINIDA"
        onReset={() => updateEntry({ contaDebito: { id: "", nome: "" } })}
        width="100%"
      />
      <SelectInput
        label="CONTA DE CRÉDITO"
        value={entry.contaCredito.id}
        handleChange={(value) => {
          const selectedChart = accountsCharts?.find((chart) => chart._id === value);
          if (!selectedChart) return updateEntry({ contaCredito: { id: "", nome: "" } });
          updateEntry({
            contaCredito: {
              id: selectedChart._id,
              nome: selectedChart.nome,
            },
          });
        }}
        options={options}
        selectedItemLabel="NÃO DEFINIDA"
        onReset={() => updateEntry({ contaCredito: { id: "", nome: "" } })}
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
