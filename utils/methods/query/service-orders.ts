import type { TServiceOrdersByFiltersResult } from "@/pages/api/ordensDeServico/search";
import type {
	TPersonalizedServiceOrderFilter,
	TServiceOrderDTO,
	TServiceOrderProjectDTO,
	TServiceOrderSimplifiedDTO,
	TServiceOrderTag,
	TServiceOrderTagDTO,
	TServiceOrderWithProjectDTO,
} from "@/utils/schemas/service-order";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type FetchServiceOrdersParams = {
	after: string;
	before: string;
	status: string;
	simplified: boolean;
	responsibleName: string;
};

export type TServiceOrderQueryParams = {
	queryTags: string[];
	queryPendingConclusion: boolean;
};

async function fetchServiceOrders({ queryTags, queryPendingConclusion }: TServiceOrderQueryParams) {
	try {
		const { data } = await axios.get(`/api/ordensDeServico?queryTags=${queryTags}&queryPendingConclusion=${queryPendingConclusion}`);
		return data.data as TServiceOrderSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function useServiceOrders() {
	const [queryParams, setQueryParams] = useState<TServiceOrderQueryParams>({
		queryTags: [],
		queryPendingConclusion: true,
	});
	function updateQueryParams(params: Partial<TServiceOrderQueryParams>) {
		setQueryParams((prev) => ({ ...prev, ...params }));
	}
	return {
		...useQuery({
			queryKey: ["service-orders", queryParams],
			queryFn: async () => await fetchServiceOrders(queryParams),
			refetchOnWindowFocus: false,
		}),
		queryParams,
		updateQueryParams,
	};
}
async function fetchServiceOrdersByProject({ projectId }: { projectId: string }) {
	try {
		const { data } = await axios.get(`/api/ordensDeServico?projectId=${projectId}`);
		return data.data as TServiceOrderSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function useProjectServiceOrders({ projectId }: { projectId: string }) {
	return useQuery({
		queryKey: ["project-service-orders", projectId],
		queryFn: async () => await fetchServiceOrdersByProject({ projectId }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrderById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/ordensDeServico?id=${id}`);
		return data.data as TServiceOrderWithProjectDTO;
	} catch (error) {
		throw error;
	}
}
export function useServiceOrderById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["service-order", id],
		queryFn: async () => fetchServiceOrderById({ id }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrdersByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedServiceOrderFilter }) {
	try {
		const { data } = await axios.post(`/api/ordensDeServico/search?page=${page}`, filters);

		return data.data as TServiceOrdersByFiltersResult;
	} catch (error) {
		throw error;
	}
}

export function useServiceOrdersByPersonalizedFilters() {
	const [filters, setFilters] = useState<TPersonalizedServiceOrderFilter>({
		page: 1,
		name: "",
		responsible: "",
		state: [],
		city: [],
		category: [],
		urgency: [],
		authors: [],
		period: {
			after: null,
			before: null,
			field: null,
		},
		pending: true,
		released: false,
	});

	function updateFilters(info: Partial<TPersonalizedServiceOrderFilter>) {
		setFilters((prev) => ({ ...prev, ...info }));
	}

	return {
		...useQuery({
			queryKey: ["service-orders-by-filters", filters],
			queryFn: async () => await fetchServiceOrdersByPersonalizedFilters({ page: filters.page, filters }),
		}),
		filters,
		updateFilters,
	};
}

async function getServiceOrderTags() {
	try {
		const { data } = await axios.get("/api/ordensDeServico/tags");
		return data.data as TServiceOrderTagDTO[];
	} catch (error) {
		throw error;
	}
}

export function useServiceOrderTags() {
	return useQuery({
		queryKey: ["service-order-tags"],
		queryFn: getServiceOrderTags,
	});
}

async function fetchServiceOrderProject({ projectId }: { projectId: string | null }) {
	try {
		if (!projectId) return null;
		const { data } = await axios.get(`/api/ordensDeServico/projeto?projectId=${projectId}`);
		return data.data as TServiceOrderProjectDTO;
	} catch (error) {
		throw error;
	}
}

export function useServiceOrderProject({ projectId }: { projectId: string | null }) {
	return useQuery({
		queryKey: ["service-order-project", projectId],
		queryFn: async () => fetchServiceOrderProject({ projectId }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrdersByResponsible({ responsibleName }: { responsibleName: string }) {
	try {
		const { data } = await axios.get(`/api/ordensDeServico?responsibleName=${responsibleName}&queryPendingConclusion=true`);
		return data.data as TServiceOrderSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function useServiceOrdersByResponsible({ responsibleName }: { responsibleName: string }) {
	return useQuery({
		queryKey: ["service-orders-by-responsible", responsibleName],
		queryFn: async () => fetchServiceOrdersByResponsible({ responsibleName }),
	});
}

async function fetchServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }: { technicalAnalysisId: string }) {
	try {
		const { data } = await axios.get(`/api/ordensDeServico?technicalAnalysisId=${technicalAnalysisId}`);
		return data.data as TServiceOrderSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function useServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }: { technicalAnalysisId: string }) {
	return useQuery({
		queryKey: ["service-orders-by-technical-analysis", technicalAnalysisId],
		queryFn: async () => fetchServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }),
	});
}
