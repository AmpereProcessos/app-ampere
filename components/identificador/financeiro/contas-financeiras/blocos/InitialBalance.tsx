import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatDateForInputValue, formatDateInputChange } from "@/utils/methods/shared";
import { TFinancialAccountState, TUseFinancialAccountState } from "@/utils/state/financial-account";
import { LayoutGrid } from "lucide-react";

type InitialBalanceBlockProps = {
  account: TUseFinancialAccountState["state"]["account"];
  updateAccount: TUseFinancialAccountState["updateAccount"];
};
export default function InitialBalanceBlock({ account, updateAccount }: InitialBalanceBlockProps) {
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES GERAIS"
      sectionTitleIcon={<LayoutGrid size={15} />}
    >
      <DateInput
        label="DATA DE INÍCIO"
        value={
          account.saldoInicial.data ? formatDateForInputValue(account.saldoInicial.data) : undefined
        }
        handleChange={(value) =>
          updateAccount({
            saldoInicial: {
              ...account.saldoInicial,
              data: formatDateInputChange(value, "string") || account.saldoInicial.data,
            },
          })
        }
        width="100%"
      />

      <NumberInput
        label="SALDO INICIAL"
        value={account.saldoInicial.valor}
        handleChange={(value) =>
          updateAccount({ saldoInicial: { ...account.saldoInicial, valor: value } })
        }
        placeholder="Preencha o saldo inicial da conta financeira..."
        width="100%"
      />
    </ResponsiveDialogDrawerSection>
  );
}
