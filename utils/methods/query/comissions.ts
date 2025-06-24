import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useDebounce, useDebounceMemo } from "@/lib/hooks/debounce";
import type { TComissionData } from "@/pages/api/gestao/comissoes";

async function fetchComissionData({ filters }: { filters: ComissionDataFilters }) {
	try {
		const { data } = await axios.get(
			`/api/gestao/comissoes?after=${filters.period.after}&before=${filters.period.before}&sellers=${filters.sellerName.join(",")}&insiders=${filters.insiderName.join(",")}&serviceTypes=${filters.serviceType.join(",")}`,
		);
		return data.data as TComissionData;
	} catch (error) {
		throw error;
	}
}

type ComissionDataFilters = {
	search: string;
	sellerName: string[];
	insiderName: string[];
	serviceType: string[];
	period: {
		after: string;
		before: string;
	};
};
type UseComissionDataParams = {
	initialFilters?: Partial<ComissionDataFilters> | undefined;
};
export function useComissionData({ initialFilters }: UseComissionDataParams) {
	const [filters, setFilters] = useState<ComissionDataFilters>({
		search: initialFilters?.search ?? "",
		sellerName: initialFilters?.sellerName ?? [],
		insiderName: initialFilters?.insiderName ?? [],
		serviceType: initialFilters?.serviceType ?? [],
		period: initialFilters?.period ?? {
			after: initialFilters?.period?.after ?? dayjs().subtract(1, "month").toISOString(),
			before: initialFilters?.period?.before ?? dayjs().toISOString(),
		},
	});

	function updateFilters(changes: Partial<ComissionDataFilters>) {
		setFilters((prev) => ({
			...prev,
			...changes,
		}));
	}
	const debouncedParams = useDebounceMemo(filters, 500);
	return {
		...useQuery({
			queryKey: ["comissions", debouncedParams],
			queryFn: async () => await fetchComissionData({ filters: debouncedParams }),
		}),
		filters,
		updateFilters,
	};
}
