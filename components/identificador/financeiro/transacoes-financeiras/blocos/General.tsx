import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { useFinancesAccountingEntries } from "@/utils/methods/query/finances";
import { formatDateForInputValue, formatDateInputChange } from "@/utils/methods/shared";
import {
  FinancialTransactionPaymentMethodsOptions,
  FinancialTransactionTypeOptions,
} from "@/utils/select-options";
import { TUseFinancialTransactionState } from "@/utils/state/financial-transaction";
import dayjs from "dayjs";
import { ArrowLeftRight } from "lucide-react";

type GeneralBlockProps = {
  transaction: TUseFinancialTransactionState["state"]["transaction"];
  updateTransaction: TUseFinancialTransactionState["updateTransaction"];
};

export default function GeneralBlock({
  transaction,
  updateTransaction,
}: GeneralBlockProps) {
  const { data: accountingEntriesData } = useFinancesAccountingEntries({
    initialParams: {
      page: 1,
      search: null,
      periodAfter: dayjs().subtract(10, "year").startOf("year").toISOString(),
      periodBefore: dayjs().add(1, "year").endOf("year").toISOString(),
    },
  });

  const accountingEntryOptions =
    accountingEntriesData?.entries.map((entry) => ({
      id: entry.id,
      value: entry.id,
      label: entry.titulo || "TÍTULO NÃO DEFINIDO",
    })) ?? [];

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES GERAIS"
      sectionTitleIcon={<ArrowLeftRight size={15} />}
    >
      <TextInput
        label="TÍTULO"
        placeholder="Preencha o título da transação financeira..."
        value={transaction.titulo}
        handleChange={(value) => updateTransaction({ titulo: value })}
        width="100%"
      />
      <SelectInput
        label="TIPO"
        value={transaction.tipo}
        handleChange={(value) =>
          updateTransaction({ tipo: value as typeof transaction.tipo })
        }
        options={FinancialTransactionTypeOptions.map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
        }))}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateTransaction({ tipo: FinancialTransactionTypeOptions[0].value })}
        width="100%"
      />
      <SelectInput
        label="LANÇAMENTO CONTÁBIL"
        value={transaction.lancamentoContabil.id}
        handleChange={(value) => {
          const selectedEntry = accountingEntriesData?.entries.find((entry) => entry.id === value);
          if (!selectedEntry) {
            return updateTransaction({ lancamentoContabil: { id: "", nome: "" } });
          }
          updateTransaction({
            lancamentoContabil: {
              id: selectedEntry.id,
              nome: selectedEntry.titulo || "TÍTULO NÃO DEFINIDO",
            },
          });
        }}
        options={accountingEntryOptions}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateTransaction({ lancamentoContabil: { id: "", nome: "" } })}
        width="100%"
      />
      <NumberInput
        label="VALOR"
        value={transaction.valor}
        handleChange={(value) => updateTransaction({ valor: value })}
        placeholder="Preencha o valor da transação..."
        width="100%"
      />
      <SelectInput
        label="MÉTODO"
        value={transaction.metodo}
        handleChange={(value) =>
          updateTransaction({ metodo: value as typeof transaction.metodo })
        }
        options={FinancialTransactionPaymentMethodsOptions.map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
        }))}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateTransaction({ metodo: "A DEFINIR" })}
        width="100%"
      />
      <DateInput
        label="DATA DE PREVISÃO"
        value={formatDateForInputValue(transaction.dataPrevisao)}
        handleChange={(value) =>
          updateTransaction({
            dataPrevisao: formatDateInputChange(value, "string") || transaction.dataPrevisao,
          })
        }
        width="100%"
      />
      <DateInput
        label="DATA DE EFETIVAÇÃO"
        value={formatDateForInputValue(transaction.dataEfetivacao)}
        handleChange={(value) =>
          updateTransaction({
            dataEfetivacao: formatDateInputChange(value, "string"),
          })
        }
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
