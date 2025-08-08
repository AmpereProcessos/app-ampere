import type { TProjectDTO } from "@/utils/schemas/projects";
import type { QueryClient } from "@tanstack/react-query";
import { formatDateAsLocale, getProductsStr } from "../formatting";
import { sendEmail } from "../email";
import { createNotification } from "./notifications";
import { updateProject } from "./clients";

import type { TCreateNotificationInput } from "@/pages/api/notificacoes";

type HandleEngineeringUpdateParams = {
	previousData: TProjectDTO;
	newData: TProjectDTO;
	changes: { [key: string]: any };
	queryClient: QueryClient;
};
export async function handleEngineeringUpdate({ previousData, newData, changes, queryClient }: HandleEngineeringUpdateParams) {
	const projectId = previousData._id;

	const previousMeterChangeDate = previousData.homologacao.vistoria.dataEfetivacao;
	const newMeterChangeDate = newData.homologacao.vistoria.dataEfetivacao;

	const previousDocumentLiberationDate = previousData.homologacao.documentacao.dataLiberacao;
	const newDocumentLiberationDate = newData.homologacao.documentacao.dataLiberacao;

	const previousAccessGrantingStatus = previousData.homologacao.status;
	const newAccessGrantingStatus = newData.homologacao.status;

	if (!!newMeterChangeDate && previousMeterChangeDate !== newMeterChangeDate) {
		const emailMessage = {
			emailTo: "contasareceber@ampereenergias.com.br", // amperecontasareceber@gmail.com
			subject: "TROCA DE MEDIDOR",
			message: `Olá, passando para te informar que o cliente ${newData.nomeDoContrato} teve a troca do medidor notificada no dia ${formatDateAsLocale(
				newMeterChangeDate,
			)}. Desde já agradeço, Volts.`,
		};
		await sendEmail(emailMessage);
	}
	if (!!newDocumentLiberationDate && previousDocumentLiberationDate !== newDocumentLiberationDate) {
		const notification: TCreateNotificationInput = {
			notificadosIds: ["6353ebc7ef4e1a367a87794b"],
			assunto: "Liberação de documentações",
			corpo: `Olá, passando para te notificar sobre a liberação das documentações do(a) cliente ${
				newData.nomeDoContrato
			} no dia ${formatDateAsLocale(newData.homologacao.documentacao.dataLiberacao)}.`,
			enviarEmail: true,
			enviarSMS: true,
		};

		await createNotification({ info: notification });
	}

	if (!!newAccessGrantingStatus && previousAccessGrantingStatus !== "APROVADO" && newAccessGrantingStatus === "APROVADO") {
		const notification: TCreateNotificationInput = {
			notificadosIds: ["64638b6c2071c508968bdf08"],
			assunto: "Parecer de acesso aprovado.",
			corpo: `Parecer de acesso aprovado para o projeto ${newData.nomeDoContrato}.`,
			enviarEmail: true,
			enviarSMS: true,
		};
		await createNotification({ info: notification });
	}
	// Update project
	await updateProject({ id: projectId, changes: changes });
	return "Atualizações feitas com sucesso";
}
