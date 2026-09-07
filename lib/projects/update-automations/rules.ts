import type { TProject } from "@/utils/schemas/projects";

// These service types share the existing assembly-order and payment-based commission rules.
const ASSEMBLY_SERVICE_TYPES = new Set([
  "SISTEMA FOTOVOLTAICO",
  "AUMENTO DE SISTEMA FOTOVOLTAICO",
  "PRODUTOS E SERVIÇOS AVULSOS",
  "MONTAGEM E DESMONTAGEM",
]);

export function usesAssemblyServiceOrder(project: TProject) {
  return ASSEMBLY_SERVICE_TYPES.has(project.tipoDeServico);
}

// Preserve the endpoint's exact dotted-key triggers, including repeated values.
export const SERVICE_ORDER_SYNC_FIELDS = [
  "idVisitaTecnica",
  "vendedor.nome",
  "etiquetas",
  "contrato.dataAssinatura",
  "homologacao.fastTrack",
  "homologacao.acesso.dataResposta",
  "homologacao.vistoria.dataEfetivacao",
  "pagamento.credor",
  "compra.dataPagamento",
  "compra.previsaoEntrega",
  "compra.dataEntrega",
  "obra.pendencias",
  "obra.observacoes",
] as const;
