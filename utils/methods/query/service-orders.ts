import type { TServiceOrdersByFiltersResult } from "@/pages/api/ordensDeServico/search";
import type { TServiceOrderStatsInput, TServiceOrderStatsOutput } from "@/pages/api/ordensDeServico/stats";
import type {
	TPersonalizedServiceOrderFilter,
	TServiceOrderDTO,
	TServiceOrderProjectDTO,
	TServiceOrderSimplifiedDTO,
	TServiceOrderTag,
	TServiceOrderTagDTO,
	TServiceOrderWithProjectDTO,
} from "@/utils/schemas/service-order";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

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
	const { data } = await axios.get(`/api/ordensDeServico?queryTags=${queryTags}&queryPendingConclusion=${queryPendingConclusion}`);
	return data.data as TServiceOrderSimplifiedDTO[];
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
	const { data } = await axios.get(`/api/ordensDeServico?projectId=${projectId}`);
	return data.data as TServiceOrderSimplifiedDTO[];
}

export function useProjectServiceOrders({ projectId }: { projectId: string }) {
	return useQuery({
		queryKey: ["project-service-orders", projectId],
		queryFn: async () => await fetchServiceOrdersByProject({ projectId }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrderById({ id }: { id: string }) {
	const { data } = await axios.get(`/api/ordensDeServico?id=${id}`);
	return data.data as TServiceOrderWithProjectDTO;
}
export function useServiceOrderById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["service-order", id],
		queryFn: async () => fetchServiceOrderById({ id }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrdersByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedServiceOrderFilter }) {
	const { data } = await axios.post(`/api/ordensDeServico/search?page=${page}`, filters);

	return data.data as TServiceOrdersByFiltersResult;
}

type UseServiceOrdersByPersonalizedFiltersParams = {
	initialFilters: Partial<TPersonalizedServiceOrderFilter>;
};
export function useServiceOrdersByPersonalizedFilters({ initialFilters }: UseServiceOrdersByPersonalizedFiltersParams) {
	const [filters, setFilters] = useState<TPersonalizedServiceOrderFilter>({
		page: initialFilters.page || 1,
		name: initialFilters.name || "",
		responsible: initialFilters.responsible || "",
		state: initialFilters.state || [],
		city: initialFilters.city || [],
		tags: initialFilters.tags || [],
		category: initialFilters.category || [],
		urgency: initialFilters.urgency || [],
		authors: initialFilters.authors || [],
		period: {
			after: initialFilters.period?.after || null,
			before: initialFilters.period?.before || null,
			field: initialFilters.period?.field || null,
		},
		topologies: initialFilters.topologies || [],
		roofTypes: initialFilters.roofTypes || [],
		pending: initialFilters.pending || true,
		released: initialFilters.released || false,
		notReleased: initialFilters.notReleased || false,
		projectEquipmentDelivered: initialFilters.projectEquipmentDelivered || false,
		projectEquipmentNotDelivered: initialFilters.projectEquipmentNotDelivered || false,
		orderBy: {
			direction: initialFilters.orderBy?.direction || "desc",
			field: initialFilters.orderBy?.field || "dataInsercao",
		},
		missingObservations: initialFilters.missingObservations || false,
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
	const { data } = await axios.get("/api/ordensDeServico/tags");
	return data.data as TServiceOrderTagDTO[];
}

export function useServiceOrderTags() {
	return useQuery({
		queryKey: ["service-order-tags"],
		queryFn: getServiceOrderTags,
	});
}

async function fetchServiceOrderProject({ projectId }: { projectId: string | null }) {
	if (!projectId) return null;
	const { data } = await axios.get(`/api/ordensDeServico/projeto?projectId=${projectId}`);
	return data.data as TServiceOrderProjectDTO;
}

export function useServiceOrderProject({ projectId }: { projectId: string | null }) {
	return useQuery({
		queryKey: ["service-order-project", projectId],
		queryFn: async () => fetchServiceOrderProject({ projectId }),
		refetchOnWindowFocus: false,
	});
}

async function fetchServiceOrdersByResponsible({ responsibleName }: { responsibleName: string }) {
	const { data } = await axios.get(`/api/ordensDeServico?responsibleName=${responsibleName}&queryPendingConclusion=true`);
	return data.data as TServiceOrderSimplifiedDTO[];
}

export function useServiceOrdersByResponsible({ responsibleName }: { responsibleName: string }) {
	return useQuery({
		queryKey: ["service-orders-by-responsible", responsibleName],
		queryFn: async () => fetchServiceOrdersByResponsible({ responsibleName }),
	});
}

async function fetchServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }: { technicalAnalysisId: string }) {
	const { data } = await axios.get(`/api/ordensDeServico?technicalAnalysisId=${technicalAnalysisId}`);
	return data.data as TServiceOrderSimplifiedDTO[];
}

export function useServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }: { technicalAnalysisId: string }) {
	return useQuery({
		queryKey: ["service-orders-by-technical-analysis", technicalAnalysisId],
		queryFn: async () => fetchServiceOrdersByTechnicalAnalysis({ technicalAnalysisId }),
	});
}

async function fetchServiceOrdersStats(input: TServiceOrderStatsInput) {
	const { data }: { data: TServiceOrderStatsOutput } = await axios.post("/api/ordensDeServico/stats", input);
	return data.data;
}

export function useServiceOrdersStats() {
	const initialPeriodStart = dayjs().startOf("month").toISOString();
	const initialPeriodEnd = dayjs().endOf("month").toISOString();
	const [filters, setFilters] = useState<TServiceOrderStatsInput>({
		period: {
			after: initialPeriodStart,
			before: initialPeriodEnd,
		},
	});
	function updateFilters(info: Partial<TServiceOrderStatsInput>) {
		setFilters((prev) => ({ ...prev, ...info }));
	}
	return {
		...useQuery({
			queryKey: ["service-orders-stats", filters],
			queryFn: async () => await fetchServiceOrdersStats(filters),
		}),
		filters,
		updateFilters,
	};
}
