"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { equipesTecnicas, oemPlans } from "@/utils/constants";
import AllCities from "@/utils/jsons/cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TOemProjectsFilters } from "@/utils/methods/query/oem";
import { ServiceOrderStatus, serviceTypes } from "@/utils/select-options";
import {
  CalendarDays,
  ListFilter,
  MapPin,
  Settings2,
  UserRound,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "obra.saida", label: "SAÍDA DE OBRA" },
  { id: 2, value: "medidor.data", label: "TROCA DE MEDIDOR" },
  { id: 3, value: "manutencoes.dataEfetivacao", label: "EXECUÇÃO DA MANUTENÇÃO" },
] as const;

const technicalTeamOptions: InteractiveFilterOption<string>[] = equipesTecnicas.map((team) => ({
  id: String(team.id),
  value: team.value ?? "",
  label: team.label,
}));

const oemPlanOptions: InteractiveFilterOption<string>[] = oemPlans.map((plan, index) => ({
  id: String(index + 1),
  value: plan.value,
  label: plan.label,
}));

type OemProjectsFiltersProps = {
  filters: TOemProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TOemProjectsFilters>>;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function OemProjectsFilters({ filters, setFilters }: OemProjectsFiltersProps) {
  const cityOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      AllCities.map((city, index) => ({
        id: String(index + 1),
        value: city,
        label: city,
      })),
    [],
  );

  const selectedPeriodLabel = useMemo(() => {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return "N/A";
    const fieldLabel =
      DATE_FIELD_OPTIONS.find((option) => option.value === filters.date.field)?.label ??
      filters.date.field;
    return `${fieldLabel}: ${formatDateAsLocale(filters.date.after)} - ${formatDateAsLocale(filters.date.before)}`;
  }, [filters.date]);

  const modulesQtyLabel = useMemo(() => {
    const parts: string[] = [];
    if (filters.modulesQtyGte != null) parts.push(`≥ ${filters.modulesQtyGte}`);
    if (filters.modulesQtyLte != null) parts.push(`≤ ${filters.modulesQtyLte}`);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  }, [filters.modulesQtyGte, filters.modulesQtyLte]);

  const hasNeighborhood = Boolean(filters.neighborhoodSearch?.trim());
  const hasModulesQty = filters.modulesQtyGte != null || filters.modulesQtyLte != null;
  const hasCity = filters.city.length > 0;
  const hasExecutionStatus = filters.executionStatus.length > 0;
  const hasPendingMaintenance = filters.pendingMaintenance;
  const hasOverdueMaintenance = filters.overdueMaintenance;
  const hasSystemOffline = filters.systemOffline;

  function clearDateFilter() {
    setFilters((prev) => ({
      ...prev,
      date: { after: null, before: null, field: null },
    }));
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={filters.search}
        placeholder="Pesquisar por nome do projeto..."
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <OemMultiFilterChip
          label="TIPO DE SERVIÇO"
          icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
          options={serviceTypes}
          value={filters.serviceType}
          onChange={(serviceType) => setFilters((prev) => ({ ...prev, serviceType }))}
          onClear={() => setFilters((prev) => ({ ...prev, serviceType: [] }))}
          contentClassName="w-80"
        />

        <OemMultiFilterChip
          label="EQUIPE RESPONSÁVEL"
          icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
          options={technicalTeamOptions}
          value={filters.technicalTeam}
          onChange={(technicalTeam) => setFilters((prev) => ({ ...prev, technicalTeam }))}
          onClear={() => setFilters((prev) => ({ ...prev, technicalTeam: [] }))}
        />

        <OemMultiFilterChip
          label="PLANO DE O&M"
          icon={<Settings2 className="h-4 w-4 min-h-4 min-w-4" />}
          options={oemPlanOptions}
          value={filters.oemPlan}
          onChange={(oemPlan) => setFilters((prev) => ({ ...prev, oemPlan }))}
          onClear={() => setFilters((prev) => ({ ...prev, oemPlan: [] }))}
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
                options={[...DATE_FIELD_OPTIONS]}
                value={filters.date.field}
                onChange={(nextField) =>
                  setFilters((prev) => ({
                    ...prev,
                    date: { ...prev.date, field: nextField },
                  }))
                }
                onClear={() =>
                  setFilters((prev) => ({
                    ...prev,
                    date: { ...prev.date, field: null },
                  }))
                }
                isCleared={!filters.date.field}
                clearLabel="SEM FILTRO"
                closeOnSelect
              />
            </div>
            <InteractiveFilter.DateRangeContent
              value={{
                from: filters.date.after ? new Date(filters.date.after) : undefined,
                to: filters.date.before ? new Date(filters.date.before) : undefined,
              }}
              onChange={(nextPeriod) =>
                setFilters((prev) => ({
                  ...prev,
                  date: {
                    ...prev.date,
                    after: nextPeriod.from
                      ? (formatDateInputChange(nextPeriod.from) as string)
                      : null,
                    before: nextPeriod.to ? (formatDateInputChange(nextPeriod.to) as string) : null,
                  },
                }))
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        {hasNeighborhood ? (
          <OemTextFilterChip
            label="BAIRRO"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.neighborhoodSearch}
            onChange={(neighborhoodSearch) =>
              setFilters((prev) => ({ ...prev, neighborhoodSearch }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, neighborhoodSearch: "" }))}
            placeholder="Digite o bairro..."
          />
        ) : null}

        {hasModulesQty ? (
          <InteractiveFilter.Root className="w-fit">
            <InteractiveFilter.Trigger>
              <InteractiveFilter.Icon>
                <Settings2 className="h-4 w-4 min-h-4 min-w-4" />
                <InteractiveFilter.Label>MÓDULOS</InteractiveFilter.Label>
              </InteractiveFilter.Icon>
              <InteractiveFilter.Value>
                <strong>{modulesQtyLabel}</strong>
              </InteractiveFilter.Value>
              <InteractiveFilter.Clear
                onClear={() =>
                  setFilters((prev) => ({
                    ...prev,
                    modulesQtyGte: null,
                    modulesQtyLte: null,
                  }))
                }
              />
            </InteractiveFilter.Trigger>
            <InteractiveFilter.Content className="w-72 p-0">
              <ModulesQtyFilterContent
                gte={filters.modulesQtyGte}
                lte={filters.modulesQtyLte}
                onChange={(gte, lte) =>
                  setFilters((prev) => ({
                    ...prev,
                    modulesQtyGte: gte,
                    modulesQtyLte: lte,
                  }))
                }
              />
            </InteractiveFilter.Content>
          </InteractiveFilter.Root>
        ) : null}

        {hasCity ? (
          <OemMultiFilterChip
            label="CIDADE"
            icon={<MapPin className="h-4 w-4 min-h-4 min-w-4" />}
            options={cityOptions}
            value={filters.city}
            onChange={(city) => setFilters((prev) => ({ ...prev, city }))}
            onClear={() => setFilters((prev) => ({ ...prev, city: [] }))}
            searchPlaceholder="Buscar cidade..."
            contentClassName="w-80"
          />
        ) : null}

        {hasExecutionStatus ? (
          <OemMultiFilterChip
            label="STATUS DA OBRA"
            icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
            options={ServiceOrderStatus}
            value={filters.executionStatus}
            onChange={(executionStatus) => setFilters((prev) => ({ ...prev, executionStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, executionStatus: [] }))}
          />
        ) : null}

        {hasPendingMaintenance ? (
          <OemBooleanFilterChip
            label="MANUTENÇÃO PENDENTE"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingMaintenance}
            onChange={(pendingMaintenance) =>
              setFilters((prev) => ({ ...prev, pendingMaintenance }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, pendingMaintenance: false }))}
          />
        ) : null}

        {hasOverdueMaintenance ? (
          <OemBooleanFilterChip
            label="MANUTENÇÃO ATRASADA"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.overdueMaintenance}
            onChange={(overdueMaintenance) =>
              setFilters((prev) => ({ ...prev, overdueMaintenance }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, overdueMaintenance: false }))}
          />
        ) : null}

        {hasSystemOffline ? (
          <OemBooleanFilterChip
            label="USINA LIGADA PENDENTE"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.systemOffline}
            onChange={(systemOffline) => setFilters((prev) => ({ ...prev, systemOffline }))}
            onClear={() => setFilters((prev) => ({ ...prev, systemOffline: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasNeighborhood ? (
                <InteractiveFilter.AddFilterItem
                  id="neighborhood"
                  label="BAIRRO"
                  icon={<MapPin className="h-4 w-4" />}
                >
                  <InteractiveFilter.TextContent
                    value={filters.neighborhoodSearch}
                    onChange={(neighborhoodSearch) =>
                      setFilters((prev) => ({ ...prev, neighborhoodSearch }))
                    }
                    onClear={() => setFilters((prev) => ({ ...prev, neighborhoodSearch: "" }))}
                    placeholder="Digite o bairro..."
                    autoCloseOnSubmit={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasModulesQty ? (
                <InteractiveFilter.AddFilterItem
                  id="modulesQty"
                  label="QUANTIDADE DE MÓDULOS"
                  icon={<Settings2 className="h-4 w-4" />}
                >
                  <ModulesQtyFilterContent
                    gte={filters.modulesQtyGte}
                    lte={filters.modulesQtyLte}
                    onChange={(gte, lte) =>
                      setFilters((prev) => ({
                        ...prev,
                        modulesQtyGte: gte,
                        modulesQtyLte: lte,
                      }))
                    }
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasCity ? (
                <InteractiveFilter.AddFilterItem id="city" label="CIDADE" icon={<MapPin className="h-4 w-4" />}>
                  <InteractiveFilter.MultiContent
                    options={cityOptions}
                    value={filters.city}
                    onChange={(city) => setFilters((prev) => ({ ...prev, city }))}
                    onClear={() => setFilters((prev) => ({ ...prev, city: [] }))}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar cidade..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasExecutionStatus ? (
                <InteractiveFilter.AddFilterItem
                  id="executionStatus"
                  label="STATUS DA OBRA"
                  icon={<Wrench className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={ServiceOrderStatus}
                    value={filters.executionStatus}
                    onChange={(executionStatus) =>
                      setFilters((prev) => ({ ...prev, executionStatus }))
                    }
                    onClear={() => setFilters((prev) => ({ ...prev, executionStatus: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingMaintenance ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingMaintenance"
                  label="MANUTENÇÃO PENDENTE"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingMaintenance}
                    onChange={(pendingMaintenance) =>
                      setFilters((prev) => ({ ...prev, pendingMaintenance }))
                    }
                    label="MANUTENÇÃO PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasOverdueMaintenance ? (
                <InteractiveFilter.AddFilterItem
                  id="overdueMaintenance"
                  label="MANUTENÇÃO ATRASADA"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.overdueMaintenance}
                    onChange={(overdueMaintenance) =>
                      setFilters((prev) => ({ ...prev, overdueMaintenance }))
                    }
                    label="MANUTENÇÃO ATRASADA"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasSystemOffline ? (
                <InteractiveFilter.AddFilterItem
                  id="systemOffline"
                  label="USINA LIGADA PENDENTE"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.systemOffline}
                    onChange={(systemOffline) =>
                      setFilters((prev) => ({ ...prev, systemOffline }))
                    }
                    label="PENDENTE CONFERÊNCIA DE USINA LIGADA"
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

function ModulesQtyFilterContent({
  gte,
  lte,
  onChange,
}: {
  gte: number | null;
  lte: number | null;
  onChange: (gte: number | null, lte: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid gap-1.5">
        <Label className="text-xs">MAIOR QUE</Label>
        <Input
          type="number"
          min={0}
          value={gte ?? ""}
          placeholder="Ex.: 10"
          onChange={(e) => {
            const raw = e.target.value.trim();
            onChange(raw === "" ? null : Number(raw), lte);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs">MENOR QUE</Label>
        <Input
          type="number"
          min={0}
          value={lte ?? ""}
          placeholder="Ex.: 50"
          onChange={(e) => {
            const raw = e.target.value.trim();
            onChange(gte, raw === "" ? null : Number(raw));
          }}
        />
      </div>
    </div>
  );
}

function OemMultiFilterChip({
  label,
  icon,
  options,
  value,
  onChange,
  onClear,
  contentClassName = "w-72",
  searchPlaceholder = "Buscar...",
}: {
  label: string;
  icon: React.ReactNode;
  options: InteractiveFilterOption<string>[];
  value: string[];
  onChange: (value: string[]) => void;
  onClear: () => void;
  contentClassName?: string;
  searchPlaceholder?: string;
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
          clearLabel="N/A"
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}

function OemTextFilterChip({
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

function OemBooleanFilterChip({
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
