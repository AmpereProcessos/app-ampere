"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { serviceOrdersCategories, serviceOrderUrgencyOptions } from "@/utils/constants";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useTags } from "@/utils/methods/query/tags";
import { useUsers } from "@/utils/methods/query/users";
import type { TPersonalizedServiceOrderFilter } from "@/utils/schemas/service-order";
import { roofTiles, ServiceOrderStatus, SystemTopologiesTypes } from "@/utils/select-options";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarDays,
  ListFilter,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

const PERIOD_FIELD_OPTIONS = [
  { id: 1, value: "dataInsercao", label: "DATA DE INSERÇÃO" },
  { id: 2, value: "dataPrevisaoLiberacao", label: "DATA DE PREVISÃO DE LIBERAÇÃO" },
  { id: 3, value: "dataLiberacao", label: "DATA DE LIBERAÇÃO" },
  { id: 4, value: "dataEfetivacao", label: "DATA DE EFETIVAÇÃO" },
  { id: 5, value: "periodo.inicio", label: "DATA DE INÍCIO DO SERVIÇO" },
  { id: 6, value: "periodo.fim", label: "DATA DE FIM DO SERVIÇO" },
  { id: 7, value: "projeto.compraDataPagamento", label: "DATA DE PAGAMENTO DA COMPRA" },
  { id: 8, value: "projeto.contratoDataAssinatura", label: "DATA DE ASSINATURA DO CONTRATO" },
  { id: 9, value: "projeto.compraEntregaDataPrevisao", label: "DATA DE PREVISÃO DE ENTREGA DA COMPRA" },
  { id: 10, value: "projeto.compraEntregaDataEfetivacao", label: "DATA DE EFETIVAÇÃO DA ENTREGA DA COMPRA" },
  { id: 11, value: "projeto.homologacaoAcessoDataResposta", label: "DATA DE RESPOSTA DA HOMOLOGACAO DE ACESSO" },
  { id: 12, value: "projeto.homologacaoVistoriaDataEfetivacao", label: "DATA DE EFETIVAÇÃO DA VISTORIA" },
] as const;

const AllStates = StatesAndCities.map((s, index) => ({ id: index + 1, value: s.sigla, label: s.sigla }));
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((city, index) => ({
  id: index + 1,
  value: city,
  label: city,
}));

