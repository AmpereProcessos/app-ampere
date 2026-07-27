import NumberInput from "@/components/inputs/Number";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMaterials } from "@/utils/methods/query/materials";
import type { TTransactionalWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import type React from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import MaterialListItem, { getMaterialRowGrid } from "./MaterialListItem";

import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Package,
  PackageOpen,
  Plus,
  Search,
  X,
} from "lucide-react";

type TMaterial = TTransactionalWarehouseFormulary["materiais"][number];
/**
 * Cada material é sempre carregado junto do seu índice original dentro do formulário.
 * Filtros e ordenações atuam apenas sobre a exibição, então remoções e atualizações
 * continuam escrevendo na posição correta do array original.
 */
type TMaterialEntry = { material: TMaterial; index: number };

type TStatusFilter = "TODOS" | "A_DEVOLVER" | "DEVOLVIDOS";
const STATUS_FILTERS: { value: TStatusFilter; label: string }[] = [
  { value: "TODOS", label: "TODOS" },
  { value: "A_DEVOLVER", label: "A DEVOLVER" },
  { value: "DEVOLVIDOS", label: "DEVOLVIDOS" },
];

type TSortKey = "nome" | "qtdeRetirada" | "qtdeDevolucao";
type TSort = { key: TSortKey; direction: "asc" | "desc" };

// A partir dessa quantidade de itens a busca deixa de ser ruído e passa a economizar tempo
const FILTERS_VISIBILITY_THRESHOLD = 5;

/** Saldo que ainda está fora do estoque, ou seja, o que resta devolver. */
function getPendingQuantity(material: TMaterial) {
  return material.qtdeRetirada - material.qtdeDevolucao;
}

