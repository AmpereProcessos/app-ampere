import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdDelete, MdEdit } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { FaDollarSign } from "react-icons/fa";
import SelectInput from "@/components/inputs/Select";
import { PurchaseCompositionItemCategories, units } from "@/utils/select-options";
import NumberInput from "@/components/inputs/Number";
import type { TPurchaseControl, TPurchaseControlWithProjectDTO } from "@/utils/schemas/purchases";
import {
  renderIconWithClassNames,
  renderProductCategoryIcon,
  renderUnitLabel,
} from "@/utils/methods/rendering";
import { formatToMoney, GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import { LoaderCircle, Package, PackageCheck, RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { syncPurchaseStockEntry } from "@/utils/methods/mutation/purchase-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type PurchaseControlCompositionTableProps = {
  purchaseControlId: string;
  showStockEntries: boolean;
  composition: TPurchaseControlWithProjectDTO["composicao"];
  updateCompositionItem: (info: {
    index: number;
    item: Partial<TPurchaseControl["composicao"][number]>;
  }) => void;
  removeCompositionItem: (info: number) => void;
};

function PurchaseControlCompositionTable({
  purchaseControlId,
  showStockEntries,
  composition,
  updateCompositionItem,
  removeCompositionItem,
}: PurchaseControlCompositionTableProps) {
  return (
    <div className="border-primary/80 flex w-full flex-col rounded border-0 lg:border">
      <div className="bg-primary/80 hidden w-full items-center gap-2 rounded rounded-br-none rounded-bl-none p-1 lg:flex">
        <h1 className="w-[30%] text-center text-sm font-bold text-white">ITEM</h1>
        <h1 className="w-[15%] text-center text-sm font-bold text-white">UNIDADE</h1>
        <h1 className="w-[15%] text-center text-sm font-bold text-white">QTDE</h1>
        <h1 className="w-[20%] text-center text-sm font-bold text-white">VALOR</h1>
        <h1 className="w-[20%] text-center text-sm font-bold text-white">TOTAL</h1>
      </div>
      <div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
        {composition.length > 0 ? (
          composition.map((item, index) => (
            <PurchaseControlCompositionTableItem
              key={`${item.materialId}-${index}`}
              purchaseControlId={purchaseControlId}
              showStockEntries={showStockEntries}
              item={{ ...item }}
              handleUpdate={(item) => updateCompositionItem({ item, index })}
              handleRemove={() => removeCompositionItem(index)}
            />
          ))
        ) : (
          <p className="text-foreground w-full text-center text-sm font-medium tracking-tight">
            Não há itens de composição da compra.
          </p>
        )}
      </div>
    </div>
  );
}

export default PurchaseControlCompositionTable;

type PurchaseControlCompositionTableItemProps = {
  purchaseControlId: string;
  showStockEntries: boolean;
  item: TPurchaseControlWithProjectDTO["composicao"][number];
  handleUpdate: (item: TPurchaseControl["composicao"][number]) => void;
  handleRemove: () => void;
};
function PurchaseControlCompositionTableItem({
  purchaseControlId,
  showStockEntries,
  item,
  handleUpdate,
  handleRemove,
}: PurchaseControlCompositionTableItemProps) {
  const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
  const [itemHolder, setItemHolder] = useState<TPurchaseControl["composicao"][number]>(item);
  const stockEntries = item.entradasEstoque || [];
  return (
    <>
      <AnimatePresence>
        <div className="bg-background hidden w-full flex-col gap-1 lg:flex dark:bg-[#121212]">
          <div className="flex w-full items-center gap-2 p-1">
            <div className="flex w-[30%] items-center gap-1">
              {item.materialImagemUrl ? (
                <a
                  href={item.materialImagemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-8 min-h-8 w-8 min-w-8"
                  aria-label={`Abrir imagem de ${item.descricao} em nova aba`}
                >
                  <Image
                    src={item.materialImagemUrl}
                    alt={item.descricao}
                    fill
                    className="rounded-lg object-cover"
                  />
                </a>
              ) : (
                <div className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-primary/80 text-primary-foreground">
                  <Package className="h-4 w-4" />
                </div>
              )}

              <div className="flex flex-col">
                <h1 className="text-xs tracking-tight">{item.descricao}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-foreground text-[0.65rem] leading-none tracking-tight italic">
                    {item.categoria}
                  </p>
                  {item.qtdeFaturamento && item.valorFaturamento && item.unidadeFaturamento ? (
                    <p className="text-foreground text-[0.65rem] leading-none tracking-tight italic">
                      FATURAMENTO: {item.qtdeFaturamento} {item.unidadeFaturamento} x{" "}
                      {formatToMoney(item.valorFaturamento)}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditMenuIsOpen((prev) => !prev)}
                className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
              >
                <MdEdit size={10} />
              </button>
              <button
                type="button"
                onClick={() => handleRemove()}
                className="flex items-center justify-center rounded border border-red-500 bg-red-50 p-1 text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
              >
                <MdDelete size={10} />
              </button>
              {showStockEntries && (stockEntries.length > 0 || item.dataAlocacao) ? (
                <StockEntriesIndicator purchaseControlId={purchaseControlId} item={item} />
              ) : null}
            </div>
            <h1 className="w-[15%] text-center text-xs tracking-tight">{item.unidade}</h1>
            <h1 className="w-[15%] text-center text-xs tracking-tight">{item.qtde}</h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">
              {item.valor ? formatToMoney(item.valor) : "-"}
            </h1>
            <h1 className="w-[20%] text-center text-xs tracking-tight">
              {item.valor ? formatToMoney(item.qtde * item.valor) : "-"}
            </h1>
          </div>
        </div>
        <div className="border-primary bg-background flex w-full flex-col rounded-md border p-2 lg:hidden dark:bg-[#121212]">
          <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div className="flex h-[20x] w-[20x] items-center justify-center rounded-full border border-black p-1 text-[15px]">
                  {renderProductCategoryIcon(item.categoria, 15)}
                </div>
                <p className="text-xs leading-none font-bold tracking-tight lg:text-sm">
                  <strong className="text-[#FF9B50]">{item.qtde}</strong> x {item.descricao}
                </p>
              </div>
              {item.valor > 0 ? (
                <div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
                  <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">
                    {formatToMoney(item.qtde * item.valor)}
                  </h1>
                </div>
              ) : null}
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <TbRulerMeasure />
                  <p className="text-foreground text-[0.6rem] italic lg:text-xs">
                    {renderUnitLabel(item.unidade)}
                  </p>
                </div>
                {item.valor > 0 ? (
                  <div className="flex items-center gap-1">
                    <FaDollarSign />
                    <p className="text-foreground text-[0.6rem] italic lg:text-xs">
                      {formatToMoney(item.valor)}/{item.unidade}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {showStockEntries && (stockEntries.length > 0 || item.dataAlocacao) ? (
                  <StockEntriesIndicator purchaseControlId={purchaseControlId} item={item} />
                ) : null}
                <button
                  onClick={() => setEditMenuIsOpen((prev) => !prev)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-orange-200"
                >
                  <MdEdit style={{ color: "orange" }} size={15} />
                </button>
                <button
                  onClick={() => handleRemove()}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: "red" }} size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {editMenuIsOpen ? (
          <motion.div
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-full flex-col gap-3 p-3"
          >
            <MaterialSelector
              initialMaterialState={{
                materialId: itemHolder.materialId || null,
                materialName: itemHolder.descricao,
              }}
              vinculateMaterial={(m) =>
                setItemHolder((prev) => ({
                  ...prev,
                  materialId: m._id,
                  descricao: m.nome,
                  materialImagemUrl: m.imagemUrl,
                  unidade: m.grandeza || "UN",
                }))
              }
              unvinculateMaterial={() =>
                setItemHolder((prev) => ({
                  ...prev,
                  materialId: null,
                  descricao: "",
                  materialImagemUrl: null,
                  unidade: "UN",
                  categoria: "INSUMO",
                  valor: 0,
                  qtde: 0,
                }))
              }
            />
            <div className="flex w-full flex-wrap items-center justify-center gap-2">
              {PurchaseCompositionItemCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={cn(
                    "flex h-14 w-20 flex-col items-center justify-center rounded-lg border border-cyan-500 p-2 text-cyan-500",
                    {
                      "bg-cyan-500 text-white": itemHolder.categoria === category.value,
                      "bg-transparent text-cyan-500": itemHolder.categoria !== category.value,
                    },
                  )}
                  onClick={() =>
                    setItemHolder((prev) => ({
                      ...prev,
                      categoria: category.value as
                        | "MÓDULO"
                        | "INVERSOR"
                        | "INSUMO"
                        | "ESTRUTURA"
                        | "PADRÃO"
                        | "OUTROS",
                    }))
                  }
                >
                  {renderIconWithClassNames(category.icon, "w-5 h-5")}
                  <p className="text-[0.65rem] font-medium">{category.label}</p>
                </button>
              ))}
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label="UNIDADE DE FATURAMENTO"
                  selectedItemLabel="NÃO DEFINIDO"
                  options={units}
                  value={itemHolder.unidadeFaturamento}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({ ...prev, unidadeFaturamento: value }))
                  }
                  onReset={() => {
                    setItemHolder((prev) => ({
                      ...prev,
                      unidadeFaturamento: null,
                    }));
                  }}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label="QUANTIDADE DE FATURAMENTO"
                  value={itemHolder.qtdeFaturamento || null}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      qtdeFaturamento: value,
                      qtde: value * (itemHolder.fatorConversao || 1),
                    }))
                  }
                  placeholder="Preencha aqui a quantidade de faturamento."
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label="VALOR DE FATURAMENTO"
                  value={itemHolder.valorFaturamento || null}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      valorFaturamento: value,
                      valor: value / (itemHolder.fatorConversao || 1),
                    }))
                  }
                  placeholder="Preencha aqui o valor de faturamento."
                  width="100%"
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <NumberInput
                label="FATOR DE CONVERSÃO"
                value={itemHolder.fatorConversao || null}
                handleChange={(value) =>
                  setItemHolder((prev) => ({
                    ...prev,
                    fatorConversao: value,
                    qtde: value * (prev.qtdeFaturamento || 1),
                    valor: (prev.valorFaturamento || 1) / value,
                  }))
                }
                placeholder="Preencha aqui o fator de conversão."
                labelClassName="text-[0.6rem]"
                holderClassName="text-xs p-2 min-h-[34px]"
                width="100%"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label="UNIDADE"
                  selectedItemLabel="NÃO DEFINIDO"
                  options={units}
                  value={itemHolder.unidade}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      unidade: value,
                    }))
                  }
                  onReset={() => {
                    setItemHolder((prev) => ({
                      ...prev,
                      unidade: "UN",
                    }));
                  }}
                  editable={false}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  value={itemHolder.qtde}
                  handleChange={(value) =>
                    setItemHolder((prev) => ({
                      ...prev,
                      qtde: value,
                      fatorConversao: value / (prev.qtdeFaturamento || 1),
                      valorFaturamento: (prev.valor * value) / (prev.qtdeFaturamento || 1),
                    }))
                  }
                  label="QUANTIDADE"
                  placeholder="Preencha aqui a quantidade."
                  width={"100%"}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  value={itemHolder.valor}
                  handleChange={(value) =>
                    setItemHolder((prev) => {
                      const newFactor = (prev.valorFaturamento || 1) / value;
                      return {
                        ...prev,
                        valor: value,
                        fatorConversao: newFactor,
                        qtdeFaturamento: prev.qtde / newFactor,
                      };
                    })
                  }
                  label="VALOR UNITÁRIO"
                  placeholder="Preencha aqui o valor unitário."
                  width={"100%"}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditMenuIsOpen(false);
                }}
                className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
              >
                FECHAR
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdate(itemHolder);
                  setEditMenuIsOpen(false);
                }}
                className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
              >
                ATUALIZAR ITEM
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

