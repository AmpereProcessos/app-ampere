"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import type { TEngineeringProjectsKanbanInput } from "@/pages/api/projects/engenharia/kanban";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useUsers } from "@/utils/methods/query/crm/users";
import { deliveryStatus, serviceTypes } from "@/utils/select-options";
import {
  CalendarDays,
  DraftingCompass,
  LayoutGrid,
  ListFilter,
  MapPin,
  PanelsTopLeft,
  Tag,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";

const KANBAN_PERIOD_FIELD_OPTIONS = [
  { id: 1, value: "contrato.dataAssinatura", label: "DATA DE ASSINATURA DO CONTRATO" },
  { id: 2, value: "homologacao.dataLiberacao", label: "DATA DE LIBERAÇÃO PARA HOMOLOGACAO" },
  {
    id: 3,
    value: "homologacao.documentacao.dataInicioElaboracao",
    label: "DATA DE INICIO DA ELABORAÇÃO (DOCS)",
  },
  {
    id: 4,
    value: "homologacao.documentacao.dataConclusaoElaboracao",
    label: "DATA DE CONCLUSÃO DA ELABORAÇÃO (DOCS)",
  },
  {
    id: 5,
    value: "homologacao.documentacao.dataLiberacao",
    label: "DATA DE LIBERAÇÃO DA PARA ASSINATURA (DOCS)",
  },
  { id: 6, value: "homologacao.documentacao.dataAssinatura", label: "DATA DA ASSINATURA (DOCS)" },
  { id: 7, value: "homologacao.vistoria.dataSolicitacao", label: "DATA DE SOLICITAÇÃO DA VISTORIA" },
  { id: 8, value: "homologacao.vistoria.dataEfetivacao", label: "DATA DE EFETIVAÇÃO DA VISTORIA" },
  { id: 9, value: "compra.dataEntrega", label: "DATA DE ENTREGA DA COMPRA" },
  { id: 10, value: "compra.dataPagamento", label: "DATA DE PAGAMENTO DA COMPRA" },
] as const satisfies {
  id: number;
  value: NonNullable<TEngineeringProjectsKanbanInput["period"]["field"]>;
  label: string;
}[];

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((city, index) => ({
  id: index + 1,
  value: city,
  label: city,
}));

const AllStates = StatesAndCities.map((state, index) => ({
  id: index + 1,
  value: state.sigla,
  label: state.sigla,
}));

type EngineeringKanbanProjectsFiltersProps = {
  filters: TEngineeringProjectsKanbanInput;
  updateFilters: (params: Partial<TEngineeringProjectsKanbanInput>) => void;
  tagOptions: InteractiveFilterOption<string>[];
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function EngineeringKanbanProjectsFilters({
  filters,
  updateFilters,
  tagOptions,
}: EngineeringKanbanProjectsFiltersProps) {
  const { data: crmUsers } = useUsers({ includeDeleted: true });

  const sellerOptions = useMemo<InteractiveFilterOption<string>[]>(() => {
    if (!crmUsers) return [];
    return [...crmUsers]
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((user) => ({
        id: user._id,
        value: user.nome,
        label: user.nome,
        keywords: [user.nome, user._id, user.email ?? ""],
      }));
  }, [crmUsers]);

  const cityOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      AllCities.map((city) => ({
        id: city.id,
        value: city.value,
        label: city.label,
      })),
    [],
  );

  const stateOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      AllStates.map((state) => ({
        id: state.id,
        value: state.value,
        label: state.label,
      })),
    [],
  );

  const selectedPeriodLabel = useMemo(() => {
    const { after, before, field } = filters.period;
    if (!after || !before || !field) return "N/A";
    const fieldLabel =
      KANBAN_PERIOD_FIELD_OPTIONS.find((option) => option.value === field)?.label ?? field;
    return `${fieldLabel}: ${formatDateAsLocale(after)} - ${formatDateAsLocale(before)}`;
  }, [filters.period]);

  const hasTags = filters.tagIds.length > 0;
  const hasCities = filters.cities.length > 0;
  const hasUfs = filters.ufs.length > 0;
  const hasProjectTypes = filters.projectTypes.length > 0;
  const hasPendingDrawing = !!filters.pendingDrawingOnly;
  const hasPendingDiagram = !!filters.pendingDiagramOnly;
  const hasPendingVistory = !!filters.pendingVistoryOnly;

  function clearDateFilter() {
    updateFilters({ period: { after: null, before: null, field: null } });
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={filters.search}
        placeholder="Pesquisar por nome do contrato..."
        onChange={(e) => updateFilters({ search: e.target.value })}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <KanbanMultiFilterChip
          label="VENDEDOR"
          icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
          options={sellerOptions}
          value={filters.sellerNames}
          onChange={(sellerNames) => updateFilters({ sellerNames })}
          onClear={() => updateFilters({ sellerNames: [] })}
          searchPlaceholder="Buscar vendedor..."
          emptyLabel={crmUsers ? "Nenhum vendedor encontrado." : "Carregando vendedores..."}
        />

        <KanbanMultiFilterChip
          label="STATUS DE ENTREGA"
          icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
          options={deliveryStatus}
          value={filters.deliveryStatus}
          onChange={(deliveryStatus) => updateFilters({ deliveryStatus })}
          onClear={() => updateFilters({ deliveryStatus: [] })}
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
                options={[...KANBAN_PERIOD_FIELD_OPTIONS]}
                value={filters.period.field ?? null}
                onChange={(nextField) =>
                  updateFilters({
                    period: { ...filters.period, field: nextField },
                  })
                }
                onClear={() =>
                  updateFilters({
                    period: { ...filters.period, field: null },
                  })
                }
                isCleared={!filters.period.field}
                searchPlaceholder="Buscar campo..."
                emptyLabel="Nenhum campo encontrado."
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
                updateFilters({
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

        {hasTags ? (
          <KanbanMultiFilterChip
            label="ETIQUETAS"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={tagOptions}
            value={filters.tagIds}
            onChange={(tagIds) => updateFilters({ tagIds })}
            onClear={() => updateFilters({ tagIds: [] })}
          />
        ) : null}

        {hasCities ? (
          <KanbanMultiFilterChip
            label="CIDADE"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            options={cityOptions}
            value={filters.cities}
            onChange={(cities) => updateFilters({ cities })}
            onClear={() => updateFilters({ cities: [] })}
            searchPlaceholder="Buscar cidade..."
            contentClassName="w-80"
          />
        ) : null}

        {hasUfs ? (
          <KanbanMultiFilterChip
            label="ESTADO"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            options={stateOptions}
            value={filters.ufs}
            onChange={(ufs) => updateFilters({ ufs })}
            onClear={() => updateFilters({ ufs: [] })}
            searchPlaceholder="Buscar estado..."
          />
        ) : null}

        {hasProjectTypes ? (
          <KanbanMultiFilterChip
            label="TIPO DE SERVIÇO"
            icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
            options={serviceTypes}
            value={filters.projectTypes}
            onChange={(projectTypes) => updateFilters({ projectTypes })}
            onClear={() => updateFilters({ projectTypes: [] })}
            contentClassName="w-80"
          />
        ) : null}

        {hasPendingDrawing ? (
          <KanbanBooleanFilterChip
            label="PENDENTES DESENHO"
            icon={<PanelsTopLeft className="h-4 w-4 min-h-4 min-w-4" />}
            value={!!filters.pendingDrawingOnly}
            onChange={(pendingDrawingOnly) => updateFilters({ pendingDrawingOnly })}
            onClear={() => updateFilters({ pendingDrawingOnly: false })}
          />
        ) : null}

        {hasPendingDiagram ? (
          <KanbanBooleanFilterChip
            label="PENDENTES DIAGRAMA"
            icon={<LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />}
            value={!!filters.pendingDiagramOnly}
            onChange={(pendingDiagramOnly) => updateFilters({ pendingDiagramOnly })}
            onClear={() => updateFilters({ pendingDiagramOnly: false })}
          />
        ) : null}

        {hasPendingVistory ? (
          <KanbanBooleanFilterChip
            label="PENDENTES VISTORIA"
            icon={<DraftingCompass className="h-4 w-4 min-h-4 min-w-4" />}
            value={!!filters.pendingVistoryOnly}
            onChange={(pendingVistoryOnly) => updateFilters({ pendingVistoryOnly })}
            onClear={() => updateFilters({ pendingVistoryOnly: false })}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasTags ? (
                <InteractiveFilter.AddFilterItem id="tags" label="ETIQUETAS" icon={<Tag className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={tagOptions}
                    value={filters.tagIds}
                    onChange={(tagIds) => updateFilters({ tagIds })}
                    onClear={() => updateFilters({ tagIds: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasCities ? (
                <InteractiveFilter.AddFilterItem id="cities" label="CIDADE" icon={<MapPin className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={cityOptions}
                    value={filters.cities}
                    onChange={(cities) => updateFilters({ cities })}
                    onClear={() => updateFilters({ cities: [] })}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar cidade..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasUfs ? (
                <InteractiveFilter.AddFilterItem id="ufs" label="ESTADO" icon={<MapPin className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={stateOptions}
                    value={filters.ufs}
                    onChange={(ufs) => updateFilters({ ufs })}
                    onClear={() => updateFilters({ ufs: [] })}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar estado..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasProjectTypes ? (
                <InteractiveFilter.AddFilterItem
                  id="projectTypes"
                  label="TIPO DE SERVIÇO"
                  icon={<Wrench className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={serviceTypes}
                    value={filters.projectTypes}
                    onChange={(projectTypes) => updateFilters({ projectTypes })}
                    onClear={() => updateFilters({ projectTypes: [] })}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingDrawing ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingDrawing"
                  label="PENDENTES DESENHO"
                  icon={<PanelsTopLeft className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={!!filters.pendingDrawingOnly}
                    onChange={(pendingDrawingOnly) => updateFilters({ pendingDrawingOnly })}
                    label="PENDENTES DESENHO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingDiagram ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingDiagram"
                  label="PENDENTES DIAGRAMA"
                  icon={<LayoutGrid className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={!!filters.pendingDiagramOnly}
                    onChange={(pendingDiagramOnly) => updateFilters({ pendingDiagramOnly })}
                    label="PENDENTES DIAGRAMA"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingVistory ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingVistory"
                  label="PENDENTES VISTORIA"
                  icon={<DraftingCompass className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={!!filters.pendingVistoryOnly}
                    onChange={(pendingVistoryOnly) => updateFilters({ pendingVistoryOnly })}
                    label="PENDENTES VISTORIA"
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

function KanbanMultiFilterChip({
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

function KanbanBooleanFilterChip({
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
