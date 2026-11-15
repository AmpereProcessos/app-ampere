import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import { isPurchaseMaterialId } from "./purchase-materials";

export function groupPurchaseStock(items: TPurchaseControl["composicao"]) {
  const result = new Map<string, { quantity: number; value: number }>();
  for (const item of items) {
    if (!isPurchaseMaterialId(item.materialId)) continue;
    const previous = result.get(item.materialId) || { quantity: 0, value: 0 };
    result.set(item.materialId, {
      quantity: previous.quantity + item.qtde,
      value: previous.value + item.qtde * item.valor,
    });
  }
  return result;
}

export function stockEntryQuantity(entry: TMaterialUpdateRegistry) {
  return typeof entry.qtdeAnterior === "number" && typeof entry.qtdeNovo === "number"
    ? entry.qtdeNovo - entry.qtdeAnterior
    : entry.alteracao;
}

export function stockEntryValue(entry: TMaterialUpdateRegistry, fallbackPrice: number) {
  if (
    typeof entry.qtdeAnterior === "number" &&
    typeof entry.qtdeNovo === "number" &&
    typeof entry.precoAnterior === "number" &&
    typeof entry.precoNovo === "number"
  ) {
    return entry.qtdeNovo * entry.precoNovo - entry.qtdeAnterior * entry.precoAnterior;
  }
  return stockEntryQuantity(entry) * fallbackPrice;
}
