import type { TGetAllPosVendaCallsInput } from "@/app/api/chamados/posvenda/route";
import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useState } from "react";

type PosVendaCallsFilterMenuProps = {
  queryParams: TGetAllPosVendaCallsInput;
  updateQueryParams: (params: Partial<TGetAllPosVendaCallsInput>) => void;
  closeMenu: () => void;
};
function PosVendaCallsFilterMenu({
  queryParams,
  updateQueryParams,
  closeMenu,
}: PosVendaCallsFilterMenuProps) {
  const [queryParamsHolder, setQueryParamsHolder] =
    useState<TGetAllPosVendaCallsInput>(queryParams);

  return (
    <Sheet open onOpenChange={closeMenu}>
      <SheetContent>
        <div className="flex h-full w-full flex-col">
          <SheetHeader>
            <SheetTitle>FILTRAR CLIENTES</SheetTitle>
            <SheetDescription>
              Escolha aqui parâmetros para filtrar o banco de clientes.
            </SheetDescription>
          </SheetHeader>
          <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-4 overflow-y-auto overscroll-y-auto p-2">
            <div className="flex w-full flex-col gap-2">
              <TextInput
                label="PESQUISA"
                value={queryParamsHolder.search || ""}
                placeholder={"Preenha aqui pelo título ou descrição do chamado para filtro."}
                handleChange={(value) =>
                  setQueryParamsHolder((prev) => ({ ...prev, search: value }))
                }
                width={"100%"}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <h1 className="text-foreground w-full text-center text-[0.65rem] tracking-tight">
                FILTRO POR PERÍODO
              </h1>
              <div className="w-fit self-center">
                <CheckboxInput
                  labelTrue="APENAS CHAMADOS EM ANDAMENTO"
                  labelFalse="APENAS CHAMADOS EM ANDAMENTO"
                  checked={queryParamsHolder.ongoingOnly === "true"}
                  handleChange={(value) =>
                    setQueryParamsHolder((prev) => ({
                      ...prev,
                      ongoingOnly: value ? "true" : "false",
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-foreground w-full text-center text-[0.65rem] tracking-tight">
                FILTRO POR PERÍODO
              </h1>
              <DateInput
                label="DEPOIS DE"
                value={formatDate(queryParamsHolder.periodAfter)}
                handleChange={(value) =>
                  setQueryParamsHolder((prev) => ({
                    ...prev,
                    periodAfter: formatDateInputChange(value, "string") as string,
                  }))
                }
                width="100%"
              />
              <DateInput
                label="ANTES DE"
                value={formatDate(queryParamsHolder.periodBefore)}
                handleChange={(value) =>
                  setQueryParamsHolder((prev) => ({
                    ...prev,
                    periodBefore: formatDateInputChange(value, "string") as string,
                  }))
                }
                width="100%"
              />
              <SelectInput
                label="PARÂMETRO"
                value={queryParamsHolder.periodField}
                options={[
                  { id: 1, label: "DATA DE INSERÇÃO", value: "dataInsercao" },
                  { id: 2, label: "DATA DE EFETIVAÇÃO", value: "dataEfetivacao" },
                ]}
                handleChange={(value) =>
                  setQueryParamsHolder((prev) => ({
                    ...prev,
                    periodField: value as "dataInsercao" | "dataEfetivacao",
                  }))
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setQueryParamsHolder((prev) => ({ ...prev, periodField: null }))}
                width={"100%"}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              updateQueryParams({ ...queryParamsHolder });
              closeMenu();
            }}
          >
            FILTRAR
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PosVendaCallsFilterMenu;
