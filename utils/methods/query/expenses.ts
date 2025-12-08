import type { TExpenseStatsResult } from "@/pages/api/despesas/estatisticas";
import type { TExpensesByFiltersResult } from "@/pages/api/despesas/search";
import {
	TExpense,
	type TExpenseDTO,
	type TExpenseProjectDTO,
	type TExpenseQueryFilters,
	type TExpenseWithProjectDTO,
	type TPaymentUnwindSimplifiedDTO,
} from "@/utils/schemas/expenses";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

// Expenses by Project
async function fetchProjectExpenses({ projectId, identifier }: { projectId: string; identifier: string | null }) {
	const query = new URLSearchParams();
	query.set("projectId", projectId);
	if (identifier) query.set("identifier", identifier);
	const { data } = await axios.get(`/api/despesas?${query.toString()}`);
	return data.data as TExpenseDTO[];
}
export function useProjectExpenses({ projectId, enabled, identifier }: { projectId: string; enabled: boolean; identifier: string | null }) {
	return {
		...useQuery({
			queryKey: ["projectExpenses", projectId, identifier],
			queryFn: async () => await fetchProjectExpenses({ projectId, identifier }),
		}),
		queryKey: ["projectExpenses", projectId, identifier],
	};
}

// General expenses
async function fetchExpenses() {
	const { data } = await axios.get("/api/despesas");
	return data.data as TExpenseDTO[];
}
export function useExpenses() {
	const [filters, setFilters] = useState({
		search: "",
		paid: false,
		notPaid: false,
		dueToday: false,
		dueThisWeek: false,
		dueThisMonth: false,
		dueOverall: false,
		overDue: false,
	});

	function matchSearch(expense: TExpenseDTO) {
		if (filters.search.trim().length === 0) return true;
		return expense.projeto?.nome?.toUpperCase().includes(filters.search.toUpperCase());
	}
	function matchPaid(expense: TExpenseDTO) {
		if (!filters.paid) return true;
		return !!expense.efetivacao.efetivado;
	}
	function matchNotPaid(expense: TExpenseDTO) {
		if (!filters.notPaid) return true;
		return !expense.efetivacao.efetivado;
	}
	function matchDueToday(expense: TExpenseDTO) {
		if (!filters.dueToday) return true;
		const isToday = dayjs(expense.efetivacao.data).add(3, "hour").isSame(dayjs(), "day");
		return isToday;
	}
	function matchOverDue(expense: TExpenseDTO) {
		if (!filters.overDue) return true;
		const isOverdue = dayjs().isAfter(dayjs(expense.efetivacao.data).add(3, "hour"), "day");
		return isOverdue;
	}
	function handleModelData(data: TExpenseDTO[]) {
		return data.filter(
			(expense) => matchSearch(expense) && matchPaid(expense) && matchNotPaid(expense) && matchDueToday(expense) && matchOverDue(expense),
		);
	}
	return {
		...useQuery({
			queryKey: ["expenses"],
			queryFn: async () => await fetchExpenses(),
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchExpenseById({ id }: { id: string }) {
	const { data } = await axios.get(`/api/despesas?id=${id}`);
	return data.data as TExpenseWithProjectDTO;
}

export function useExpenseById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["expense-by-id", id],
		queryFn: async () => await fetchExpenseById({ id }),
	});
}

async function fetchExpenseByFilters({ page, ...filters }: TExpenseQueryFilters & { page: number }) {
	const { data } = await axios.post(`/api/despesas/search?page=${page}`, filters);
	return data.data as TExpensesByFiltersResult;
}

type UseExpensesByFiltersParams = {
	initialQueryParams: TExpenseQueryFilters & { page: number };
};
export function useExpensesByFilters({ initialQueryParams }: UseExpensesByFiltersParams) {
	const [queryParams, setQueryParams] = useState<TExpenseQueryFilters & { page: number }>(initialQueryParams);

	function updateQueryParams(params: Partial<TExpenseQueryFilters & { page: number }>) {
		setQueryParams((prev) => ({ ...prev, ...params }));
	}

	const query = useQuery({
		queryKey: ["expenses-by-filters", queryParams],
		queryFn: async () => await fetchExpenseByFilters(queryParams),
	});

	return { ...query, queryParams, updateQueryParams };
}

async function fetchPendingPayments() {
	const { data } = await axios.get("/api/despesas/pagamentos");
	return data.data as TPaymentUnwindSimplifiedDTO[];
}

type UsePendingPaymentsParams = {
	initialFilters: { search: string; apportionments: string[]; categories: string[]; previewPeriod: { after?: string | null; before?: string | null } };
};
export function usePendingPayments({ initialFilters }: UsePendingPaymentsParams) {
	const [filters, setFilters] = useState(initialFilters);

	function matchApportionments(payment: TPaymentUnwindSimplifiedDTO) {
		if (filters.apportionments.length === 0) return true;
		return filters.apportionments.includes(payment.rateio);
	}
	function matchCategories(payment: TPaymentUnwindSimplifiedDTO) {
		if (filters.categories.length === 0) return true;
		return filters.categories.includes(payment.categoria);
	}
	function matchPaymentPreviewDate(payment: TPaymentUnwindSimplifiedDTO) {
		const afterFilterDate = filters.previewPeriod.after ? new Date(filters.previewPeriod.after) : null;
		const beforeFilterDate = filters.previewPeriod.before ? new Date(filters.previewPeriod.before) : null;
		const paymentPreviewDate = new Date(payment.pagamento.dataPrevisaoPagamento);
		if (!afterFilterDate && !beforeFilterDate) return true;
		if (afterFilterDate && !beforeFilterDate) return paymentPreviewDate >= afterFilterDate;
		if (!afterFilterDate && beforeFilterDate) return paymentPreviewDate <= beforeFilterDate;
		if (!!afterFilterDate && !!beforeFilterDate) return paymentPreviewDate >= afterFilterDate && paymentPreviewDate <= beforeFilterDate;
		return false;
	}

	function handleModelData(data: TPaymentUnwindSimplifiedDTO[]) {
		return data.filter((payment) => matchApportionments(payment) && matchCategories(payment) && matchPaymentPreviewDate(payment));
	}

	return {
		...useQuery({
			queryKey: ["payments"],
			queryFn: fetchPendingPayments,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchExpenseStats() {
	const { data } = await axios.get("/api/despesas/estatisticas");
	return data.data as TExpenseStatsResult;
}

export function useExpenseStats() {
	return useQuery({
		queryKey: ["expense-stats"],
		queryFn: fetchExpenseStats,
	});
}

async function fetchExpenseProject({ projectId }: { projectId: string | null }) {
	if (!projectId) return null;
	const { data } = await axios.get(`/api/despesas/projeto?projectId=${projectId}`);
	return data.data as TExpenseProjectDTO;
}

export function useExpenseProject({ projectId }: { projectId: string | null }) {
	return useQuery({
		queryKey: ["expense-project", projectId],
		queryFn: async () => fetchExpenseProject({ projectId }),
	});
}

async function fetchExpenseByIdentifier({ identifier }: { identifier: string }) {
	const { data } = await axios.get(`/api/despesas?identifier=${identifier}`);
	return data.data as TExpenseDTO[];
}

export function useExpenseByIdentifier({ identifier }: { identifier: string }) {
	return useQuery({
		queryKey: ["expense-by-identifier", identifier],
		queryFn: async () => fetchExpenseByIdentifier({ identifier }),
	});
}
