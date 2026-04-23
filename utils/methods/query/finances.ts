import { useDebounceMemo } from "@/lib/hooks/debounce";
import {
  TGetAccountingEntriesInput,
  TGetAccountingEntriesOutput,
} from "@/pages/api/financeiro/accounting-entries";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";

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

async function fetchFinancialAccounts(input: TGetFinancialAccountsInput) {
  const searchParams = new URLSearchParams();
  if (input.activeOnly) searchParams.set("activeOnly", input.activeOnly.toString());
  if (input.stats) searchParams.set("stats", input.stats.toString());
  if (input.statsPeriodBefore) searchParams.set("statsPeriodBefore", input.statsPeriodBefore);
  if (input.statsPeriodAfter) searchParams.set("statsPeriodAfter", input.statsPeriodAfter);
  const { data } = await axios.get<TGetFinancialAccountsOutput>(
    `/api/financeiro/financial-accounts?${searchParams.toString()}`,
  );
  return data.data.default;
}

type UseFinancesFinancialAccountsParams = {
  initialParams?: Partial<TGetFinancialAccountsInput>;
};
export function useFinancesFinancialAccounts({
  initialParams,
}: UseFinancesFinancialAccountsParams) {
  const [queryParams, setQueryParams] = useState<TGetFinancialAccountsInput>({
    activeOnly: initialParams?.activeOnly ?? true,
    stats: initialParams?.stats ?? false,
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
