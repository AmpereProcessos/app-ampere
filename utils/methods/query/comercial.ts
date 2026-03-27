import type {
  TComercialAnalyticalItem,
  TGetComercialAnalyticalDataOutput,
  TGetComercialAnalyticsDataInput,
} from "@/pages/api/projects/analitico/comercial";
import type { TCommercialProjectDTO } from "@/pages/api/projects/comercial";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { getProjectNestedFieldValue } from "../formatting";
import dayjs from "dayjs";
import { useDebounceMemo } from "@/lib/hooks/debounce";

async function fetchProjects() {
  try {
    const { data } = await axios.get("/api/projects/comercial");
    return data as TCommercialProjectDTO[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type UseComercialProjectsFilters = {
  identifier: string | null;
  search: string;
  contractStatus: string[];
  serviceType: string[];
  sellerName: string[];
  insiderName: string[];
  supplyStatus: string[];
  grantingStatus: string[];
  tagIds: string[];
  pendingSupplyLiberation: boolean;
  signaturePendency: boolean;
  noCRMVinculation: boolean;
  noAnalysisVinculation: boolean;
  date: {
    after: string | null;
    before: string | null;
    field: string | null;
  };
};
export function useComercialProjects({ enabled }: { enabled: boolean }) {
  const [filters, setFilters] = useState<UseComercialProjectsFilters>({
    identifier: null,
    search: "",
    contractStatus: [],
    serviceType: [],
    sellerName: [],
    insiderName: [],
    supplyStatus: [],
    grantingStatus: [],
    tagIds: [],
    pendingSupplyLiberation: false,
    signaturePendency: false,
    noCRMVinculation: false,
    noAnalysisVinculation: false,
    date: {
      after: null,
      before: null,
      field: null,
    },
  });

  function matchSearch(project: TCommercialProjectDTO) {
    if (filters.search.trim().length === 0) return true;
    return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase());
  }
  function matchIdentifier(project: TCommercialProjectDTO) {
    if (!filters.identifier) return true;
    if (typeof project.codigoSVB === "string")
      return project.codigoSVB.includes(filters.identifier.toUpperCase());
    if (typeof project.codigoSVB === "number")
      return project.codigoSVB.toString().includes(filters.identifier);
  }
  function matchContractStatus(project: TCommercialProjectDTO) {
    if (filters.contractStatus.length === 0) return true;
    return filters.contractStatus.includes(project.contrato?.status || "");
  }
  function matchServiceType(project: TCommercialProjectDTO) {
    if (filters.serviceType.length === 0) return true;
    return filters.serviceType.includes(project.tipoDeServico);
  }
  function matchSellerName(project: TCommercialProjectDTO) {
    if (filters.sellerName.length === 0) return true;
    return filters.sellerName.includes(project.vendedor?.nome);
  }
  function matchInsiderName(project: TCommercialProjectDTO) {
    if (filters.insiderName.length === 0) return true;
    return filters.insiderName.includes(project.insider || "");
  }
  function matchSupplyStatus(project: TCommercialProjectDTO) {
    if (filters.supplyStatus.length === 0) return true;
    return filters.supplyStatus.includes(project.compra.status || "");
  }
  function matchGrantingStatus(project: TCommercialProjectDTO) {
    if (filters.grantingStatus.length === 0) return true;
    return filters.grantingStatus.includes(project.homologacao.status || "");
  }
  function matchPendingSupplyLiberation(project: TCommercialProjectDTO) {
    if (!filters.pendingSupplyLiberation) return true;
    return !project.compra.liberacao;
  }
  function matchSignaturePendency(project: TCommercialProjectDTO) {
    if (!filters.signaturePendency) return true;
    return !!project.contrato.dataLiberacao && !project.contrato.dataAssinatura;
  }
  function matchNoCRMVinculation(project: TCommercialProjectDTO) {
    if (!filters.noCRMVinculation) return true;
    return !project.idProjetoCRM;
  }
  function matchNoAnalysisVinculation(project: TCommercialProjectDTO) {
    if (!filters.noAnalysisVinculation) return true;
    return !project.idVisitaTecnica;
  }

  function matchTagIds(project: TCommercialProjectDTO) {
    if (filters.tagIds.length === 0) return true;
    const projectTagIds = (project.etiquetas ?? []).map((e) => e.id);
    return filters.tagIds.some((t) => projectTagIds.includes(t));
  }
  function matchDate(project: TCommercialProjectDTO) {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
    const fieldValue = getProjectNestedFieldValue(project, filters.date.field);
    return (
      // @ts-ignore
      fieldValue >= filters.date.after &&
      // @ts-ignore
      fieldValue <= filters.date.before
    );
  }
  function handleModelData(data: TCommercialProjectDTO[]) {
    return data.filter(
      (project) =>
        matchSearch(project) &&
        matchIdentifier(project) &&
        matchContractStatus(project) &&
        matchServiceType(project) &&
        matchSellerName(project) &&
        matchInsiderName(project) &&
        matchGrantingStatus(project) &&
        matchSupplyStatus(project) &&
        matchPendingSupplyLiberation(project) &&
        matchSignaturePendency(project) &&
        matchNoCRMVinculation(project) &&
        matchNoAnalysisVinculation(project) &&
        matchTagIds(project) &&
        matchDate(project),
    );
  }
  return {
    ...useQuery({
      queryKey: ["comercial-projects"],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  };
}

async function fetchComercialAnalyticalData(filters: TGetComercialAnalyticsDataInput) {
  const searchParams = new URLSearchParams();
  searchParams.set("search", filters.search);
  searchParams.set("periodField", filters.periodField);
  searchParams.set("periodAfter", filters.periodAfter);
  searchParams.set("periodBefore", filters.periodBefore);
  searchParams.set("sellerIds", filters.sellerIds.join(","));
  searchParams.set("pendingVinculation", filters.pendingVinculation.toString());
  const { data } = await axios.get<TGetComercialAnalyticalDataOutput>(
    `/api/projects/analitico/comercial?${searchParams.toString()}`,
  );
  return data;
}

type UseComercialAnalyticalDataFilters = {
  initialFilters?: Partial<TGetComercialAnalyticsDataInput>;
};
export function useComercialAnalyticalData({ initialFilters }: UseComercialAnalyticalDataFilters) {
  const monthStart = dayjs().startOf("month").toISOString();
  const monthEnd = dayjs().endOf("month").toISOString();
  const [filters, setFilters] = useState<TGetComercialAnalyticsDataInput>({
    search: initialFilters?.search || "",
    sellerIds: initialFilters?.sellerIds || [],
    pendingVinculation: initialFilters?.pendingVinculation || false,
    periodField: initialFilters?.periodField || "contrato.dataAssinatura",
    periodAfter: initialFilters?.periodAfter || monthStart,
    periodBefore: initialFilters?.periodBefore || monthEnd,
  });
  function updateFilters(changes: Partial<TGetComercialAnalyticsDataInput>) {
    setFilters((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  const debouncedSearch = useDebounceMemo({ search: filters.search }, 1000);
  const finalFilters = { ...filters, search: debouncedSearch.search };
  return {
    ...useQuery({
      queryKey: ["analytical-comercial", finalFilters],
      queryFn: async () => await fetchComercialAnalyticalData(finalFilters),
    }),
    filters,
    updateFilters,
  };
}
