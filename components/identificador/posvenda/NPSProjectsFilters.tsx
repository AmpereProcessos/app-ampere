"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cidadesAtendidas } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TNPSProjectsFilters } from "@/utils/methods/query/aftersales";
import { allSellers } from "@/utils/select-options";
import {
  CalendarDays,
  ListFilter,
  MapPin,
  MessageSquare,
  Star,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "jornada.dataNps", label: "COLETA DO NPS" },
  { id: 2, value: "homologacao.vistoria.dataEfetivacao", label: "TROCA DO MEDIDOR" },
] as const;

type NPSProjectsFiltersProps = {
  filters: TNPSProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TNPSProjectsFilters>>;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function NPSProjectsFilters({ filters, setFilters }: NPSProjectsFiltersProps) {
  const cityOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      cidadesAtendidas.map((city, index) => ({
        id: String(index + 1),
        value: city,
        label: city,
      })),
    [],
  );

  const sellerOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      allSellers.map((seller) => ({
        id: String(seller.id),
        value: seller.value ?? "",
        label: seller.label,
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

  const npsRangeLabel = useMemo(() => {
    const parts: string[] = [];
    if (filters.npsRange.min != null) parts.push(`≥ ${filters.npsRange.min}`);
    if (filters.npsRange.max != null) parts.push(`≤ ${filters.npsRange.max}`);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  }, [filters.npsRange]);

  const hasCity = filters.city.length > 0;
  const hasSeller = filters.sellerName.length > 0;
  const hasNpsRange =
    filters.npsRange.min != null || filters.npsRange.max != null;
  const hasOnlyPromoters = filters.onlyPromoters;
  const hasOnlyDetrators = filters.onlyDetrators;
  const hasOnlyNeutrals = filters.onlyNeutrals;
  const hasUnCollected = filters.unCollected;
  const hasWithObs = filters.withObs;
  const hasWithoutObs = filters.withoutObs;

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

        {hasNpsRange ? (
          <InteractiveFilter.Root className="w-fit">
            <InteractiveFilter.Trigger>
              <InteractiveFilter.Icon>
                <Star className="h-4 w-4 min-h-4 min-w-4" />
                <InteractiveFilter.Label>FAIXA NPS</InteractiveFilter.Label>
              </InteractiveFilter.Icon>
              <InteractiveFilter.Value>
                <strong>{npsRangeLabel}</strong>
              </InteractiveFilter.Value>
              <InteractiveFilter.Clear
                onClear={() =>
                  setFilters((prev) => ({
                    ...prev,
                    npsRange: { min: null, max: null },
                  }))
                }
              />
            </InteractiveFilter.Trigger>
            <InteractiveFilter.Content className="w-72 p-0">
              <NpsRangeFilterContent
                min={filters.npsRange.min}
                max={filters.npsRange.max}
                onChange={(min, max) =>
                  setFilters((prev) => ({
                    ...prev,
                    npsRange: { min, max },
                  }))
                }
              />
            </InteractiveFilter.Content>
          </InteractiveFilter.Root>
        ) : null}

        {hasCity ? (
          <NPSMultiFilterChip
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

        {hasSeller ? (
          <NPSMultiFilterChip
            label="VENDEDOR"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            options={sellerOptions}
            value={filters.sellerName}
            onChange={(sellerName) => setFilters((prev) => ({ ...prev, sellerName }))}
            onClear={() => setFilters((prev) => ({ ...prev, sellerName: [] }))}
            searchPlaceholder="Buscar vendedor..."
          />
        ) : null}

        {hasOnlyPromoters ? (
          <NPSBooleanFilterChip
            label="PROMOTORES"
            icon={<Star className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.onlyPromoters}
            onChange={(onlyPromoters) => setFilters((prev) => ({ ...prev, onlyPromoters }))}
            onClear={() => setFilters((prev) => ({ ...prev, onlyPromoters: false }))}
          />
        ) : null}

        {hasOnlyDetrators ? (
          <NPSBooleanFilterChip
            label="DETRATORES"
            icon={<Star className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.onlyDetrators}
            onChange={(onlyDetrators) => setFilters((prev) => ({ ...prev, onlyDetrators }))}
            onClear={() => setFilters((prev) => ({ ...prev, onlyDetrators: false }))}
          />
        ) : null}

        {hasOnlyNeutrals ? (
          <NPSBooleanFilterChip
            label="NEUTROS"
            icon={<Star className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.onlyNeutrals}
            onChange={(onlyNeutrals) => setFilters((prev) => ({ ...prev, onlyNeutrals }))}
            onClear={() => setFilters((prev) => ({ ...prev, onlyNeutrals: false }))}
          />
        ) : null}

        {hasUnCollected ? (
          <NPSBooleanFilterChip
            label="NÃO COLETADOS"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.unCollected}
            onChange={(unCollected) => setFilters((prev) => ({ ...prev, unCollected }))}
            onClear={() => setFilters((prev) => ({ ...prev, unCollected: false }))}
          />
        ) : null}

        {hasWithObs ? (
          <NPSBooleanFilterChip
            label="COM OBSERVAÇÕES"
            icon={<MessageSquare className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.withObs}
            onChange={(withObs) => setFilters((prev) => ({ ...prev, withObs }))}
            onClear={() => setFilters((prev) => ({ ...prev, withObs: false }))}
          />
        ) : null}

        {hasWithoutObs ? (
          <NPSBooleanFilterChip
            label="SEM OBSERVAÇÕES"
            icon={<MessageSquare className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.withoutObs}
            onChange={(withoutObs) => setFilters((prev) => ({ ...prev, withoutObs }))}
            onClear={() => setFilters((prev) => ({ ...prev, withoutObs: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasNpsRange ? (
                <InteractiveFilter.AddFilterItem
                  id="npsRange"
                  label="FAIXA NPS"
                  icon={<Star className="h-4 w-4" />}
                >
                  <NpsRangeFilterContent
                    min={filters.npsRange.min}
                    max={filters.npsRange.max}
                    onChange={(min, max) =>
                      setFilters((prev) => ({
                        ...prev,
                        npsRange: { min, max },
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

              {!hasSeller ? (
                <InteractiveFilter.AddFilterItem
                  id="seller"
                  label="VENDEDOR"
                  icon={<UserRound className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={sellerOptions}
                    value={filters.sellerName}
                    onChange={(sellerName) => setFilters((prev) => ({ ...prev, sellerName }))}
                    onClear={() => setFilters((prev) => ({ ...prev, sellerName: [] }))}
                    clearLabel="N/A"
                    searchPlaceholder="Buscar vendedor..."
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasOnlyPromoters ? (
                <InteractiveFilter.AddFilterItem
                  id="onlyPromoters"
                  label="PROMOTORES"
                  icon={<Star className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.onlyPromoters}
                    onChange={(onlyPromoters) =>
                      setFilters((prev) => ({ ...prev, onlyPromoters }))
                    }
                    label="PROMOTORES (NPS ≥ 9)"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasOnlyDetrators ? (
                <InteractiveFilter.AddFilterItem
                  id="onlyDetrators"
                  label="DETRATORES"
                  icon={<Star className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.onlyDetrators}
                    onChange={(onlyDetrators) =>
                      setFilters((prev) => ({ ...prev, onlyDetrators }))
                    }
                    label="DETRATORES (NPS ≤ 6)"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasOnlyNeutrals ? (
                <InteractiveFilter.AddFilterItem
                  id="onlyNeutrals"
                  label="NEUTROS"
                  icon={<Star className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.onlyNeutrals}
                    onChange={(onlyNeutrals) =>
                      setFilters((prev) => ({ ...prev, onlyNeutrals }))
                    }
                    label="NEUTROS (NPS 7–8)"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasUnCollected ? (
                <InteractiveFilter.AddFilterItem
                  id="unCollected"
                  label="NÃO COLETADOS"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.unCollected}
                    onChange={(unCollected) => setFilters((prev) => ({ ...prev, unCollected }))}
                    label="NÃO COLETADOS"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasWithObs ? (
                <InteractiveFilter.AddFilterItem
                  id="withObs"
                  label="COM OBSERVAÇÕES"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.withObs}
                    onChange={(withObs) => setFilters((prev) => ({ ...prev, withObs }))}
                    label="COM OBSERVAÇÕES"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasWithoutObs ? (
                <InteractiveFilter.AddFilterItem
                  id="withoutObs"
                  label="SEM OBSERVAÇÕES"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.withoutObs}
                    onChange={(withoutObs) => setFilters((prev) => ({ ...prev, withoutObs }))}
                    label="SEM OBSERVAÇÕES"
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

function NpsRangeFilterContent({
  min,
  max,
  onChange,
}: {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid gap-1.5">
        <Label className="text-xs">MAIOR OU IGUAL</Label>
        <Input
          type="number"
          min={0}
          max={10}
          value={min ?? ""}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value.trim();
            onChange(raw === "" ? null : Number(raw), max);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs">MENOR OU IGUAL</Label>
        <Input
          type="number"
          min={0}
          max={10}
          value={max ?? ""}
          placeholder="10"
          onChange={(e) => {
            const raw = e.target.value.trim();
            onChange(min, raw === "" ? null : Number(raw));
          }}
        />
      </div>
    </div>
  );
}

function NPSMultiFilterChip({
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

function NPSBooleanFilterChip({
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