type SortableHeaderProps = {
  label: string;
  sortKey: TSortKey;
  sort: TSort | null;
  onSort: (key: TSortKey) => void;
  className?: string;
};
function SortableHeader({ label, sortKey, sort, onSort, className }: SortableHeaderProps) {
  const isActive = sort?.key === sortKey;
  const sortStateLabel = isActive
    ? sort?.direction === "asc"
      ? " (ordenado de forma crescente)"
      : " (ordenado de forma decrescente)"
    : "";
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      aria-label={`Ordenar por ${label}${sortStateLabel}`}
      className={cn(
        "focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-sm text-xs font-medium tracking-wide outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-offset-1",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {label}
      {isActive ? (
        sort?.direction === "asc" ? (
          <ArrowUp className="h-3 min-h-3 w-3 min-w-3" />
        ) : (
          <ArrowDown className="h-3 min-h-3 w-3 min-w-3" />
        )
      ) : (
        <ChevronsUpDown className="h-3 min-h-3 w-3 min-w-3 opacity-50" />
      )}
    </button>
  );
}

type MaterialsBlockProps = {
  formularyId?: string;
  formHolder: TTransactionalWarehouseFormulary;
  setFormHolder: React.Dispatch<React.SetStateAction<TTransactionalWarehouseFormulary>>;
  blockTakeAway?: boolean;
  blockDevolution?: boolean;
  allowPostFinishEditing?: boolean;
};
function MaterialsBlock({
  formularyId,
  formHolder,
  setFormHolder,
  blockTakeAway = false,
  blockDevolution = true,
  allowPostFinishEditing = false,
}: MaterialsBlockProps) {
  const { data: materials } = useMaterials();
  const [materialHolder, setMaterialHolder] = useState<{ id: string | null; qtde: number | null }>({
    id: null,
    qtde: null,
  });
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TStatusFilter>("TODOS");
  const [sort, setSort] = useState<TSort | null>(null);

  function addMaterial({ id, qtde }: { id: string; qtde: number }) {
    // Checking for positive numbers only
    if (qtde <= 0) return toast.error("Por favor, preencha uma quantidade válida de retirada.");
    // Getting the equivalent material based on the id selected
    const equivalent = materials?.find((client) => client._id === id);
    if (!equivalent) return;
    const { nome, preco, grandeza, qtde: currentQty } = equivalent;
    // Validating if choosen qty exceeds the qty in stock
    if (qtde > currentQty)
      return toast.error(`Quantidade excede o estoque atual contabilizado de ${currentQty}`);

    // If validations were passed, handling the addition of the material to list
    setFormHolder((prev) => {
      const materialInListIndex = prev.materiais.findIndex((item) => !!item.id && item.id === id);
      // In case it isnt in the list, pushing it to the list holder
      if (materialInListIndex === -1)
        return {
          ...prev,
          materiais: [
            ...prev.materiais,
            {
              id,
              nome,
              preco,
              grandeza: grandeza || "UN",
              qtdeRetirada: qtde,
              qtdeDevolucao: 0,
            },
          ],
        };
      // Otherwise, accumulating the quantity in the material already listed
      return {
        ...prev,
        materiais: prev.materiais.map((item, itemIndex) =>
          itemIndex === materialInListIndex
            ? { ...item, qtdeRetirada: item.qtdeRetirada + qtde }
            : item,
        ),
      };
    });

    setMaterialHolder({ id: null, qtde: null });
    return toast.success(`Material ${nome} adicionado com sucesso`);
  }

  function removeMaterial({ index }: { id?: string | null; index: number }) {
    // Removendo pelo índice original do material no formulário
    return setFormHolder((prev) => ({
      ...prev,
      materiais: prev.materiais.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleSort(key: TSortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("TODOS");
  }

  const visibleEntries = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    let entries: TMaterialEntry[] = formHolder.materiais.map((material, index) => ({
      material,
      index,
    }));

    if (searchTerm)
      entries = entries.filter(({ material }) =>
        [material.nome, material.id, material.grandeza].some((field) =>
          field?.toString().toLowerCase().includes(searchTerm),
        ),
      );

    // "A devolver" = ainda há saldo fora do estoque; "devolvidos" = nada resta devolver
    if (statusFilter === "A_DEVOLVER")
      entries = entries.filter(({ material }) => getPendingQuantity(material) > 0);
    if (statusFilter === "DEVOLVIDOS")
      entries = entries.filter(({ material }) => getPendingQuantity(material) <= 0);

    if (sort) {
      const orientation = sort.direction === "asc" ? 1 : -1;
      entries = [...entries].sort((a, b) => {
        if (sort.key === "nome")
          return a.material.nome.localeCompare(b.material.nome, "pt-BR") * orientation;
        return (a.material[sort.key] - b.material[sort.key]) * orientation;
      });
    }

    return entries;
  }, [formHolder.materiais, search, statusFilter, sort]);

  const totals = useMemo(
    () =>
      visibleEntries.reduce(
        (acc, { material }) => ({
          retirado: acc.retirado + material.qtdeRetirada,
          devolvido: acc.devolvido + material.qtdeDevolucao,
        }),
        { retirado: 0, devolvido: 0 },
      ),
    [visibleEntries],
  );

  const isFormularyFinished = !!formHolder.dataEfetivacao;
  const totalMaterials = formHolder.materiais.length;
  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "TODOS";
  const showFilters = totalMaterials >= FILTERS_VISIBILITY_THRESHOLD || hasActiveFilters;
  // Na criação do formulário a devolução é sempre zero, então a coluna só polui a leitura
  const showDevolutionColumn =
    !blockDevolution || formHolder.materiais.some((material) => material.qtdeDevolucao > 0);
  const rowGrid = getMaterialRowGrid(showDevolutionColumn);
  const canAddMaterial = !!materialHolder.id && !!materialHolder.qtde && materialHolder.qtde > 0;

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="MATERIAIS"
      sectionTitleIcon={<Package className="h-4 min-h-4 w-4 min-w-4" />}
    >
      {!isFormularyFinished ? (
        <div className="border-border bg-card flex w-full flex-col gap-1 rounded-lg border p-2">
          <h4 className="text-muted-foreground text-xs font-medium tracking-wide">
            MENU DE NOVOS MATERIAIS
          </h4>
          <div className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center">
            <div className="w-full lg:w-3/4">
              <SelectVirtualizedInput
                label="MATERIAL"
                options={
                  materials?.map((material) => ({
                    id: material._id,
                    label: `${material.nome} (${material.qtde} ${material.grandeza || "UN"} restantes)`,
                    value: material._id,
                  })) || []
                }
                value={materialHolder.id}
                handleChange={(value) => {
                  setMaterialHolder((prev) => ({ ...prev, id: value }));
                }}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setMaterialHolder({ id: null, qtde: null })}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/4">
              <NumberInput
                label="QUANTIDADE"
                placeholder="Preencha aqui a quantidade de saída..."
                value={materialHolder.qtde}
                handleChange={(value) => setMaterialHolder((prev) => ({ ...prev, qtde: value }))}
                width="100%"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={!canAddMaterial}
              onClick={() => {
                if (!materialHolder.id || !materialHolder.qtde)
                  return toast.error("Selecione um material e uma quantidade válida.");
                addMaterial({ id: materialHolder.id, qtde: materialHolder.qtde });
              }}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 min-h-4 w-4 min-w-4" />
              ADICIONAR MATERIAL
            </Button>
          </div>
        </div>
      ) : null}

      {totalMaterials === 0 ? (
        <div className="border-border text-muted-foreground flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <PackageOpen className="h-6 min-h-6 w-6 min-w-6 opacity-60" />
          <p className="text-sm font-medium">Nenhum material adicionado ainda.</p>
          {!isFormularyFinished ? (
            <p className="text-xs">
              Use o menu acima para selecionar um material do estoque e a quantidade de saída.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          {showFilters ? (
            <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 min-h-4 w-4 min-w-4 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, unidade ou código..."
                  aria-label="Buscar materiais do formulário"
                  className="h-9 pr-9 pl-9"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Limpar busca"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md outline-hidden transition-colors focus-visible:ring-2"
                  >
                    <X className="h-3.5 min-h-3.5 w-3.5 min-w-3.5" />
                  </button>
                ) : null}
              </div>

              {showDevolutionColumn ? (
                <div className="border-border bg-muted/40 flex w-fit items-center gap-0.5 rounded-md border p-0.5">
                  {STATUS_FILTERS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatusFilter(option.value)}
                      aria-pressed={statusFilter === option.value}
                      className={cn(
                        "focus-visible:ring-ring rounded-[5px] px-2.5 py-1 text-xs font-medium outline-hidden transition-colors focus-visible:ring-2",
                        statusFilter === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="border-border bg-card w-full overflow-hidden rounded-lg border">
            <div className={cn("bg-muted/50 border-border hidden border-b px-3 py-2", rowGrid)}>
              <SortableHeader label="MATERIAL" sortKey="nome" sort={sort} onSort={handleSort} />
              <SortableHeader
                label="RETIRADO"
                sortKey="qtdeRetirada"
                sort={sort}
                onSort={handleSort}
                className="w-full justify-end pr-2"
              />
              {showDevolutionColumn ? (
                <SortableHeader
                  label="DEVOLVIDO"
                  sortKey="qtdeDevolucao"
                  sort={sort}
                  onSort={handleSort}
                  className="w-full justify-end pr-2"
                />
              ) : null}
              <span className="sr-only">AÇÕES</span>
            </div>

            {visibleEntries.length > 0 ? (
              <div className="divide-border flex w-full flex-col divide-y">
                {visibleEntries.map(({ material, index }) => (
                  <MaterialListItem
                    key={material.id ?? `sem-id-${index}`}
                    formularyId={formularyId}
                    allowPostFinishEditing={allowPostFinishEditing}
                    material={material}
                    index={index}
                    removeMaterial={removeMaterial}
                    formHolder={formHolder}
                    setFormHolder={setFormHolder}
                    blockTakeAway={blockTakeAway}
                    blockDevolution={blockDevolution}
                    showDevolutionColumn={showDevolutionColumn}
                  />
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground flex w-full flex-col items-center gap-2 px-4 py-8 text-center">
                <Search className="h-5 min-h-5 w-5 min-w-5 opacity-60" />
                <p className="text-sm font-medium">Nenhum material corresponde aos filtros.</p>
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  LIMPAR FILTROS
                </Button>
              </div>
            )}

            {visibleEntries.length > 0 ? (
              <div
                className={cn(
                  "bg-muted/50 border-border text-muted-foreground border-t px-3 py-2 text-xs",
                  rowGrid,
                )}
              >
                <p className="font-medium">
                  {hasActiveFilters
                    ? `${visibleEntries.length} de ${totalMaterials} materiais`
                    : `${totalMaterials} ${totalMaterials === 1 ? "material" : "materiais"}`}
                </p>
                <p className="text-foreground hidden px-2 text-right font-semibold tabular-nums lg:block">
                  {totals.retirado}
                </p>
                {showDevolutionColumn ? (
                  <p className="text-foreground hidden px-2 text-right font-semibold tabular-nums lg:block">
                    {totals.devolvido}
                  </p>
                ) : null}
                <span />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </ResponsiveDialogDrawerSection>
  );
}

export default MaterialsBlock;
