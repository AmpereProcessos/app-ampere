import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetDashboardStatsOutput } from "@/pages/api/stats";
import type { TClientProfileInput, TClientProfileOutput } from "@/pages/api/stats/client-profile";
import type { TGetGraphStatsInput, TGetGraphsStatsOutput } from "@/pages/api/stats/graph";
import type { TOverallReportInput, TOverallReportOutput } from "@/pages/api/stats/overall-report";
import type {
  TGeographicReportInput,
  TGeographicReportOutput,
} from "@/pages/api/stats/geographic-report";
import type {
  TGetSalesRankingInput,
  TGetSalesRankingOutput,
} from "@/pages/api/stats/sales-ranking";
import type { TGetSDRRankingInput, TGetSDRRankingOutput } from "@/pages/api/stats/sdr-ranking";
import type {
  TEngineeringSectorStatsInput,
  TEngineeringSectorStatsOutput,
} from "@/pages/api/stats/sector-reports/engineering";
import type { TExecutionStats } from "@/pages/api/stats/sector-reports/execution";
import type {
  TDashboardStats,
  TSaleGraphStat,
  TSalesRakingInput,
  TSalesRakingOutput,
} from "@/utils/schemas/stats";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

async function fetchDashboardStats() {
  const { data } = await axios.get<TGetDashboardStatsOutput>("/api/stats");
  return data.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });
}

async function fetchSalesGraphStats({ year }: { year: number }) {
  const { data } = await axios.get(`/api/stats/getByYear/${year}`);
  return data as TSaleGraphStat[];
}

export function useSalesGraphStats({ year }: { year: number }) {
  return useQuery({
    queryKey: ["sales-graph-stats", year],
    queryFn: async () => await fetchSalesGraphStats({ year }),
  });
}

async function fetchExecutionStats() {
  const { data } = await axios.get("/api/stats/sector-reports/execution");
  return data.data as TExecutionStats;
}

export function useExecutionStats() {
  return useQuery({
    queryKey: ["execution-stats"],
    queryFn: fetchExecutionStats,
  });
}

async function fetchOverallReport(payload: TOverallReportInput) {
  const { data }: { data: TOverallReportOutput } = await axios.post(
    "/api/stats/overall-report",
    payload,
  );
  return data.data;
}

