import { z } from "zod";

export const PlannedAllocationQuantitySchema = z
  .number()
  .finite()
  .positive("A quantidade prevista deve ser maior que zero.");
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Identificador inválido.");
export const EditProjectAllocationSchema = z
  .object({
    projectId: objectId,
    materialId: objectId,
    quantidadePrevista: PlannedAllocationQuantitySchema,
    quantidadePrevistaAnterior: z.number().finite(),
  })
  .strict();

export const AddProjectAllocationSchema = z
  .object({
    projectId: objectId,
    materialId: objectId,
    quantidadePrevista: PlannedAllocationQuantitySchema,
  })
  .strict();

export function getAllocationProgress(planned: number, allocated: number) {
  return {
    pending: Math.max(planned - allocated, 0),
    status:
      allocated <= 0 ? "NÃO ALOCADO" : allocated < planned ? "PARCIALMENTE ALOCADO" : "ALOCADO",
  };
}
