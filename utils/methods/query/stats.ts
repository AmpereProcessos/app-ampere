import type { TExecutionStats } from "@/pages/api/stats/sector-reports/execution";
import type { TDashboardStats, TSaleGraphStat } from "@/utils/schemas/stats";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { TOverallReportInput, TOverallReportOutput } from "@/pages/api/stats/overall-report";
import { useState } from "react";
import dayjs from "dayjs";
import { useDebounceMemo } from "@/lib/hooks/debounce";

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
	const monthStart = dayjs().startOf("month").toISOString();
	const monthEnd = dayjs().endOf("month").toISOString();
	const [queryParams, setQueryParams] = useState<TOverallReportInput>({
		period: {
			after: initialParams?.period?.after ?? monthStart,
			before: initialParams?.period?.before ?? monthEnd,
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
