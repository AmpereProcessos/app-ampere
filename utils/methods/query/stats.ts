import type { TExecutionStats } from "@/pages/api/stats/sector-reports/execution";
import type { TDashboardStats, TSaleGraphStat } from "@/utils/schemas/stats";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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
