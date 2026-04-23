import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { InteractiveFilter } from "@/components/ui/interactive-filter";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { TGetFinancialTransactionsOutputDefault } from "@/pages/api/financeiro/financial-transactions";
import { formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useFinancesFinancialTransactions } from "@/utils/methods/query/finances";
import {
  FinancialAccountTypeOptions,
  FinancialTransactionPaymentMethodsOptions,
  FinancialTransactionTypeOptions,
} from "@/utils/select-options";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  ListFilter,
  PencilIcon,
  PlusIcon,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BsCalendar, BsCalendarCheck } from "react-icons/bs";
import ControlFinancialTransaction from "./transacoes-financeiras/ControlFinancialTransaction";
import NewFinancialTransaction from "./transacoes-financeiras/NewFinancialTransaction";

const TRANSACTION_STATUS_OPTIONS = [
  {
    id: "pendente",
    value: "pendente",
    label: "PENDENTE",
    icon: <Clock className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "efetivada",
    value: "efetivada",
    label: "EFETIVADA",
    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  },
  {
    id: "em-atraso",
    value: "em-atraso",
    label: "EM ATRASO",
    icon: <AlertCircle className="w-4 h-4 text-red-600" />,
  },
];

export default function FinancialTransactionsView({ session }: { session: TAuthSession }) {
  const queryClient = useQueryClient();
  const [newFinancialTransactionModalIsOpen, setNewFinancialTransactionModalIsOpen] =
    useState(false);
  const [editFinancialTransactionModalId, setEditFinancialTransactionModalId] = useState<
    string | null
  >(null);
  const { data, queryKey, isLoading, isError, isSuccess, error, queryParams, updateQueryParams } =
    useFinancesFinancialTransactions({
      initialParams: {
        page: 1,
        search: "",
        types: [],
        paymentMethods: [],
        statuses: [],
        periodAfter: null,
        periodBefore: null,
      },
    });
  const transactions = data?.transactions ?? [];
  const transactionsMatched = data?.transactionsMatched ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const selectedTypesLabel = useMemo(
    () =>
      queryParams.types
        .map(
          (type) =>
            FinancialTransactionTypeOptions.find((option) => option.value === type)?.label ?? type,
        )
        .join(", "),
    [queryParams.types],
  );
  const selectedPaymentMethodsLabel = useMemo(
    () =>
      queryParams.paymentMethods
        .map(
          (method) =>
            FinancialTransactionPaymentMethodsOptions.find((option) => option.value === method)
              ?.label ?? method,
        )
        .join(", "),
    [queryParams.paymentMethods],
  );
  const selectedStatusesLabel = useMemo(
    () =>
      queryParams.statuses
        .map(
          (status) =>
            TRANSACTION_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status,
        )
        .join(", "),
    [queryParams.statuses],
  );
  const selectedForecastPeriodLabel = useMemo(() => {
    return queryParams.periodAfter && queryParams.periodBefore
      ? `${formatDateAsLocale(queryParams.periodAfter)} - ${formatDateAsLocale(queryParams.periodBefore)}`
      : "N/A";
  }, [queryParams.periodAfter, queryParams.periodBefore]);

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
          onClick={() => setNewFinancialTransactionModalIsOpen(true)}
        >
          <PlusIcon className="w-4 h-4" />
          NOVA TRANSAÇÃO FINANCEIRA
        </Button>
      </div>

      <Input
        value={queryParams.search ?? ""}
        placeholder="Pesquisar movimentação..."
        onChange={(e) => updateQueryParams({ search: e.target.value, page: 1 })}
        className="grow rounded-xl"
      />
      <div className="flex flex-col gap-3 justify-end lg:flex-row lg:items-end">
        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <ArrowRight className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>TIPO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              {selectedTypesLabel.length > 0 ? (
                <strong>{selectedTypesLabel}</strong>
              ) : (
                <span>NENHUM</span>
              )}
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear onClear={() => updateQueryParams({ types: [], page: 1 })} />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-72 p-0">
            <InteractiveFilter.MultiContent
              options={FinancialTransactionTypeOptions.map((option) => ({
                ...option,
                startContent: option.icon,
              }))}
              value={queryParams.types}
              onChange={(nextTypes) => updateQueryParams({ types: nextTypes, page: 1 })}
              onClear={() => updateQueryParams({ types: [], page: 1 })}
              isCleared={queryParams.types.length === 0}
              searchPlaceholder="Buscar tipo..."
              emptyLabel="Nenhum tipo encontrado."
              clearLabel="N/A"
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <Wallet className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>MÉTODO DE PAGAMENTO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              {selectedPaymentMethodsLabel.length > 0 ? (
                <strong>{selectedPaymentMethodsLabel}</strong>
              ) : (
                <span>NENHUM</span>
              )}
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear
              onClear={() => updateQueryParams({ paymentMethods: [], page: 1 })}
            />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-80 p-0">
            <InteractiveFilter.MultiContent
              options={FinancialTransactionPaymentMethodsOptions.map((option) => ({
                ...option,
                startContent: option.icon,
              }))}
              value={queryParams.paymentMethods}
              onChange={(nextPaymentMethods) =>
                updateQueryParams({ paymentMethods: nextPaymentMethods, page: 1 })
              }
              onClear={() => updateQueryParams({ paymentMethods: [], page: 1 })}
              isCleared={queryParams.paymentMethods.length === 0}
              searchPlaceholder="Buscar método..."
              emptyLabel="Nenhum método encontrado."
              clearLabel="N/A"
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>STATUS</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              {selectedStatusesLabel.length > 0 ? (
                <strong>{selectedStatusesLabel}</strong>
              ) : (
                <span>NENHUM</span>
              )}
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear onClear={() => updateQueryParams({ statuses: [], page: 1 })} />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-72 p-0">
            <InteractiveFilter.MultiContent
              options={TRANSACTION_STATUS_OPTIONS.map((option) => ({
                ...option,
                startContent: option.icon,
              }))}
              value={queryParams.statuses}
              onChange={(nextStatuses) => updateQueryParams({ statuses: nextStatuses, page: 1 })}
              onClear={() => updateQueryParams({ statuses: [], page: 1 })}
              isCleared={queryParams.statuses.length === 0}
              searchPlaceholder="Buscar status..."
              emptyLabel="Nenhum status encontrado."
              clearLabel="N/A"
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <CalendarDays className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>PERÍODO DE PREVISÃO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>{selectedForecastPeriodLabel}</InteractiveFilter.Value>
            <InteractiveFilter.Clear
              onClear={() => updateQueryParams({ periodAfter: null, periodBefore: null, page: 1 })}
            />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-auto p-0">
            <InteractiveFilter.DateRangeContent
              value={{
                from: queryParams.periodAfter ? new Date(queryParams.periodAfter) : undefined,
                to: queryParams.periodBefore ? new Date(queryParams.periodBefore) : undefined,
              }}
              onChange={(nextPeriod) =>
                updateQueryParams({
                  periodAfter: nextPeriod.from ? nextPeriod.from.toISOString() : null,
                  periodBefore: nextPeriod.to ? nextPeriod.to.toISOString() : null,
                  page: 1,
                })
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>
      </div>

      <GeneralPaginationComponent
        activePage={queryParams.page}
        queryLoading={isLoading}
        selectPage={(page) => updateQueryParams({ page })}
        totalPages={totalPages}
        itemsMatchedText={`${transactionsMatched} ${transactionsMatched === 1 ? "movimentação encontrada" : "movimentações encontradas"}.`}
        itemsShowingText={`Mostrando ${transactions.length} ${transactions.length === 1 ? "movimentação" : "movimentações"}.`}
      />

      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess && transactions ? (
        transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onEditClick={() => setEditFinancialTransactionModalId(tx.id)}
            />
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DollarSign />
              </EmptyMedia>
              <EmptyTitle>Nenhuma movimentação encontrada</EmptyTitle>
              <EmptyDescription>
                Não há movimentações financeiras para os filtros selecionados.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        )
      ) : null}

      {newFinancialTransactionModalIsOpen ? (
        <NewFinancialTransaction
          session={session}
          closeModal={() => setNewFinancialTransactionModalIsOpen(false)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}

      {editFinancialTransactionModalId ? (
        <ControlFinancialTransaction
          session={session}
          transactionId={editFinancialTransactionModalId}
          closeModal={() => setEditFinancialTransactionModalId(null)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
    </div>
  );
}

type TransactionCardProps = {
  transaction: TGetFinancialTransactionsOutputDefault["transactions"][number];
  onEditClick: () => void;
};

function TransactionCard({ transaction, onEditClick }: TransactionCardProps) {
  const typeConfig = useMemo(
    () => FinancialTransactionTypeOptions.find((o) => o.value === transaction.tipo) ?? null,
    [transaction.tipo],
  );

  const isEffective = !!transaction.dataEfetivacao;
  const isOverdue =
    !isEffective && !!transaction.dataPrevisao && new Date(transaction.dataPrevisao) < new Date();
  const statusConfig = useMemo(() => {
    return {
      label: isEffective ? "EFETIVADA" : isOverdue ? "EM ATRASO" : "PENDENTE",
      className: isEffective
        ? "bg-green-100 text-green-700"
        : isOverdue
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700",
      icon: isEffective ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : isOverdue ? (
        <AlertCircle className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      ),
    };
  }, [isEffective, isOverdue]);

  const paymentMethodConfig = useMemo(() => {
    return (
      FinancialTransactionPaymentMethodsOptions.find((o) => o.value === transaction.metodo) ?? null
    );
  }, [transaction.metodo]);

  const financialAccountTypeConfig = useMemo(() => {
    return (
      FinancialAccountTypeOptions.find((o) => o.value === transaction.contaFinanceira?.tipo) ?? null
    );
  }, [transaction.contaFinanceira?.tipo]);

  return (
    <div className="bg-card border-primary/20 flex w-full flex-col gap-1.5 rounded-xl border px-3 py-4 shadow-2xs">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 flex-wrap">
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
          <h1 className="text-xs font-bold tracking-tight lg:text-sm">
            {transaction.titulo || "TÍTULO NÃO DEFINIDO"}
          </h1>
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
              statusConfig.className,
            )}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          <span className="text-sm font-semibold">{formatToMoney(transaction.valor)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {transaction.contaFinanceira ? (
          <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
            {financialAccountTypeConfig?.icon}
            {transaction.contaFinanceira.nome}
          </span>
        ) : null}
        {paymentMethodConfig ? (
          <span className={cn("flex items-center gap-1.5 text-[0.65rem]")}>
            {paymentMethodConfig.icon}
            {paymentMethodConfig.label}
          </span>
        ) : null}

        {transaction.totalParcelas && transaction.totalParcelas > 1 ? (
          <span className="text-[0.65rem] text-muted-foreground">
            Parcela {transaction.parcela}/{transaction.totalParcelas}
          </span>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {transaction.dataEfetivacao ? (
            <div className={cn("flex items-center gap-1.5 text-[0.65rem] font-bold text-primary")}>
              <BsCalendarCheck className="w-3 min-w-3 h-3 min-h-3 text-green-600" />
              <p className="text-xs font-medium tracking-tight uppercase">
                EFETIVADA: {formatDateAsLocale(transaction.dataEfetivacao)}
              </p>
            </div>
          ) : transaction.dataPrevisao ? (
            <div className={cn("flex items-center gap-1.5 text-[0.65rem] font-bold text-primary")}>
              <BsCalendar className="w-3 min-w-3 h-3 min-h-3 text-amber-600" />
              <p className="text-xs font-medium tracking-tight uppercase">
                PREVISÃO: {formatDateAsLocale(transaction.dataPrevisao)}
              </p>
            </div>
          ) : null}

          {transaction.autor ? (
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={transaction.autor.avatarUrl || undefined}
                  alt={transaction.autor.nome || "N/A"}
                />
                <AvatarFallback className="text-[0.5rem]">
                  {formatNameAsInitials(transaction.autor.nome || "N/A")}
                </AvatarFallback>
              </Avatar>
              <span className="text-[0.65rem] text-muted-foreground">{transaction.autor.nome}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
