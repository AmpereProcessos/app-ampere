"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import type { UseInstallationStructureExecutionProjectsFilters } from "@/utils/methods/query/execution";
import { ListFilter, PiggyBankIcon, Truck, Wrench } from "lucide-react";

const SEGMENT_OPTIONS: InteractiveFilterOption<string>[] = [
  { id: "1", value: "COMERCIAL", label: "COMERCIAL" },
  { id: "2", value: "INDUSTRIAL", label: "INDUSTRIAL" },
  { id: "3", value: "RESIDENCIAL", label: "RESIDENCIAL" },
  { id: "4", value: "RURAL", label: "RURAL" },
];

type StructureAdequationsProjectsFiltersProps = {
  filters: UseInstallationStructureExecutionProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<UseInstallationStructureExecutionProjectsFilters>>;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function StructureAdequationsProjectsFilters({
  filters,
  setFilters,
}: StructureAdequationsProjectsFiltersProps) {
  const hasPendingPaid = filters.pendingPaid;
  const hasPendingDelivery = filters.pendingDelivery;
  const hasPendingReady = filters.pendingReady;

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={filters.search}
        placeholder="Pesquisar por nome do projeto..."
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <StructureMultiFilterChip
          label="SEGMENTO"
          icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
          options={SEGMENT_OPTIONS}
          value={filters.segments}
          onChange={(segments) => setFilters((prev) => ({ ...prev, segments }))}
          onClear={() => setFilters((prev) => ({ ...prev, segments: [] }))}
        />

        {hasPendingPaid ? (
          <StructureBooleanFilterChip
            label="PENDÊNCIAS DE PAGAMENTO"
            icon={<PiggyBankIcon className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingPaid}
            onChange={(pendingPaid) => setFilters((prev) => ({ ...prev, pendingPaid }))}
            onClear={() => setFilters((prev) => ({ ...prev, pendingPaid: false }))}
          />
        ) : null}

        {hasPendingDelivery ? (
          <StructureBooleanFilterChip
            label="PENDÊNCIAS DE ENTREGA"
            icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingDelivery}
            onChange={(pendingDelivery) => setFilters((prev) => ({ ...prev, pendingDelivery }))}
            onClear={() => setFilters((prev) => ({ ...prev, pendingDelivery: false }))}
          />
        ) : null}

        {hasPendingReady ? (
          <StructureBooleanFilterChip
            label="APTAS PARA EXECUÇÃO"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingReady}
            onChange={(pendingReady) => setFilters((prev) => ({ ...prev, pendingReady }))}
            onClear={() => setFilters((prev) => ({ ...prev, pendingReady: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasPendingPaid ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingPaid"
                  label="PENDÊNCIAS DE PAGAMENTO"
                  icon={<PiggyBankIcon className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingPaid}
                    onChange={(pendingPaid) => setFilters((prev) => ({ ...prev, pendingPaid }))}
                    label="PENDÊNCIAS DE PAGAMENTO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingDelivery ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingDelivery"
                  label="PENDÊNCIAS DE ENTREGA"
                  icon={<Truck className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingDelivery}
                    onChange={(pendingDelivery) =>
                      setFilters((prev) => ({ ...prev, pendingDelivery }))
                    }
                    label="PENDÊNCIAS DE ENTREGA"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingReady ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingReady"
                  label="APTAS PARA EXECUÇÃO"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingReady}
                    onChange={(pendingReady) => setFilters((prev) => ({ ...prev, pendingReady }))}
                    label="PENDÊNCIAS APTAS PARA EXECUÇÃO"
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

function StructureMultiFilterChip({
  label,
  icon,
  options,
  value,
  onChange,
  onClear,
}: {
  label: string;
  icon: React.ReactNode;
  options: InteractiveFilterOption<string>[];
  value: string[];
  onChange: (value: string[]) => void;
  onClear: () => void;
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
      <InteractiveFilter.Content className="w-72 p-0">
        <InteractiveFilter.MultiContent
          options={options}
          value={value}
          onChange={onChange}
          onClear={onClear}
          isCleared={value.length === 0}
          clearLabel="N/A"
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}

function StructureBooleanFilterChip({
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
