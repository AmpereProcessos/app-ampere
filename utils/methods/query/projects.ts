import type { TGetProjectsExportRoutePayload } from "@/lib/data-exports";
import { useDebounce } from "@/lib/hooks/debounce";
import type { TGetProjectAllocationsGroupedInput, TGetProjectAllocationsGroupedOutput } from "@/pages/api/projects/alocacoes/grouped";
import type { TProjectsByFiltersResult } from "@/pages/api/projects/search";
import type {
	TPersonalizedProjectsFilter,
	TProjectResumeDTO,
	TQueryVinculationProjectsFilterInput,
	TVinculationProjectsByFiltersResult,
} from "@/utils/schemas/projects";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

export async function fetchVinculationProjectsSearch(query: TQueryVinculationProjectsFilterInput) {
	const { data } = await axios.post("/api/projects/pesquisa-vinculacao", query);
	return data.data as TVinculationProjectsByFiltersResult;
}

export function useVinculationProjectsSearch(query: TQueryVinculationProjectsFilterInput) {
	return useQuery({
		queryKey: ["projects-vinculation-search", query],
		queryFn: async () => await fetchVinculationProjectsSearch(query),
	});
}

/**
 * Busca paginada de projetos para o seletor assíncrono (components/inputs/project-picker).
 * O debounce fica dentro do hook para manter a query key estável entre digitações.
 */
export function useVinculationProjectsSearchInfinite({ search }: { search: string }) {
	const debouncedSearch = useDebounce(search, 400);
	return {
		...useInfiniteQuery({
			queryKey: ["projects-vinculation-search-infinite", { search: debouncedSearch }],
			queryFn: async ({ pageParam }) =>
				await fetchVinculationProjectsSearch({ search: debouncedSearch, page: pageParam }),
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) =>
				allPages.length < lastPage.totalPages ? allPages.length + 1 : undefined,
			staleTime: 60 * 1000,
		}),
		debouncedSearch,
	};
}

export async function fetchProjectResume({ id }: { id: string }) {
	const { data } = await axios.get(`/api/projects/resumo/${id}`);
	return data.data as TProjectResumeDTO;
}

export function useProjectResume({ id, enabled = true }: { id: string | null; enabled?: boolean }) {
	return useQuery({
		queryKey: ["project-resume", id],
		queryFn: async () => await fetchProjectResume({ id: id as string }),
		enabled: !!id && enabled,
		staleTime: 5 * 60 * 1000,
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
