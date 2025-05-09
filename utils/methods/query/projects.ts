import type { TProjectsByFiltersResult } from "@/pages/api/projects/search";
import type { TPersonalizedProjectsFilter, TProjectDTODBSimplified, TQueryVinculationProjectsFilter } from "@/utils/schemas/projects";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TGetProjectsExportRoutePayload } from "@/lib/data-exports";

async function fetchProjectsByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedProjectsFilter }) {
	try {
		const { data } = await axios.post(`/api/projects/search?page=${page}`, filters);

		return data.data as TProjectsByFiltersResult;
	} catch (error) {
		throw error;
	}
}

export function useProjectsByPersonalizedFilters({ page }: { page: number }) {
	const [filters, setFilters] = useState<TPersonalizedProjectsFilter>({
		name: "",
		payerName: "",
		period: { after: null, before: null, field: null },
		modulesQty: {
			greater: null,
			less: null,
		},
		state: [],
		city: [],
		tagIds: [],
		address: "",
		neighborhood: "",
		serviceType: [],
		seller: [],
		insider: [],
		technicalTeam: [],
		acquisitionChannel: [],
	});
	function updateFilters(filters: TPersonalizedProjectsFilter) {
		setFilters(filters);
	}
	return {
		...useQuery({
			queryKey: ["projects-by-filters", page, filters],
			queryFn: async () => await fetchProjectsByPersonalizedFilters({ page, filters }),
		}),
		updateFilters,
	};
}

async function fetchVinculationProjectsSearch(query: TQueryVinculationProjectsFilter) {
	try {
		if (query.search.trim().length === 0) return [];
		const { data } = await axios.post("/api/projects/pesquisa-vinculacao", query);
		return data.data as TProjectDTODBSimplified[];
	} catch (error) {
		throw error;
	}
}

export function useVinculationProjectsSearch(query: TQueryVinculationProjectsFilter) {
	return useQuery({
		queryKey: ["projects-vinculation-search", query],
		queryFn: async () => await fetchVinculationProjectsSearch(query),
	});
}

export async function fetchProjectsExportation(payload: TGetProjectsExportRoutePayload) {
	try {
		const { data } = await axios.post("/api/projects/personalized-export", payload);
		return data.data;
	} catch (error) {
		console.log("Error on projects exportation", error);
		throw error;
	}
}
