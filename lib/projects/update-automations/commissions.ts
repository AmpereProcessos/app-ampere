import { usesAssemblyServiceOrder } from "./rules";
import type { ProjectUpdateAutomationContext } from "./types";

export async function syncProjectCommission({
  project,
  updateKeys,
  projectsCollection,
}: ProjectUpdateAutomationContext) {
  const usesPaymentDate = usesAssemblyServiceOrder(project);
  const sourceField = usesPaymentDate ? "compra.dataPagamento" : "contrato.dataAssinatura";
  if (!updateKeys.includes(sourceField)) return;

  const referenceDate = usesPaymentDate
    ? project.compra.dataPagamento
    : project.contrato.dataAssinatura;
  await projectsCollection.updateOne(
    { _id: project._id },
    { $set: { "comissoes.dataReferencia": referenceDate } },
  );
}
