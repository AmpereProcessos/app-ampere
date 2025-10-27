import type { TProject } from "@/utils/schemas/projects";

type handleProjectUpdateTrackingParams = {
	previous: TProject;
	updated: TProject;
};
export function handleProjectUpdateJourneyStepsTracking({ previous, updated }: handleProjectUpdateTrackingParams) {
	const wasContractSigned = previous.contrato.status !== "ASSINADO" && updated.contrato.status === "ASSINADO";
	const wasHomologationAccessApproved = !previous.homologacao.acesso.dataResposta && updated.homologacao.acesso.dataResposta;
	const wasPaymentConfirmed = !previous.compra.dataPagamento && updated.compra.dataPagamento;
	const wasDeliveryScheduled = !previous.compra.previsaoEntrega && updated.compra.previsaoEntrega;
	const wasDeliveryPerformed = !previous.compra.dataEntrega && updated.compra.dataEntrega;
	const wasExecutionScheduled = !previous.obra.agendamentoEntrada && updated.obra.agendamentoEntrada;
	const wasInspectionRequested = !previous.homologacao.vistoria.dataSolicitacao && updated.homologacao.vistoria.dataSolicitacao;
	const wasInspectionApproved = !previous.homologacao.vistoria.dataEfetivacao && updated.homologacao.vistoria.dataEfetivacao;
	const wasCheckingPerformed = !previous.conferencias.energiaInjetada.data && updated.conferencias.energiaInjetada.data;

	console.log("[INFO] [PROJECT_UPDATE_TRACKING] Starting tracking...");
	if (wasContractSigned) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [CONTRATO_ASSINADO] Contract was signed");
	}
	if (wasHomologationAccessApproved) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [HOMOLOGACAO_ACESSO_LIBERADO] Homologation access was approved");
	}
	if (wasPaymentConfirmed) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [PAGAMENTO_EFETIVADO] Payment was confirmed");
	}
	if (wasDeliveryScheduled) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_PREVISTA] Delivery was scheduled");
	}
	if (wasDeliveryPerformed) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_REALIZADA] Delivery was performed");
	}
	if (wasExecutionScheduled) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [EXECUCAO_AGENDADA] Execution was scheduled");
	}
	if (wasInspectionRequested) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_SOLICITADA] Inspection was requested");
	}
	if (wasInspectionApproved) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_REALIZADA] Inspection was approved");
	}
	if (wasCheckingPerformed) {
		console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENERGIA_INJETADA] Checking was performed");
	}
}
