import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetPropertiesOutput, TPropertiesQueryParamsInput } from "@/pages/api/propriedades";
import type {
  TGetSimplifiedPropertiesOutput,
  TSimplifiedPropertiesQueryParamsInput,
} from "@/pages/api/propriedades/simplicado";
import type {
  TPropertiesStatsOutput,
  TStatsQueryParamsInput,
} from "@/pages/api/propriedades/estatisticas";
import type {
  TGetPropertyTemporaryUsagesOutput,
  TPropertyTemporaryUsagesByPeriodInput,
} from "@/pages/api/propriedades/uso-temporario";
import type {
  TGetTemporaryUsageByPropertyOutput,
  TTemporaryUsageByPropertyInput,
} from "@/pages/api/propriedades/uso-temporario/propriedade";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

async function fetchProperties(queryParams: TPropertiesQueryParamsInput) {
  const urlParams = new URLSearchParams();
  if ("search" in queryParams) urlParams.set("search", queryParams.search || "");
  if ("metadataTypes" in queryParams)
    urlParams.set("metadataTypes", queryParams.metadataTypes.join(","));
  if ("includeOpenUsages" in queryParams)
    urlParams.set("includeOpenUsages", queryParams.includeOpenUsages.toString());
  if ("status" in queryParams && queryParams.status) urlParams.set("status", queryParams.status);
  const { data }: { data: TGetPropertiesOutput } = await axios.get(
    `/api/propriedades?${urlParams.toString()}`,
  );
  if (!data.data.default) throw new Error("Não foi possível obter as propriedades.");
  return data.data.default;
}

