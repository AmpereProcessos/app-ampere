import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import { ProjectJourneyLegacySchema, PROJECT_JOURNEYS_COLLECTION_NAME, type TProjectJourney } from "@/utils/schemas/project-journey";
import type { TProject } from "@/utils/schemas/projects";
import type { z } from "zod";

import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { type AnyBulkWriteOperation, type Filter, type WithId, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type TProjectLegacyJornada = z.infer<typeof ProjectJourneyLegacySchema>;

function legacyJornada(project: WithId<TProject>): TProjectLegacyJornada {
	return project.jornada as unknown as TProjectLegacyJornada;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const projectsDb = await connectToDatabase();
	const projectsCollection = projectsDb.collection<TProject>("dados");

	const legacyProjectsFilter = { "jornada.estagios": null } as Filter<TProject>;
	const projects = await projectsCollection
		.find(legacyProjectsFilter, {
			sort: {
				qtde: 1,
			},
		})
		.toArray();

	function getProjectJourneyNotesForContacts(project: WithId<TProject>) {
		const jornada = legacyJornada(project);
		if (jornada.contatos)
			return `
			CONTATOS: ${jornada.contatos}\n
			`;
		return "";
	}
	function getProjectJourneyNotesForCuidados(project: WithId<TProject>) {
		const jornada = legacyJornada(project);
		if (jornada.cuidados)
			return `
			CUIDADOS: ${jornada.cuidados}\n
			`;
		return "";
	}
	function getProjectJourneyNotesForObsJornada(project: WithId<TProject>) {
		const jornada = legacyJornada(project);
		if (jornada.obsJornada)
			return `
			OBSERVAÇÕES: ${jornada.obsJornada}
			`;
		return "";
	}
	function getProjectJourneyConclutionDate(project: WithId<TProject>) {
		const jornada = legacyJornada(project);
		if (jornada.dataConclusao) return jornada.dataConclusao;

		if (project.tipoDeServico === "SISTEMA FOTOVOLTAICO" || project.tipoDeServico === "AUMENTO DE SISTEMA FOTOVOLTAICO") {
			if (jornada.jornadaConcluida) {
				if (project.homologacao.vistoria.dataEfetivacao) return project.homologacao.vistoria.dataEfetivacao;
				if (project.homologacao.dataEfetivacao) return project.homologacao.dataEfetivacao;
				if (project.obra.saida) return project.obra.saida;
				return "-";
			}
			return null;
		}

		if (project.tipoDeServico === "OPERAÇÃO E MANUTENÇÃO") {
			if (jornada.jornadaConcluida) {
				if (project.contrato.dataAssinatura) return project.contrato.dataAssinatura;
				return "-";
			}
			return null;
		}

		if (jornada.jornadaConcluida) {
			if (project.homologacao.dataEfetivacao) return project.homologacao.dataEfetivacao;
			if (project.obra.saida) return project.obra.saida;
			if (project.contrato.dataAssinatura) return project.contrato.dataAssinatura;
			return "-";
		}
		return null;
	}
	const newProjectsJourneys: (TProjectJourney & { projeto: { id: string; nome: string; tipo: string; identificador: string } })[] = projects.map(
		(project) => {
			const jornada = legacyJornada(project);
			return {
				projeto: {
					id: project._id.toString(),
					nome: project.nomeDoContrato,
					tipo: project.tipoDeServico,
					identificador: project.qtde.toString(),
				},
				anotacoes: `${getProjectJourneyNotesForContacts(project)}${getProjectJourneyNotesForCuidados(project)}${getProjectJourneyNotesForObsJornada(project)}`,
				estagios: [
					{
						ordem: 1,
						titulo: "BOAS VINDAS !",
						versao: "LEGADO",
						concluido: !!jornada.boasVindas,
					},
					{
						ordem: 2,
						titulo: "ASSINATURA DAS DOCUMENTAÇÕES",
						versao: "LEGADO",
						concluido: !!jornada.assDocumentacoes,
					},
					{
						ordem: 3,
						titulo: "RESPOSTA DA CONCESSIONÁRIA",
						versao: "LEGADO",
						concluido: !!jornada.respConcessionaria,
					},
					{
						ordem: 4,
						titulo: "COMPRA DO KIT",
						versao: "LEGADO",
						concluido: !!jornada.compraDoKit,
					},
					{
						ordem: 5,
						titulo: "NF FATURADA",
						versao: "LEGADO",
						concluido: !!jornada.nfFaturada,
					},
					{
						ordem: 6,
						titulo: "PREVISÃO DE ENTREGA",
						versao: "LEGADO",
						concluido: !!jornada.prevChegada,
					},
					{
						ordem: 7,
						titulo: "ENTREGA DO KIT",
						versao: "LEGADO",
						concluido: !!jornada.entregaDoKit,
					},
					{
						ordem: 8,
						titulo: "INSTALAÇÃO AGENDADA",
						versao: "LEGADO",
						concluido: !!jornada.instalacaoAgendada,
					},
					{
						ordem: 9,
						titulo: "INSTALAÇÃO REALIZADA",
						versao: "LEGADO",
						concluido: !!jornada.instalacaoRealizada,
					},
					{
						ordem: 10,
						titulo: "VISTORIA REALIZADA",
						versao: "LEGADO",
						concluido: !!jornada.vistoriaConcessionaria,
					},
					{
						ordem: 11,
						titulo: "SISTEMA OPERANTE",
						versao: "LEGADO",
						concluido: !!jornada.sistemaLigado,
					},
					{
						ordem: 12,
						titulo: "ENTREGA TÉCNICA",
						versao: "LEGADO",
						concluido: !!jornada.entregaTecnica,
					},
					{
						ordem: 13,
						titulo: "JORNADA CONCLUÍDA",
						versao: "LEGADO",
						concluido: !!jornada.jornadaConcluida,
					},
				],
				dataEfetivacao: getProjectJourneyConclutionDate(project),
				dataUltimaInteracao: jornada.dataUltimoContato,
			};
		},
	);

	const newOngoingProjectJourneys = newProjectsJourneys.filter((journey) => !journey.dataEfetivacao);
	const newCompletedProjectJourneys = newProjectsJourneys.filter((journey) => !!journey.dataEfetivacao);

	const newOngoingProjectJourneysIds = newOngoingProjectJourneys.map((journey) => journey.projeto.id);
	const oldOngoingProjectJourneyIds = projects.filter((project) => !legacyJornada(project).jornadaConcluida).map((project) => project._id.toString());

	// Calculate the percentage of ids in newOngoingProjectJourneysIds that also exist in oldOngoingProjectJourneyIds
	const matchingIdsCount = newOngoingProjectJourneysIds.filter((id) => oldOngoingProjectJourneyIds.includes(id)).length;
	const percentageMatching = newOngoingProjectJourneysIds.length === 0 ? 0 : (matchingIdsCount / newOngoingProjectJourneysIds.length) * 100;

	const oldOngoingProjectsNotMatching = oldOngoingProjectJourneyIds.filter((id) => !newOngoingProjectJourneysIds.includes(id));

	const bulkwriteProjectsUpdates: AnyBulkWriteOperation<TProject>[] = newProjectsJourneys.map((journey) => {
		return {
			updateOne: {
				filter: { _id: new ObjectId(journey.projeto.id) },
				update: {
					$set: {
						"jornada.anotacoes": journey.anotacoes,
						"jornada.estagios": journey.estagios,
						"jornada.dataUltimaInteracao": journey.dataUltimaInteracao,
						"jornada.dataEfetivacao": journey.dataEfetivacao,
					},
				},
			},
		};
	});

	// const bulkwriteProjectsUpdatesResult = await projectsCollection.bulkWrite(bulkwriteProjectsUpdates);
	return res.status(200).json({
		// oldOngoingProjectsNotMatching,
		// compatibility: percentageMatching,
		// ongoingCount: newOngoingProjectJourneys.length,
		// completedCount: newCompletedProjectJourneys.length,
		// journeys: newProjectsJourneys,
		// bulkwriteProjectsUpdatesResult,
		bulkwriteProjectsUpdates,
	});
}
