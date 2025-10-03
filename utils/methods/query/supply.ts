import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TProjectDTO } from "@/utils/schemas/projects";
import type { TPurchaseControlDeliveryTrackingDTO } from "@/utils/schemas/purchases";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics, getProjectNestedFieldValue } from "../formatting";

async function fetchProjects() {
	try {
		const { data } = await axios.get("/api/projects/suprimentos");
		return data as TProjectDTO[];
	} catch (error) {
		throw error;
	}
}

type TSupplyProjectsFilters = {
	supplyStatus: string[];
	deliveryStatus: string[];
	accessGrantingStatus: string[];
	yetToBuy: boolean;
	search: string;
	date: {
		after: string | null;
		before: string | null;
		field: string | null;
	};
};
export function useSupplyProjects({ enabled }: { enabled: boolean }) {
	const [filters, setFilters] = useState<TSupplyProjectsFilters>({
		supplyStatus: [],
		deliveryStatus: [],
		accessGrantingStatus: [],
		yetToBuy: false,
		search: "",
		date: {
			after: null,
			before: null,
			field: null,
		},
	});
	function matchSupplyStatus(project: TProjectDTO) {
		if (filters.supplyStatus.length === 0) return true;
		return filters.supplyStatus.includes(project.compra.status || "");
	}
	function matchDeliveryStatus(project: TProjectDTO) {
		if (filters.deliveryStatus.length === 0) return true;
		return filters.deliveryStatus.includes(project.compra.statusEntrega || "");
	}
	function matchAccessGrantingStatus(project: TProjectDTO) {
		if (filters.accessGrantingStatus.length === 0) return true;
		return filters.accessGrantingStatus.includes(project.homologacao.status);
	}
	function matchDate(project: TProjectDTO) {
		if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
		const fieldValue = getProjectNestedFieldValue(project, filters.date.field);
		return fieldValue >= filters.date.after && fieldValue <= filters.date.before;
	}
	function matchYetToBuy(project: TProjectDTO) {
		if (!filters.yetToBuy) return true;
		return project.homologacao.status === "APROVADO" && !project.compra.dataPedido;
	}
	function matchSearch(project: TProjectDTO) {
		if (filters.search.trim().length === 0) return true;
		return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase());
	}
	function handleModelData(data: TProjectDTO[]) {
		return data.filter(
			(project: TProjectDTO) =>
				matchSupplyStatus(project) &&
				matchDeliveryStatus(project) &&
				matchYetToBuy(project) &&
				matchAccessGrantingStatus(project) &&
				matchDate(project) &&
				matchSearch(project),
		);
	}
	return {
		...useQuery({ queryKey: ["supply-projects"], queryFn: fetchProjects, select: (data) => handleModelData(data) }),
		filters,
		setFilters,
	};
}

type TProjectsInDeliveryFilters = {
	search: string;
	deliveryStatus: string[];
	cities: string[];
	ufs: string[];
	tagIds: string[];
	purchasedOnly: boolean;
	deliveredRecentOnly: boolean;
};

async function fetchProjectsInDelivery(params: TProjectsInDeliveryFilters) {
	try {
		const queryParams = new URLSearchParams();

		if (params.search.trim().length > 0) queryParams.append("search", params.search);
		if (params.deliveryStatus.length > 0) queryParams.append("deliveryStatus", params.deliveryStatus.join(","));
		if (params.cities.length > 0) queryParams.append("cities", params.cities.join(","));
		if (params.ufs.length > 0) queryParams.append("ufs", params.ufs.join(","));
		if (params.tagIds.length > 0) queryParams.append("tagIds", params.tagIds.join(","));
		if (params.purchasedOnly) queryParams.append("purchasedOnly", "true");
		if (params.deliveredRecentOnly) queryParams.append("deliveredRecentOnly", "true");

		const { data } = await axios.get(`/api/projects/entregas?${queryParams.toString()}`);
		return data.data as TPurchaseControlDeliveryTrackingDTO[];
	} catch (error) {
		throw error;
	}
}

type UseProjectsInDeliveryProps = {
	initialFilters?: Partial<TProjectsInDeliveryFilters>;
};
export function useProjectsInDelivery({ initialFilters }: UseProjectsInDeliveryProps) {
	const [filters, setFilters] = useState<TProjectsInDeliveryFilters>({
		search: initialFilters?.search || "",
		deliveryStatus: initialFilters?.deliveryStatus || [],
		cities: initialFilters?.cities || [],
		ufs: initialFilters?.ufs || [],
		tagIds: initialFilters?.tagIds || [],
		purchasedOnly: initialFilters?.purchasedOnly || true,
		deliveredRecentOnly: initialFilters?.deliveredRecentOnly || false,
	});

	const querParamsDebounced = useDebounceMemo(filters, 500);
	const query = useQuery({
		queryKey: ["projects-in-delivery", querParamsDebounced],
		queryFn: async () => await fetchProjectsInDelivery(querParamsDebounced),
	});

	return { ...query, queryKey: ["projects-in-delivery", querParamsDebounced], filters, setFilters };
}
