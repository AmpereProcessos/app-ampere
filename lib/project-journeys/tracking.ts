import { api } from "@/convex/_generated/api";
import type { TProjectJourneyStageWorkflow } from "@/utils/schemas/project-journey";
import type { TProject } from "@/utils/schemas/projects";
import { convexClient } from "@/utils/services/convex/client";
import { type Collection, ObjectId } from "mongodb";
import { UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_CONFIG } from ".";

type handleProjectUpdateTrackingParams = {
	projectId: string;
	previous: TProject;
	updated: TProject;
	collection: Collection<TProject>;
};
export async function handleProjectUpdateJourneyStepsTracking({ projectId, previous, updated, collection }: handleProjectUpdateTrackingParams) {
	const wasContractSigned = previous.contrato.status !== "ASSINADO" && updated.contrato.status === "ASSINADO";
	const wasHomologationAccessApproved = !previous.homologacao.acesso.dataResposta && updated.homologacao.acesso.dataResposta;
	const wasPaymentConfirmed = !previous.compra.dataPagamento && updated.compra.dataPagamento;
	const wasDeliveryScheduled = !previous.compra.previsaoEntrega && updated.compra.previsaoEntrega;
	const wasDeliveryPerformed = !previous.compra.dataEntrega && updated.compra.dataEntrega;
	const wasExecutionScheduled = !previous.obra.agendamentoEntrada && updated.obra.agendamentoEntrada;
	const wasInspectionRequested = !previous.homologacao.vistoria.dataSolicitacao && updated.homologacao.vistoria.dataSolicitacao;
	const wasInspectionApproved = !previous.homologacao.vistoria.dataEfetivacao && updated.homologacao.vistoria.dataEfetivacao;
	const wasCheckingPerformed = !previous.conferencias.energiaInjetada.data && updated.conferencias.energiaInjetada.data;

	const projectJourneyWorkflowStages = updated.jornada.estagios.filter((stage) => stage.versao === "WORKFLOW");
	console.log("[INFO] [PROJECT_UPDATE_TRACKING] Starting tracking...");

	try {
		if (wasContractSigned) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [CONTRATO_ASSINADO] Contract was signed");

			const contractSigningWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "CONTRATO_ASSINADO");
			// If the workflow stage is not found or is already completed, return
			if (!contractSigningWorkflowStage || contractSigningWorkflowStage.concluido) {
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [CONTRATO_ASSINADO] Workflow stage already completed");
				return;
			}
			const contractSigningWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === contractSigningWorkflowStage.ordem);

			const contractSigningWorkflowStageActions = contractSigningWorkflowStage.acoes;

			try {
				await Promise.all(
					contractSigningWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "CONTRATO_ASSINADO", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === contractSigningWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// 	await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [CONTRATO_ASSINADO] Error handling actions:", error);
				throw new Error("Error handling CONTRATO_ASSINADO actions");
			}
		}
		if (wasHomologationAccessApproved) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [HOMOLOGACAO_ACESSO_LIBERADO] Homologation access was approved");

			const homologationAccessApprovedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "HOMOLOGACAO_ACESSO_LIBERADO");
			if (!homologationAccessApprovedWorkflowStage || homologationAccessApprovedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [HOMOLOGACAO_ACESSO_LIBERADO] Workflow stage already completed");
				return;
			}
			const homologationAccessApprovedWorkflowStageActions = homologationAccessApprovedWorkflowStage.acoes;
			const homologationAccessApprovedWorkflowStageIndex = updated.jornada.estagios.findIndex(
				(s) => s.ordem === homologationAccessApprovedWorkflowStage.ordem,
			);
			try {
				await Promise.all(
					homologationAccessApprovedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "HOMOLOGACAO_ACESSO_LIBERADO", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === homologationAccessApprovedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [HOMOLOGACAO_ACESSO_LIBERADO] Error handling actions:", error);
				throw new Error("Error handling HOMOLOGACAO_ACESSO_LIBERADO actions");
			}
		}
		if (wasPaymentConfirmed) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [PAGAMENTO_EFETIVADO] Payment was confirmed");

			const paymentConfirmedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "PAGAMENTO_EFETIVADO");
			if (!paymentConfirmedWorkflowStage || paymentConfirmedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [PAGAMENTO_EFETIVADO] Workflow stage already completed");
				return;
			}
			const paymentConfirmedWorkflowStageActions = paymentConfirmedWorkflowStage.acoes;
			const paymentConfirmedWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === paymentConfirmedWorkflowStage.ordem);
			try {
				await Promise.all(
					paymentConfirmedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "PAGAMENTO_EFETIVADO", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === paymentConfirmedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [PAGAMENTO_EFETIVADO] Error handling actions:", error);
				throw new Error("Error handling PAGAMENTO_EFETIVADO actions");
			}
		}
		if (wasDeliveryScheduled) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_PREVISTA] Delivery was scheduled");

			const deliveryScheduledWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "ENTREGA_PREVISTA");
			if (!deliveryScheduledWorkflowStage || deliveryScheduledWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_PREVISTA] Workflow stage already completed");
				return;
			}
			const deliveryScheduledWorkflowStageActions = deliveryScheduledWorkflowStage.acoes;
			const deliveryScheduledWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === deliveryScheduledWorkflowStage.ordem);
			try {
				await Promise.all(
					deliveryScheduledWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "ENTREGA_PREVISTA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === deliveryScheduledWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [ENTREGA_PREVISTA] Error handling actions:", error);
				throw new Error("Error handling ENTREGA_PREVISTA actions");
			}
		}
		if (wasDeliveryPerformed) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_REALIZADA] Delivery was performed");

			const deliveryPerformedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "ENTREGA_REALIZADA");
			if (!deliveryPerformedWorkflowStage || deliveryPerformedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENTREGA_REALIZADA] Workflow stage already completed");
				return;
			}
			const deliveryPerformedWorkflowStageActions = deliveryPerformedWorkflowStage.acoes;
			const deliveryPerformedWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === deliveryPerformedWorkflowStage.ordem);
			try {
				await Promise.all(
					deliveryPerformedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "ENTREGA_REALIZADA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === deliveryPerformedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [ENTREGA_REALIZADA] Error handling actions:", error);
				throw new Error("Error handling ENTREGA_REALIZADA actions");
			}
		}
		if (wasExecutionScheduled) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [EXECUCAO_AGENDADA] Execution was scheduled");

			const executionScheduledWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "EXECUCAO_AGENDADA");
			if (!executionScheduledWorkflowStage || executionScheduledWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [EXECUCAO_AGENDADA] Workflow stage already completed");
				return;
			}
			const executionScheduledWorkflowStageActions = executionScheduledWorkflowStage.acoes;
			const executionScheduledWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === executionScheduledWorkflowStage.ordem);
			try {
				await Promise.all(
					executionScheduledWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "EXECUCAO_AGENDADA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === executionScheduledWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [EXECUCAO_AGENDADA] Error handling actions:", error);
				throw new Error("Error handling EXECUCAO_AGENDADA actions");
			}
		}
		if (wasInspectionRequested) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_SOLICITADA] Inspection was requested");

			const inspectionRequestedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "VISTORIA_SOLICITADA");
			if (!inspectionRequestedWorkflowStage || inspectionRequestedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_SOLICITADA] Workflow stage already completed");
				return;
			}
			const inspectionRequestedWorkflowStageActions = inspectionRequestedWorkflowStage.acoes;
			const inspectionRequestedWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === inspectionRequestedWorkflowStage.ordem);
			try {
				await Promise.all(
					inspectionRequestedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "VISTORIA_SOLICITADA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === inspectionRequestedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [VISTORIA_SOLICITADA] Error handling actions:", error);
				throw new Error("Error handling VISTORIA_SOLICITADA actions");
			}
		}
		if (wasInspectionApproved) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_REALIZADA] Inspection was approved");

			const inspectionApprovedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "VISTORIA_REALIZADA");
			if (!inspectionApprovedWorkflowStage || inspectionApprovedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [VISTORIA_REALIZADA] Workflow stage already completed");
				return;
			}
			const inspectionApprovedWorkflowStageActions = inspectionApprovedWorkflowStage.acoes;
			const inspectionApprovedWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === inspectionApprovedWorkflowStage.ordem);
			try {
				await Promise.all(
					inspectionApprovedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "VISTORIA_REALIZADA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === inspectionApprovedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				// 	await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [VISTORIA_REALIZADA] Error handling actions:", error);
				throw new Error("Error handling VISTORIA_REALIZADA actions");
			}
		}
		if (wasCheckingPerformed) {
			console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENERGIA_INJETADA] Checking was performed");

			const checkingPerformedWorkflowStage = projectJourneyWorkflowStages.find((s) => s.gatilho.evento === "ENERGIA_INJETADA");
			if (!checkingPerformedWorkflowStage || checkingPerformedWorkflowStage.concluido) {
				// If the workflow stage is not found or is already completed, return
				console.log("[INFO] [PROJECT_UPDATE_TRACKING] [ENERGIA_INJETADA] Workflow stage already completed");
				return;
			}
			const checkingPerformedWorkflowStageActions = checkingPerformedWorkflowStage.acoes;
			const checkingPerformedWorkflowStageIndex = updated.jornada.estagios.findIndex((s) => s.ordem === checkingPerformedWorkflowStage.ordem);
			try {
				await Promise.all(
					checkingPerformedWorkflowStageActions.map((action) =>
						handleProjectJourneyWorkflowStageAction({ project: updated, trigger: "ENERGIA_INJETADA", action }),
					),
				);

				const updatesProjectJourneyWorkflowStages = updated.jornada.estagios.map((s, index) => {
					if (index === checkingPerformedWorkflowStageIndex) {
						return {
							...s,
							concluido: true,
							dataConclusao: new Date().toISOString(),
						};
					}
					return s;
				});

				await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: { "jornada.estagios": updatesProjectJourneyWorkflowStages } });
			} catch (error) {
				console.error("[ERROR] [PROJECT_UPDATE_TRACKING] [ENERGIA_INJETADA] Error handling actions:", error);
				throw new Error("Error handling ENERGIA_INJETADA actions");
			}
		}

		return { success: true, message: "Project update tracking completed successfully" };
	} catch (error) {
		console.error("[ERROR] [PROJECT_UPDATE_TRACKING] Error tracking project update:", error);
		return { success: false, message: "Error tracking project update" };
	}
}

