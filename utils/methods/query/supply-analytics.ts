import type { TSupplyAnalyticsResponse } from "@/pages/api/stats/supply";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type TSupplyAnalyticsFilters = {
	year: number;
	suppliers: string[];
	states: string[];
	statuses: string[];
};

async function fetchSupplyAnalytics(filters: TSupplyAnalyticsFilters) {
	const params = new URLSearchParams({
		year: String(filters.year),
		suppliers: filters.suppliers.join(","),
		states: filters.states.join(","),
		statuses: filters.statuses.join(","),
	});
	const response = await axios.get<TSupplyAnalyticsResponse>(`/api/stats/supply?${params.toString()}`);
	return response.data.data;
}

export function useSupplyAnalytics(filters: TSupplyAnalyticsFilters) {
	return useQuery({
		queryKey: ["supply-analytics", filters],
		queryFn: () => fetchSupplyAnalytics(filters),
	});
}
