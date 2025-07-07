import type { TGetPosVendaCallsStatisticsInput, TGetPosVendaCallsStatisticsOutput } from "@/app/api/chamados/posvenda/estatisticas/route";
import type { TGetAllPosVendaCallsInput, TGetPosVendaCallsOutput } from "@/app/api/chamados/posvenda/route";
import { useDebounceMemo } from "@/lib/hooks/debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { useState } from "react";

async function getPosVendaCallById({ id }: { id: string }) {
	try {
		const { data }: { data: TGetPosVendaCallsOutput } = await axios.get(`/api/chamados/posvenda?id=${id}`);

		const call = data.data.byId;
		if (!call) {
			throw new Error("Chamado não encontrado.");
		}

		return call;
	} catch (error) {
		console.log("Error running getPosVendaCallById", error);
		throw error;
	}
}

type UseGetPosVendaCallByIdProps = {
	id: string;
};
export function useGetPosVendaCallById({ id }: UseGetPosVendaCallByIdProps) {
	return useQuery({
		queryKey: ["pos-venda-call-by-id", id],
		queryFn: () => getPosVendaCallById({ id }),
	});
}

async function getAllPosVendaCalls({ search, periodAfter, periodBefore, periodField, ongoingOnly }: TGetAllPosVendaCallsInput) {
	try {
		const { data }: { data: TGetPosVendaCallsOutput } = await axios.get("/api/chamados/posvenda", {
			params: {
				search,
				periodAfter,
				periodBefore,
				periodField,
				ongoingOnly: ongoingOnly ? "true" : "false",
			},
		});

		if (!data.data.default) {
			throw new Error("Nenhum chamado encontrado.");
		}

		return data.data.default;
	} catch (error) {
		console.log("Error running getAllPosVendaCalls", error);
		throw error;
	}
}

type UseGetAllPosVendaCallsProps = {
	initialFilters?: Partial<TGetAllPosVendaCallsInput>;
};
export function useGetAllPosVendaCalls({ initialFilters }: UseGetAllPosVendaCallsProps) {
	const [filters, setFilters] = useState<Partial<TGetAllPosVendaCallsInput>>({
		search: initialFilters?.search || "",
		periodAfter: initialFilters?.periodAfter || null,
		periodBefore: initialFilters?.periodBefore || null,
		periodField: initialFilters?.periodField || null,
		ongoingOnly: initialFilters?.ongoingOnly || "true",
	});

	const updateFilters = (newFilters: Partial<TGetAllPosVendaCallsInput>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const debouncedFilters = useDebounceMemo(filters, 500);
	return {
		...useQuery({
			queryKey: ["pos-venda-calls", debouncedFilters],
			queryFn: async () => await getAllPosVendaCalls(debouncedFilters),
		}),
		filters,
		updateFilters,
	};
}

async function getPosVendaCallsStatistics({ periodAfter, periodBefore }: TGetPosVendaCallsStatisticsInput) {
	try {
		const { data }: { data: TGetPosVendaCallsStatisticsOutput } = await axios.get("/api/chamados/posvenda/estatisticas", {
			params: { periodAfter, periodBefore },
		});

		return data.data;
	} catch (error) {
		console.log("Error running getPosVendaCallsStatistics", error);
		throw error;
	}
}

type UseGetPosVendaCallsStatisticsProps = {
	initialFilters?: Partial<TGetPosVendaCallsStatisticsInput>;
};
export function useGetPosVendaCallsStatistics({ initialFilters }: UseGetPosVendaCallsStatisticsProps) {
	const monthStart = dayjs().startOf("month").toISOString();
	const monthEnd = dayjs().endOf("month").toISOString();
	const [filters, setFilters] = useState<TGetPosVendaCallsStatisticsInput>({
		periodAfter: initialFilters?.periodAfter || monthStart,
		periodBefore: initialFilters?.periodBefore || monthEnd,
	});

	const updateFilters = (newFilters: Partial<TGetPosVendaCallsStatisticsInput>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const debouncedFilters = useDebounceMemo(filters, 500);
	return {
		...useQuery({
			queryKey: ["pos-venda-calls-statistics", debouncedFilters],
			queryFn: async () => await getPosVendaCallsStatistics(debouncedFilters),
		}),
		filters,
		updateFilters,
	};
}