type TUseOverallReportParams = {
  initialParams?: Partial<TOverallReportInput>;
};
export function useOverallReport({ initialParams }: TUseOverallReportParams) {
  const [queryParams, setQueryParams] = useState<TOverallReportInput>({
    projectTypes: initialParams?.projectTypes ?? [],
    period: {
      after: initialParams?.period?.after ?? undefined,
      before: initialParams?.period?.before ?? undefined,
    },
  });

  function updateQueryParams(params: Partial<TOverallReportInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  const queryParamsDebounced = useDebounceMemo(queryParams, 500);

  return {
    ...useQuery({
      queryKey: ["overall-report", queryParamsDebounced],
      queryFn: async () => await fetchOverallReport(queryParamsDebounced),
    }),
    queryParams,
    updateQueryParams,
  };
}

async function fetchGeographicReport(payload: TGeographicReportInput) {
  const { data } = await axios.post<TGeographicReportOutput>(
    "/api/stats/geographic-report",
    payload,
  );
  return data.data;
}

export function useGeographicReport(params: TGeographicReportInput) {
  const paramsDebounced = useDebounceMemo(params, 500);

  return useQuery({
    queryKey: ["geographic-report", paramsDebounced],
    queryFn: () => fetchGeographicReport(paramsDebounced),
    placeholderData: (previousData) => previousData,
  });
}

async function fetchClientProfileReport(payload: TClientProfileInput) {
  const { data } = await axios.post<TClientProfileOutput>("/api/stats/client-profile", payload);
  return data.data;
}

type TUseClientProfileReportParams = {
  params: TClientProfileInput;
};
export function useClientProfileReport({ params }: TUseClientProfileReportParams) {
  const paramsDebounced = useDebounceMemo(params, 500);

  return useQuery({
    queryKey: ["client-profile-report", paramsDebounced],
    queryFn: async () => await fetchClientProfileReport(paramsDebounced),
    placeholderData: (prev) => prev,
  });
}

async function fetchSalesRanking(payload: TGetSalesRankingInput) {
  try {
    const params = new URLSearchParams();
    params.append("type", payload.type);
    params.append("rankBy", payload.rankBy);
    params.append("projectTypes", payload.projectTypes.join(","));
    const { data }: { data: TGetSalesRankingOutput } = await axios.get("/api/stats/sales-ranking", {
      params,
    });
    return data.data;
  } catch (error) {
    console.error("[ERROR] Fetch sales ranking", error);
    throw error;
  }
}

type TUseSalesRankingParams = {
  initialParams?: Partial<TGetSalesRankingInput>;
};
export function useSalesRanking({ initialParams }: TUseSalesRankingParams) {
  const [queryParams, setQueryParams] = useState<TGetSalesRankingInput>({
    type: initialParams?.type ?? "current-year",
    rankBy: initialParams?.rankBy ?? "sales-total-power",
    projectTypes: initialParams?.projectTypes ?? [
      "SISTEMA FOTOVOLTAICO",
      "AUMENTO DE SISTEMA FOTOVOLTAICO",
    ],
  });
  function updateQueryParams(params: Partial<TGetSalesRankingInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  const queryParamsDebounced = useDebounceMemo(queryParams, 500);

  return {
    ...useQuery({
      queryKey: ["sales-ranking", queryParamsDebounced],
      queryFn: async () => await fetchSalesRanking(queryParamsDebounced),
    }),
    queryParams,
    updateQueryParams,
  };
}

async function fetchSDRRanking(payload: TGetSDRRankingInput) {
  const params = new URLSearchParams();
  params.append("type", payload.type);
  params.append("rankBy", payload.rankBy);
  const { data } = await axios.get<TGetSDRRankingOutput>("/api/stats/sdr-ranking", { params });
  return data.data;
}

type TUseSDRRankingParams = {
  initialParams?: Partial<TGetSDRRankingInput>;
};
export function useSDRRanking({ initialParams }: TUseSDRRankingParams) {
  const [queryParams, setQueryParams] = useState<TGetSDRRankingInput>({
    type: initialParams?.type ?? "current-year",
    rankBy: initialParams?.rankBy ?? "opportunities-created-qty",
  });

  function updateQueryParams(params: Partial<TGetSDRRankingInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  const queryParamsDebounced = useDebounceMemo(queryParams, 500);

  return {
    ...useQuery({
      queryKey: ["sdr-ranking", queryParamsDebounced],
      queryFn: async () => await fetchSDRRanking(queryParamsDebounced),
    }),
    queryParams,
    updateQueryParams,
  };
}

async function fetchEngineeringSectorStats(info: TEngineeringSectorStatsInput) {
  const urlParams = new URLSearchParams();
  urlParams.append("after", info.after);
  urlParams.append("before", info.before);
  const { data }: { data: TEngineeringSectorStatsOutput } = await axios.get(
    `/api/stats/sector-reports/engineering?${urlParams.toString()}`,
  );
  return data.data;
}

type UseEngineeringSectorStatsParams = {
  initialParams?: Partial<TEngineeringSectorStatsInput>;
};
export function useEngineeringSectorStats({ initialParams }: UseEngineeringSectorStatsParams) {
  const monthStateDate = dayjs().startOf("month").toISOString();
  const monthEndingDate = dayjs().endOf("month").toISOString();
  const [queryParams, setQueryParams] = useState<TEngineeringSectorStatsInput>({
    after: initialParams?.after ?? monthStateDate,
    before: initialParams?.before ?? monthEndingDate,
  });

  function updateQueryParams(params: Partial<TEngineeringSectorStatsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  const queryParamsDebounced = useDebounceMemo(queryParams, 500);

  return {
    ...useQuery({
      queryKey: ["engineering-sector-stats", queryParamsDebounced],
      queryFn: async () => await fetchEngineeringSectorStats(queryParamsDebounced),
    }),
    queryParams,
    updateQueryParams,
  };
}

async function fetchGraphsStats(input: TGetGraphStatsInput) {
  const { data } = await axios.get<TGetGraphsStatsOutput>("/api/stats/graph", { params: input });
  return data.data;
}

type TUseGraphsStatsParams = {
  initialParams?: Partial<TGetGraphStatsInput>;
};
export function useGraphsStats({ initialParams }: TUseGraphsStatsParams) {
  const currentPeriodStart = dayjs().startOf("month");
  const currentPeriodEnd = dayjs().endOf("month");
  const [queryParams, setQueryParams] = useState<TGetGraphStatsInput>({
    metric: initialParams?.metric ?? "SALE_UFV_POWER",
    periodStart: initialParams?.periodStart ?? currentPeriodStart.toISOString(),
    periodEnd: initialParams?.periodEnd ?? currentPeriodEnd.toISOString(),
    previousPeriodStart:
      initialParams?.previousPeriodStart ?? currentPeriodStart.subtract(1, "month").toISOString(),
    previousPeriodEnd:
      initialParams?.previousPeriodEnd ?? currentPeriodEnd.subtract(1, "month").toISOString(),
  });

  function updateQueryParams(params: Partial<TGetGraphStatsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  const queryParamsDebounced = useDebounceMemo(queryParams, 500);
  return {
    ...useQuery({
      queryKey: ["graphs-stats", queryParamsDebounced],
      queryFn: async () => await fetchGraphsStats(queryParamsDebounced),
    }),
    queryKey: ["graphs-stats", queryParamsDebounced],
    queryParams,
    updateQueryParams,
  };
}
