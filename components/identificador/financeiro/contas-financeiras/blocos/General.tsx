import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { useAccountsCharts } from "@/utils/methods/query/finances";
import { FinancialAccountTypeOptions } from "@/utils/select-options";
import { TFinancialAccountState, TUseFinancialAccountState } from "@/utils/state/financial-account";
import { LayoutGrid } from "lucide-react";

type GeneralBlockProps = {
  account: TUseFinancialAccountState["state"]["account"];
  updateAccount: TUseFinancialAccountState["updateAccount"];
};
export default function GeneralBlock({ account, updateAccount }: GeneralBlockProps) {
  const { data: accountsCharts } = useAccountsCharts();
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES GERAIS"
      sectionTitleIcon={<LayoutGrid size={15} />}
    >
      <CheckboxInput
        labelFalse="ATIVO"
        labelTrue="ATIVO"
        checked={account.ativo}
        handleChange={(value) => updateAccount({ ativo: value })}
      />
      <TextInput
        label="NOME"
        placeholder="Preencha o nome da conta financeira..."
        value={account.nome}
        handleChange={(value) => updateAccount({ nome: value })}
        width="100%"
      />
      <TextareaInput
        label="DESCRIÇÃO"
        placeholder="Preencha a descrição da conta financeira..."
        value={account.descricao}
        handleChange={(value) => updateAccount({ descricao: value })}
      />
      <SelectInput
        label="TIPO"
        value={account.tipo}
        handleChange={(value) =>
          updateAccount({
            tipo: value,
            metadados:
              value === "BANCO"
                ? {
                    tipo: "BANCO",
                    nome: "",
                    codigo: "",
                    agencia: "",
                    numero: "",
                    digito: "",
                    tipoConta: "CORRENTE",
                  }
                : null,
          })
        }
        options={FinancialAccountTypeOptions}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() =>
          updateAccount({ tipo: FinancialAccountTypeOptions[0].value, metadados: null })
        }
        width="100%"
      />
      <SelectInput
        label="PLANO DE CONTAS"
        value={account.contaContabil.id}
        handleChange={(value) => {
          const selectedChart = accountsCharts?.find((chart) => chart._id === value);
          if (selectedChart) {
            updateAccount({ contaContabil: { id: selectedChart._id, nome: selectedChart.nome } });
          } else {
            updateAccount({ contaContabil: undefined });
          }
        }}
        options={
          accountsCharts?.map((chart) => ({
            id: chart._id,
            label: chart.nome,
            value: chart._id,
          })) || []
        }
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateAccount({ contaContabil: undefined })}
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
