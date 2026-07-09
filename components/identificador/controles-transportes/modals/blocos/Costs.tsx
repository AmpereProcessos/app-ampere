import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import type { TUseTransportControlState } from "@/utils/state/transport-controls";
import { DollarSign, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type CostsBlockProps = {
  costs: TUseTransportControlState["state"]["transportControl"]["custos"];
  addCost: (cost: TUseTransportControlState["state"]["transportControl"]["custos"][number]) => void;
  removeCost: (index: number) => void;
};
export default function CostsBlock({ costs, addCost, removeCost }: CostsBlockProps) {
  const [newCostMenuIsOpen, setNewCostMenuIsOpen] = useState(false);
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="CUSTOS"
      sectionTitleIcon={<DollarSign size={15} />}
    >
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full flex items-center gap-2 justify-end">
          <Button
            onClick={() => setNewCostMenuIsOpen(true)}
            variant="ghost"
            size="fit"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
          >
            <PlusIcon className="w-4 h-4" />
            ADICIONAR
          </Button>
        </div>
      </div>

      {costs.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          {costs.map((cost, index) => (
            <div
              key={index.toString()}
              className="w-full flex items-center gap-2 justify-between p-2 rounded-lg shadow-sm border border-border"
            >
              <h1 className="text-xs tracking-tight font-medium text-start w-fit">
                {cost.descricao}
              </h1>

              <div className="flex items-center gap-1">
                <h1
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground",
                    {},
                  )}
                >
                  {formatToMoney(cost.valor)}
                </h1>
                <Button
                  variant="ghost"
                  size="fit"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors"
                  onClick={() => removeCost(index)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum custo adicionado ainda.</p>
      )}
      {newCostMenuIsOpen ? (
        <NewCostMenu addCost={addCost} closeMenu={() => setNewCostMenuIsOpen(false)} />
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}

type NewCostMenuProps = {
  addCost: (cost: TUseTransportControlState["state"]["transportControl"]["custos"][number]) => void;
  closeMenu: () => void;
};
function NewCostMenu({ addCost, closeMenu }: NewCostMenuProps) {
  const [costHolder, setCostHolder] = useState<
    TUseTransportControlState["state"]["transportControl"]["custos"][number]
  >({
    descricao: "",
    valor: 0,
    anexos: [],
  });

  function handleAddCost(
    info: TUseTransportControlState["state"]["transportControl"]["custos"][number],
  ) {
    if (!costHolder.descricao) {
      toast.error("Preencha uma descrição para o custo.");
      return;
    }
    if (!costHolder.valor) {
      toast.error("Preencha um valor para o custo.");
      return;
    }
    addCost(costHolder);
    closeMenu();
  }
  return (
    <ResponsiveDialogDrawer
      menuTitle="NOVO CUSTO"
      menuDescription="Adicione um novo custo ao controle de transporte."
      menuActionButtonText="ADICIONAR CUSTO"
      menuCancelButtonText="CANCELAR"
      stateIsLoading={false}
      actionFunction={() => handleAddCost(costHolder)}
      actionIsPending={false}
      closeMenu={closeMenu}
    >
      <TextInput
        label="DESCRIÇÃO"
        placeholder="Preencha a descrição do custo..."
        value={costHolder.descricao}
        handleChange={(value) => setCostHolder((prev) => ({ ...prev, descricao: value }))}
        width="100%"
      />
      <NumberInput
        label="VALOR"
        placeholder="Preencha o valor do custo..."
        value={costHolder.valor}
        handleChange={(value) => setCostHolder((prev) => ({ ...prev, valor: value }))}
        width="100%"
      />
    </ResponsiveDialogDrawer>
  );
}