type HandleProjectJourneyWorkflowStageActionProps = {
	project: TProject;
	trigger: TProjectJourneyStageWorkflow["gatilho"]["evento"];
	action: TProjectJourneyStageWorkflow["acoes"][number];
};

async function handleProjectJourneyWorkflowStageAction({ project, trigger, action }: HandleProjectJourneyWorkflowStageActionProps) {
	switch (action.tipo) {
		case "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP": {
			const eventWorkflowStage = UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_CONFIG.find((s) => s.gatilho.evento === trigger);

			if (!eventWorkflowStage) return;
			const payload = eventWorkflowStage.payload(project);
			return await convexClient.mutation(api.mutations.messages.createTemplateMessage, {
				cliente: {
					idApp: project.idClienteCRM as string,
					nome: project.nomeDoContrato,
					telefone: "3484063369", // FIXED FOR NOW. TODO: GET THE PHONE FROM THE PROJECT as string,
					avatar_url: undefined,
					email: project.email ?? undefined,
					cpfCnpj: project.cpf_cnpj.toString(),
				},
				autor: {
					idApp: "6318db05929e9f8731d8d9bb",
					tipo: "usuario",
				},
				whatsappPhoneNumberId: "807009649165845",
				templateId: action.metadados.whatsappTemplateId,
				templatePayloadData: payload.data,
				templatePayloadContent: payload.content,
			});
		}
		default: {
			return;
		}
	}
}
