import { useMemo, useState } from "react";
import {
  useFinancesFinancialAccountGraph,
  useFinancesFinancialAccounts,
} from "@/utils/methods/query/finances";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { InteractiveFilter } from "@/components/ui/interactive-filter";
import { Banknote, PencilIcon, PlusIcon } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import {
  ArrowUp,
  GitBranch,
  CalendarDays,
  PlayIcon,
  ArrowDown,
  ArrowUpDown,
  TrendingUp,
} from "lucide-react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { TGetFinancialAccountsOutputDefault } from "@/pages/api/financeiro/financial-accounts";
import { FinancialAccountTypeOptions } from "@/utils/select-options";
import { cn } from "@/lib/utils";
import { formatToMoney } from "@/utils/constants";
import { AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Area } from "recharts";
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { Button } from "@/components/ui/button";
import NewFinancialAccount from "./contas-financeiras/NewFinancialAccount";
import { useQueryClient } from "@tanstack/react-query";
import { TAuthSession } from "@/lib/authentication/types";
import ControlFinancialAccount from "./contas-financeiras/ControlFinancialAccount";
const ACCOUNT_STATUS_OPTIONS = [
  { id: "active", value: "true", label: "Somente ativas" },
  { id: "all", value: "false", label: "Todas as contas" },
];

