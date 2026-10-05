import { ObjectId } from "mongodb";
import {
  getServiceObservationsFromObras,
  getServiceOrderTagsFromProject,
} from "@/utils/methods/util/service-order";
import { buildProjectServiceOrder } from "./build-service-order";
import { SERVICE_ORDER_SYNC_FIELDS, usesAssemblyServiceOrder } from "./rules";
import type { ProjectUpdateAutomationContext } from "./types";

export async function syncProjectServiceOrder({
  project,
  updateKeys,
  serviceOrdersCollection,
}: ProjectUpdateAutomationContext) {
  if (
    !project.idOrdemServico ||
    !SERVICE_ORDER_SYNC_FIELDS.some((field) => updateKeys.includes(field))
  )
    return;
  await serviceOrdersCollection.updateOne(
    {
      _id: new ObjectId(project.idOrdemServico),
    },
    {
      $set: {
        etiquetas: getServiceOrderTagsFromProject(project),
        idAnaliseTecnica: project.idVisitaTecnica,
        observacoes: getServiceObservationsFromObras(project.obra.observacoes),
        "projeto.vendedorNome": project.vendedor.nome,
        "projeto.contratoDataAssinatura": project.contrato?.dataAssinatura,
        "projeto.compraDataPagamento": project.compra?.dataPagamento,
        "projeto.compraEntregaDataPrevisao": project.compra?.previsaoEntrega,
        "projeto.compraEntregaDataEfetivacao": project.compra?.dataEntrega,
        "projeto.homologacaoAcessoDataResposta": project.homologacao?.acesso.dataResposta,
        "projeto.homologacaoVistoriaDataEfetivacao": project.homologacao?.vistoria.dataEfetivacao,
      },
    },
  );
}

export async function createProjectServiceOrder(context: ProjectUpdateAutomationContext) {
  const { project, updateKeys } = context;
  // A date correction must not replace the project's linked service order.
  if (project.idOrdemServico) return;
  if (
    !usesAssemblyServiceOrder(project) ||
    !updateKeys.includes("contrato.dataAssinatura") ||
    !project.contrato.dataAssinatura
  )
    return;

  await ensureProjectAssemblyServiceOrder(context);
}

/** Delivery can recover a missing order, but must reuse an existing assembly order. */
export async function ensureProjectAssemblyServiceOrder({
  project,
  author,
  projectsCollection,
  serviceOrdersCollection,
}: Pick<ProjectUpdateAutomationContext, "project" | "author" | "projectsCollection" | "serviceOrdersCollection">) {
  if (project.idOrdemServico && ObjectId.isValid(project.idOrdemServico)) {
    const linkedOrder = await serviceOrdersCollection.findOne({
      _id: new ObjectId(project.idOrdemServico),
      "projeto.id": project._id.toString(),
    });
    if (linkedOrder) return linkedOrder._id.toString();
  }
  const existing = await serviceOrdersCollection.findOne({
    "projeto.id": project._id.toString(),
    categoria: "MONTAGEM",
  });
  if (existing) {
    if (project.idOrdemServico !== existing._id.toString()) {
      await projectsCollection.updateOne({ _id: project._id }, { $set: { idOrdemServico: existing._id.toString() } });
    }
    return existing._id.toString();
  }
  const result = await serviceOrdersCollection.insertOne(buildProjectServiceOrder({ project, author }));
  await projectsCollection.updateOne({ _id: project._id }, { $set: { idOrdemServico: result.insertedId.toString() } });
  return result.insertedId.toString();
}