type StockEntriesIndicatorProps = {
  purchaseControlId: string;
  item: TPurchaseControlWithProjectDTO["composicao"][number];
};

function StockEntriesIndicator({ purchaseControlId, item }: StockEntriesIndicatorProps) {
  const queryClient = useQueryClient();
  const entries = item.entradasEstoque || [];
  const unit = item.unidade;
  const totalQuantity = entries.reduce((total, entry) => total + entry.alteracao, 0);
  const difference = item.qtde - totalQuantity;
  const isSynchronized = Math.abs(difference) < 0.000001;
  const formatSignedQuantity = (quantity: number) => `${quantity > 0 ? "+" : ""}${quantity}`;
  const { mutate: sync, isPending } = useMutation({
    mutationFn: syncPurchaseStockEntry,
    onSuccess: async (message) => {
      await queryClient.invalidateQueries({ queryKey: ["purchase-control-by-id", purchaseControlId] });
      toast.success(message);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Não foi possível sincronizar a entrada."),
  });

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={cn(
            "focus-visible:ring-ring inline-flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isSynchronized
              ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
              : "border-amber-500/50 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300",
          )}
          aria-label={isSynchronized ? "Entrada de estoque sincronizada" : `Entrada de estoque com diferença de ${difference} ${unit}`}
        >
          {isSynchronized ? <PackageCheck className="size-3.5" aria-hidden="true" /> : <TriangleAlert className="size-3.5" aria-hidden="true" />}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" side="top" className="w-80 p-0">
        <div className="border-border flex items-center justify-between border-b px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold">Entradas no estoque</p>
            <p className="text-muted-foreground text-xs">
              {isSynchronized ? "Quantidade conferida" : "Quantidade divergente"}
            </p>
          </div>
          <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-semibold">
            {formatSignedQuantity(totalQuantity)} {unit}
          </span>
        </div>
        <div className="border-border grid grid-cols-2 gap-2 border-b px-3 py-2.5 text-xs">
          <div>
            <p className="text-muted-foreground">Na compra</p>
            <p className="font-semibold">{item.qtde} {unit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gerado no estoque</p>
            <p className="font-semibold">{totalQuantity} {unit}</p>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1.5">
          {entries.map((entry) => (
            <div key={entry._id} className="hover:bg-muted rounded-md px-2 py-2 transition-colors">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold">
                  {formatSignedQuantity(entry.alteracao)} {unit}
                </span>
                <time className="text-muted-foreground text-xs" dateTime={entry.dataInsercao}>
                  {dayjs(entry.dataInsercao).format("DD/MM/YYYY [às] HH:mm")}
                </time>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Saldo: {entry.qtdeAnterior ?? "—"} → {entry.qtdeNovo ?? "—"} {unit}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                Registrado por {entry.autor.nome}
              </p>
            </div>
          ))}
        </div>
        {!isSynchronized && item.materialId ? (
          <div className="border-border border-t p-2">
            <Button
              type="button"
              size="sm"
              className="w-full"
              disabled={isPending}
              onClick={() => sync({ id: purchaseControlId, materialId: item.materialId as string })}
            >
              {isPending ? <LoaderCircle className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              {isPending ? "Sincronizando…" : `Sincronizar ${difference > 0 ? `+${difference}` : difference} ${unit}`}
            </Button>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
