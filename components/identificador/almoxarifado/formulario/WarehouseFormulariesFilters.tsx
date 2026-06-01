"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import type { TGetWarehouseFormulariesInput } from "@/pages/api/almoxarifado/formularios/index-two";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { CalendarDays, ClipboardList, ListFilter } from "lucide-react";
import { useMemo } from "react";

const PERIOD_TYPE_OPTIONS: InteractiveFilterOption<"dataInsercao" | "dataEfetivacao">[] = [
  { id: "1", value: "dataInsercao", label: "DATA DE INSERÇÃO" },
  { id: "2", value: "dataEfetivacao", label: "DATA DE EFETIVAÇÃO" },
];

type WarehouseFormulariesFiltersProps = {
  filters: TGetWarehouseFormulariesInput;
  updateFilters: (filters: Partial<TGetWarehouseFormulariesInput>) => void;
};

export default function WarehouseFormulariesFilters({
  filters,
  updateFilters,
}: WarehouseFormulariesFiltersProps) {
  const selectedPeriodLabel = useMemo(() => {
    if (!filters.periodAfter || !filters.periodBefore || !filters.periodType) return "N/A";
    const fieldLabel =
      PERIOD_TYPE_OPTIONS.find((option) => option.value === filters.periodType)?.label ??
      filters.periodType;
    return `${fieldLabel}: ${formatDateAsLocale(filters.periodAfter)} - ${formatDateAsLocale(filters.periodBefore)}`;
  }, [filters.periodAfter, filters.periodBefore, filters.periodType]);

  const hasPendingOnly = filters.pendingOnly;

  function clearPeriodFilter() {
    updateFilters({ periodType: null, periodAfter: null, periodBefore: null });
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={filters.search ?? ""}
        placeholder="Pesquisar pelo título do formulário..."
        onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
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
            <InteractiveFilter.Clear onClear={clearPeriodFilter} />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-auto p-0" align="end">
            <div className="flex w-full min-w-[280px] flex-col border-b">
              <InteractiveFilter.SingleContent
                options={PERIOD_TYPE_OPTIONS}
                value={filters.periodType ?? null}
                onChange={(nextType) =>
                  updateFilters({
                    periodType: nextType,
                    page: 1,
                  })
                }
                onClear={() => updateFilters({ periodType: null, page: 1 })}
                isCleared={!filters.periodType}
                clearLabel="SEM FILTRO"
                closeOnSelect
              />
            </div>
            <InteractiveFilter.DateRangeContent
              value={{
                from: filters.periodAfter ? new Date(filters.periodAfter) : undefined,
                to: filters.periodBefore ? new Date(filters.periodBefore) : undefined,
              }}
              onChange={(nextPeriod) =>
                updateFilters({
                  periodAfter: nextPeriod.from
                    ? (formatDateInputChange(nextPeriod.from) as string)
                    : null,
                  periodBefore: nextPeriod.to
                    ? (formatDateInputChange(nextPeriod.to) as string)
                    : null,
                  page: 1,
                })
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        {hasPendingOnly ? (
          <InteractiveFilter.Root className="w-fit">
            <InteractiveFilter.Trigger>
              <InteractiveFilter.Icon>
                <ClipboardList className="h-4 w-4 min-h-4 min-w-4" />
                <InteractiveFilter.Label>SOMENTE EM ABERTO</InteractiveFilter.Label>
              </InteractiveFilter.Icon>
              <InteractiveFilter.Value>
                <strong>ATIVO</strong>
              </InteractiveFilter.Value>
              <InteractiveFilter.Clear
                onClear={() => updateFilters({ pendingOnly: false, page: 1 })}
              />
            </InteractiveFilter.Trigger>
            <InteractiveFilter.Content className="w-80 p-0">
              <InteractiveFilter.BooleanContent
                value={filters.pendingOnly}
                onChange={(pendingOnly) => updateFilters({ pendingOnly, page: 1 })}
                label="SOMENTE EM ABERTO"
                autoCloseOnChange={false}
              />
            </InteractiveFilter.Content>
          </InteractiveFilter.Root>
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasPendingOnly ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingOnly"
                  label="SOMENTE EM ABERTO"
                  icon={<ClipboardList className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingOnly}
                    onChange={(pendingOnly) => updateFilters({ pendingOnly, page: 1 })}
                    label="SOMENTE EM ABERTO"
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
