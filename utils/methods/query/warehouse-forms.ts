import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetWarehouseFormulariesInput, TGetWarehouseFormulariesOutput } from "@/pages/api/almoxarifado/formularios/index-two";
import type { TNewWarehouseFormularyDTO } from "@/utils/schemas/warehouse-formularies";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export async function fetchWarehouseForms(input: TGetWarehouseFormulariesInput) {
	const searchParams = new URLSearchParams();
	if (input.page) searchParams.set("page", input.page.toString());
	if (input.search) searchParams.set("search", input.search);
	if (input.periodType) searchParams.set("periodType", input.periodType);
	if (input.periodAfter) searchParams.set("periodAfter", input.periodAfter);
	if (input.periodBefore) searchParams.set("periodBefore", input.periodBefore);
	if (input.pendingOnly) searchParams.set("pendingOnly", input.pendingOnly.toString());
	const { data } = await axios.get<TGetWarehouseFormulariesOutput>(`/api/almoxarifado/formularios/index-two?${searchParams.toString()}`);
	if (!data.data.default) throw new Error("Não foi possível obter os formulários.");
	return data.data.default;
}

type TUseWarehouseFormsParams = {
	initialFilters?: Partial<TGetWarehouseFormulariesInput>;
};
export function useWarehouseForms({ initialFilters }: TUseWarehouseFormsParams) {
	const [filters, setFilters] = useState<TGetWarehouseFormulariesInput>({
		page: initialFilters?.page || 1,
		pendingOnly: initialFilters?.pendingOnly || false,
		search: initialFilters?.search || "",
		periodType: initialFilters?.periodType || null,
		periodAfter: initialFilters?.periodAfter || null,
		periodBefore: initialFilters?.periodBefore || null,
	});

	function updateFilters(filters: Partial<TGetWarehouseFormulariesInput>) {
		setFilters((prevFilters) => ({
			...prevFilters,
			...filters,
		}));
	}

	const debouncedFilters = useDebounceMemo(filters, 1000);
	return {
		...useQuery({
			queryKey: ["warehouse-forms", debouncedFilters],
			queryFn: async () => await fetchWarehouseForms(debouncedFilters),
		}),
		queryKey: ["warehouse-forms", debouncedFilters],
		filters,
		updateFilters,
	};
}

async function fetchWarehouseFormById({ id }: { id: string }) {
	try {
		const { data } = await axios.get<TGetWarehouseFormulariesOutput>(`/api/almoxarifado/formularios/index-two?id=${id}`);
		if (!data.data.byId) throw new Error("Formulário não encontrado.");
		return data.data.byId;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function useWarehouseFormById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["warehouse-form-by-id", id],
		queryFn: async () => await fetchWarehouseFormById({ id }),
		refetchOnWindowFocus: false,
	});
}
