import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TRevenue } from "@/utils/schemas/revenues";
import { paymentMethods, revenueSources } from "@/utils/select-options";
import React from "react";

type RevenueGeneralInformationBlockProps = {
  infoHolder: TRevenue;
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>;
};
function RevenueGeneralInformationBlock({
  infoHolder,
  setInfoHolder,
}: RevenueGeneralInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">
        INFORMAÇÕES GERAIS
      </h1>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <TextInput
              label="NOME DA RECEITA"
              placeholder="Preencha o nome da receita..."
              value={infoHolder.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <SelectInput
              label="TIPO"
              options={revenueSources}
              selectedItemLabel="NÃO DEFINIDO"
              value={infoHolder.tipo}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipo: value }))}
              onReset={() => setInfoHolder((prev) => ({ ...prev, tipo: revenueSources[0].value }))}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <SelectInput
              label="MÉTODO DE PAGAMENTO"
              options={paymentMethods}
              selectedItemLabel="NÃO DEFINIDO"
              value={infoHolder.metodo}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, metodo: value }))}
              onReset={() =>
                setInfoHolder((prev) => ({ ...prev, metodo: paymentMethods[0].value }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="VALOR"
              placeholder="Preencha aqui o valor da receita..."
              value={infoHolder.total}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
              width="100%"
            />
          </div>
        </div>
        <h1 className="bg-primary/10 text-primary w-fit self-center rounded-md p-2 text-[0.65rem] leading-none tracking-tight">
          OBS: O PARÂMETRO DE EFETIVAÇÃO SE REFERE A DATA EM QUE A RECEITA ENTRA NO REGIME DE
          COMPETÊNCIA.
        </h1>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <CheckboxInput
              checked={!!infoHolder.efetivacao.efetivado}
              labelFalse={"EFETIVADO"}
              labelTrue={"EFETIVADO"}
              justify="justify-center"
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  efetivacao: {
                    ...prev.efetivacao,
                    efetivado: value,
                  },
                }))
              }
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <DateInput
              label={
                infoHolder.efetivacao.efetivado ? "DATA DA EFETIVAÇÃO" : "PREVISÃO DE EFETIVAÇÃO"
              }
              labelClassName="text-center text-foreground font-normal font-raleway text-sm"
              value={
                infoHolder.efetivacao.data ? formatDate(infoHolder.efetivacao.data) : undefined
              }
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  efetivacao: {
                    ...prev.efetivacao,
                    data: formatDateInputChange(value),
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueGeneralInformationBlock;
