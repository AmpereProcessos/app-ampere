import {
  TGetAccountingEntriesInput,
  TGetAccountingEntriesOutput,
} from "@/pages/api/financeiro/accounting-entries";
import { TGetAccountsChartsOutput } from "@/pages/api/financeiro/accounts-charts";
import {
  TGetFinancialAccountsInput,
  TGetFinancialAccountsOutput,
} from "@/pages/api/financeiro/financial-accounts";
import {
  TGetFinancialAccountGraphInput,
  TGetFinancialAccountGraphOutput,
} from "@/pages/api/financeiro/financial-accounts/graph";
import {
  TGetFinancialTransactionsInput,
  TGetFinancialTransactionsOutput,
} from "@/pages/api/financeiro/financial-transactions";
import {
  TGetFinancesOverallStatsInput,
  TGetFinancesOverallStatsOutput,
} from "@/pages/api/financeiro/stats";
import {
  TGetReconciliationsInput,
  TGetReconciliationsOutput,
} from "@/pages/api/financeiro/reconciliation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

export async function fetchAccountsCharts() {
  const { data } = await axios.get<TGetAccountsChartsOutput>(`/api/financeiro/accounts-charts`);

  const defaultCharts = data.data.default;
  if (!defaultCharts) throw new Error("Não foi possível carregar os planos de contas.");
  return defaultCharts;
}

export function useAccountsCharts() {
  return {
    ...useQuery({
      queryKey: ["accounts-charts"],
      queryFn: async () => await fetchAccountsCharts(),
    }),
  };
}

async function fetchAccountsChartById(id: string) {
  const { data } = await axios.get<TGetAccountsChartsOutput>(
    `/api/financeiro/accounts-charts?id=${id}`,
  );

  const byId = data.data.byId;
  if (!byId) throw new Error("Plano de contas não encontrado.");
  return byId;
}

export function useAccountsChartById(id: string) {
  return {
    ...useQuery({
      queryKey: ["accounts-chart-by-id", id],
      queryFn: async () => await fetchAccountsChartById(id),
    }),
    queryKey: ["accounts-chart-by-id", id],
  };
}
async function fetchFinancesOverallStats(input: TGetFinancesOverallStatsInput) {
  const searchParams = new URLSearchParams();
  if (input.periodAfter) searchParams.set("periodAfter", input.periodAfter);
  if (input.periodBefore) searchParams.set("periodBefore", input.periodBefore);
  const { data } = await axios.get<TGetFinancesOverallStatsOutput>(
    `/api/financeiro/stats?${searchParams.toString()}`,
  );
  return data;
}

type UseFinancesOverallStatsParams = {
  initialParams?: Partial<TGetFinancesOverallStatsInput>;
};
export function useFinancesOverallStats({ initialParams }: UseFinancesOverallStatsParams) {
  const [queryParams, setQueryParams] = useState<TGetFinancesOverallStatsInput>({
    periodAfter: initialParams?.periodAfter ?? dayjs().startOf("month").toISOString(),
    periodBefore: initialParams?.periodBefore ?? dayjs().endOf("month").toISOString(),
  });
  function updateQueryParams(params: Partial<TGetFinancesOverallStatsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }
  return {
    ...useQuery({
      queryKey: ["finances-overall-stats", queryParams],
      queryFn: async () => await fetchFinancesOverallStats(queryParams),
    }),
    queryKey: ["finances-overall-stats", queryParams],
    queryParams,
    updateQueryParams,
  };
}

async function fetchAccountingEntries(input: TGetAccountingEntriesInput) {
  const searchParams = new URLSearchParams();

  if (input.page) searchParams.set("page", input.page.toString());
  if (input.search) searchParams.set("search", input.search);
  if (input.periodAfter) searchParams.set("periodAfter", input.periodAfter);
  if (input.periodBefore) searchParams.set("periodBefore", input.periodBefore);
  const { data } = await axios.get<TGetAccountingEntriesOutput>(
    `/api/financeiro/accounting-entries?${searchParams.toString()}`,
  );
  return data.data.default;
}

async function fetchAccountingEntryById(id: string) {
  const { data } = await axios.get<TGetAccountingEntriesOutput>(
    `/api/financeiro/accounting-entries?id=${id}`,
  );
  const byId = data.data.byId;
  if (!byId) throw new Error("Lançamento contábil não encontrado.");
  return byId;
}

