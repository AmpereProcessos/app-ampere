import type { TPropertyDTO, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatWithoutDiacritics } from "../formatting";
import type { TGetPropertyTemporaryUsagesOutput, TPropertyTemporaryUsagesByPeriodInput, TPropertyTemporaryUsagesInput } from "@/pages/api/propriedades/uso-temporario";
import dayjs from "dayjs";
import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetTemporaryUsageByPropertyOutput, TTemporaryUsageByPropertyInput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import type { TGetPropertiesOutput, TPropertiesQueryParamsInput } from "@/pages/api/propriedades";

async function fetchProperties(queryParams: TPropertiesQueryParamsInput) {
	try {
		const urlParams = new URLSearchParams();
		if ("search" in queryParams) urlParams.set("search", queryParams.search || "");
		if ("metadataTypes" in queryParams) urlParams.set("metadataTypes", queryParams.metadataTypes.join(","));
		if ("includeOpenUsages" in queryParams) urlParams.set("includeOpenUsages", queryParams.includeOpenUsages.toString());

		const { data }: { data: TGetPropertiesOutput } = await axios.get(`/api/propriedades?${urlParams.toString()}`);
		if (!data.data.default) throw new Error("Não foi possível obter as propriedades.");
		return data.data.default;
	} catch (error) {
		throw error;
	}
}

type TUsePropertiesParams = {
	initialFilters?: Partial<Exclude<TPropertiesQueryParamsInput, "id">>;
};
export function useProperties({ initialFilters }: TUsePropertiesParams) {
	const [filters, setFilters] = useState<TPropertiesQueryParamsInput>({
		search: initialFilters?.search ?? "",
		metadataTypes: initialFilters?.metadataTypes ?? [],
		includeOpenUsages: initialFilters?.includeOpenUsages ?? true,
	});

	function updateFilters(filters: Partial<TPropertiesQueryParamsInput>) {
		setFilters((prev) => ({
			...prev,
			...filters,
		}));
	}

	const queryParamsDebounced = useDebounceMemo(filters, 500);
	return {
		...useQuery({
			queryKey: ["properties", queryParamsDebounced],
			queryFn: async () => await fetchProperties(queryParamsDebounced),
		}),
		filters,
		updateFilters,
	};
}

async function fetchPropertyById({ id }: { id: string }) {
	try {
		const { data }: { data: TGetPropertiesOutput } = await axios.get(`/api/propriedades?id=${id}&includeOpenUsages=true`);
		if (!data.data.byId) throw new Error("Propriedade não encontrada.");
		return data.data.byId;
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
		if ("periodAfter" in params && params.periodAfter) urlParams.set("periodAfter", params.periodAfter);
		if ("periodBefore" in params && params.periodBefore) urlParams.set("periodBefore", params.periodBefore);
		if ("periodType" in params && params.periodType) urlParams.set("periodType", params.periodType);
		if ("type" in params && params.type) urlParams.set("type", params.type);

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
	const [queryParams, setQueryParams] = useState<TPropertyTemporaryUsagesByPeriodInput>({
		type: initialParams?.type ?? "all",
		periodAfter: initialParams?.periodAfter ?? undefined,
		periodBefore: initialParams?.periodBefore ?? undefined,
		periodType: initialParams?.periodType ?? undefined,
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

async function fetchPropertyTemporaryUsageById({ id }: { id: string }) {
	try {
		const { data } = await axios.get<TGetPropertyTemporaryUsagesOutput>(`/api/propriedades/uso-temporario?id=${id}`);
		if (!data.data.byId) throw new Error("Uso temporário não encontrado.");
		return data.data.byId;
	} catch (error) {
		throw error;
	}
}

export function usePropertyTemporaryUsageById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["property-temporary-usage-by-id", id],
		queryFn: async () => await fetchPropertyTemporaryUsageById({ id }),
	});
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
