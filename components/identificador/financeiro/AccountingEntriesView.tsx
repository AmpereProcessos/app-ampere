import { Input } from "@/components/ui/input";
import { InteractiveFilter } from "@/components/ui/interactive-filter";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { useMemo, useState } from "react";
import { useFinancesAccountingEntries } from "@/utils/methods/query/finances";
import { ArrowRight, BookOpen, CalendarDays, PencilIcon, PlusIcon } from "lucide-react";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { TGetAccountingEntriesOutputDefault } from "@/pages/api/financeiro/accounting-entries";
import { formatToMoney } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { BsCalendar } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { TAuthSession } from "@/lib/authentication/types";
import NewAccountingEntry from "./lancamentos-contabeis/NewAccountingEntry";
import ControlAccountingEntry from "./lancamentos-contabeis/ControlAccountingEntry";

export default function AccountingEntriesView({ session }: { session: TAuthSession }) {
  const queryClient = useQueryClient();
  const [newAccountingEntryModalIsOpen, setNewAccountingEntryModalIsOpen] = useState(false);
  const [editAccountingEntryModalId, setEditAccountingEntryModalId] = useState<string | null>(null);
  const { data, queryKey, isLoading, isError, isSuccess, error, queryParams, updateQueryParams } =
    useFinancesAccountingEntries({
      initialParams: { page: 1, search: "" },
    });

  const entries = data?.entries ?? [];
  const entriesMatched = data?.entriesMatched ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const selectedCompetencePeriodLabel = useMemo(() => {
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
          onClick={() => setNewAccountingEntryModalIsOpen(true)}
        >
          <PlusIcon className="w-4 h-4" />
          NOVO LANÇAMENTO CONTÁBIL
        </Button>
      </div>

      <Input
        value={queryParams.search ?? ""}
        placeholder="Pesquisar lançamento..."
        onChange={(e) => updateQueryParams({ search: e.target.value, page: 1 })}
        className="grow rounded-xl"
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end justify-end">
        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <CalendarDays className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>PERÍODO DE COMPETÊNCIA</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>{selectedCompetencePeriodLabel}</InteractiveFilter.Value>
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
                  periodAfter: nextPeriod.from
                    ? nextPeriod.from.toISOString()
                    : queryParams.periodAfter
                      ? queryParams.periodAfter
                      : undefined,
                  periodBefore: nextPeriod.to
                    ? nextPeriod.to.toISOString()
                    : queryParams.periodBefore
                      ? queryParams.periodBefore
                      : undefined,
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
        itemsMatchedText={`${entriesMatched} ${entriesMatched === 1 ? "lançamento encontrado" : "lançamentos encontrados"}.`}
        itemsShowingText={`Mostrando ${entries.length} ${entries.length === 1 ? "lançamento" : "lançamentos"}.`}
      />

      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess && entries ? (
        entries.length > 0 ? (
          entries.map((entry) => (
            <AccountingEntryCard
              key={entry.id}
              entry={entry}
              onEditClick={() => setEditAccountingEntryModalId(entry.id)}
            />
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyTitle>Nenhum lançamento encontrado</EmptyTitle>
              <EmptyDescription>
                Não há lançamentos contábeis para os filtros selecionados.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        )
      ) : null}

      {newAccountingEntryModalIsOpen ? (
        <NewAccountingEntry
          session={session}
          closeModal={() => setNewAccountingEntryModalIsOpen(false)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}

      {editAccountingEntryModalId ? (
        <ControlAccountingEntry
          session={session}
          entryId={editAccountingEntryModalId}
          closeModal={() => setEditAccountingEntryModalId(null)}
          callbacks={{
            onMutate: handleOnMutate,
            onSettled: handleOnSettled,
          }}
        />
      ) : null}
    </div>
  );
}

type AccountingEntryCardProps = {
  entry: TGetAccountingEntriesOutputDefault["entries"][number];
  onEditClick: () => void;
};

function AccountingEntryCard({ entry, onEditClick }: AccountingEntryCardProps) {
  return (
    <div className="bg-card border-border flex w-full flex-col gap-1.5 rounded-xl border px-3 py-4 shadow-2xs">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-bold tracking-tight lg:text-sm">
            {entry.titulo || "TÍTULO NÃO DEFINIDO"}
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
          <span className="text-sm font-semibold">{formatToMoney(entry.valor)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
        <span className="font-medium">{entry.contaDebito?.nome ?? "—"}</span>
        <ArrowRight className="w-4 h-4 min-w-4 min-h-4" />
        <span className="font-medium">{entry.contaCredito?.nome ?? "—"}</span>
      </div>

      {entry.anotacoes ? (
        <p className="text-[0.65rem] text-muted-foreground line-clamp-1">{entry.anotacoes}</p>
      ) : null}

      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn("flex items-center gap-1.5 text-[0.65rem] font-bold text-primary")}>
            <BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
            <p className="text-xs font-medium tracking-tight uppercase">
              COMPETÊNCIA: {formatDateAsLocale(entry.dataCompetencia)}
            </p>
          </div>
          {entry.autor ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={entry.autor.avatarUrl || undefined}
                  alt={entry.autor.nome || "N/A"}
                />
                <AvatarFallback className="text-[0.5rem]">
                  {formatNameAsInitials(entry.autor.nome || "N/A")}
                </AvatarFallback>
              </Avatar>
              <span className="text-[0.65rem] text-muted-foreground">{entry.autor.nome}</span>
            </div>
          ) : null}
          <span className="text-[0.65rem] text-muted-foreground">
            {formatDateAsLocale(entry.dataInsercao, true)}
          </span>
        </div>
      </div>
    </div>
  );
}
