import type {
	TPurchaseControlCompositionKitDTO,
	TPurchaseControlKanbanSimplifiedDTO,
	TPurchaseControlSimplifiedDTO,
	TPurchaseControlsQueryFilters,
	TPurchaseControlTagDTO,
	TPurchaseControlWithProjectDTO,
	TPurchaseProjectDTO,
} from "@/utils/schemas/purchases";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics } from "../formatting";
import { useQuery } from "@tanstack/react-query";
import type { TPurchaseControlsByFiltersResult } from "@/pages/api/controles-compras/search";
import type { TGetPurchaseControlCompositionKitsOutput } from "@/pages/api/controles-compras/kits";

async function fetchPurchasesControls({ queryTags, queryPendingConclusion }: TPurchaseControlQueryParams) {
	try {
		const { data } = await axios.get(`/api/controles-compras?queryTags=${queryTags}&queryPendingConclusion=${queryPendingConclusion}`);
		return data.data as TPurchaseControlKanbanSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

type TPurchaseControlQueryParams = {
	queryTags: string[];
	queryPendingConclusion: boolean;
};
type TPurchaseControlFilters = {
	title: string;
	status: string[];
	tags: string[];
	deliveryStatus: string[];
};
export function usePurchaseControls() {
	const [queryParams, setQueryParams] = useState<TPurchaseControlQueryParams>({
		queryTags: [],
		queryPendingConclusion: true,
	});
	const [filters, setFilters] = useState<TPurchaseControlFilters>({
		title: "",
		status: [],
		tags: [],
		deliveryStatus: [],
	});

	function matchTitle(control: TPurchaseControlKanbanSimplifiedDTO) {
		if (filters.title.trim().length === 0) return true;
		return formatWithoutDiacritics(control.titulo, true).includes(formatWithoutDiacritics(filters.title, true));
	}
	function matchStatus(control: TPurchaseControlKanbanSimplifiedDTO) {
		if (filters.status.length === 0) return true;
		return filters.status.includes(control.status);
	}
	function matchTags(control: TPurchaseControlKanbanSimplifiedDTO) {
		if (filters.tags.length === 0) return true;
		return control.etiquetas.some((t) => filters.tags.includes(t.id));
	}
	function matchDeliveryStatus(control: TPurchaseControlKanbanSimplifiedDTO) {
		if (filters.deliveryStatus.length === 0) return true;
		return filters.deliveryStatus.includes(control.entrega.status);
	}
	function handleModelData(data: TPurchaseControlKanbanSimplifiedDTO[]) {
		return data.filter((control) => matchTitle(control) && matchStatus(control) && matchTags(control) && matchDeliveryStatus(control));
	}

	function updateQueryParams(params: Partial<TPurchaseControlQueryParams>) {
		setQueryParams((prev) => ({ ...prev, ...params }));
	}
	return {
		...useQuery({
			queryKey: ["purchase-controls", queryParams],
			queryFn: async () => await fetchPurchasesControls(queryParams),
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
		queryParams,
		updateQueryParams,
	};
}

async function fetchPurchaseControlsByFilters({ page, filters }: { page: number; filters: TPurchaseControlsQueryFilters }) {
	try {
		const { data } = await axios.post(`/api/controles-compras/search?page=${page}`, filters);

		return data.data as TPurchaseControlsByFiltersResult;
	} catch (error) {
		throw error;
	}
}

export type TUsePurchaseControlsByFiltersFilters = { page: number } & TPurchaseControlsQueryFilters;
export function usePurchaseControlsByFilters() {
	const [filters, setFilters] = useState<TUsePurchaseControlsByFiltersFilters>({
		page: 1,
		title: "",
		supplier: "",
		carrier: "",
		period: {},
		tags: [],
		pendingOrder: false,
		pendingDelivery: false,
	});

	function updateFilters(info: Partial<TUsePurchaseControlsByFiltersFilters>) {
		setFilters((prev) => ({ ...prev, ...info }));
	}

	const query = useQuery({
		queryKey: ["purchase-controls-by-filters", filters],
		queryFn: async () => await fetchPurchaseControlsByFilters({ page: filters.page, filters }),
	});

	return {
		...query,
		filters,
		updateFilters,
	};
}
async function fetchPurchaseControlById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/controles-compras?id=${id}`);
		return data.data as TPurchaseControlWithProjectDTO;
	} catch (error) {
		throw error;
	}
}

export function usePurchaseControlByProjectId({ projectId }: { projectId: string }) {
	return useQuery({
		queryKey: ["purchase-control-by-project-id", projectId],
		queryFn: async () => await fetchPurchaseControlByProjectId({ projectId }),
	});
}
async function fetchPurchaseControlByProjectId({ projectId }: { projectId: string }) {
	try {
		const { data } = await axios.get(`/api/controles-compras?projectId=${projectId}`);
		return data.data as TPurchaseControlSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function usePurchaseControlById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["purchase-control-by-id", id],
		queryFn: async () => await fetchPurchaseControlById({ id }),
	});
}

async function fetchPurchasesControlTags() {
	try {
		const { data } = await axios.get("/api/controles-compras/tags");
		return data.data as TPurchaseControlTagDTO[];
	} catch (error) {
		throw error;
	}
}

export function usePurchaseControlsTags() {
	return useQuery({
		queryKey: ["purchase-controls-tags"],
		queryFn: fetchPurchasesControlTags,
	});
}

async function fetchPurchaseProject({ projectId }: { projectId: string | null }) {
	try {
		if (!projectId) return null;
		const { data } = await axios.get(`/api/controles-compras/projeto?projectId=${projectId}`);
		return data.data as TPurchaseProjectDTO;
	} catch (error) {
		throw error;
	}
}

export function usePurchaseProject({ projectId }: { projectId: string | null }) {
	return useQuery({
		queryKey: ["purchase-project", projectId],
		queryFn: async () => fetchPurchaseProject({ projectId }),
	});
}

async function fetchPurchaseControlCompositionKitById({ id }: { id: string }) {
	try {
		const { data }: { data: TGetPurchaseControlCompositionKitsOutput } = await axios.get(`/api/controles-compras/kits?id=${id}`);
		return data.data as Exclude<TGetPurchaseControlCompositionKitsOutput["data"], TPurchaseControlCompositionKitDTO[]>;
	} catch (error) {
		console.log("Error running fetchPurchaseControlCompositionKitById", error);
		throw error;
	}
}
export function usePurchaseControlCompositionKitById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["purchase-control-composition-kit-by-id", id],
		queryFn: async () => await fetchPurchaseControlCompositionKitById({ id }),
	});
}
async function fetchPurchaseControlCompositionKits() {
	try {
		const { data }: { data: TGetPurchaseControlCompositionKitsOutput } = await axios.get("/api/controles-compras/kits");
		return data.data as Exclude<TGetPurchaseControlCompositionKitsOutput["data"], TPurchaseControlCompositionKitDTO>;
	} catch (error) {
		console.log("Error running fetchPurchaseControlCompositionKitById", error);
		throw error;
	}
}
export function usePurchaseControlCompositionKits() {
	return useQuery({
		queryKey: ["purchase-control-composition-kits"],
		queryFn: fetchPurchaseControlCompositionKits,
	});
}
