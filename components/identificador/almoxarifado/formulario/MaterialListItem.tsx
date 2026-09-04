import NumberInput from "@/components/inputs/Number";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isEmpty } from "@/utils/methods/shared";
import type { TTransactionalWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { Check, Hash, Pencil, Ruler, Trash2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

type TMaterial = TTransactionalWarehouseFormulary["materiais"][number];

/**
 * Grade compartilhada entre o cabeçalho, as linhas e o rodapé da tabela.
 * Mantê-la em um único lugar garante que as colunas nunca desalinhem.
 * A coluna de devolução some quando ela não é aplicável (ex: criação do formulário).
 */
export function getMaterialRowGrid(showDevolutionColumn: boolean) {
  return showDevolutionColumn
    ? "lg:grid lg:grid-cols-[minmax(0,1fr)_7rem_7rem_2.25rem] lg:items-center lg:gap-3"
    : "lg:grid lg:grid-cols-[minmax(0,1fr)_7rem_2.25rem] lg:items-center lg:gap-3";
}

type QuantityCellProps = {
  label: string;
  value: number;
  unit: string;
  editable: boolean;
  inputId: string;
  handleChange: (value: number) => void;
};
function QuantityCell({ label, value, unit, editable, inputId, handleChange }: QuantityCellProps) {
  return (
    <div className="flex items-center justify-between gap-2 lg:block">
      <label
        htmlFor={editable ? inputId : undefined}
        className="text-muted-foreground text-xs font-medium lg:hidden"
      >
        {label}
      </label>
      {editable ? (
        <input
          id={inputId}
          type="number"
          min={0}
          value={!isEmpty(value) ? value?.toString() : ""}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            if (Number.isNaN(parsed)) return;
            handleChange(Math.max(0, parsed));
          }}
          className="border-border bg-background focus-visible:ring-ring focus-visible:ring-offset-background h-9 w-24 rounded-md border px-2 text-right text-sm font-semibold tabular-nums outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 lg:w-full"
        />
      ) : (
        <p className="text-foreground px-2 text-right text-sm font-semibold tabular-nums lg:w-full">
          {value ?? 0}
          <span className="text-muted-foreground ml-1 text-xs font-normal">{unit}</span>
        </p>
      )}
    </div>
  );
}

