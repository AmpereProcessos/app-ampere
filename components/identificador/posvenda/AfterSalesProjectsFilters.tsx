"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_LEGACY_CONFIG } from "@/lib/project-journeys";
import { cn } from "@/lib/utils";
import { cidadesAtendidas } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TAfterSalesProjectsFilters } from "@/utils/methods/query/aftersales";
import {
  HomologationControlStatus,
  PurchaseDeliveryStatus,
  ServiceOrderStatus,
  allSellers,
  inspectionStatus,
} from "@/utils/select-options";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarDays,
  FileSignature,
  ListFilter,
  MapPin,
  Route,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "contrato.dataAssinatura", label: "DATA ASS.CONTRATO" },
  { id: 2, value: "compra.dataPagamento", label: "DATA DE PAGAMENTO" },
  { id: 3, value: "homologacao.documentacao.dataLiberacao", label: "DATA LIB.DOCUMENTAÇÃO" },
  { id: 4, value: "homologacao.documentacao.dataAssinatura", label: "DATA ASS.DOCUMENTAÇÃO" },
  { id: 5, value: "homologacao.acesso.dataSolicitacao", label: "DATA DE SOLICITAÇÃO DO PARECER" },
  { id: 6, value: "homologacao.acesso.dataResposta", label: "DATA DE APROVAÇÃO DO PARECER" },
  { id: 7, value: "compra.previsaoEntrega", label: "PREV. ENTREGA" },
  { id: 8, value: "obra.entrada", label: "ENTRADA NA OBRA" },
  { id: 9, value: "obra.saida", label: "SAIDA DE OBRA" },
  { id: 10, value: "homologacao.vistoria.dataSolicitacao", label: "PEDIDO DA VISTORIA" },
  { id: 11, value: "homologacao.vistoria.dataEfetivacao", label: "TROCA DO MEDIDOR" },
] as const;

