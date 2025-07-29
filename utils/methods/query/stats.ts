import type { TExecutionStats } from "@/pages/api/stats/sector-reports/execution";
import type { TDashboardStats, TSaleGraphStat, TSalesRakingInput, TSalesRakingOutput } from "@/utils/schemas/stats";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { TOverallReportInput, TOverallReportOutput } from "@/pages/api/stats/overall-report";
import { useState } from "react";
import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TEngineeringSectorStatsInput, TEngineeringSectorStatsOutput } from "@/pages/api/stats/sector-reports/engineering";
import dayjs from "dayjs";

async function fetchDashboardStats() {
	const { data } = await axios.get("/api/stats");
	return data as TDashboardStats;
}

export function useDashboardStats() {
	return useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: fetchDashboardStats,
	});
}

async function fetchSalesGraphStats({ year }: { year: number }) {
	try {
		const { data } = await axios.get(`/api/stats/getByYear/${year}`);
		return data as TSaleGraphStat[];
	} catch (error) {
		throw error;
	}
}

export function useSalesGraphStats({ year }: { year: number }) {
	return useQuery({
		queryKey: ["sales-graph-stats", year],
		queryFn: async () => await fetchSalesGraphStats({ year }),
	});
}

async function fetchExecutionStats() {
	try {
		const { data } = await axios.get("/api/stats/sector-reports/execution");
		return data.data as TExecutionStats;
	} catch (error) {
		throw error;
	}
}

export function useExecutionStats() {
	return useQuery({
		queryKey: ["execution-stats"],
		queryFn: fetchExecutionStats,
	});
}

async function fetchOverallReport(payload: TOverallReportInput) {
	const { data }: { data: TOverallReportOutput } = await axios.post("/api/stats/overall-report", payload);
	return data.data;
}

type TUseOverallReportParams = {
	initialParams?: Partial<TOverallReportInput>;
};
export function useOverallReport({ initialParams }: TUseOverallReportParams) {
	const [queryParams, setQueryParams] = useState<TOverallReportInput>({
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

async function fetchSalesRanking(payload: TSalesRakingInput) {
	try {
		const params = new URLSearchParams();
		params.append("type", payload.type);
		params.append("rankBy", payload.rankBy);
		params.append("projectTypes", payload.projectTypes.join(","));
		const { data }: { data: TSalesRakingOutput } = await axios.get("/api/stats/sales-ranking", { params });
		return data.data;
	} catch (error) {
		console.error("[ERROR] Fetch sales ranking", error);
		throw error;
	}
}

type TUseSalesRankingParams = {
	initialParams?: Partial<TSalesRakingInput>;
};
export function useSalesRanking({ initialParams }: TUseSalesRankingParams) {
	const [queryParams, setQueryParams] = useState<TSalesRakingInput>({
		type: initialParams?.type ?? "current-semester",
		rankBy: initialParams?.rankBy ?? "sales-total-power",
		projectTypes: initialParams?.projectTypes ?? ["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"],
	});
	function updateQueryParams(params: Partial<TSalesRakingInput>) {
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

async function fetchEngineeringSectorStats(info: TEngineeringSectorStatsInput) {
	try {
		const urlParams = new URLSearchParams();
		urlParams.append("after", info.after);
		urlParams.append("before", info.before);
		const { data }: { data: TEngineeringSectorStatsOutput } = await axios.get(`/api/stats/sector-reports/engineering?${urlParams.toString()}`);
		return data.data;
	} catch (error) {
		throw error;
	}
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