export default function FinancialAccountsView({ session }: { session: TAuthSession }) {
  const queryClient = useQueryClient();
  const [newFinancialAccountModalIsOpen, setNewFinancialAccountModalIsOpen] = useState(false);
  const [editFinancialAccountModalId, setEditFinancialAccountModalId] = useState<string | null>(
    null,
  );
  const { data, queryKey, isLoading, isError, isSuccess, error, queryParams, updateQueryParams } =
    useFinancesFinancialAccounts({ initialParams: {} });
  const accounts = data?.accounts ?? [];

  const selectedStatusLabel = queryParams.activeOnly ? "SOMENTE ATIVAS" : "TODAS AS CONTAS";
  const selectedPeriodLabel = useMemo(() => {
    return queryParams.statsPeriodAfter && queryParams.statsPeriodBefore
      ? `${formatDateAsLocale(queryParams.statsPeriodAfter)} - ${formatDateAsLocale(queryParams.statsPeriodBefore)}`
      : "N/A";
  }, [queryParams.statsPeriodAfter, queryParams.statsPeriodBefore]);

  const handleOnMutate = async () => {
    await queryClient.cancelQueries({ queryKey: queryKey });
  };
  const handleOnSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKey });
  };
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full flex items-center justify-end">
        <Button
          size={"sm"}
          className="flex items-center gap-1"
          onClick={() => setNewFinancialAccountModalIsOpen(true)}
        >
          <PlusIcon className="w-4 h-4" />
          NOVA CONTA FINANCEIRA
        </Button>
      </div>
      <div className="flex flex-col gap-3 justify-end lg:flex-row lg:items-end">
        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <Banknote className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>STATUS</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              <strong>{selectedStatusLabel}</strong>
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear onClear={() => updateQueryParams({ activeOnly: true })} />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-56 p-0">
            <InteractiveFilter.SingleContent
              options={ACCOUNT_STATUS_OPTIONS}
              value={queryParams.activeOnly ? "true" : "false"}
              onChange={(nextValue) => updateQueryParams({ activeOnly: nextValue === "true" })}
              searchPlaceholder="Buscar status..."
              emptyLabel="Nenhum status encontrado."
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <CalendarDays className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>PERÍODO DE ESTATÍSTICAS</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>{selectedPeriodLabel}</InteractiveFilter.Value>
            <InteractiveFilter.Clear
              onClear={() => updateQueryParams({ statsPeriodAfter: null, statsPeriodBefore: null })}
            />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-auto p-0">
            <InteractiveFilter.DateRangeContent
              value={{
                from: queryParams.statsPeriodAfter
                  ? new Date(queryParams.statsPeriodAfter)
                  : undefined,
                to: queryParams.statsPeriodBefore
                  ? new Date(queryParams.statsPeriodBefore)
                  : undefined,
              }}
              onChange={(nextPeriod) =>
                updateQueryParams({
                  statsPeriodAfter: nextPeriod.from
                    ? nextPeriod.from.toISOString()
                    : (queryParams.statsPeriodAfter ?? null),
                  statsPeriodBefore: nextPeriod.to
                    ? nextPeriod.to.toISOString()
                    : (queryParams.statsPeriodBefore ?? null),
                })
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>
      </div>

      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess && accounts ? (
        accounts.length > 0 ? (
          <div className="w-full flex flex-col gap-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                statsPeriodAfter={queryParams.statsPeriodAfter}
                statsPeriodBefore={queryParams.statsPeriodBefore}
                onEditClick={() => setEditFinancialAccountModalId(account.id)}
              />
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Banknote />
              </EmptyMedia>
              <EmptyTitle>Nenhuma conta financeira encontrada</EmptyTitle>
              <EmptyDescription>
                {queryParams.activeOnly
                  ? "Não há contas financeiras ativas."
                  : "Não há contas financeiras cadastradas."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        )
      ) : null}
      {newFinancialAccountModalIsOpen ? (
        <NewFinancialAccount
          session={session}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
          closeModal={() => setNewFinancialAccountModalIsOpen(false)}
        />
      ) : null}
      {editFinancialAccountModalId ? (
        <ControlFinancialAccount
          session={session}
          accountId={editFinancialAccountModalId}
          closeModal={() => setEditFinancialAccountModalId(null)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
    </div>
  );
}

type AccountCardProps = {
  account: TGetFinancialAccountsOutputDefault["accounts"][number];
  statsPeriodAfter: string | null;
  statsPeriodBefore: string | null;
  onEditClick: () => void;
};
function AccountCard({
  account,
  statsPeriodAfter,
  statsPeriodBefore,
  onEditClick,
}: AccountCardProps) {
  const typeConfig = FinancialAccountTypeOptions.find((o) => o.value === account.tipo) ?? null;
  const stats = account.estatisticas;

  return (
    <div className="bg-card border-primary/20 flex w-full flex-col gap-2 rounded-xl border px-4 py-4 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {typeConfig ? (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem]",
                typeConfig.colors.background,
                typeConfig.colors.text,
              )}
            >
              {typeConfig.icon}
              {typeConfig.label}
            </span>
          ) : null}

          <h2 className="text-sm font-semibold">{account.nome}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size={"xs"}
            variant={"ghost"}
            className="flex items-center gap-1"
            onClick={onEditClick}
          >
            <PencilIcon className="w-4 h-4" />
            EDITAR
          </Button>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem]",
              account.ativo ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600",
            )}
          >
            {account.ativo ? "ATIVO" : "INATIVO"}
          </span>
        </div>
      </div>
      <div className="w-full flex items-center flex-wrap gap-x-3 gap-y-1.5">
        <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
          <PlayIcon className="w-3 h-3" />
          INICIAL: {formatToMoney(account.saldoInicial.valor)} EM{" "}
          {formatDateAsLocale(account.saldoInicial.data)}
        </span>
        <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
          <GitBranch className="w-3 h-3" />
          CONTA CONTÁBIL: {account.contaContabil?.nome ?? "N/A"}
        </span>
      </div>

      {account.metadados?.tipo === "BANCO" &&
      (account.metadados?.codigo || account.metadados?.agencia || account.metadados?.numero) ? (
        <div className="flex flex-col gap-1 border-t border-primary/10 pt-2">
          {account.metadados?.nome ? (
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] text-muted-foreground">Banco</span>
              <span className="text-[0.65rem] font-medium">{account.metadados?.nome}</span>
            </div>
          ) : null}
          {account.metadados?.agencia ? (
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] text-muted-foreground">Agência</span>
              <span className="text-[0.65rem] font-medium">{account.metadados?.agencia}</span>
            </div>
          ) : null}
          {account.metadados?.numero ? (
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] text-muted-foreground">Conta</span>
              <span className="text-[0.65rem] font-medium">
                {account.metadados?.numero}
                {account.metadados?.digito ? `-${account.metadados?.digito}` : ""}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-stretch">
        {/* LEFT: Stat badges stacked vertically */}
        <div className="flex w-full shrink-0 flex-col gap-1 lg:w-1/3">
          {/* Saldo Atual — all time */}
          <div
            className={cn(
              "w-full flex items-center justify-between gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem] bg-secondary",
            )}
          >
            <div className="flex items-center gap-1.5">
              <BadgeDollarSign className="w-4 h-4 min-w-4 min-h-4" />
              <span className="text-xs font-medium">SALDO ATUAL</span>
            </div>
            <span className="text-sm font-bold tabular-nums">
              {formatToMoney(stats?.saldoAtual ?? 0)}
            </span>
          </div>

          {/* Total Entradas — period */}
          <div className="w-full flex items-center justify-between gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem] bg-green-100 text-green-700">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="w-4 h-4 min-w-4 min-h-4" />
              <span className="text-xs font-medium">ENTRADAS</span>
            </div>
            <span className="text-sm font-bold tabular-nums">
              {formatToMoney(stats?.totalEntradas ?? 0)}
            </span>
          </div>

          {/* Total Saídas — period */}
          <div className="w-full flex items-center justify-between gap-1.5 rounded-xl px-3 py-1.5 text-[0.65rem] bg-red-100 text-red-700">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-4 h-4 min-w-4 min-h-4" />
              <span className="text-xs font-medium">SAÍDAS</span>
            </div>
            <span className="text-sm font-bold tabular-nums">
              {formatToMoney(stats?.totalSaidas ?? 0)}
            </span>
          </div>
        </div>

        {/* RIGHT: chart — owns its own header + type toggles */}
        <div className="flex min-h-[120px] flex-1 flex-col rounded-[10px] bg-gradient-to-b from-muted/40 to-transparent px-2 pb-1 pt-2">
          <AccountCardChart
            accountId={account.id}
            startDate={statsPeriodAfter}
            endDate={statsPeriodBefore}
          />
        </div>
      </div>
    </div>
  );
}