type UseFinancesAccountingEntriesParams = {
  initialParams?: Partial<TGetAccountingEntriesInput>;
};
export function useFinancesAccountingEntries({
  initialParams,
}: UseFinancesAccountingEntriesParams) {
  const [queryParams, setQueryParams] = useState<TGetAccountingEntriesInput>({
    page: initialParams?.page ?? 1,
    search: initialParams?.search ?? null,
    periodAfter: initialParams?.periodAfter ?? dayjs().startOf("month").toISOString(),
    periodBefore: initialParams?.periodBefore ?? dayjs().endOf("month").toISOString(),
  });

  function updateQueryParams(params: Partial<TGetAccountingEntriesInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }

  return {
    ...useQuery({
      queryKey: ["accounting-entries", queryParams],
      queryFn: async () => await fetchAccountingEntries(queryParams),
    }),
    queryKey: ["accounting-entries", queryParams],
    queryParams,
    updateQueryParams,
  };
}

export function useAccountingEntryById(id: string) {
  return {
    ...useQuery({
      queryKey: ["accounting-entry-by-id", id],
      queryFn: async () => await fetchAccountingEntryById(id),
    }),
    queryKey: ["accounting-entry-by-id", id],
  };
}

async function fetchFinancialTransactions(input: TGetFinancialTransactionsInput) {
  const searchParams = new URLSearchParams();
  if (input.page) searchParams.set("page", input.page.toString());
  if (input.search) searchParams.set("search", input.search);
  if (input.periodAfter) searchParams.set("periodAfter", input.periodAfter);
  if (input.periodBefore) searchParams.set("periodBefore", input.periodBefore);
  if (input.types) searchParams.set("types", input.types.join(","));
  if (input.paymentMethods) searchParams.set("paymentMethods", input.paymentMethods.join(","));
  if (input.statuses) searchParams.set("statuses", input.statuses.join(","));
  const { data } = await axios.get<TGetFinancialTransactionsOutput>(
    `/api/financeiro/financial-transactions?${searchParams.toString()}`,
  );
  return data.data.default;
}

async function fetchFinancialTransactionById(id: string) {
  const { data } = await axios.get<TGetFinancialTransactionsOutput>(
    `/api/financeiro/financial-transactions?id=${id}`,
  );
  const byId = data.data.byId;
  if (!byId) throw new Error("Transação financeira não encontrada.");
  return byId;
}

type UseFinancesFinancialTransactionsParams = {
  initialParams?: Partial<TGetFinancialTransactionsInput>;
};
export function useFinancesFinancialTransactions({
  initialParams,
}: UseFinancesFinancialTransactionsParams) {
  const [queryParams, setQueryParams] = useState<TGetFinancialTransactionsInput>({
    page: initialParams?.page ?? 1,
    search: initialParams?.search ?? null,
    periodAfter: initialParams?.periodAfter ?? dayjs().startOf("month").toISOString(),
    periodBefore: initialParams?.periodBefore ?? dayjs().endOf("month").toISOString(),
    types: initialParams?.types ?? [],
    paymentMethods: initialParams?.paymentMethods ?? [],
    statuses: initialParams?.statuses ?? [],
  });

  function updateQueryParams(params: Partial<TGetFinancialTransactionsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }

  return {
    ...useQuery({
      queryKey: ["financial-transactions", queryParams],
      queryFn: async () => await fetchFinancialTransactions(queryParams),
    }),
    queryKey: ["financial-transactions", queryParams],
    queryParams,
    updateQueryParams,
  };
}

export function useFinancialTransactionById(id: string) {
  return {
    ...useQuery({
      queryKey: ["financial-transaction-by-id", id],
      queryFn: async () => await fetchFinancialTransactionById(id),
    }),
    queryKey: ["financial-transaction-by-id", id],
  };
}

async function fetchFinancialAccounts(input: TGetFinancialAccountsInput) {
  const searchParams = new URLSearchParams();
  if (input.activeOnly) searchParams.set("activeOnly", input.activeOnly.toString());
  if (input.stats) searchParams.set("stats", input.stats.toString());
  if (input.statsPeriodBefore) searchParams.set("statsPeriodBefore", input.statsPeriodBefore);
  if (input.statsPeriodAfter) searchParams.set("statsPeriodAfter", input.statsPeriodAfter);
  const { data } = await axios.get<TGetFinancialAccountsOutput>(
    `/api/financeiro/financial-accounts?${searchParams.toString()}`,
  );
  const defaultAccounts = data.data.default;
  if (!defaultAccounts) throw new Error("Não foi possível carregar as contas financeiras.");
  return defaultAccounts;
}

type UseFinancesFinancialAccountsParams = {
  initialParams?: Partial<TGetFinancialAccountsInput>;
};
export function useFinancesFinancialAccounts({
  initialParams,
}: UseFinancesFinancialAccountsParams) {
  const [queryParams, setQueryParams] = useState<TGetFinancialAccountsInput>({
    activeOnly: initialParams?.activeOnly ?? true,
    stats: initialParams?.stats ?? true,
    statsPeriodBefore: initialParams?.statsPeriodBefore ?? null,
    statsPeriodAfter: initialParams?.statsPeriodAfter ?? null,
  });

  function updateQueryParams(params: Partial<TGetFinancialAccountsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }

  return {
    ...useQuery({
      queryKey: ["financial-accounts", queryParams],
      queryFn: async () => await fetchFinancialAccounts(queryParams),
    }),
    queryKey: ["financial-accounts", queryParams],
    queryParams,
    updateQueryParams,
  };
}

