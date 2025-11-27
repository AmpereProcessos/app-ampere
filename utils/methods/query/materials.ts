import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetMaterialsDatabaseInput, TGetMaterialsDatabaseOutput } from "@/pages/api/almoxarifado/estoque/database";
import type { TGetStockAnalyticsOutput } from "@/pages/api/almoxarifado/estoque/estatisticas";
import type { TMaterialDeletionDataOutput } from "@/pages/api/almoxarifado/materiais/exclusao";
import type { TMaterialUpdateRegistryDTO } from "@/utils/schemas/material-updates-registry";
import type {
	TMaterial,
	TMaterialDTO,
	TMaterialSimplifiedWithAlocatorDTO,
	TMaterialSupplier,
	TMaterialSupplierDTO,
	TQueryVinculationMaterialsFilter,
} from "@/utils/schemas/materials";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics } from "../formatting";
import { isEmpty } from "../shared";

export async function fetchMaterials() {
	const { data } = await axios.get("/api/almoxarifado/estoque");
	return data.data as TMaterialDTO[];
}
async function fetchMaterialLogsByMaterialId(materialId: string) {
	const { data } = await axios.get(`/api/almoxarifado/estoque/registros-atualizacao?materialId=${materialId}`);
	return data.data as TMaterialUpdateRegistryDTO[];
}

