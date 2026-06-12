import { useDebounceMemo } from "@/lib/hooks/debounce";
import type {
  TADMProjectsByFiltersResult,
  TGetADMProjectsInput,
  TProjectADMSimplifiedWithRevenue,
} from "@/pages/api/projects/adm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function buildADMProjectsQueryParams(filters: TGetADMProjectsInput) {
  const queryParams = new URLSearchParams();

  queryParams.set("page", String(filters.page));
  if (filters.search.trim().length > 0) queryParams.set("search", filters.search);
  if (filters.contractStatus.length > 0)
    queryParams.set("contractStatus", filters.contractStatus.join(","));
  if (filters.tagIds.length > 0) queryParams.set("tagIds", filters.tagIds.join(","));
  if (filters.technicalTeam.length > 0)
    queryParams.set("technicalTeam", filters.technicalTeam.join(","));
  if (filters.billingCompany.length > 0)
    queryParams.set("billingCompany", filters.billingCompany.join(","));
  if (filters.inspectionStatus.length > 0)
    queryParams.set("inspectionStatus", filters.inspectionStatus.join(","));
  if (filters.sellers.length > 0) queryParams.set("sellers", filters.sellers.join(","));
  if (filters.toCharge) queryParams.set("toCharge", "true");
  if (filters.chargeDone) queryParams.set("chargeDone", "true");
  if (filters.toBill) queryParams.set("toBill", "true");
  if (filters.billingDone) queryParams.set("billingDone", "true");
  if (filters.receiptsUndefined) queryParams.set("receiptsUndefined", "true");
  if (filters.receiptToday) queryParams.set("receiptToday", "true");
  if (filters.receiptThisWeek) queryParams.set("receiptThisWeek", "true");
  if (filters.receiptThisMonth) queryParams.set("receiptThisMonth", "true");
  if (filters.date.after) queryParams.set("dateAfter", filters.date.after);
  if (filters.date.before) queryParams.set("dateBefore", filters.date.before);
  if (filters.date.field) queryParams.set("dateField", filters.date.field);

  return queryParams;
}

async function fetchProjects(filters: TGetADMProjectsInput) {
  const queryParams = buildADMProjectsQueryParams(filters);
  const { data } = await axios.get<{ data: TADMProjectsByFiltersResult }>(
    `/api/projects/adm?${queryParams.toString()}`,
  );
  return data.data;
}

export type TUseADMProjectsFilters = TGetADMProjectsInput;
export type TUpdateADMProjectsFilters = (partial: Partial<TUseADMProjectsFilters>) => void;

export function useADMProjects() {
  const [filters, setFiltersState] = useState<TUseADMProjectsFilters>({
    page: 1,
    search: "",
    contractStatus: [],
    tagIds: [],
    technicalTeam: [],
    billingCompany: [],
    inspectionStatus: [],
    sellers: [],
    toCharge: false,
    chargeDone: false,
    toBill: false,
    billingDone: false,
    receiptsUndefined: false,
    receiptToday: false,
    receiptThisWeek: false,
    receiptThisMonth: false,
    date: {
      after: null,
      before: null,
      field: null,
    },
  });

  const debouncedSearch = useDebounceMemo(
    {
      search: filters.search,
    },
    1000,
  );
  const finalFilters = { ...filters, ...debouncedSearch };

  function setFilters(partial: Partial<TUseADMProjectsFilters>) {
    setFiltersState((prev) => {
      const next = { ...prev, ...partial };
      const { page: _prevPage, ...prevRest } = prev;
      const { page: _nextPage, ...nextRest } = next;

      if (JSON.stringify(prevRest) !== JSON.stringify(nextRest)) {
        return { ...next, page: 1 };
      }

      return next;
    });
  }

  return {
    ...useQuery({
      queryKey: ["adm-projects", finalFilters],
      queryFn: () => fetchProjects(finalFilters),
    }),
    queryKey: ["adm-projects", finalFilters],
    filters,
    setFilters,
  };
}

export type { TProjectADMSimplifiedWithRevenue };
