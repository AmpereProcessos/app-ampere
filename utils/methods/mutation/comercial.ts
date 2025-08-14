import axios from "axios";
import { updateProject } from "./clients";
import { getContractValue } from "../util/projects";
import { createRevenue } from "../../../utils/methods/mutation/revenues";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { notifySeller, updateCRMProject } from "../crm-integration";
import type { QueryClient } from "@tanstack/react-query";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import { updateOpportunity } from "./crm/opportunities";
import dayjs from "dayjs";
import { ContractRequestPaymentOptions } from "@/utils/select-options";
import type { TRevenue } from "@/utils/schemas/revenues";
import type { TCreateNotificationInput } from "@/pages/api/notificacoes";
import { createNotification } from "./notifications";

type HandleComercialUpdateProps = {
	previousData: TProjectDTO;
	newData: TProjectDTO;
	changes: { [key: string]: any };
	queryClient: QueryClient;
};
export async function handleComercialUpdate({ previousData, newData, changes, queryClient }: HandleComercialUpdateProps) {
	let updates = changes;
	const projectId = previousData._id;
	const idCRMProject = newData.idProjetoCRM;
	const serviceType = newData.tipoDeServico;

	const previousContractStatus = previousData.contrato.status;
	const wasSigned = previousContractStatus === "ASSINADO";
	const wasUnsigned = !wasSigned;

	const newContractStatus = newData.contrato.status;
	const isSigned = newContractStatus === "ASSINADO";
	const newSignatureDate = newData.contrato.dataAssinatura;
	const isReleasedForPurchase = !!newData.compra.liberacao;

	try {
		// const wasUnsigned = previousData.contrato.status != 'ASSINADO'
		// const isSigned = newData.contrato.status == 'ASSINADO'
		if (wasUnsigned && isSigned) {
			await notifyContractSigning({ projectIdentifier: newData.qtde, projectName: newData.nomeDoContrato });
			await generateContractRevenue({ data: newData, queryClient });
			if (["OPERAÇÃO E MANUTENÇÃO", "MONITORAMENTO"].includes(newData.tipoDeServico) && newSignatureDate)
				updates = {
					...updates,
					"oem.dataInicio": newSignatureDate,
					"oem.dataFim": dayjs(newSignatureDate).add(365, "days").toISOString(),
				};
			if (["SEGURO DE SISTEMA FOTOVOLTAICO"].includes(newData.tipoDeServico) && newSignatureDate)
				updates = {
					...updates,
					"seguro.dataInicio": newSignatureDate,
					"seguro.dataFim": dayjs(newSignatureDate).add(365, "days").toISOString(),
				};
		}

		// Handle automations for CRM
		if (idCRMProject) await handleCRMAutomation({ previousData, newData });

		// Update project
		await updateProject({ id: projectId, changes: changes });

		return "Atualizações realizadas com sucesso !";
	} catch (error) {
		throw error;
	}
}

type NotifyContractSigningParams = {
	projectName: string;
	projectIdentifier: string | number;
};
async function notifyContractSigning({ projectName, projectIdentifier }: NotifyContractSigningParams) {
	const notification: TCreateNotificationInput = {
		notificadosIds: ["6353eb83ef4e1a367a877949", "64638b6c2071c508968bdf08"],
		assunto: "NOVO CONTRATO ASSINADO",
		corpo: `Contrato ${projectName} (${projectIdentifier}) foi atualizado como ASSINADO.`,
		enviarEmail: true,
	};
	await createNotification({ info: notification });

	return "Notificações criadas com sucesso !";
}
type GenerateContractRevenueParams = {
	data: TProjectDTO;
	queryClient: QueryClient;
};
export async function generateContractRevenue({ data, queryClient }: GenerateContractRevenueParams) {
	try {
		const contractValue = getContractValue({
			projectValue: data.sistema.valorProjeto,
			structureValue: data.estruturaPersonalizada.valor,
			paValue: data.padrao.valor,
		});
		const paymentFractionnements = ContractRequestPaymentOptions.find((c) => c.value === data.pagamento.metodo)?.fractionnements;
		const revenue: TRevenue = {
			nome: `CONTRATO DE ${data.nomeDoContrato}`,
			tipo: data.tipoDeServico,
			autor: {
				id: "",
				nome: "SISTEMA",
				avatar_url: null,
			},
			projeto: {
				id: data._id,
				nome: data.nomeDoContrato,
				identificador: data.qtde,
			},
			total: contractValue,
			metodo: data.pagamento.forma === "FINANCIAMENTO" ? "FINANCIAMENTO" : "À VISTA (GERAL)",
			efetivacao: {
				efetivado: true,
				data: data.contrato.dataAssinatura,
			},
			fracionamento: paymentFractionnements
				? paymentFractionnements.map((c) => ({
						titulo: c.title,
						porcentagem: c.percentage,
						dataPrevisaoRecebimento: new Date().toISOString(),
						valor: contractValue * (c.percentage / 100),
					}))
				: [
						{
							titulo: "RECEBIMENTO TOTAL",
							porcentagem: 100,
							dataPrevisaoRecebimento: new Date().toISOString(),
							valor: contractValue,
						},
					],
			dataInsercao: new Date().toISOString(),
		};
		await createRevenue({ info: revenue });
		await queryClient.invalidateQueries({ queryKey: ["project-revenues", data._id] });
	} catch (error) {
		throw error;
	}
}