type MaterialListItemProps = {
  formularyId?: string;
  material: TMaterial;
  index: number;
  removeMaterial: ({ id, index }: { id?: string | null; index: number }) => void;
  formHolder: TTransactionalWarehouseFormulary;
  setFormHolder: React.Dispatch<React.SetStateAction<TTransactionalWarehouseFormulary>>;
  blockTakeAway: boolean;
  blockDevolution: boolean;
  showDevolutionColumn: boolean;
  allowPostFinishEditing?: boolean;
};
function MaterialListItem({
  formularyId,
  material,
  index,
  removeMaterial,
  formHolder,
  setFormHolder,
  blockTakeAway,
  blockDevolution,
  showDevolutionColumn,
  allowPostFinishEditing = false,
}: MaterialListItemProps) {
  const [editMaterialMenuIsOpen, setEditMaterialMenuIsOpen] = useState<boolean>(false);
  const [editMaterialHolder, setEditMaterialHolder] = useState<TMaterial>(material);

  /**
   * Toda escrita é feita pelo índice original do material dentro do formulário,
   * de forma imutável, para que filtros e ordenações de exibição não interfiram.
   */
  function updateMaterialAtIndex(changes: Partial<TMaterial>) {
    setFormHolder((prev) => ({
      ...prev,
      materiais: prev.materiais.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item,
      ),
    }));
  }

  function handleTakeAwayChange(value: number) {
    updateMaterialAtIndex({ qtdeRetirada: value });
  }

  function handleDevolutionChange(value: number) {
    // Impedindo que a devolução ultrapasse o que foi efetivamente retirado
    const exceedsTakeAway = value > material.qtdeRetirada;
    if (exceedsTakeAway) toast.error("Quantidade de devolução não pode exceder a de retirada.");
    updateMaterialAtIndex({
      qtdeDevolucao: exceedsTakeAway ? material.qtdeRetirada : value,
    });
  }

  function handleUpdateMaterial(info: TMaterial) {
    if (!formularyId) return toast.error("Formulário não encontrado");
    if (info.qtdeRetirada < 0)
      return toast.error("Por favor, insira uma quantidade válida de retirada");
    if (info.qtdeDevolucao > info.qtdeRetirada)
      return toast.error("Quantidade devolvida não deve ultrapassar a retidada.");

    updateMaterialAtIndex(info);
    setEditMaterialMenuIsOpen(false);
    return toast.success("Material atualizado.");
  }

  function openEditMenu() {
    // Sincronizando o rascunho de edição com o valor mais recente do material
    setEditMaterialHolder(material);
    setEditMaterialMenuIsOpen(true);
  }

  const isFormularyFinished = !!formHolder.dataEfetivacao;
  const unit = material.grandeza || "UN";
  const canRemove = !isFormularyFinished;
  const canEdit = isFormularyFinished && allowPostFinishEditing;

  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          "hover:bg-muted/40 relative flex w-full flex-col gap-2 px-3 py-2.5 transition-colors",
          getMaterialRowGrid(showDevolutionColumn),
        )}
      >
        <div className="flex min-w-0 flex-col gap-0.5 pr-9 lg:pr-0">
          <h3 className="text-foreground truncate text-sm font-semibold" title={material.nome}>
            {material.nome}
          </h3>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3 min-h-3 w-3 min-w-3" />
              {unit}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <Hash className="h-3 min-h-3 w-3 min-w-3" />
              <span className="truncate">{material.id || "NÃO DEFINIDO"}</span>
            </span>
          </div>
        </div>

        <QuantityCell
          label="RETIRADO"
          value={material.qtdeRetirada}
          unit={unit}
          editable={!blockTakeAway && !isFormularyFinished}
          inputId={`qtde-retirada-${index}`}
          handleChange={handleTakeAwayChange}
        />

        {showDevolutionColumn ? (
          <QuantityCell
            label="DEVOLVIDO"
            value={material.qtdeDevolucao}
            unit={unit}
            editable={!blockDevolution && !isFormularyFinished}
            inputId={`qtde-devolucao-${index}`}
            handleChange={handleDevolutionChange}
          />
        ) : null}

        <div className="absolute top-2 right-2 flex items-center justify-end lg:static">
          {canRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMaterial({ id: material.id, index })}
              aria-label={`Remover ${material.nome} do formulário`}
              title="Remover material"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 min-h-4 w-4 min-w-4" />
            </Button>
          ) : null}
          {canEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                editMaterialMenuIsOpen ? setEditMaterialMenuIsOpen(false) : openEditMenu()
              }
              aria-label={`Editar quantidades de ${material.nome}`}
              aria-expanded={editMaterialMenuIsOpen}
              title="Editar quantidades"
              className={cn(
                "text-muted-foreground hover:text-primary h-8 w-8",
                editMaterialMenuIsOpen && "bg-primary/10 text-primary",
              )}
            >
              <Pencil className="h-4 min-h-4 w-4 min-w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {editMaterialMenuIsOpen ? (
        <div className="bg-muted/40 border-border flex w-full flex-col gap-2 border-t px-3 py-3">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="NOVO RETIRADO"
                placeholder="Preencha a nova quantidade retirada..."
                value={editMaterialHolder.qtdeRetirada}
                handleChange={(value) =>
                  setEditMaterialHolder((prev) => ({ ...prev, qtdeRetirada: value }))
                }
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="NOVO DEVOLVIDO"
                placeholder="Preencha a nova quantidade devolvida..."
                value={editMaterialHolder.qtdeDevolucao}
                handleChange={(value) => {
                  // Checking for the case where user puts a devolution value higher than the takeway
                  if (value > editMaterialHolder.qtdeRetirada) {
                    toast.error("Quantidade de devolução não pode exceder a de retirada.");
                    // Setting the devolution to the max value, which is the taken away qty
                    setEditMaterialHolder((prev) => ({
                      ...prev,
                      qtdeDevolucao: prev.qtdeRetirada,
                    }));
                  } else {
                    setEditMaterialHolder((prev) => ({ ...prev, qtdeDevolucao: value }));
                  }
                }}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-1">
            <Button
              type="button"
              onClick={() => setEditMaterialMenuIsOpen(false)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <X className="h-4 min-h-4 w-4 min-w-4" />
              CANCELAR
            </Button>
            <Button
              type="button"
              onClick={() => handleUpdateMaterial(editMaterialHolder)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Check className="h-4 min-h-4 w-4 min-w-4" />
              ATUALIZAR MATERIAL
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MaterialListItem;