type AccountCardGraphType = "entries-and-exits" | "entries" | "exits" | "consolidated";

const GRAPH_TYPE_OPTIONS: { value: AccountCardGraphType; icon: React.ReactNode; label: string }[] =
  [
    {
      value: "entries-and-exits",
      icon: <ArrowUpDown className="h-3 w-3" />,
      label: "Entradas e Saídas",
    },
    { value: "entries", icon: <ArrowUp className="h-3 w-3" />, label: "Entradas" },
    { value: "exits", icon: <ArrowDown className="h-3 w-3" />, label: "Saídas" },
    { value: "consolidated", icon: <TrendingUp className="h-3 w-3" />, label: "Resultado líquido" },
  ];

const GRAPH_TYPE_LABELS: Record<AccountCardGraphType, string> = {
  "entries-and-exits": "Entradas vs Saídas",
  entries: "Entradas",
  exits: "Saídas",
  consolidated: "Resultado líquido",
};

type AccountCardChartProps = {
  accountId: string;
  startDate: string | null;
  endDate: string | null;
};
function AccountCardChart({ accountId, startDate, endDate }: AccountCardChartProps) {
  const [graphType, setGraphType] = useState<AccountCardGraphType>("entries-and-exits");
  const { data, isLoading, isError, isSuccess, error, queryParams, updateQueryParams } =
    useFinancesFinancialAccountGraph({
      initialParams: {
        contaFinanceiraId: accountId,
        startDate,
        endDate,
        comparingStartDate: null,
        comparingEndDate: null,
      },
    });

  const consolidatedData = useMemo(
    () => data?.map((d) => ({ ...d, net: d.entries - d.exits })) ?? [],
    [data],
  );

  const chartConfig = {
    entries: { label: "Entradas", color: "#16a34a" },
    exits: { label: "Saídas", color: "#dc2626" },
    net: { label: "Resultado", color: "#6366f1" },
  } satisfies ChartConfig;

  const header = (
    <div className="mb-1 flex items-center justify-between px-0.5">
      <span className="text-[0.55rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
        {GRAPH_TYPE_LABELS[graphType]}
      </span>
      <div className="flex items-center gap-0.5">
        {GRAPH_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => setGraphType(opt.value)}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md transition-colors",
              graphType === opt.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {opt.icon}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex w-full flex-col flex-1">
        {header}
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[0.6rem] text-muted-foreground animate-pulse">Carregando...</span>
        </div>
      </div>
    );
  }

  const hasAnyData = data && data.some((d) => d.entries > 0 || d.exits > 0);
  if (!data || !hasAnyData) {
    return (
      <div className="flex w-full flex-col flex-1">
        {header}
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[0.6rem] text-muted-foreground">Sem movimentações no período</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col flex-1">
      {header}
      <ChartContainer config={chartConfig} className="aspect-auto h-[88px] w-full">
        <AreaChart
          accessibilityLayer
          data={graphType === "consolidated" ? consolidatedData : data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`grad-entries-${accountId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`grad-exits-${accountId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`grad-net-${accountId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeWidth={0.2} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={4}
            axisLine={false}
            tick={{ fontSize: 8 }}
            tickFormatter={(v) => String(v).slice(0, 8)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const colorMap: Record<string, string> = {
                    entries: "#16a34a",
                    exits: "#dc2626",
                    net: "#6366f1",
                  };
                  const labelMap: Record<string, string> = {
                    entries: "Entradas",
                    exits: "Saídas",
                    net: "Resultado líquido",
                  };
                  const color = colorMap[name as string] ?? "#888";
                  const label = labelMap[name as string] ?? String(name);
                  return (
                    <>
                      <div
                        className="h-2 w-2 shrink-0 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-1 items-center justify-between gap-3 leading-none">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatToMoney(Number(value))}
                        </span>
                      </div>
                    </>
                  );
                }}
              />
            }
          />

          {(graphType === "entries-and-exits" || graphType === "entries") && (
            <Area
              type="monotone"
              dataKey="entries"
              stroke="#16a34a"
              strokeWidth={1.5}
              fill={`url(#grad-entries-${accountId})`}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          )}
          {(graphType === "entries-and-exits" || graphType === "exits") && (
            <Area
              type="monotone"
              dataKey="exits"
              stroke="#dc2626"
              strokeWidth={1.5}
              fill={`url(#grad-exits-${accountId})`}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          )}
          {graphType === "consolidated" && (
            <Area
              type="monotone"
              dataKey="net"
              stroke="#6366f1"
              strokeWidth={1.5}
              fill={`url(#grad-net-${accountId})`}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