async function fetchFinancialAccountById(id: string) {
  const { data } = await axios.get<TGetFinancialAccountsOutput>(
    `/api/financeiro/financial-accounts?id=${id}`,
  );
  const byId = data.data.byId;
  if (!byId) throw new Error("Conta financeira não encontrada.");
  return byId;
}

export function useFinancialAccountById(id: string) {
  return {
    ...useQuery({
      queryKey: ["financial-account-by-id", id],
      queryFn: async () => await fetchFinancialAccountById(id),
    }),
    queryKey: ["financial-account-by-id", id],
  };
}

/* -------------------------------------------------------------------------- */
/* RECONCILIATIONS                                                            */
/* -------------------------------------------------------------------------- */

async function fetchReconciliations(input: TGetReconciliationsInput) {
  const searchParams = new URLSearchParams();
  if (input.page) searchParams.set("page", input.page.toString());
  if (input.contaFinanceiraId) searchParams.set("contaFinanceiraId", input.contaFinanceiraId);
  const { data } = await axios.get<TGetReconciliationsOutput>(
    `/api/financeiro/reconciliation?${searchParams.toString()}`,
  );
  return data.data.default;
}

type UseFinancesReconciliationsParams = {
  initialParams?: Partial<TGetReconciliationsInput>;
};
export function useFinancesReconciliations({
  initialParams,
}: UseFinancesReconciliationsParams = {}) {
  const [queryParams, setQueryParams] = useState<TGetReconciliationsInput>({
    page: initialParams?.page ?? 1,
    contaFinanceiraId: initialParams?.contaFinanceiraId ?? null,
    id: null,
  });

  function updateQueryParams(params: Partial<TGetReconciliationsInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }

  return {
    ...useQuery({
      queryKey: ["reconciliations", queryParams],
      queryFn: async () => await fetchReconciliations(queryParams),
    }),
    queryKey: ["reconciliations", queryParams],
    queryParams,
    updateQueryParams,
  };
}

async function fetchReconciliationById(id: string) {
  const { data } = await axios.get<TGetReconciliationsOutput>(
    `/api/financeiro/reconciliation?id=${id}`,
  );
  const byId = data.data.byId;
  if (!byId) throw new Error("Conciliação não encontrada.");
  return byId;
}

export function useReconciliationById(id: string | null) {
  return {
    ...useQuery({
      queryKey: ["reconciliation-by-id", id],
      queryFn: async () => await fetchReconciliationById(id as string),
      enabled: !!id,
    }),
    queryKey: ["reconciliation-by-id", id],
  };
}

async function fetchFinancialAccountGraph(input: TGetFinancialAccountGraphInput) {
  const searchParams = new URLSearchParams();
  if (input.contaFinanceiraId) searchParams.set("contaFinanceiraId", input.contaFinanceiraId);
  if (input.startDate) searchParams.set("startDate", input.startDate);
  if (input.endDate) searchParams.set("endDate", input.endDate);
  if (input.comparingStartDate) searchParams.set("comparingStartDate", input.comparingStartDate);
  if (input.comparingEndDate) searchParams.set("comparingEndDate", input.comparingEndDate);
  const { data } = await axios.get<TGetFinancialAccountGraphOutput>(
    `/api/financeiro/financial-accounts/graph?${searchParams.toString()}`,
  );
  return data.data;
}

type UseFinancesFinancialAccountGraphParams = {
  initialParams?: Partial<TGetFinancialAccountGraphInput>;
};
export function useFinancesFinancialAccountGraph({
  initialParams,
}: UseFinancesFinancialAccountGraphParams) {
  const [queryParams, setQueryParams] = useState<TGetFinancialAccountGraphInput>({
    contaFinanceiraId: initialParams?.contaFinanceiraId ?? "",
    startDate: initialParams?.startDate ?? null,
    endDate: initialParams?.endDate ?? null,
    comparingStartDate: initialParams?.comparingStartDate ?? null,
    comparingEndDate: initialParams?.comparingEndDate ?? null,
  });

  function updateQueryParams(params: Partial<TGetFinancialAccountGraphInput>) {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }

  return {
    ...useQuery({
      queryKey: ["financial-account-graph", queryParams],
      queryFn: async () => await fetchFinancialAccountGraph(queryParams),
    }),
    queryKey: ["financial-account-graph", queryParams],
    queryParams,
    updateQueryParams,
  };
}
