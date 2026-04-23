import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { FinancialAccountMetadataBankAccountTypeOptions } from "@/utils/select-options";
import { TUseFinancialAccountState } from "@/utils/state/financial-account";
import { LayoutGrid } from "lucide-react";

type MetadataBlockProps = {
  account: TUseFinancialAccountState["state"]["account"];
  updateAccount: TUseFinancialAccountState["updateAccount"];
};

export default function MetadataBlock({ account, updateAccount }: MetadataBlockProps) {
  const metadata = account.metadados;
  if (!metadata) return null;
  if (metadata.tipo === "BANCO") {
    return (
      <ResponsiveDialogDrawerSection
        sectionTitleText="DADOS DO BANCO"
        sectionTitleIcon={<LayoutGrid size={15} />}
      >
        <TextInput
          label="NOME"
          placeholder="Preencha o nome da conta financeira..."
          value={metadata.nome}
          handleChange={(value) => updateAccount({ metadados: { ...metadata, nome: value } })}
          width="100%"
        />
        <TextInput
          label="CÓDIGO"
          placeholder="Preencha o código da conta financeira..."
          value={metadata.codigo}
          handleChange={(value) => updateAccount({ metadados: { ...metadata, codigo: value } })}
          width="100%"
        />
        <TextInput
          label="AGÊNCIA"
          placeholder="Preencha a agência da conta financeira..."
          value={metadata.agencia}
          handleChange={(value) => updateAccount({ metadados: { ...metadata, agencia: value } })}
          width="100%"
        />
        <TextInput
          label="NÚMERO"
          placeholder="Preencha o número da conta financeira..."
          value={metadata.numero}
          handleChange={(value) => updateAccount({ metadados: { ...metadata, numero: value } })}
          width="100%"
        />
        <TextInput
          label="DIGITO"
          placeholder="Preencha o digito da conta financeira..."
          value={metadata.digito}
          handleChange={(value) => updateAccount({ metadados: { ...metadata, digito: value } })}
          width="100%"
        />
        <SelectInput
          label="TIPO DE CONTA"
          selectedItemLabel={metadata.tipoConta}
          options={FinancialAccountMetadataBankAccountTypeOptions}
          onReset={() =>
            updateAccount({ metadados: { ...metadata, tipoConta: metadata.tipoConta } })
          }
          handleChange={(value) =>
            updateAccount({
              metadados: { ...metadata, tipoConta: value as typeof metadata.tipoConta },
            })
          }
          value={metadata.tipoConta}
          width="100%"
        />
      </ResponsiveDialogDrawerSection>
    );
  }

  return null;
}
