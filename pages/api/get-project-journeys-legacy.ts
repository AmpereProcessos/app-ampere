import { contractVariables } from "@/lib/contract-generation/variables";
import { formatAsSlug, formatDateAsLocale } from "@/utils/methods/formatting";
import type { TContractTemplateVariable } from "@/utils/schemas/contract-templates-variables";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TMaterialUpdateRegistry } from "@/utils/schemas/material-updates-registry";
import type { TMaterial } from "@/utils/schemas/materials";
import { PROJECT_JOURNEYS_COLLECTION_NAME, type TProjectJourney } from "@/utils/schemas/project-journey";
import type { TProject } from "@/utils/schemas/projects";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import type { TEmployee } from "@/utils/schemas/users";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import axios from "axios";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { type AnyBulkWriteOperation, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const projectsDb = await connectToDatabase();
	const projectsCollection = projectsDb.collection<TProject>("dados");
	const projectsJourneysCollection = projectsDb.collection<TProjectJourney>(PROJECT_JOURNEYS_COLLECTION_NAME);

	const projects = await projectsCollection
		.find(
			{
				"contrato.status": "ASSINADO",
				tipoDeServico: { $nin: ["OPERAÇÃO E MANUTENÇÃO", "CONSÓRCIO DE ENERGIA", "MONITORAMENTO"] },
			},
			{
				sort: {
					qtde: 1,
				},
			},
		)
		.toArray();

	function getProjectJourneyNotesForContacts(project: TProject) {
		if (project.jornada.contatos)
			return `
			CONTATOS: ${project.jornada.contatos}\n
			`;
		return "";
	}
	function getProjectJourneyNotesForCuidados(project: TProject) {
		if (project.jornada.cuidados)
			return `
			CUIDADOS: ${project.jornada.cuidados}\n
			`;
		return "";
	}
	function getProjectJourneyNotesForObsJornada(project: TProject) {
		if (project.jornada.obsJornada)
			return `
			OBSERVAÇÕES: ${project.jornada.obsJornada}
			`;
		return "";
	}
	function getProjectJourneyConclutionDate(project: TProject) {
		if (project.jornada.dataConclusao) return project.jornada.dataConclusao;

		if (project.tipoDeServico === "SISTEMA FOTOVOLTAICO" || project.tipoDeServico === "AUMENTO DE SISTEMA FOTOVOLTAICO") {
			if (project.homologacao.vistoria.dataEfetivacao) return project.homologacao.vistoria.dataEfetivacao;
			if (project.homologacao.dataEfetivacao) return project.homologacao.dataEfetivacao;
			if (project.obra.saida) return project.obra.saida;
			return null;
		}

		if (project.tipoDeServico === "OPERAÇÃO E MANUTENÇÃO") {
			if (project.contrato.dataAssinatura) return project.contrato.dataAssinatura;
			return "-";
		}

		if (project.homologacao.dataEfetivacao) return project.homologacao.dataEfetivacao;
		if (project.obra.saida) return project.obra.saida;
		if (project.contrato.dataAssinatura) return project.contrato.dataAssinatura;
		return "-";
	}
	const projectsJourneys: TProjectJourney[] = projects.map((project) => {
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
					concluido: !!project.jornada.boasVindas,
				},
				{
					ordem: 2,
					titulo: "ASSINATURA DAS DOCUMENTAÇÕES",
					versao: "LEGADO",
					concluido: !!project.jornada.assDocumentacoes,
				},
				{
					ordem: 3,
					titulo: "RESPOSTA DA CONCESSIONÁRIA",
					versao: "LEGADO",
					concluido: !!project.jornada.respConcessionaria,
				},
				{
					ordem: 4,
					titulo: "COMPRA DO KIT",
					versao: "LEGADO",
					concluido: !!project.jornada.compraDoKit,
				},
				{
					ordem: 5,
					titulo: "NF FATURADA",
					versao: "LEGADO",
					concluido: !!project.jornada.nfFaturada,
				},
				{
					ordem: 6,
					titulo: "PREVISÃO DE ENTREGA",
					versao: "LEGADO",
					concluido: !!project.jornada.prevChegada,
				},
				{
					ordem: 7,
					titulo: "ENTREGA DO KIT",
					versao: "LEGADO",
					concluido: !!project.jornada.entregaDoKit,
				},
				{
					ordem: 8,
					titulo: "INSTALAÇÃO AGENDADA",
					versao: "LEGADO",
					concluido: !!project.jornada.instalacaoAgendada,
				},
				{
					ordem: 9,
					titulo: "INSTALAÇÃO REALIZADA",
					versao: "LEGADO",
					concluido: !!project.jornada.instalacaoRealizada,
				},
				{
					ordem: 10,
					titulo: "VISTORIA REALIZADA",
					versao: "LEGADO",
					concluido: !!project.jornada.vistoriaConcessionaria,
				},
				{
					ordem: 11,
					titulo: "SISTEMA OPERANTE",
					versao: "LEGADO",
					concluido: !!project.jornada.sistemaLigado,
				},
				{
					ordem: 12,
					titulo: "ENTREGA TÉCNICA",
					versao: "LEGADO",
					concluido: !!project.jornada.entregaTecnica,
				},
				{
					ordem: 13,
					titulo: "JORNADA CONCLUÍDA",
					versao: "LEGADO",
					concluido: !!project.jornada.jornadaConcluida,
				},
			],
			dataEfetivacao: getProjectJourneyConclutionDate(project),
			dataUltimaInteracao: project.jornada.dataUltimoContato,
		};
	});

	return res.status(200).json("OK");
}
