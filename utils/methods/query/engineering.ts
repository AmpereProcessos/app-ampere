import type { TProjectDTO } from "@/utils/schemas/projects";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectNestedFieldValue } from "../formatting";
import type { TGetEngineeringProjectsOutput } from "@/pages/api/projects/engenharia";
import type { TEngineeringProjectsKanbanInput, TEngineeringProjectsKanbanOutput } from "@/pages/api/projects/engenharia/kanban";

async function fetchProjects() {
	try {
		const { data }: { data: TGetEngineeringProjectsOutput } = await axios.get("/api/projects/engenharia");
		return data.data;
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
	function matchSearch(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.search.trim().length === 0) return true;
		return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase());
	}
	function matchSeller(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.sellerName.length === 0) return true;
		return filters.sellerName.includes(project.vendedor?.nome);
	}
	function matchCity(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.city.length === 0) return true;
		return filters.city.includes(project.cidade);
	}
	function matchDeliveryStatus(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.deliveryStatus.length === 0) return true;
		return filters.deliveryStatus.includes(project.compra?.statusEntrega || "");
	}
	function matchExecutionStatus(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.executionStatus.length === 0) return true;
		return filters.executionStatus.includes(project.obra?.statusDaObra || "");
	}
	function matchTagIds(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.tagIds.length === 0) return true;
		const projectTagIds = (project.etiquetas ?? []).map((e) => e.id);
		return filters.tagIds.some((t) => projectTagIds.includes(t));
	}
	function matchPendingVistory(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.pendingVistory) return true;
		return !!project.homologacao.vistoria.dataSolicitacao && !project.homologacao.vistoria.dataEfetivacao;
	}
	function matchInspectionStatus(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.inspectionStatus.length === 0) return true;
		return filters.inspectionStatus.includes(project.vistoria?.status || "");
	}
	function matchGrantingStatus(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.grantingStatus.length === 0) return true;
		return filters.grantingStatus.includes(project.homologacao.status);
	}
	function matchServiceType(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (filters.serviceType.length === 0) return true;
		return filters.serviceType.includes(project.tipoDeServico);
	}
	function matchNecessaryHomologation(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.necessaryHomologation) return true;
		return project.homologacao.homologar;
	}
	function matchNotNecessaryHomologation(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.notNecessaryHomologation) return true;
		return !project.homologacao.homologar;
	}
	function matchNecessaryDistribution(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.necessaryDistribution) return true;
		return project.homologacao.instalacao.dependentes.length > 0;
	}

	function matchMissingDraw(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.missingDraw) return true;
		return !project.homologacao.pendencias.desenhos;
	}
	function matchMissingDiagram(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.missingDiagram) return true;
		return !project.homologacao.pendencias.diagramas;
	}
	function matchMissingSignature(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.missingSignature) return true;
		return !!project.homologacao.documentacao.dataLiberacao && !project.homologacao.documentacao.dataAssinatura;
	}
	function matchDrawReady(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.drawReady) return true;
		return !!project.homologacao.pendencias.desenhos;
	}
	function matchDate(project: TGetEngineeringProjectsOutput["data"][number]) {
		if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
		const fieldValue = getProjectNestedFieldValue(project, filters.date.field);
		return (
			// @ts-ignore
			fieldValue >= filters.date.after &&
			// @ts-ignore
			fieldValue <= filters.date.before
		);
	}
	function handleModelData(data: TGetEngineeringProjectsOutput["data"]) {
		return data.filter(
			(project: TGetEngineeringProjectsOutput["data"][number]) =>
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

async function fetchEngineeringProjectsKanban(input: TEngineeringProjectsKanbanInput) {
	try {
		const { data }: { data: TEngineeringProjectsKanbanOutput } = await axios.post("/api/projects/engenharia/kanban", input);
		return data.data;
	} catch (error) {
		throw error;
	}
}

export function useEngineeringProjectsKanban() {
	const [filters, setFilters] = useState<TEngineeringProjectsKanbanInput>({
		search: "",
		projectTypes: [],
		cities: [],
		ufs: [],
		deliveryStatus: [],
		tagIds: [],
		sellerNames: [],
		accessGrantingStatus: [],
		pendingVistoryOnly: false,
		pendingDrawingOnly: false,
		pendingDiagramOnly: false,
		period: {},
	});
	function updateFilters(newFilters: Partial<TEngineeringProjectsKanbanInput>) {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}
	return {
		...useQuery({
			queryKey: ["engineering-projects-kanban", filters],
			queryFn: () => fetchEngineeringProjectsKanban(filters),
		}),
		filters,
		updateFilters,
	};
}
