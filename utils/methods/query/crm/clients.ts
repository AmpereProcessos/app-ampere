import { useDebounce, useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetClientsSearchInput, TGetClientsSearchOutput } from "@/pages/api/crm/clients/search";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

async function fetchClientsSearch(input: TGetClientsSearchInput) {
	const searchParams = new URLSearchParams();
	if (input.page) searchParams.set("page", input.page.toString());
	if (input.search) searchParams.set("search", input.search);
	if (input.onlyValidPhones) searchParams.set("onlyValidPhones", input.onlyValidPhones.toString());
	const url = `/api/crm/clients/search?${searchParams.toString()}`;
	const { data } = await axios.get<TGetClientsSearchOutput>(url);
	return data.data;
}

type UseClientsSearchParams = {
	initialFilters?: Partial<TGetClientsSearchInput>;
};
export function useClientsSearch(input: UseClientsSearchParams) {
	const [filters, setFilters] = useState<TGetClientsSearchInput>({
		page: input.initialFilters?.page || 1,
		search: input.initialFilters?.search || "",
		onlyValidPhones: input.initialFilters?.onlyValidPhones || false,
	});
	function updateFilters(filters: Partial<TGetClientsSearchInput>) {
		setFilters((prev) => ({ ...prev, ...filters }));
	}
	const debouncedFilters = useDebounceMemo(
		{
			search: useDebounce(filters.search, 100),
			onlyValidPhones: filters.onlyValidPhones,
		},
		1000,
	);
	const finalFilters = { page: filters.page, ...debouncedFilters };
	return {
		...useQuery({ queryKey: ["clients-search", finalFilters], queryFn: async () => await fetchClientsSearch(finalFilters) }),
		queryKey: ["clients-search", finalFilters],
		filters,
		updateFilters,
	};
}
