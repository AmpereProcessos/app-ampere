import NumberInput from "@/components/inputs/Number";
import { Button } from "@/components/ui/button";
import { isEmpty } from "@/utils/methods/shared";
import type { TTransactionalWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCode } from "react-icons/bs";
import { TbRulerMeasure } from "react-icons/tb";

type MaterialListItem = {
  formularyId?: string;
  material: TTransactionalWarehouseFormulary["materiais"][number];
  index: number;
  removeMaterial: ({ id, index }: { id?: string | null; index: number }) => void;
  formHolder: TTransactionalWarehouseFormulary;
  setFormHolder: React.Dispatch<React.SetStateAction<TTransactionalWarehouseFormulary>>;
  blockTakeAway: boolean;
  blockDevolution: boolean;
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
  allowPostFinishEditing = false,
}: MaterialListItem) {
  const queryClient = useQueryClient();

  const [editMaterialMenuIsOpen, setEditMaterialMenuIsOpen] = useState<boolean>(false);
  const [editMaterialHolder, setEditMaterialHolder] = useState(material);

  async function handleUpdateMaterial(info: TTransactionalWarehouseFormulary["materiais"][number]) {
    if (!formularyId) return toast.error("Formulário não encontrado");
    if (info.qtdeRetirada < 0)
      return toast.error("Por favor, insira uma quantidade válida de retirada");
    if (info.qtdeDevolucao > info.qtdeRetirada)
      return toast.error("Quantidade devolvida não deve ultrapassar a retidada.");

    // Getting the difference for the material take away and devolution in the post finish formulary
    const diffBeforeEditing = material.qtdeRetirada - material.qtdeDevolucao;
    // Getting the difference for the information edited
    const diffAfterEditing = info.qtdeRetirada - info.qtdeDevolucao;
    // Getting the final difference considering the values defined after editing and the origin values
    const diffFinal = diffAfterEditing - diffBeforeEditing;

    const materialsList = [...formHolder.materiais];
    materialsList[index] = info;

    setFormHolder((prev) => ({ ...prev, materiais: materialsList }));
  }

  const isFormularyFinished = !!formHolder.dataEfetivacao;
  return (
    <div className="flex w-full flex-col">
      <div className="border-border flex w-full flex-col items-center justify-between gap-1 rounded border p-2 lg:flex-row">
        <div className="flex w-full flex-row gap-1 lg:w-[40%] lg:flex-col lg:gap-0">
          <h1 className="text-primary text-sm font-bold">{material.nome}</h1>
          <div className="flex items-center gap-1">
            <TbRulerMeasure />
            <p className="text-foreground text-xs italic">{material.grandeza}</p>
            <BsCode />
            <p className="text-foreground text-xs italic">#{material.id || "NÃO DEFIDO"}</p>
            {!isFormularyFinished ? (
              <button
                type="button"
                onClick={() => removeMaterial({ id: material.id, index })}
                className="text-xxs rounded-lg border border-red-600 bg-red-100 p-1 text-center font-bold text-red-600"
              >
                EXCLUIR
              </button>
            ) : null}
            {isFormularyFinished && allowPostFinishEditing ? (
              <button
                type="button"
                onClick={() => setEditMaterialMenuIsOpen(true)}
                className="text-xxs rounded-lg border border-orange-600 bg-orange-100 p-1 text-center font-bold text-orange-600"
              >
                EDITAR
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex w-full items-center gap-1 lg:w-[60%]">
          <div className="w-[50%]">
            <input
              disabled={blockTakeAway || isFormularyFinished}
              value={!isEmpty(material.qtdeRetirada) ? material.qtdeRetirada?.toString() : ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                const materialsList = [...formHolder.materiais];
                materialsList[index].qtdeRetirada = value;
                setFormHolder((prev) => ({ ...prev, materiais: materialsList }));
              }}
              min={0}
              id={"qtdeRetirada"}
              type="number"
              className="border-border h-full w-full rounded-md border p-3 text-xs outline-hidden placeholder:italic disabled:bg-primary/80 disabled:text-primary-foreground"
            />
          </div>
          <div className="w-[50%]">
            <input
              disabled={blockDevolution || isFormularyFinished}
              value={!isEmpty(material.qtdeDevolucao) ? material.qtdeDevolucao?.toString() : ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                const materialsList = [...formHolder.materiais];

                // Checking for the case where user puts a devolution value higher than the takeway
                if (value > materialsList[index].qtdeRetirada) {
                  toast.error("Quantidade de devolução não pode exceder a de retirada.");
                  // Setting the devolution to the max value, which is the taken away qty
                  materialsList[index].qtdeDevolucao = materialsList[index].qtdeRetirada;
                } else {
                  materialsList[index].qtdeDevolucao = value;
                }

                setFormHolder((prev) => ({ ...prev, materiais: materialsList }));
              }}
              min={0}
              id={"qtdeDevolucao"}
              type="number"
              className="border-border h-full w-full rounded-md border p-3 text-xs outline-hidden placeholder:italic disabled:bg-primary/80 disabled:text-primary-foreground"
            />
          </div>
        </div>
      </div>
      {editMaterialMenuIsOpen ? (
        <div className="mt-1 flex w-full flex-col gap-1">
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
          <div className="flex w-full items-center justify-end">
            <Button
              onClick={() => handleUpdateMaterial(editMaterialHolder)}
              variant={"ghost"}
              size={"sm"}
            >
              ATUALIZAR MATERIAL
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MaterialListItem;
