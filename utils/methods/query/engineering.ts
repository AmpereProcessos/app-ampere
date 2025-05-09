import type { TProjectDTO } from "@/utils/schemas/projects";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectNestedFieldValue } from "../formatting";

async function fetchProjects() {
	try {
		const { data } = await axios.get("/api/projects/projetos");
		return data as TProjectDTO[];
	} catch (error) {
		throw error;
	}
}

type UseEngineeringProjectsFilters = {
	search: string;
	sellerName: string[];
	city: string[];
	tagIds: string[];
	analyst: string[];
	deliveryStatus: string[];
	executionStatus: string[];
	inspectionStatus: string[];
	grantingStatus: string[];
	serviceType: string[];
	necessaryHomologation: boolean;
	notNecessaryHomologation: boolean;
	necessaryDistribution: boolean;
	pendingVistory: boolean;
	missingDraw: boolean;
	missingDiagram: boolean;
	missingSignature: boolean;
	drawReady: boolean;
	date: {
		after: string | null;
		before: string | null;
		field: string | null;
	};
};
export function useEngineeringProjects() {
	const [filters, setFilters] = useState<UseEngineeringProjectsFilters>({
		search: "",
		sellerName: [],
		city: [],
		tagIds: [],
		analyst: [],
		deliveryStatus: [],
		executionStatus: [],
		inspectionStatus: [],
		grantingStatus: [],
		serviceType: [],
		necessaryHomologation: false,
		notNecessaryHomologation: false,
		necessaryDistribution: false,
		pendingVistory: false,
		missingDraw: false,
		missingDiagram: false,
		missingSignature: false,
		drawReady: false,
		date: {
			after: null,
			before: null,
			field: null,
		},
	});
	function matchSearch(project: TProjectDTO) {
		if (filters.search.trim().length === 0) return true;
		return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase());
	}
	function matchSeller(project: TProjectDTO) {
		if (filters.sellerName.length === 0) return true;
		return filters.sellerName.includes(project.vendedor?.nome);
	}
	function matchCity(project: TProjectDTO) {
		if (filters.city.length === 0) return true;
		return filters.city.includes(project.cidade);
	}
	function matchDeliveryStatus(project: TProjectDTO) {
		if (filters.deliveryStatus.length === 0) return true;
		return filters.deliveryStatus.includes(project.compra?.statusEntrega || "");
	}
	function matchExecutionStatus(project: TProjectDTO) {
		if (filters.executionStatus.length === 0) return true;
		return filters.executionStatus.includes(project.obra?.statusDaObra || "");
	}
	function matchTagIds(project: TProjectDTO) {
		if (filters.tagIds.length === 0) return true;
		const projectTagIds = (project.etiquetas ?? []).map((e) => e.id);
		return filters.tagIds.some((t) => projectTagIds.includes(t));
	}
	function matchPendingVistory(project: TProjectDTO) {
		if (!filters.pendingVistory) return true;
		return !!project.homologacao.vistoria.dataSolicitacao && !project.homologacao.vistoria.dataEfetivacao;
	}
	function matchInspectionStatus(project: TProjectDTO) {
		if (filters.inspectionStatus.length === 0) return true;
		return filters.inspectionStatus.includes(project.vistoria?.status || "");
	}
	function matchGrantingStatus(project: TProjectDTO) {
		if (filters.grantingStatus.length === 0) return true;
		return filters.grantingStatus.includes(project.homologacao.status);
	}
	function matchServiceType(project: TProjectDTO) {
		if (filters.serviceType.length === 0) return true;
		return filters.serviceType.includes(project.tipoDeServico);
	}
	function matchNecessaryHomologation(project: TProjectDTO) {
		if (!filters.necessaryHomologation) return true;
		return project.homologacao.homologar;
	}
	function matchNotNecessaryHomologation(project: TProjectDTO) {
		if (!filters.notNecessaryHomologation) return true;
		return !project.homologacao.homologar;
	}
	function matchNecessaryDistribution(project: TProjectDTO) {
		if (!filters.necessaryDistribution) return true;
		return project.homologacao.instalacao.dependentes.length > 0;
	}

	function matchMissingDraw(project: TProjectDTO) {
		if (!filters.missingDraw) return true;
		return !project.homologacao.pendencias.desenhos;
	}
	function matchMissingDiagram(project: TProjectDTO) {
		if (!filters.missingDiagram) return true;
		return !project.homologacao.pendencias.diagramas;
	}
	function matchMissingSignature(project: TProjectDTO) {
		if (!filters.missingSignature) return true;
		return !!project.homologacao.documentacao.dataLiberacao && !project.homologacao.documentacao.dataAssinatura;
	}
	function matchDrawReady(project: TProjectDTO) {
		if (!filters.drawReady) return true;
		return !!project.homologacao.pendencias.desenhos;
	}
	function matchDate(project: TProjectDTO) {
		if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
		const fieldValue = getProjectNestedFieldValue(project, filters.date.field);
		return (
			// @ts-ignore
			fieldValue >= filters.date.after &&
			// @ts-ignore
			fieldValue <= filters.date.before
		);
	}
	function handleModelData(data: TProjectDTO[]) {
		return data.filter(
			(project: TProjectDTO) =>
				matchSearch(project) &&
				matchSeller(project) &&
				matchCity(project) &&
				matchDeliveryStatus(project) &&
				matchExecutionStatus(project) &&
				matchTagIds(project) &&
				matchInspectionStatus(project) &&
				matchGrantingStatus(project) &&
				matchServiceType(project) &&
				matchPendingVistory(project) &&
				matchNecessaryHomologation(project) &&
				matchNotNecessaryHomologation(project) &&
				matchNecessaryDistribution(project) &&
				matchMissingDraw(project) &&
				matchMissingDiagram(project) &&
				matchMissingSignature(project) &&
				matchDrawReady(project) &&
				matchDate(project),
		);
	}
	return {
		...useQuery({
			queryKey: ["engineering-projects"],
			queryFn: fetchProjects,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}
