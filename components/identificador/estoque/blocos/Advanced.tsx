import SelectInputVirtualized from "@/components/inputs/SelectVirtualized";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { cn } from "@/lib/utils";
import { TMaterialDeletionDataOutput } from "@/pages/api/almoxarifado/materiais/exclusao";
import { getErrorMessage } from "@/utils/methods/handlers";
import { deleteMaterial } from "@/utils/methods/mutation/materials";
import { useMaterials } from "@/utils/methods/query/materials";
import { TMaterial } from "@/utils/schemas/materials";
import { useMutation } from "@tanstack/react-query";
import {
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  Combine,
  Settings,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type AdvancedProps = {
  materialId: string;
  material: TMaterial;
  deletionData: TMaterialDeletionDataOutput["data"];
  closeModal: () => void;
};

export default function Advanced({
  materialId,
  material,
  deletionData,
  closeModal,
}: AdvancedProps) {
  const [hardDeleteMenuIsOpen, setHardDeleteMenuIsOpen] = useState(false);
  const [softDeleteMenuIsOpen, setSoftDeleteMenuIsOpen] = useState(false);
  const [mergeMenuIsOpen, setMergeMenuIsOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-fit items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
        <Settings className="min-w-4 min-h-4 h-4 w-4" />
        <h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">
          AVANÇADO
        </h1>
      </div>
      <div className="flex w-full flex-col gap-1">
        <h3 className="text-sm font-medium">DEPENDÊNCIAS</h3>
        <h3 className="text-xs font-medium tracking-tight">
          Compras: {deletionData.dependencias?.compras || 0}
        </h3>
        <h3 className="text-xs font-medium tracking-tight">
          Formulários: {deletionData.dependencias?.formularios || 0}
        </h3>
        <h3 className="text-xs font-medium tracking-tight">
          Análises Técnicas: {deletionData.dependencias?.analisesTecnicas || 0}
        </h3>
        <h3 className="text-xs font-medium tracking-tight">
          Projetos: {deletionData.dependencias?.projetos || 0}
        </h3>
      </div>
      {deletionData.tiposExclusaoHabilitados.includes("hard-delete") ? (
        <div className="flex w-full flex-col gap-1 rounded-lg border border-red-500/20 bg-red-500/20 px-4 py-1.5">
          <div className="flex w-full items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Deseja excluir todos os registros do material?</h3>
            <Button
              variant="link"
              size="fit"
              className="text-xs"
              onClick={() => setHardDeleteMenuIsOpen(true)}
            >
              EXCLUIR
            </Button>
          </div>
          <h3 className="text-xs tracking-tight">
            Esse procedimento excluirá todos os registros do material, incluindo os registros de
            estoque, relatórios e afins. Essa ação pode causar danos à integridade de dados (como
            compras, projetos, etc.).
          </h3>
        </div>
      ) : null}
      {deletionData.tiposExclusaoHabilitados.includes("soft-delete") ? (
        <div className="flex w-full flex-col gap-1 rounded-lg border border-yellow-500/20 bg-yellow-500/20 px-4 py-1.5">
          <div className="flex w-full items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Deseja inativar o material?</h3>
            <Button
              variant="link"
              size="fit"
              className="text-xs"
              onClick={() => setSoftDeleteMenuIsOpen(true)}
            >
              INATIVAR
            </Button>
          </div>
          <h3 className="text-xs tracking-tight">
            Esse procedimento inativaria o material, removendo do estoque, dos relatórios e afins,
            mas manteria o registro ativo para integridade de dados e consultas futuras.
          </h3>
        </div>
      ) : null}
      {deletionData.tiposExclusaoHabilitados.includes("merge") ? (
        <div className="flex w-full flex-col gap-1 rounded-lg border border-border bg-primary/20 px-4 py-1.5">
          <div className="flex w-full items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Deseja mesclar o material com outro?</h3>
            <Button
              variant="link"
              size="fit"
              className="text-xs"
              onClick={() => setMergeMenuIsOpen(true)}
            >
              MESCLAR
            </Button>
          </div>
          <h3 className="text-xs tracking-tight">
            Esse procedimento mesclará o material com outro, transferindo os registros dependentes
            para o material escolhido.
          </h3>
        </div>
      ) : null}
      {hardDeleteMenuIsOpen ? (
        <HardDeleteMenu
          materialId={materialId}
          material={material}
          closeMenu={() => setHardDeleteMenuIsOpen(false)}
          closeModal={closeModal}
        />
      ) : null}
      {mergeMenuIsOpen ? (
        <MergeMenu
          materialId={materialId}
          material={material}
          closeMenu={() => setMergeMenuIsOpen(false)}
          closeModal={closeModal}
        />
      ) : null}
      {softDeleteMenuIsOpen ? (
        <SoftDeleteMenu
          materialId={materialId}
          material={material}
          closeMenu={() => setSoftDeleteMenuIsOpen(false)}
          closeModal={closeModal}
        />
      ) : null}
    </div>
  );
}

type HardDeleteMenuProps = {
  materialId: string;
  material: TMaterial;
  closeMenu: () => void;
  closeModal: () => void;
};
function HardDeleteMenu({ materialId, material, closeMenu, closeModal }: HardDeleteMenuProps) {
  const { mutate: softDeleteMaterial, isPending } = useMutation({
    mutationKey: ["hard-delete-material", materialId],
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteMaterial({ id, type: "hard-delete" });
    },
    onSuccess: () => {
      closeModal();
      toast.success("Material excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <AlertDialog open={true} onOpenChange={closeMenu}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja excluir o material?</AlertDialogTitle>
          <AlertDialogDescription>
            Esse procedimento excluirá o material, removendo do estoque, dos relatórios e afins, e
            não poderá ser recuperado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>CANCELAR</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            onClick={() => softDeleteMaterial({ id: materialId })}
            loading={isPending}
          >
            EXCLUIR
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
type SoftDeleteMenuProps = {
  materialId: string;
  material: TMaterial;
  closeMenu: () => void;
  closeModal: () => void;
};
function SoftDeleteMenu({ materialId, material, closeMenu, closeModal }: SoftDeleteMenuProps) {
  const { mutate: softDeleteMaterial, isPending } = useMutation({
    mutationKey: ["soft-delete-material", materialId],
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteMaterial({ id, type: "soft-delete" });
    },
    onSuccess: () => {
      closeModal();
      toast.success("Material inativado com sucesso!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <AlertDialog open={true} onOpenChange={closeMenu}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja inativar o material?</AlertDialogTitle>
          <AlertDialogDescription>
            Esse procedimento inativaria o material, removendo do estoque, dos relatórios e afins,
            mas manteria o registro ativo para integridade de dados e consultas futuras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>CANCELAR</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            onClick={() => softDeleteMaterial({ id: materialId })}
            loading={isPending}
          >
            INATIVAR
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type MergeMenuProps = {
  materialId: string;
  material: TMaterial;
  closeMenu: () => void;
  closeModal: () => void;
};

function MergeMenu({ materialId, material, closeMenu, closeModal }: MergeMenuProps) {
  const {
    data: materials,
    isLoading: materialsLoading,
    isFetching: materialsFetching,
  } = useMaterials();
  const [mergeMethod, setMergeMethod] = useState<{
    mergeIntoId: string | null;
    mergeMethod: "combine" | "replace-target-with-origin" | "keep-target";
  }>({
    mergeIntoId: null,
    mergeMethod: "combine",
  });

  const { mutate: mergeMaterial, isPending } = useMutation({
    mutationKey: ["merge-material", materialId],
    mutationFn: async ({
      originId,
      targetId,
      mergeMethod,
    }: {
      originId: string;
      targetId: string | null;
      mergeMethod: "combine" | "replace-target-with-origin" | "keep-target";
    }) => {
      if (!targetId) throw new Error("Defina um material para mesclar.");
      console.log({ originId, targetId, mergeMethod });
      return await deleteMaterial({
        id: originId,
        type: "merge",
        mergeIntoId: targetId,
        mergeMethod,
      });
    },
    onSuccess: () => {
      toast.success("Material mesclado com sucesso!");
      closeModal();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <AlertDialog open={true} onOpenChange={closeMenu}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja inativar o material?</AlertDialogTitle>
          <AlertDialogDescription>
            Esse procedimento inativaria o material, removendo do estoque, dos relatórios e afins,
            mas manteria o registro ativo para integridade de dados e consultas futuras.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <SelectInputVirtualized
          label="MATERIAL PARA MESCLAR"
          options={
            materials?.map((material) => ({
              id: material._id,
              label: `${material.nome} (${material.qtde} ${material.grandeza || "UN"}`,
              value: material._id,
            })) || []
          }
          value={mergeMethod.mergeIntoId}
          handleChange={(value) => {
            setMergeMethod((prev) => ({ ...prev, mergeIntoId: value }));
          }}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setMergeMethod((prev) => ({ ...prev, mergeIntoId: null }))}
          width="100%"
        />
        <div className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">MÉTODO DE MESCLAGEM</h1>
          <div className="flex w-full flex-col items-center gap-2">
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-1 rounded-lg border px-3 py-1 transition-all duration-300",
                mergeMethod.mergeMethod === "combine"
                  ? "border-cyan-800 bg-cyan-100 text-cyan-800"
                  : "border-border text-foreground",
              )}
              onClick={() => setMergeMethod((prev) => ({ ...prev, mergeMethod: "combine" }))}
            >
              <Combine className="h-3 w-3" />
              <h3 className="text-xs font-medium">COMBINAR DADOS</h3>
            </button>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-1 rounded-lg border px-3 py-1 transition-all duration-300",
                mergeMethod.mergeMethod === "replace-target-with-origin"
                  ? "border-cyan-800 bg-cyan-100 text-cyan-800"
                  : "border-border text-foreground",
              )}
              onClick={() =>
                setMergeMethod((prev) => ({ ...prev, mergeMethod: "replace-target-with-origin" }))
              }
            >
              <AlignHorizontalJustifyStart className="h-3 w-3" />
              <h3 className="text-xs font-medium">USAR DADOS DA ORIGEM</h3>
            </button>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-1 rounded-lg border px-3 py-1 transition-all duration-300",
                mergeMethod.mergeMethod === "keep-target"
                  ? "border-cyan-800 bg-cyan-100 text-cyan-800"
                  : "border-border text-foreground",
              )}
              onClick={() => setMergeMethod((prev) => ({ ...prev, mergeMethod: "keep-target" }))}
            >
              <AlignHorizontalJustifyEnd className="h-3 w-3" />
              <h3 className="text-xs font-medium">MANTER DADOS DO DESTINO</h3>
            </button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>CANCELAR</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            onClick={() =>
              mergeMaterial({
                originId: materialId,
                targetId: mergeMethod.mergeIntoId,
                mergeMethod: mergeMethod.mergeMethod,
              })
            }
            loading={isPending}
          >
            MESCLAR
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
