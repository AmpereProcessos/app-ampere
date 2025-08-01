import type { TPropertyDTO, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatWithoutDiacritics } from "../formatting";
import type { TGetPropertyTemporaryUsagesOutput, TPropertyTemporaryUsagesByPeriodInput, TPropertyTemporaryUsagesInput } from "@/pages/api/propriedades/uso-temporario";
import dayjs from "dayjs";
import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetTemporaryUsageByPropertyOutput, TTemporaryUsageByPropertyInput } from "@/pages/api/propriedades/uso-temporario/propriedade";

async function fetchProperties() {
	try {
		const { data } = await axios.get("/api/propriedades");
		return data.data as TPropertyDTO[];
	} catch (error) {
		throw error;
	}
}

type UsePropertiesFilters = {
	search: string;
	responsibles: string[];
	tags: string[];
};
export function useProperties() {
	const [filters, setFilters] = useState<UsePropertiesFilters>({
		search: "",
		responsibles: [],
		tags: [],
	});
	function matchSearch(property: TPropertyDTO) {
		if (filters.search.trim().length === 0) return true;
		return formatWithoutDiacritics(property.nome, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function matchResponsibles(property: TPropertyDTO) {
		if (filters.responsibles.length === 0) return true;
		return property.responsaveis.some((resp) => filters.responsibles.includes(resp.id));
	}
	function matchTags(property: TPropertyDTO) {
		if (filters.tags.length === 0) return true;
		return property.tags.some((tag) => filters.tags.includes(tag));
	}

	function handleModelData(data: TPropertyDTO[]) {
		return data.filter((property) => matchSearch(property) && matchResponsibles(property) && matchTags(property));
	}
	return {
		...useQuery({
			queryKey: ["properties"],
			queryFn: fetchProperties,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchPropertyById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/propriedades?id=${id}`);
		return data.data as TPropertyDTO;
	} catch (error) {
		throw error;
	}
}

export function usePropertyById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["property-by-id", id],
		queryFn: async () => await fetchPropertyById({ id }),
	});
}

async function fetchPropertyTemporaryUsages(params: TPropertyTemporaryUsagesByPeriodInput) {
	try {
		const urlParams = new URLSearchParams();
		if ("periodAfter" in params) urlParams.set("periodAfter", params.periodAfter);
		if ("periodBefore" in params) urlParams.set("periodBefore", params.periodBefore);
		if ("periodType" in params) urlParams.set("periodType", params.periodType);

		const { data } = await axios.get<TGetPropertyTemporaryUsagesOutput>(`/api/propriedades/uso-temporario?${urlParams.toString()}`);
		if (!data.data.default) throw new Error("Não foi possível obter os usos temporários da propriedade.");
		return data.data.default;
	} catch (error) {
		throw error;
	}
}

type UsePropertyTemporaryUsagesParams = {
	initialParams?: TPropertyTemporaryUsagesByPeriodInput;
};
export function usePropertyTemporaryUsages({ initialParams }: UsePropertyTemporaryUsagesParams) {
	const monthStart = dayjs().startOf("month").toISOString();
	const monthEnd = dayjs().endOf("month").toISOString();
	const [queryParams, setQueryParams] = useState<TPropertyTemporaryUsagesByPeriodInput>({
		periodAfter: initialParams?.periodAfter ?? monthStart,
		periodBefore: initialParams?.periodBefore ?? monthEnd,
		periodType: initialParams?.periodType ?? "dataInicio",
	});

	function updateQueryParams(params: Partial<TPropertyTemporaryUsagesByPeriodInput>) {
		setQueryParams((prev) => ({
			...prev,
			...params,
		}));
	}

	const queryParamsDebouncded = useDebounceMemo(queryParams, 500);
	return {
		...useQuery({
			queryKey: ["property-temporary-usages", queryParamsDebouncded],
			queryFn: async () => await fetchPropertyTemporaryUsages(queryParamsDebouncded),
		}),
		queryParams,
		updateQueryParams,
	};
}

async function fetchOpenPropertyTemporaryUsageByPropertyId(input: TTemporaryUsageByPropertyInput) {
	try {
		const { data } = await axios.get<TGetTemporaryUsageByPropertyOutput>(`/api/propriedades/uso-temporario/propriedade?openUsagePropertyId=${input.openUsagePropertyId}`);
		return data.data;
	} catch (error) {
		throw error;
	}
}

export function useOpenPropertyTemporaryUsageByPropertyId({ id }: { id: string }) {
	return useQuery({
		queryKey: ["open-property-temporary-usage-by-property-id", id],
		queryFn: async () => await fetchOpenPropertyTemporaryUsageByPropertyId({ openUsagePropertyId: id }),
	});
}
