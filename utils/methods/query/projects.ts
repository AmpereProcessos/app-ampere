import type { TGetProjectsExportRoutePayload } from "@/lib/data-exports";
import { useDebounce } from "@/lib/hooks/debounce";
import type { TGetProjectAllocationsGroupedInput, TGetProjectAllocationsGroupedOutput } from "@/pages/api/projects/alocacoes/grouped";
import type { TProjectsByFiltersResult } from "@/pages/api/projects/search";
import type { TPersonalizedProjectsFilter, TProjectDTODBSimplified, TQueryVinculationProjectsFilter } from "@/utils/schemas/projects";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

async function fetchProjectsByPersonalizedFilters({ page, filters }: { page: number; filters: TPersonalizedProjectsFilter }) {
	const { data } = await axios.post(`/api/projects/search?page=${page}`, filters);

	return data.data as TProjectsByFiltersResult;
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
		filters,
		updateFilters,
	};
}

async function fetchVinculationProjectsSearch(query: TQueryVinculationProjectsFilter) {
	if (query.search.trim().length === 0) return [];
	const { data } = await axios.post("/api/projects/pesquisa-vinculacao", query);
	return data.data as TProjectDTODBSimplified[];
}

export function useVinculationProjectsSearch(query: TQueryVinculationProjectsFilter) {
	return useQuery({
		queryKey: ["projects-vinculation-search", query],
		queryFn: async () => await fetchVinculationProjectsSearch(query),
	});
}

export async function fetchProjectsExportation(payload: TGetProjectsExportRoutePayload) {
	const { data } = await axios.post("/api/projects/personalized-export", payload);
	return data.data;
}

export async function fetchProjectsAllocationsGrouped(input: TGetProjectAllocationsGroupedInput) {
	const searchParams = new URLSearchParams();
	if (input.projectIds) searchParams.set("projectIds", input.projectIds.join(","));
	if (input.search) searchParams.set("search", input.search);
	if (input.ufs) searchParams.set("ufs", input.ufs.join(","));
	if (input.cities) searchParams.set("cities", input.cities.join(","));
	const url = `/api/projects/alocacoes/grouped?${searchParams.toString()}`;
	const { data } = await axios.get<TGetProjectAllocationsGroupedOutput>(url);
	return data.data.default;
}

export function useProjectsAllocationsGrouped(input: TGetProjectAllocationsGroupedInput) {
	const debouncedSearch = useDebounce(input.search, 500);
	return {
		...useQuery({
			queryKey: ["projects-allocations-grouped", { ...input, search: debouncedSearch }],
			queryFn: async () => await fetchProjectsAllocationsGrouped({ ...input, search: debouncedSearch }),
		}),
		queryKey: ["projects-allocations-grouped", { ...input, search: debouncedSearch }],
	};
}