type HandleCRMAutomationsParams = {
	previousData: TProjectDTO;
	newData: TProjectDTO;
};
async function handleCRMAutomation({ previousData, newData }: HandleCRMAutomationsParams) {
	const projectId = previousData._id;
	const contractRequestDate = newData.contrato.dataSolicitacao;
	const idContractRequest = newData.idSolicitacaoContrato;
	const idCRMProject = newData.idProjetoCRM as string;
	const idCRMPropose = newData.idPropostaCRM;
	const email = newData.email;
	const sellerName = newData.vendedor.nome;
	const projectValue = newData.sistema?.valorProjeto || 0;
	const paValue = newData.padrao?.valor || 0;
	const structureValue = newData.estruturaPersonalizada?.valor || 0;
	const contractValue = getContractValue({ projectValue, structureValue, paValue });
	const previousContractStatus = previousData.contrato.status;
	const wasSigned = previousContractStatus === "ASSINADO";
	const wasUnsigned = !wasSigned;

	const newContractStatus = newData.contrato.status;
	const isSigned = newContractStatus === "ASSINADO";
	const signatureDate = newData.contrato.dataAssinatura;
	const isTerminated = newContractStatus === "RESCISÃO DE CONTRATO";
	// Checking for signature event
	if (wasUnsigned && isSigned && !!signatureDate) {
		// Update  crm project
		const changes: Partial<TOpportunity> = {
			ganho: {
				idProjeto: projectId,
				idProposta: idCRMPropose,
				data: signatureDate,
				idSolicitacao: idContractRequest,
				dataSolicitacao: contractRequestDate,
			},
			perda: {
				data: null,
				descricaoMotivo: null,
			},
		};
		await updateOpportunity({ id: idCRMProject, changes: changes });
		// await notifySeller({ sellerName, idCRMProject, message: 'CONTRATO ATUALIZADO COMO ASSINADO.' })
		const rdSaleNotification = { operation: "SALE", email: email, value: contractValue };
		if (email) await notifyRDStationWin({ info: rdSaleNotification });

		return "Automações de assinatura realizadas.";
	}
	// Checking for rescission
	if (isTerminated) {
		console.log("PASSED IN CONTRACT TERMINATION");
		const changes: Partial<TOpportunity> = {
			ganho: { data: null },
			perda: { data: new Date().toISOString(), descricaoMotivo: "RESCISÃO CONTRATUAL" },
		};
		await updateOpportunity({ id: idCRMProject, changes: changes });
		return "Automações de rescisão contratual realizadas.";
	}
	// Checking for unsigning
	if (wasSigned && !isSigned && !isTerminated) {
		console.log("PASSED IN CONTRACT UNSIGNING");
		const changes: Partial<TOpportunity> = { ganho: { data: null } };
		await updateOpportunity({ id: idCRMProject, changes: changes });
		return "Automações de dessasinatura realizadas.";
	}
	return "Automações de CRM concluídas.";
}

async function notifyRDStationWin({ info }: { info: any }) {
	try {
		await axios.put("/api/integracao/rd-station/opportunities", info);
	} catch (error) {
		throw error;
	}
}

// async function notifySellerInCRM(sellerName, idCRMProject, message) {
//   if (!sellerName || !idCRMProject) return
//   const apiResponse = await axios.post(`/api/crm/notifySeller?sellerName=${sellerName}&idCRMProject=${idCRMProject}`, {
//     message: message,
//   })
// }

// export async function updateCRMProject({ idCRMProject, changes }) {
//   try {
//     const { data } = await axios.post(`/api/crm/updateProjects?projectId=${idCRMProject}`, {
//       changes,
//     })
//     return 'ATUALIZAÇÕES DO PROJETO CRM BEM SUCEDIDAS !'
//   } catch (error) {
//     return 'HOUVE NA ATUALIZAÇÃO DO PROJETO CRM'
//   }
// }
