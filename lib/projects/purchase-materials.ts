import createHttpError from "http-errors";
import { ObjectId, type ClientSession, type Collection } from "mongodb";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TPurchaseControl } from "@/utils/schemas/purchases";

type Item = TPurchaseControl["composicao"][number];
export const isPurchaseMaterialId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9]{24}$/.test(id);

function itemKey(item: Item) {
  const { dataAlocacao, qtdeAlocada, ...fields } = item;
  return JSON.stringify(Object.entries(fields).sort(([a], [b]) => a.localeCompare(b)));
}

export function purchaseCompositionChanged(previous: Item[], next: Item[]) {
  return JSON.stringify(previous.map(itemKey)) !== JSON.stringify(next.map(itemKey));
}

export function preservePurchaseAllocationMetadata(items: Item[], previous: Item[]) {
  return items.map((item) => {
    const old =
      previous.find((row) => itemKey(row) === itemKey(item)) ||
      (isPurchaseMaterialId(item.materialId) ? previous.find((row) => row.materialId === item.materialId) : undefined);
    return { ...item, dataAlocacao: old?.dataAlocacao ?? null, qtdeAlocada: old?.qtdeAlocada ?? 0 };
  });
}

export function validatePurchaseComposition(items: Item[], previous: Item[] = []) {
  const legacyItems = new Map<string, number>();
  for (const item of previous)
    if (!isPurchaseMaterialId(item.materialId)) {
      const key = itemKey(item);
      legacyItems.set(key, (legacyItems.get(key) || 0) + 1);
    }
  for (const item of items) {
    if (isPurchaseMaterialId(item.materialId)) {
      if (!Number.isFinite(item.qtde) || item.qtde <= 0 || !Number.isFinite(item.valor) || item.valor < 0)
        throw new createHttpError.BadRequest(`Informe quantidade e valor válidos para ${item.descricao}.`);
      continue;
    }
    const key = itemKey(item);
    const available = legacyItems.get(key) || 0;
    if (!available)
      throw new createHttpError.BadRequest(`Selecione um material válido para ${item.descricao || "o item"}.`);
    legacyItems.set(key, available - 1);
  }
}

export async function validatePurchaseMaterialCatalog(
  items: Pick<Item, "materialId" | "descricao">[],
  collection: Collection<TMaterial>,
  session?: ClientSession,
  previous: Pick<Item, "materialId">[] = [],
) {
  const remaining = new Map<string | null | undefined, number>();
  for (const item of previous) remaining.set(item.materialId, (remaining.get(item.materialId) || 0) + 1);
  const ids = [
    ...new Set(
      items
        .filter((item) => {
          const count = remaining.get(item.materialId) || 0;
          if (count) {
            remaining.set(item.materialId, count - 1);
            return false;
          }
          return true;
        })
        .map((item) => item.materialId),
    ),
  ];
  if (!ids.length) return;
  if (ids.some((id) => !isPurchaseMaterialId(id)))
    throw new createHttpError.BadRequest("Selecione um material válido para todos os itens.");
  const materials = await collection
    .find(
      { _id: { $in: ids.map((id) => new ObjectId(id as string)) }, dataExclusao: null },
      { session, projection: { _id: 1 } },
    )
    .toArray();
  if (materials.length !== ids.length)
    throw new createHttpError.BadRequest("Um dos materiais não existe ou foi excluído. Selecione outro material.");
}

export function assertPurchaseRevision(expected: unknown, current: number | undefined) {
  if (!Number.isSafeInteger(expected) || (expected as number) < 0)
    throw new createHttpError.Conflict("Reabra a compra antes de salvar para carregar a versão atual.");
  if (expected !== (current ?? 0))
    throw new createHttpError.Conflict("Esta compra foi alterada por outra operação. Reabra a compra antes de salvar.");
}