type TUsePropertiesParams = {
  initialFilters?: Partial<Exclude<TPropertiesQueryParamsInput, "id">>;
};
export function useProperties({ initialFilters }: TUsePropertiesParams) {
  const [filters, setFilters] = useState<TPropertiesQueryParamsInput>({
    search: initialFilters?.search ?? "",
    metadataTypes: initialFilters?.metadataTypes ?? ["VEÍCULO"],
    includeOpenUsages: initialFilters?.includeOpenUsages ?? true,
    status: initialFilters?.status ?? "active-only",
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

async function fetchSimplifiedProperties(payload: TSimplifiedPropertiesQueryParamsInput = {}) {
  const urlParams = new URLSearchParams();
  if ("search" in payload && payload.search) urlParams.set("search", payload.search);
  const { data } = await axios.get<TGetSimplifiedPropertiesOutput>(
    `/api/propriedades/simplicado?${urlParams.toString()}`,
  );
  return data.data;
}

export function useSimplifiedProperties(payload: TSimplifiedPropertiesQueryParamsInput = {}) {
  const queryParamsDebounced = useDebounceMemo(payload, 500);
  return useQuery({
    queryKey: ["simplified-properties", queryParamsDebounced],
    queryFn: async () => await fetchSimplifiedProperties(queryParamsDebounced),
  });
}

async function fetchPropertyById({ id }: { id: string }) {
  const { data }: { data: TGetPropertiesOutput } = await axios.get(
    `/api/propriedades?id=${id}&includeOpenUsages=true`,
  );
  if (!data.data.byId) throw new Error("Propriedade não encontrada.");
  return data.data.byId;
}

export function usePropertyById({ id }: { id: string }) {
  return useQuery({
    queryKey: ["property-by-id", id],
    queryFn: async () => await fetchPropertyById({ id }),
  });
}

async function fetchPropertyTemporaryUsages(params: TPropertyTemporaryUsagesByPeriodInput) {
  const urlParams = new URLSearchParams();
  if ("periodAfter" in params && params.periodAfter)
    urlParams.set("periodAfter", params.periodAfter);
  if ("periodBefore" in params && params.periodBefore)
    urlParams.set("periodBefore", params.periodBefore);
  if ("periodType" in params && params.periodType) urlParams.set("periodType", params.periodType);
  if ("type" in params && params.type) urlParams.set("type", params.type);
  if ("propertyIds" in params && params.propertyIds)
    urlParams.set("propertyIds", params.propertyIds.join(","));
  if ("search" in params && params.search) urlParams.set("search", params.search);
  const { data } = await axios.get<TGetPropertyTemporaryUsagesOutput>(
    `/api/propriedades/uso-temporario?${urlParams.toString()}`,
  );
  if (!data.data.default)
    throw new Error("Não foi possível obter os usos temporários da propriedade.");
  return data.data.default;
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
    propertyIds: initialParams?.propertyIds ?? [],
    search: initialParams?.search ?? undefined,
  });

  function updateQueryParams(params: Partial<TPropertyTemporaryUsagesByPeriodInput>) {
    setQueryParams((prev) => ({
      ...prev,
      ...params,
    }));
  }

  const searchDebounced = useDebounceMemo({ search: queryParams.search }, 1200);
  const finalQueryParams = { ...queryParams, ...searchDebounced };
  return {
    ...useQuery({
      queryKey: ["property-temporary-usages", finalQueryParams],
      queryFn: async () => await fetchPropertyTemporaryUsages(finalQueryParams),
    }),
    queryParams,
    updateQueryParams,
  };
}

async function fetchPropertyTemporaryUsageById({ id }: { id: string }) {
  const { data } = await axios.get<TGetPropertyTemporaryUsagesOutput>(
    `/api/propriedades/uso-temporario?id=${id}`,
  );
  if (!data.data.byId) throw new Error("Uso temporário não encontrado.");
  return data.data.byId;
}

export function usePropertyTemporaryUsageById({ id }: { id: string }) {
  return useQuery({
    queryKey: ["property-temporary-usage-by-id", id],
    queryFn: async () => await fetchPropertyTemporaryUsageById({ id }),
  });
}

async function fetchOpenPropertyTemporaryUsageByPropertyId(input: TTemporaryUsageByPropertyInput) {
  const { data } = await axios.get<TGetTemporaryUsageByPropertyOutput>(
    `/api/propriedades/uso-temporario/propriedade?openUsagePropertyId=${input.openUsagePropertyId}`,
  );
  return data.data;
}

export function useOpenPropertyTemporaryUsageByPropertyId({ id }: { id: string }) {
  return useQuery({
    queryKey: ["open-property-temporary-usage-by-property-id", id],
    queryFn: async () =>
      await fetchOpenPropertyTemporaryUsageByPropertyId({ openUsagePropertyId: id }),
  });
}

async function fetchPropertiesStats(payload: TStatsQueryParamsInput) {
  const urlParams = new URLSearchParams();
  if ("after" in payload) urlParams.set("after", payload.after);
  if ("before" in payload) urlParams.set("before", payload.before);

  const { data } = await axios.get<TPropertiesStatsOutput>(
    `/api/propriedades/estatisticas?${urlParams.toString()}`,
  );
  return data.data;
}

type UsePropertiesStatsParams = {
  initialParams?: TStatsQueryParamsInput;
};
export function usePropertiesStats({ initialParams }: UsePropertiesStatsParams) {
  const monthStart = dayjs().startOf("month").toISOString();
  const monthEnd = dayjs().endOf("month").toISOString();
  const [queryParams, setQueryParams] = useState<TStatsQueryParamsInput>({
    after: initialParams?.after ?? monthStart,
    before: initialParams?.before ?? monthEnd,
  });
  function updateQueryParams(params: Partial<TStatsQueryParamsInput>) {
    setQueryParams((prev) => ({
      ...prev,
      ...params,
    }));
  }
  const debouncedQueryParams = useDebounceMemo(queryParams, 500);
  return {
    ...useQuery({
      queryKey: ["properties-stats", debouncedQueryParams],
      queryFn: async () => await fetchPropertiesStats(debouncedQueryParams),
    }),
    queryParams,
    updateQueryParams,
  };
}