type UseMaterialsFilters = {
	search: string;
	lessThan: number;
	moreThan: number;
	minimumUndefined: boolean;
	maximumUndefined: boolean;
	belowMinimum: boolean;
	aboveMaximum: boolean;
};
export function useMaterials() {
	const [filters, setFilters] = useState<UseMaterialsFilters>({
		search: "",
		lessThan: 0,
		moreThan: 0,
		minimumUndefined: false,
		maximumUndefined: false,
		belowMinimum: false,
		aboveMaximum: false,
	});

	function matchSearch(material: TMaterialDTO) {
		if (filters.search.trim().length === 0) return true;
		return formatWithoutDiacritics(material.nome, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function matchLessThan(material: TMaterialDTO) {
		if (!filters.lessThan) return true;
		return material.qtde < filters.lessThan;
	}
	function matchMoreThan(material: TMaterialDTO) {
		if (!filters.moreThan) return true;
		return material.qtde > filters.moreThan;
	}
	function matchMinimumUndefined(material: TMaterialDTO) {
		if (!filters.minimumUndefined) return true;
		return !material.qtdeMinima;
	}
	function matchMaximumUndefined(material: TMaterialDTO) {
		if (!filters.maximumUndefined) return true;
		return !material.qtdeMaxima;
	}
	function matchBelowMinimum(material: TMaterialDTO) {
		if (!filters.belowMinimum) return true;
		return material.qtde < (material.qtdeMinima || 0);
	}
	function matchAboveMaximum(material: TMaterialDTO) {
		if (!filters.aboveMaximum) return true;
		return material.qtdeMaxima && material.qtde > material.qtdeMaxima;
	}
	function handleModelData(data: TMaterialDTO[]) {
		return data.filter(
			(material) =>
				matchSearch(material) &&
				matchLessThan(material) &&
				matchMoreThan(material) &&
				matchMinimumUndefined(material) &&
				matchMaximumUndefined(material) &&
				matchBelowMinimum(material) &&
				matchAboveMaximum(material),
		);
	}
	return {
		...useQuery({
			queryKey: ["materials"],
			queryFn: fetchMaterials,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchMaterialById({ id }: { id: string }) {
	const { data } = await axios.get(`/api/almoxarifado/estoque?id=${id}`);
	return data.data as TMaterialDTO;
}
export function useMaterialById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["material-by-id", id],
			queryFn: async () => await fetchMaterialById({ id }),
		}),
		queryKey: ["material-by-id", id],
	};
}
export function useMaterialsWithFilters(enabled: boolean, filters: any) {
	const { search, qtyLessThan } = filters;

	function checkName(materialName: string, searchFilter: string) {
		if (isEmpty(searchFilter)) return true;
		return materialName?.toUpperCase().includes(searchFilter.toUpperCase());
	}
	function checkQty(materialQty: number, lessThanFilter: number) {
		if (!materialQty || materialQty <= 0 || typeof materialQty !== "number") return true;
		if (!lessThanFilter || lessThanFilter <= 0 || typeof lessThanFilter !== "number") return true;
		return materialQty <= lessThanFilter;
	}
	return useQuery({
		queryKey: ["materials"],
		queryFn: fetchMaterials,
		refetchOnWindowFocus: false,
		enabled: !!enabled,
		select: (materials) => materials.filter((material) => checkName(material.nome, search) && checkQty(material.qtde, qtyLessThan)),
	});
}
export function useMaterialLogs(materialId: string) {
	return useQuery({
		queryKey: ["material-update-registries", materialId],
		queryFn: async () => await fetchMaterialLogsByMaterialId(materialId),
		refetchOnWindowFocus: false,
	});
}

async function fetchMaterialLogsBy({ type }: { type: string }) {
	const { data } = await axios.get(`/api/almoxarifado/estoque/registros-atualizacao?type=${type}`);
	return data.data as TMaterialUpdateRegistryDTO[];
}

export function useMaterialLogsByType({ type }: { type: string }) {
	return useQuery({
		queryKey: ["materials-logs-by-type", type],
		queryFn: async () => await fetchMaterialLogsBy({ type }),
		refetchOnWindowFocus: false,
	});
}

async function fetchVinculationMaterialsBySearch(query: TQueryVinculationMaterialsFilter) {
	if (query.search.trim().length === 0) return [];
	const { data } = await axios.post("/api/almoxarifado/materiais/pesquisa-vinculacao", query);
	return data.data as TMaterialSimplifiedWithAlocatorDTO[];
}

export function useVinculationMaterialsBySearch(query: TQueryVinculationMaterialsFilter) {
	return useQuery({
		queryKey: ["materials-vinculation-search", query],
		queryFn: async () => await fetchVinculationMaterialsBySearch(query),
	});
}

async function fetchMaterialsWithFilters(input: TGetMaterialsDatabaseInput) {
	const { data } = await axios.post("/api/almoxarifado/estoque/database", input);
	return data.data as TGetMaterialsDatabaseOutput;
}

export function useMaterialsDatabase() {
	const [filters, setFilters] = useState<TGetMaterialsDatabaseInput>({
		page: 1,
		sku: "",
		location: "",
		suppliers: [],
		name: "",
		quantity: {},
		price: {},
		period: {},
		belowMinimum: false,
		aboveMaximum: false,
		minimumUndefined: false,
		maximumUndefined: false,
		materialType: "non-equipment-only",
	});
	function updateFilters(changes: Partial<TGetMaterialsDatabaseInput>) {
		return setFilters((prev) => ({ ...prev, ...changes }));
	}

	const query = useQuery({
		queryKey: ["materials-database", filters],
		queryFn: async () => await fetchMaterialsWithFilters(filters),
	});

	return {
		...query,
		filters,
		updateFilters,
	};
}

async function fetchStockAnalytics() {
	const { data }: { data: TGetStockAnalyticsOutput } = await axios.get("/api/almoxarifado/estoque/estatisticas");
	return data.data;
}

export function useStockAnalytics() {
	return useQuery({
		queryKey: ["stock-analytics"],
		queryFn: fetchStockAnalytics,
	});
}

async function fetchMaterialSuppliers() {
	const { data } = await axios.get("/api/almoxarifado/fornecedores");
	return data.data as TMaterialSupplierDTO[];
}

export function useMaterialSuppliers() {
	return useQuery({
		queryKey: ["material-suppliers"],
		queryFn: fetchMaterialSuppliers,
	});
}

async function fetchMaterialDeletionData({ id }: { id: string }) {
	const { data } = await axios.get<TMaterialDeletionDataOutput>(`/api/almoxarifado/materiais/exclusao?id=${id}`);
	return data.data;
}

export function useMaterialDeletionData({ id }: { id: string }) {
	return useQuery({
		queryKey: ["material-deletion-data", id],
		queryFn: async () => await fetchMaterialDeletionData({ id }),
	});
}
