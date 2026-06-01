"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import type { TEnergyPAExecutionWithFiltersInput } from "@/pages/api/gestao-obras/padroes";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { HomologationControlStatus } from "@/utils/select-options";
import {
  CalendarDays,
  FileSignature,
  ListFilter,
  PiggyBankIcon,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";

const SEGMENT_OPTIONS = [
  { id: 1, value: "COMERCIAL", label: "COMERCIAL" },
  { id: 2, value: "INDUSTRIAL", label: "INDUSTRIAL" },
  { id: 3, value: "RESIDENCIAL", label: "RESIDENCIAL" },
  { id: 4, value: "RURAL", label: "RURAL" },
] as const;

const RESPONSABILITY_OPTIONS = [
  { id: 1, value: "AMPERE", label: "AMPERE" },
  { id: 2, value: "CLIENTE", label: "CLIENTE" },
  { id: 3, value: "NÃO SE APLICA", label: "NÃO SE APLICA" },
] as const;

const PERIOD_FIELD_OPTIONS = [
  {
    id: 1,
    value: "homologacao.documentacao.dataConclusaoElaboracao",
    label: "DATA DE CONCLUSÃO DA ELABORAÇÃO DA DOCUMENTAÇÃO",
  },
  { id: 2, value: "homologacao.documentacao.dataAssinatura", label: "DATA DE ASSINATURA DA DOCUMENTAÇÃO" },
  { id: 3, value: "homologacao.acesso.dataResposta", label: "DATA DE RESPOSTA DA SOLICITAÇÃO DE ACESSO" },
  { id: 4, value: "homologacao.vistoria.dataEfetivacao", label: "DATA DE EFETIVAÇÃO DA VISTORIA" },
  { id: 5, value: "padrao.aumentoCarga.dataEfetivacao", label: "DATA DE EFETIVAÇÃO DO AUMENTO DE CARGA" },
] as const;

type EnergyPAProjectsFiltersProps = {
  queryParams: TEnergyPAExecutionWithFiltersInput;
  updateQueryParams: (params: Partial<TEnergyPAExecutionWithFiltersInput>) => void;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function EnergyPAProjectsFilters({
  queryParams,
  updateQueryParams,
}: EnergyPAProjectsFiltersProps) {
  const homologationOptions = useMemo<InteractiveFilterOption<string>[]>(
    () => HomologationControlStatus.map((o) => ({ id: o.id, value: String(o.value), label: o.label })),
    [],
  );

  const selectedPeriodLabel = useMemo(() => {
    const { after, before, field } = queryParams.period;
    if (!after || !before || !field) return "N/A";
    const fieldLabel =
      PERIOD_FIELD_OPTIONS.find((o) => o.value === field)?.label ?? field;
    return `${fieldLabel}: ${formatDateAsLocale(after)} - ${formatDateAsLocale(before)}`;
  }, [queryParams.period]);

  function patch(params: Partial<TEnergyPAExecutionWithFiltersInput>) {
    updateQueryParams({ ...params, page: 1 });
  }

  const hasHomologationStatus = queryParams.homologationStatus.length > 0;
  const hasPendingExecution = queryParams.pendingExecutionOnly;
  const hasPaidOnly = queryParams.paidOnly;

  function clearDateFilter() {
    patch({ period: { field: null, after: null, before: null } });
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-3">
      <Input
        value={queryParams.search}
        placeholder="Pesquisar projeto..."
        onChange={(e) => patch({ search: e.target.value })}
        className="grow rounded-xl"
      />

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <PAMultiFilterChip
          label="SEGMENTO"
          icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
          options={[...SEGMENT_OPTIONS]}
          value={queryParams.segments}
          onChange={(segments) => patch({ segments })}
          onClear={() => patch({ segments: [] })}
        />

        <PAMultiFilterChip
          label="RESPONSABILIDADE"
          icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
          options={[...RESPONSABILITY_OPTIONS]}
          value={queryParams.responsabilityTypes}
          onChange={(responsabilityTypes) => patch({ responsabilityTypes })}
          onClear={() => patch({ responsabilityTypes: [] })}
        />

        <PAMultiFilterChip
          label="STATUS DO PARECER"
          icon={<ShieldCheck className="h-4 w-4 min-h-4 min-w-4" />}
          options={homologationOptions}
          value={queryParams.homologationStatus}
          onChange={(homologationStatus) => patch({ homologationStatus })}
          onClear={() => patch({ homologationStatus: [] })}
          contentClassName="w-80"
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
                value={queryParams.period.field}
                onChange={(nextField) =>
                  patch({ period: { ...queryParams.period, field: nextField } })
                }
                onClear={() => patch({ period: { ...queryParams.period, field: null } })}
                isCleared={!queryParams.period.field}
                clearLabel="SEM FILTRO"
                closeOnSelect
              />
            </div>
            <InteractiveFilter.DateRangeContent
              value={{
                from: queryParams.period.after ? new Date(queryParams.period.after) : undefined,
                to: queryParams.period.before ? new Date(queryParams.period.before) : undefined,
              }}
              onChange={(nextPeriod) =>
                patch({
                  period: {
                    ...queryParams.period,
                    after: nextPeriod.from
                      ? (formatDateInputChange(nextPeriod.from) as string)
                      : null,
                    before: nextPeriod.to
                      ? (formatDateInputChange(nextPeriod.to) as string)
                      : null,
                  },
                })
              }
            />
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        {hasPendingExecution ? (
          <PABooleanFilterChip
            label="APENAS NÃO EXECUTADOS"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={queryParams.pendingExecutionOnly}
            onChange={(pendingExecutionOnly) => patch({ pendingExecutionOnly })}
            onClear={() => patch({ pendingExecutionOnly: false })}
          />
        ) : null}

        {hasPaidOnly ? (
          <PABooleanFilterChip
            label="APENAS PAGOS"
            icon={<PiggyBankIcon className="h-4 w-4 min-h-4 min-w-4" />}
            value={queryParams.paidOnly}
            onChange={(paidOnly) => patch({ paidOnly })}
            onClear={() => patch({ paidOnly: false })}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasPendingExecution ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingExecution"
                  label="APENAS NÃO EXECUTADOS"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={queryParams.pendingExecutionOnly}
                    onChange={(pendingExecutionOnly) => patch({ pendingExecutionOnly })}
                    label="APENAS NÃO EXECUTADOS"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPaidOnly ? (
                <InteractiveFilter.AddFilterItem
                  id="paidOnly"
                  label="APENAS PAGOS"
                  icon={<PiggyBankIcon className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={queryParams.paidOnly}
                    onChange={(paidOnly) => patch({ paidOnly })}
                    label="APENAS PAGOS"
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

function PAMultiFilterChip({
  label,
  icon,
  options,
  value,
  onChange,
  onClear,
  contentClassName = "w-72",
}: {
  label: string;
  icon: React.ReactNode;
  options: InteractiveFilterOption<string>[];
  value: string[];
  onChange: (value: string[]) => void;
  onClear: () => void;
  contentClassName?: string;
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
          clearLabel="N/A"
        />
      </InteractiveFilter.Content>
    </InteractiveFilter.Root>
  );
}

function PABooleanFilterChip({
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
