"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import { equipesTecnicas } from "@/utils/constants";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TCommissioningProjectsFilters } from "@/utils/methods/query/oem";
import { allActiveSellers } from "@/utils/select-options";
import {
  CalendarDays,
  ListFilter,
  MapPin,
  Smartphone,
  UserRound,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "obra.saida", label: "SAÍDA DE OBRA" },
  { id: 2, value: "medidor.data", label: "TROCA DO MEDIDOR" },
] as const;

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((city, index) => ({
  id: index + 1,
  value: city,
  label: city,
}));

const technicalTeamOptions: InteractiveFilterOption<string>[] = equipesTecnicas.map(
  (team, index) => ({
    id: String(index + 1),
    value: team.value,
    label: team.label,
  }),
);

const sellerOptions: InteractiveFilterOption<string>[] = allActiveSellers.map((seller) => ({
  id: String(seller.id),
  value: seller.value,
  label: seller.label,
}));

type CommissioningProjectsFiltersProps = {
  filters: TCommissioningProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TCommissioningProjectsFilters>>;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function CommissioningProjectsFilters({
  filters,
  setFilters,
}: CommissioningProjectsFiltersProps) {
  const cityOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      AllCities.map((city) => ({
        id: String(city.id),
        value: city.value,
        label: city.label,
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

  const hasCity = filters.city.length > 0;
  const hasSeller = filters.seller.length > 0;
  const hasAppPending = filters.appPending;
  const hasPlantPower = filters.plantPowerCheckPending;
  const hasInjectedEnergy = filters.injectedEnergyPending;
  const hasMonitoring = filters.monitoringPending;

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
        placeholder="Pesquisar por nome do contrato..."
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <CommissioningMultiFilterChip
          label="EQUIPE TÉCNICA"
          icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
          options={technicalTeamOptions}
          value={filters.responsibleTeam}
          onChange={(responsibleTeam) => setFilters((prev) => ({ ...prev, responsibleTeam }))}
          onClear={() => setFilters((prev) => ({ ...prev, responsibleTeam: [] }))}
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

        {hasSeller ? (
          <CommissioningMultiFilterChip
            label="VENDEDOR"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            options={sellerOptions}
            value={filters.seller}
            onChange={(seller) => setFilters((prev) => ({ ...prev, seller }))}
            onClear={() => setFilters((prev) => ({ ...prev, seller: [] }))}
            searchPlaceholder="Buscar vendedor..."
          />
        ) : null}

        {hasCity ? (
          <CommissioningMultiFilterChip
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

        {hasAppPending ? (
          <CommissioningBooleanFilterChip
            label="APP PENDENTE"
            icon={<Smartphone className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.appPending}
            onChange={(appPending) => setFilters((prev) => ({ ...prev, appPending }))}
            onClear={() => setFilters((prev) => ({ ...prev, appPending: false }))}
          />
        ) : null}

        {hasPlantPower ? (
          <CommissioningBooleanFilterChip
            label="USINA LIGADA PENDENTE"
            icon={<Zap className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.plantPowerCheckPending}
            onChange={(plantPowerCheckPending) =>
              setFilters((prev) => ({ ...prev, plantPowerCheckPending }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, plantPowerCheckPending: false }))}
          />
        ) : null}

        {hasInjectedEnergy ? (
          <CommissioningBooleanFilterChip
            label="ENERGIA INJETADA PENDENTE"
            icon={<Zap className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.injectedEnergyPending}
            onChange={(injectedEnergyPending) =>
              setFilters((prev) => ({ ...prev, injectedEnergyPending }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, injectedEnergyPending: false }))}
          />
        ) : null}

        {hasMonitoring ? (
          <CommissioningBooleanFilterChip
            label="MONITORAMENTO PENDENTE"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.monitoringPending}
            onChange={(monitoringPending) =>
              setFilters((prev) => ({ ...prev, monitoringPending }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, monitoringPending: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasSeller ? (
                <InteractiveFilter.AddFilterItem
                  id="seller"
                  label="VENDEDOR"
                  icon={<UserRound className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={sellerOptions}
                    value={filters.seller}
                    onChange={(seller) => setFilters((prev) => ({ ...prev, seller }))}
                    onClear={() => setFilters((prev) => ({ ...prev, seller: [] }))}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar vendedor..."
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

              {!hasAppPending ? (
                <InteractiveFilter.AddFilterItem
                  id="appPending"
                  label="APP PENDENTE"
                  icon={<Smartphone className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.appPending}
                    onChange={(appPending) => setFilters((prev) => ({ ...prev, appPending }))}
                    label="CONFIGURAÇÃO DO APLICATIVO PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPlantPower ? (
                <InteractiveFilter.AddFilterItem
                  id="plantPower"
                  label="USINA LIGADA PENDENTE"
                  icon={<Zap className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.plantPowerCheckPending}
                    onChange={(plantPowerCheckPending) =>
                      setFilters((prev) => ({ ...prev, plantPowerCheckPending }))
                    }
                    label="CONFERÊNCIA DE USINA LIGADA PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasInjectedEnergy ? (
                <InteractiveFilter.AddFilterItem
                  id="injectedEnergy"
                  label="ENERGIA INJETADA PENDENTE"
                  icon={<Zap className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.injectedEnergyPending}
                    onChange={(injectedEnergyPending) =>
                      setFilters((prev) => ({ ...prev, injectedEnergyPending }))
                    }
                    label="CONFERÊNCIA DE ENERGIA INJETADA PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasMonitoring ? (
                <InteractiveFilter.AddFilterItem
                  id="monitoring"
                  label="MONITORAMENTO PENDENTE"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.monitoringPending}
                    onChange={(monitoringPending) =>
                      setFilters((prev) => ({ ...prev, monitoringPending }))
                    }
                    label="MONITORAMENTO PENDENTE"
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

function CommissioningMultiFilterChip({
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

function CommissioningBooleanFilterChip({
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