type AfterSalesProjectsFiltersProps = {
  filters: TAfterSalesProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TAfterSalesProjectsFilters>>;
  mode: "CARD" | "SIMPLIFIED";
  onModeChange: (mode: "CARD" | "SIMPLIFIED") => void;
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function AfterSalesProjectsFilters({
  filters,
  setFilters,
  mode,
  onModeChange,
}: AfterSalesProjectsFiltersProps) {
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

  const journeyPendingOptions = useMemo<InteractiveFilterOption<string>[]>(
    () =>
      UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_LEGACY_CONFIG.map((stage) => ({
        id: String(stage.ordem),
        value: String(stage.ordem),
        label: `PENDENTE ${stage.titulo}`,
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

  const contactOrderLabel =
    filters.contactOrder === "ASC"
      ? "CRESCENTE"
      : filters.contactOrder === "DESC"
        ? "DECRESCENTE"
        : "N/A";

  const hasModuleQty = filters.moduleQty != null && filters.moduleQty > 0;
  const hasCity = filters.city.length > 0;
  const hasSeller = filters.sellerName.length > 0;
  const hasExecutionStatus = filters.executionStatus.length > 0;
  const hasInspectionStatus = filters.inspectionStatus.length > 0;
  const hasNecessaryDistribution = filters.necessaryDistribution;
  const hasMissingSignature = filters.missingSignature;
  const hasPendingContact = filters.pendingContact;

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
        <AfterSalesMultiFilterChip
          label="PENDÊNCIAS DA JORNADA"
          icon={<Route className="h-4 w-4 min-h-4 min-w-4" />}
          options={journeyPendingOptions}
          value={filters.journeyPendings}
          onChange={(journeyPendings) => setFilters((prev) => ({ ...prev, journeyPendings }))}
          onClear={() => setFilters((prev) => ({ ...prev, journeyPendings: [] }))}
          contentClassName="w-80"
        />

        <AfterSalesMultiFilterChip
          label="STATUS DE ENTREGA"
          icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
          options={PurchaseDeliveryStatus}
          value={filters.deliveryStatus}
          onChange={(deliveryStatus) => setFilters((prev) => ({ ...prev, deliveryStatus }))}
          onClear={() => setFilters((prev) => ({ ...prev, deliveryStatus: [] }))}
        />

        <AfterSalesMultiFilterChip
          label="STATUS DO PARECER"
          icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
          options={HomologationControlStatus}
          value={filters.grantingStatus}
          onChange={(grantingStatus) => setFilters((prev) => ({ ...prev, grantingStatus }))}
          onClear={() => setFilters((prev) => ({ ...prev, grantingStatus: [] }))}
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

        <InteractiveFilter.Root className="w-fit">
          <InteractiveFilter.Trigger>
            <InteractiveFilter.Icon>
              <ArrowUpNarrowWide className="h-4 w-4 min-h-4 min-w-4" />
              <InteractiveFilter.Label>ORDEM DE CONTATO</InteractiveFilter.Label>
            </InteractiveFilter.Icon>
            <InteractiveFilter.Value>
              <strong>{contactOrderLabel}</strong>
            </InteractiveFilter.Value>
            <InteractiveFilter.Clear
              onClear={() => setFilters((prev) => ({ ...prev, contactOrder: null }))}
            />
          </InteractiveFilter.Trigger>
          <InteractiveFilter.Content className="w-72 p-0">
            <div className="flex flex-wrap items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    contactOrder: prev.contactOrder === "ASC" ? null : "ASC",
                  }))
                }
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                  filters.contactOrder === "ASC"
                    ? "bg-primary/50 text-primary-foreground"
                    : "text-primary hover:bg-primary/20",
                )}
              >
                <ArrowUpNarrowWide size={12} />
                CRESCENTE
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    contactOrder: prev.contactOrder === "DESC" ? null : "DESC",
                  }))
                }
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                  filters.contactOrder === "DESC"
                    ? "bg-primary/50 text-primary-foreground"
                    : "text-primary hover:bg-primary/20",
                )}
              >
                <ArrowDownNarrowWide size={12} />
                DECRESCENTE
              </button>
            </div>
          </InteractiveFilter.Content>
        </InteractiveFilter.Root>

        {hasModuleQty ? (
          <InteractiveFilter.Root className="w-fit">
            <InteractiveFilter.Trigger>
              <InteractiveFilter.Icon>
                <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
                <InteractiveFilter.Label>MÓDULOS</InteractiveFilter.Label>
              </InteractiveFilter.Icon>
              <InteractiveFilter.Value>
                <strong>{filters.moduleQty}</strong>
              </InteractiveFilter.Value>
              <InteractiveFilter.Clear
                onClear={() => setFilters((prev) => ({ ...prev, moduleQty: null }))}
              />
            </InteractiveFilter.Trigger>
            <InteractiveFilter.Content className="w-72 p-0">
              <ModuleQtyFilterContent
                value={filters.moduleQty}
                onChange={(moduleQty) => setFilters((prev) => ({ ...prev, moduleQty }))}
              />
            </InteractiveFilter.Content>
          </InteractiveFilter.Root>
        ) : null}

        {hasCity ? (
          <AfterSalesMultiFilterChip
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
          <AfterSalesMultiFilterChip
            label="VENDEDOR"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            options={sellerOptions}
            value={filters.sellerName}
            onChange={(sellerName) => setFilters((prev) => ({ ...prev, sellerName }))}
            onClear={() => setFilters((prev) => ({ ...prev, sellerName: [] }))}
            searchPlaceholder="Buscar vendedor..."
          />
        ) : null}

        {hasExecutionStatus ? (
          <AfterSalesMultiFilterChip
            label="STATUS DA OBRA"
            icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
            options={ServiceOrderStatus}
            value={filters.executionStatus}
            onChange={(executionStatus) => setFilters((prev) => ({ ...prev, executionStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, executionStatus: [] }))}
          />
        ) : null}

        {hasInspectionStatus ? (
          <AfterSalesMultiFilterChip
            label="STATUS DA VISTORIA"
            icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
            options={inspectionStatus}
            value={filters.inspectionStatus}
            onChange={(inspectionStatus) => setFilters((prev) => ({ ...prev, inspectionStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, inspectionStatus: [] }))}
          />
        ) : null}

        {hasNecessaryDistribution ? (
          <AfterSalesBooleanFilterChip
            label="NECESSÁRIO DISTRIBUIÇÃO"
            icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.necessaryDistribution}
            onChange={(necessaryDistribution) =>
              setFilters((prev) => ({ ...prev, necessaryDistribution }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, necessaryDistribution: false }))}
          />
        ) : null}

        {hasMissingSignature ? (
          <AfterSalesBooleanFilterChip
            label="FALTANDO ASSINATURA"
            icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.missingSignature}
            onChange={(missingSignature) => setFilters((prev) => ({ ...prev, missingSignature }))}
            onClear={() => setFilters((prev) => ({ ...prev, missingSignature: false }))}
          />
        ) : null}

        {hasPendingContact ? (
          <AfterSalesBooleanFilterChip
            label="CONTATO PENDENTE"
            icon={<ListFilter className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingContact}
            onChange={(pendingContact) => setFilters((prev) => ({ ...prev, pendingContact }))}
            onClear={() => setFilters((prev) => ({ ...prev, pendingContact: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasModuleQty ? (
                <InteractiveFilter.AddFilterItem
                  id="moduleQty"
                  label="NÚMERO DE MÓDULOS"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <ModuleQtyFilterContent
                    value={filters.moduleQty}
                    onChange={(moduleQty) => setFilters((prev) => ({ ...prev, moduleQty }))}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasCity ? (
                <InteractiveFilter.AddFilterItem
                  id="city"
                  label="CIDADE"
                  icon={<MapPin className="h-4 w-4" />}
                >
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

              {!hasInspectionStatus ? (
                <InteractiveFilter.AddFilterItem
                  id="inspectionStatus"
                  label="STATUS DA VISTORIA"
                  icon={<FileSignature className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={inspectionStatus}
                    value={filters.inspectionStatus}
                    onChange={(inspectionStatus) =>
                      setFilters((prev) => ({ ...prev, inspectionStatus }))
                    }
                    onClear={() => setFilters((prev) => ({ ...prev, inspectionStatus: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasNecessaryDistribution ? (
                <InteractiveFilter.AddFilterItem
                  id="necessaryDistribution"
                  label="NECESSÁRIO DISTRIBUIÇÃO"
                  icon={<Truck className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.necessaryDistribution}
                    onChange={(necessaryDistribution) =>
                      setFilters((prev) => ({ ...prev, necessaryDistribution }))
                    }
                    label="NECESSÁRIO DISTRIBUIÇÃO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasMissingSignature ? (
                <InteractiveFilter.AddFilterItem
                  id="missingSignature"
                  label="FALTANDO ASSINATURA"
                  icon={<FileSignature className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.missingSignature}
                    onChange={(missingSignature) =>
                      setFilters((prev) => ({ ...prev, missingSignature }))
                    }
                    label="FALTANDO ASSINATURA"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingContact ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingContact"
                  label="CONTATO PENDENTE"
                  icon={<ListFilter className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingContact}
                    onChange={(pendingContact) =>
                      setFilters((prev) => ({ ...prev, pendingContact }))
                    }
                    label="CONTATO PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}
            </InteractiveFilter.AddFilterSection>
          </InteractiveFilter.AddFilterContent>
        </InteractiveFilter.AddFilterRoot>

        <div className="inline-flex h-auto items-center gap-1 rounded-lg border border-[#15599a]/30 px-1 py-0.5">
          <button
            type="button"
            onClick={() => onModeChange("CARD")}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium",
              mode === "CARD" ? "bg-[#15599a] text-white" : "text-[#15599a] hover:bg-[#15599a]/10",
            )}
          >
            CARD
          </button>
          <button
            type="button"
            onClick={() => onModeChange("SIMPLIFIED")}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium",
              mode === "SIMPLIFIED"
                ? "bg-[#15599a] text-white"
                : "text-[#15599a] hover:bg-[#15599a]/10",
            )}
          >
            SIMPLIFICADO
          </button>
        </div>

        <Link
          href="/chamados/chamadosPosVenda"
          className="inline-flex h-auto items-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-primary/10"
        >
          CHAMADOS
        </Link>
        <Link
          href="/financeiro/receitas"
          className="inline-flex h-auto items-center rounded-lg border border-green-500/40 px-3 py-2 text-xs font-medium text-green-700 transition-colors hover:bg-green-500/10"
        >
          RECEITAS
        </Link>
        <Link
          href="/obras/controle-padroes"
          className="inline-flex h-auto items-center rounded-lg border border-[#15599a] px-3 py-2 text-xs font-medium text-[#15599a] transition-colors hover:bg-[#15599a]/10"
        >
          CONTROLE DE PADRÕES
        </Link>
      </div>
    </div>
  );
}

function ModuleQtyFilterContent({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid gap-1.5">
        <Label className="text-xs">QUANTIDADE EXATA</Label>
        <Input
          type="number"
          min={0}
          value={value ?? ""}
          placeholder="Ex.: 12"
          onChange={(e) => {
            const raw = e.target.value.trim();
            onChange(raw === "" ? null : Number(raw));
          }}
        />
      </div>
    </div>
  );
}

function AfterSalesMultiFilterChip({
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

function AfterSalesBooleanFilterChip({
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