type ExecutionProjectsFiltersProps = {
  filters: TPersonalizedServiceOrderFilter;
  updateFilters: (patch: Partial<TPersonalizedServiceOrderFilter>) => void;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function ExecutionProjectsFilters({ filters, updateFilters }: ExecutionProjectsFiltersProps) {
  const { data: users } = useUsers();
  const { data: tags } = useTags({ initialFilters: { applicableToServiceOrders: "true" } });

  const tagOptions = useMemo<InteractiveFilterOption<string>[]>(
    () => tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) ?? [],
    [tags],
  );

  const authorOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      users?.map((u) => ({
        id: u._id,
        value: u._id,
        label: u.nome,
        keywords: [u.nome, u._id],
      })) ?? [],
    [users],
  );

  const cityOptions = useMemo<InteractiveFilterOption<string>[]>(
    () => AllCities.map((c) => ({ id: c.id, value: c.value, label: c.label })),
    [],
  );

  const stateOptions = useMemo<InteractiveFilterOption<string>[]>(
    () => AllStates.map((s) => ({ id: s.id, value: s.value, label: s.label })),
    [],
  );

  const selectedPeriodLabel = useMemo(() => {
    if (!filters.period.after || !filters.period.before || !filters.period.field) return "N/A";
    const fieldLabel =
      PERIOD_FIELD_OPTIONS.find((o) => o.value === filters.period.field)?.label ?? filters.period.field;
    return `${fieldLabel}: ${formatDateAsLocale(filters.period.after)} - ${formatDateAsLocale(filters.period.before)}`;
  }, [filters.period]);

  const orderByLabel = useMemo(() => {
    if (!filters.orderBy.direction || !filters.orderBy.field) return "N/A";
    const fieldLabel =
      PERIOD_FIELD_OPTIONS.find((o) => o.value === filters.orderBy.field)?.label ?? filters.orderBy.field;
    const dir = filters.orderBy.direction === "asc" ? "CRESCENTE" : "DECRESCENTE";
    return `${dir} — ${fieldLabel}`;
  }, [filters.orderBy]);

  function patch(patch: Partial<TPersonalizedServiceOrderFilter>) {
    updateFilters({ ...patch, page: 1 });
  }

  const hasResponsible = Boolean(filters.responsible?.trim());
  const hasTags = filters.tags.length > 0;
  const hasCity = filters.city.length > 0;
  const hasState = filters.state.length > 0;
  const hasAuthors = filters.authors.length > 0;
  const hasTopologies = filters.topologies.length > 0;
  const hasRoofTypes = filters.roofTypes.length > 0;
  const hasReleased = filters.released;
  const hasNotReleased = filters.notReleased;
  const hasMissingObservations = filters.missingObservations;

  function clearDateFilter() {
    patch({ period: { after: null, before: null, field: null } });
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={filters.name}
        placeholder="Pesquisar por nome do favorecido..."
        onChange={(e) => patch({ name: e.target.value })}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <ExecutionMultiFilterChip
          label="CATEGORIA"
          icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
          options={serviceOrdersCategories}
          value={filters.category}
          onChange={(category) => patch({ category })}
          onClear={() => patch({ category: [] })}
        />

        <ExecutionMultiFilterChip
          label="URGÊNCIA"
          icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
          options={serviceOrderUrgencyOptions}
          value={filters.urgency}
          onChange={(urgency) => patch({ urgency })}
          onClear={() => patch({ urgency: [] })}
        />

        <ExecutionMultiFilterChip
          label="STATUS"
          icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
          options={ServiceOrderStatus}
          value={filters.status}
          onChange={(status) => patch({ status })}
          onClear={() => patch({ status: [] })}
        />

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <CalendarDays className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>PERÍODO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>{selectedPeriodLabel}</InteractiveFilter.Value>
            <InteractiveFilter.Clear onClear={clearDateFilter} />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-auto p-0" align="end">
            <div className="flex w-full min-w-[280px] flex-col border-b">
              <InteractiveFilter.SingleContent
                options={[...PERIOD_FIELD_OPTIONS]}
                value={filters.period.field}
                onChange={(nextField) =>
                  patch({ period: { ...filters.period, field: nextField } })
                }
                onClear={() => patch({ period: { ...filters.period, field: null } })}
                isCleared={!filters.period.field}
                clearLabel="SEM FILTRO"
                closeOnSelect
              />
            </div>
            <InteractiveFilter.DateRangeContent
              value={{
                from: filters.period.after ? new Date(filters.period.after) : undefined,
                to: filters.period.before ? new Date(filters.period.before) : undefined,
              }}
              onChange={(nextPeriod) =>
                patch({
                  period: {
                    ...filters.period,
                    after: nextPeriod.from
                      ? (formatDateInputChange(nextPeriod.from) as string)
                      : null,
                    before: nextPeriod.to ? (formatDateInputChange(nextPeriod.to) as string) : null,
                  },
                })
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <ExecutionBooleanFilterChip
          label="SOMENTE EM ABERTO"
          icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
          value={filters.pending}
          onChange={(pending) => patch({ pending })}
          onClear={() => patch({ pending: false })}
        />

        {hasResponsible ? (
          <ExecutionTextFilterChip
            label="RESPONSÁVEL"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.responsible}
            onChange={(responsible) => patch({ responsible })}
            onClear={() => patch({ responsible: "" })}
            placeholder="Digite o nome do responsável..."
          />
        ) : null}

        {hasTags ? (
          <ExecutionMultiFilterChip
            label="ETIQUETAS"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={tagOptions}
            value={filters.tags}
            onChange={(tags) => patch({ tags })}
            onClear={() => patch({ tags: [] })}
          />
        ) : null}

        {hasCity ? (
          <ExecutionMultiFilterChip
            label="CIDADE"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            options={cityOptions}
            value={filters.city}
            onChange={(city) => patch({ city })}
            onClear={() => patch({ city: [] })}
            searchPlaceholder="Buscar cidade..."
            contentClassName="w-80"
          />
        ) : null}

        {hasState ? (
          <ExecutionMultiFilterChip
            label="ESTADO"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            options={stateOptions}
            value={filters.state}
            onChange={(state) => patch({ state })}
            onClear={() => patch({ state: [] })}
            searchPlaceholder="Buscar estado..."
          />
        ) : null}

        {hasAuthors ? (
          <ExecutionMultiFilterChip
            label="AUTOR"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            options={authorOptions}
            value={filters.authors}
            onChange={(authors) => patch({ authors })}
            onClear={() => patch({ authors: [] })}
          />
        ) : null}

        {hasTopologies ? (
          <ExecutionMultiFilterChip
            label="TOPOLOGIA"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={SystemTopologiesTypes}
            value={filters.topologies}
            onChange={(topologies) => patch({ topologies })}
            onClear={() => patch({ topologies: [] })}
          />
        ) : null}

        {hasRoofTypes ? (
          <ExecutionMultiFilterChip
            label="TIPOS DE TELHA"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={roofTiles}
            value={filters.roofTypes}
            onChange={(roofTypes) => patch({ roofTypes })}
            onClear={() => patch({ roofTypes: [] })}
          />
        ) : null}

        {hasReleased ? (
          <ExecutionBooleanFilterChip
            label="SOMENTE LIBERADAS"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.released}
            onChange={(released) => patch({ released })}
            onClear={() => patch({ released: false })}
          />
        ) : null}

        {hasNotReleased ? (
          <ExecutionBooleanFilterChip
            label="SOMENTE NÃO LIBERADAS"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.notReleased}
            onChange={(notReleased) => patch({ notReleased })}
            onClear={() => patch({ notReleased: false })}
          />
        ) : null}

        {hasMissingObservations ? (
          <ExecutionBooleanFilterChip
            label="OBSERVAÇÕES AUSENTES"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.missingObservations}
            onChange={(missingObservations) => patch({ missingObservations })}
            onClear={() => patch({ missingObservations: false })}
          />
        ) : null}

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <ArrowUpNarrowWide className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>ORDENAÇÃO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              <strong>{orderByLabel}</strong>
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear
              onClear={() =>
                patch({ orderBy: { direction: "desc", field: "dataInsercao" } })
              }
            />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-80 p-0">
            <div className="flex flex-col gap-3 p-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => patch({ orderBy: { ...filters.orderBy, direction: "asc" } })}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                    filters.orderBy.direction === "asc"
                      ? "bg-primary/50 text-primary-foreground"
                      : "text-primary hover:bg-primary/20",
                  )}
                >
                  <ArrowUpNarrowWide size={12} />
                  CRESCENTE
                </button>
                <button
                  type="button"
                  onClick={() => patch({ orderBy: { ...filters.orderBy, direction: "desc" } })}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                    filters.orderBy.direction === "desc"
                      ? "bg-primary/50 text-primary-foreground"
                      : "text-primary hover:bg-primary/20",
                  )}
                >
                  <ArrowDownNarrowWide size={12} />
                  DECRESCENTE
                </button>
              </div>
              <InteractiveFilter.SingleContent
                options={[...PERIOD_FIELD_OPTIONS]}
                value={filters.orderBy.field}
                onChange={(field) => patch({ orderBy: { ...filters.orderBy, field } })}
                searchPlaceholder="Campo de ordenação..."
                closeOnSelect
              />
            </div>
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasResponsible ? (
                <InteractiveFilter.AddFilterItem
                  id="responsible"
                  label="RESPONSÁVEL"
                  icon={<UserRound className="h-4 w-4" />}
                >
                  <InteractiveFilter.TextContent
                    value={filters.responsible}
                    onChange={(responsible) => patch({ responsible })}
                    onClear={() => patch({ responsible: "" })}
                    placeholder="Digite o nome do responsável..."
                    autoCloseOnSubmit={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasTags ? (
                <InteractiveFilter.AddFilterItem id="tags" label="ETIQUETAS" icon={<Tag className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={tagOptions}
                    value={filters.tags}
                    onChange={(tags) => patch({ tags })}
                    onClear={() => patch({ tags: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasCity ? (
                <InteractiveFilter.AddFilterItem id="city" label="CIDADE" icon={<MapPin className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={cityOptions}
                    value={filters.city}
                    onChange={(city) => patch({ city })}
                    onClear={() => patch({ city: [] })}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar cidade..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasState ? (
                <InteractiveFilter.AddFilterItem id="state" label="ESTADO" icon={<MapPin className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={stateOptions}
                    value={filters.state}
                    onChange={(state) => patch({ state })}
                    onClear={() => patch({ state: [] })}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar estado..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasAuthors ? (
                <InteractiveFilter.AddFilterItem id="authors" label="AUTOR" icon={<UserRound className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={authorOptions}
                    value={filters.authors}
                    onChange={(authors) => patch({ authors })}
                    onClear={() => patch({ authors: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasTopologies ? (
                <InteractiveFilter.AddFilterItem id="topologies" label="TOPOLOGIA" icon={<Tag className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={SystemTopologiesTypes}
                    value={filters.topologies}
                    onChange={(topologies) => patch({ topologies })}
                    onClear={() => patch({ topologies: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasRoofTypes ? (
                <InteractiveFilter.AddFilterItem
                  id="roofTypes"
                  label="TIPOS DE TELHA"
                  icon={<Tag className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={roofTiles}
                    value={filters.roofTypes}
                    onChange={(roofTypes) => patch({ roofTypes })}
                    onClear={() => patch({ roofTypes: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasReleased ? (
                <InteractiveFilter.AddFilterItem
                  id="released"
                  label="SOMENTE LIBERADAS"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.released}
                    onChange={(released) => patch({ released })}
                    label="SOMENTE LIBERADAS"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasNotReleased ? (
                <InteractiveFilter.AddFilterItem
                  id="notReleased"
                  label="SOMENTE NÃO LIBERADAS"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.notReleased}
                    onChange={(notReleased) => patch({ notReleased })}
                    label="SOMENTE NÃO LIBERADAS"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasMissingObservations ? (
                <InteractiveFilter.AddFilterItem
                  id="missingObservations"
                  label="OBSERVAÇÕES AUSENTES"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.missingObservations}
                    onChange={(missingObservations) => patch({ missingObservations })}
                    label="SOMENTE COM OBSERVAÇÕES AUSENTES"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}
            </InteractiveFilter.AddFilterSection>
          </InteractiveFilter.AddFilterContent>
        </InteractiveFilter.AddFilterRoot>
      </div>
    </div>
  );
}

function ExecutionMultiFilterChip({
  label,
  icon,
  options,
  value,
  onChange,
  onClear,
  contentClassName = "w-72",
  searchPlaceholder = "Buscar...",
  emptyLabel = "Nenhuma opção encontrada.",
}: {
  label: string;
  icon: React.ReactNode;
  options: InteractiveFilterOption<string>[];
  value: string[];
  onChange: (value: string[]) => void;
  onClear: () => void;
  contentClassName?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
}) {
  const selectedLabel = joinLabels(value, options);

  return (
    <InteractiveFilter.Root className="w-fit">
      <InteractiveFilter.Trigger>
        <InteractiveFilter.Icon>
          {icon}
          <InteractiveFilter.Label>{label}</InteractiveFilter.Label>
        </InteractiveFilter.Icon>
        <InteractiveFilter.Value>
          {selectedLabel.length > 0 ? <strong>{selectedLabel}</strong> : <span>NENHUM</span>}
        </InteractiveFilter.Value>
        <InteractiveFilter.Clear onClear={onClear} />
      </InteractiveFilter.Trigger>
      <InteractiveFilter.Content className={`${contentClassName} p-0`}>
        <InteractiveFilter.MultiContent
          options={options}
          value={value}
          onChange={onChange}
          onClear={onClear}
          isCleared={value.length === 0}
          searchPlaceholder={searchPlaceholder}
          emptyLabel={emptyLabel}
          clearLabel="N/A"
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}

function ExecutionTextFilterChip({
  label,
  icon,
  value,
  onChange,
  onClear,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
}) {
  return (
    <InteractiveFilter.Root className="w-fit">
      <InteractiveFilter.Trigger>
        <InteractiveFilter.Icon>
          {icon}
          <InteractiveFilter.Label>{label}</InteractiveFilter.Label>
        </InteractiveFilter.Icon>
        <InteractiveFilter.Value>
          {value.trim() ? <strong>{value}</strong> : <span>N/A</span>}
        </InteractiveFilter.Value>
        <InteractiveFilter.Clear onClear={onClear} />
      </InteractiveFilter.Trigger>
      <InteractiveFilter.Content className="w-72 p-0">
        <InteractiveFilter.TextContent
          value={value}
          onChange={onChange}
          onClear={onClear}
          placeholder={placeholder}
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}

function ExecutionBooleanFilterChip({
  label,
  icon,
  value,
  onChange,
  onClear,
}: {
  label: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  onClear: () => void;
}) {
  return (
    <InteractiveFilter.Root className="w-fit">
      <InteractiveFilter.Trigger>
        <InteractiveFilter.Icon>
          {icon}
          <InteractiveFilter.Label>{label}</InteractiveFilter.Label>
        </InteractiveFilter.Icon>
        <InteractiveFilter.Value>
          <strong>{value ? "ATIVO" : "INATIVO"}</strong>
        </InteractiveFilter.Value>
        <InteractiveFilter.Clear onClear={onClear} />
      </InteractiveFilter.Trigger>
      <InteractiveFilter.Content className="w-80 p-0">
        <InteractiveFilter.BooleanContent
          value={value}
          onChange={onChange}
          label={label}
          autoCloseOnChange={false}
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}
