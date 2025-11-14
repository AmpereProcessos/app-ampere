import type { TFileReferenceDTO, TFileReferencesQueryParams } from "@/utils/schemas/crm/file-reference.schema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatWithoutDiacritics } from "../../formatting";

type UseFileReferencesByOpportunityIdParams = {
	opportunityId: string | null;
};
async function fetchFileReferencesByOpportunityId({ opportunityId }: UseFileReferencesByOpportunityIdParams) {
	try {
		if (!opportunityId) return [];
		const { data } = await axios.get(`/api/crm/file-references?opportunityId=${opportunityId}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export function useFileReferencesByOpportunityId({ opportunityId }: UseFileReferencesByOpportunityIdParams) {
	return useQuery({
		queryKey: ["file-references-by-opportunity", opportunityId],
		queryFn: async () => await fetchFileReferencesByOpportunityId({ opportunityId }),
	});
}

async function fetchFileReferencesByAnalysisId({ analysisId }: { analysisId: string }) {
	try {
		const { data } = await axios.get(`/api/crm/file-references?analysisId=${analysisId}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export function useFileReferencesByAnalysisId({ analysisId }: { analysisId: string }) {
	return useQuery({
		queryKey: ["file-references-by-analysis", analysisId],
		queryFn: async () => await fetchFileReferencesByAnalysisId({ analysisId }),
	});
}

async function fetchFileReferencesByClientId({ clientId }: { clientId: string }) {
	try {
		const { data } = await axios.get(`/api/crm/file-references?clientId=${clientId}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export function useFileReferencesByClientId({ clientId }: { clientId: string }) {
	return useQuery({
		queryKey: ["file-references-by-client", clientId],
		queryFn: async () => await fetchFileReferencesByClientId({ clientId }),
	});
}

export async function fetchFileReferencesByHomologationId({ homologationId }: { homologationId: string }) {
	try {
		const { data } = await axios.get(`/api/crm/file-references?homologationId=${homologationId}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export function useFileReferencesByHomologationId({ homologationId }: { homologationId: string }) {
	return useQuery({
		queryKey: ["file-references-by-homologation", homologationId],
		queryFn: async () => await fetchFileReferencesByHomologationId({ homologationId }),
	});
}

async function fetchFileReferencesByQuery({
	clientId,
	opportunityId,
	analysisId,
	homologationId,
	projectId,
	purchaseId,
	revenueId,
	serviceOrderId,
	callId,
}: TFileReferencesQueryParams) {
	try {
		const clientParam = clientId ? `clientId=${clientId}` : null;
		const opportunityParam = opportunityId ? `opportunityId=${opportunityId}` : null;
		const analysisParam = analysisId ? `analysisId=${analysisId}` : null;
		const homologationParam = homologationId ? `homologationId=${homologationId}` : null;
		const projectParam = projectId ? `projectId=${projectId}` : null;
		const purchaseParam = purchaseId ? `purchaseId=${purchaseId}` : null;
		const revenueParam = revenueId ? `revenueId=${revenueId}` : null;
		const serviceOrderParam = serviceOrderId ? `serviceOrderId=${serviceOrderId}` : null;
		const callParam = callId ? `callId=${callId}` : null;
		const param = [
			clientParam,
			opportunityParam,
			analysisParam,
			homologationParam,
			projectParam,
			purchaseParam,
			revenueParam,
			serviceOrderParam,
			callParam,
		]
			.filter((q) => !!q)
			.join("&");
		if (!param) return [];

		const { data } = await axios.get(`/api/crm/file-references/many?${param}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export type TUseFileReferencesFilters = {
	title: string;
	categories: string[];
};
export function useFileReferences({
	clientId,
	opportunityId,
	analysisId,
	homologationId,
	projectId,
	purchaseId,
	revenueId,
	serviceOrderId,
	callId,
}: TFileReferencesQueryParams) {
	const [filters, setFilters] = useState<TUseFileReferencesFilters>({
		title: "",
		categories: [],
	});

	function matchTitle(fileReference: TFileReferenceDTO) {
		if (filters.title.trim().length === 0) return true;
		return formatWithoutDiacritics(fileReference.titulo, true).includes(formatWithoutDiacritics(filters.title, true));
	}
	function matchCategories(fileReference: TFileReferenceDTO) {
		if (filters.categories.length === 0) return true;
		return fileReference.categorias?.some((c) => filters.categories.includes(c));
	}
	function handleModelData(data: TFileReferenceDTO[]) {
		return data.filter((fileReference) => matchTitle(fileReference) && matchCategories(fileReference));
	}
	return {
		...useQuery({
			queryKey: [
				"file-references-by-query",
				{ clientId, opportunityId, analysisId, homologationId, projectId, purchaseId, revenueId, serviceOrderId, callId },
			],
			queryFn: async () =>
				await fetchFileReferencesByQuery({
					clientId,
					opportunityId,
					analysisId,
					homologationId,
					projectId,
					purchaseId,
					revenueId,
					serviceOrderId,
					callId,
				}),
			select: (data) => handleModelData(data),
		}),
		queryKey: [
			"file-references-by-query",
			{ clientId, opportunityId, analysisId, homologationId, projectId, purchaseId, revenueId, serviceOrderId, callId },
		],
		filters,
		setFilters,
	};
}

async function fetchFileReferencesByCallId({ callId }: { callId: string }) {
	try {
		const { data } = await axios.get(`/api/crm/file-references?callId=${callId}`);
		return data.data as TFileReferenceDTO[];
	} catch (error) {
		throw error;
	}
}

export function useFileReferencesByCallId({ callId }: { callId: string }) {
	return useQuery({
		queryKey: ["file-references-by-call", callId],
		queryFn: async () => await fetchFileReferencesByCallId({ callId }),
	});
}
