"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import type { TComercialProjectsFilters } from "@/utils/methods/query/comercial";
import { useUsers } from "@/utils/methods/query/crm/users";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import {
  HomologationControlStatus,
  PurchaseControlStatus,
  contractStatus,
  insiders,
  serviceTypes,
} from "@/utils/select-options";
import {
  CalendarDays,
  FileSignature,
  Hash,
  Link2,
  ListFilter,
  ShoppingCart,
  Tag,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "contrato.dataLiberacao", label: "DATA DA LIBERAÇÃO" },
  { id: 2, value: "contrato.dataAssinatura", label: "DATA ASS.CONTRATO" },
  { id: 3, value: "compra.dataPagamento", label: "DATA PAG.KIT" },
] as const;

type ComercialProjectsFiltersProps = {
  filters: TComercialProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TComercialProjectsFilters>>;
  tagOptions: InteractiveFilterOption<string>[];
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function ComercialProjectsFilters({
  filters,
  setFilters,
  tagOptions,
}: ComercialProjectsFiltersProps) {
  const { data: crmUsers } = useUsers({ includeDeleted: true });

  const sellerOptions = useMemo<InteractiveFilterOption<string>[]>(() => {
    if (!crmUsers) return [];
    return [...crmUsers]
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((user) => ({
        id: user._id,
        value: user._id,
        label: user.nome,
        keywords: [user.nome, user._id, user.email ?? ""],
        startContent: (
          <Avatar className="h-5 w-5 min-h-5 min-w-5">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback className="text-[0.6rem]">{formatNameAsInitials(user.nome)}</AvatarFallback>
          </Avatar>
        ),
      }));
  }, [crmUsers]);

  const selectedPeriodLabel = useMemo(() => {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return "N/A";
    const fieldLabel =
      DATE_FIELD_OPTIONS.find((option) => option.value === filters.date.field)?.label ??
      filters.date.field;
    return `${fieldLabel}: ${formatDateAsLocale(filters.date.after)} - ${formatDateAsLocale(filters.date.before)}`;
  }, [filters.date]);

  const hasTags = filters.tagIds.length > 0;
  const hasInsider = filters.insiderName.length > 0;
  const hasSupplyStatus = filters.supplyStatus.length > 0;
  const hasGrantingStatus = filters.grantingStatus.length > 0;
  const hasIdentifier = Boolean(filters.identifier?.trim());
  const hasPendingSupply = filters.pendingSupplyLiberation;
  const hasSignaturePendency = filters.signaturePendency;
  const hasNoAnalysis = filters.noAnalysisVinculation;
  const hasNoCrm = filters.noCRMVinculation;

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
        <ComercialMultiFilterChip
          label="STATUS DO CONTRATO"
          icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
          options={contractStatus}
          value={filters.contractStatus}
          onChange={(contractStatus) => setFilters((prev) => ({ ...prev, contractStatus }))}
          onClear={() => setFilters((prev) => ({ ...prev, contractStatus: [] }))}
        />

        <ComercialMultiFilterChip
          label="VENDEDOR"
          icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
          options={sellerOptions}
          value={filters.sellerIds}
          onChange={(sellerIds) => setFilters((prev) => ({ ...prev, sellerIds }))}
          onClear={() => setFilters((prev) => ({ ...prev, sellerIds: [] }))}
          searchPlaceholder="Buscar vendedor..."
          emptyLabel={crmUsers ? "Nenhum vendedor encontrado." : "Carregando vendedores..."}
        />

        <ComercialMultiFilterChip
          label="TIPO DE SERVIÇO"
          icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
          options={serviceTypes}
          value={filters.serviceType}
          onChange={(serviceType) => setFilters((prev) => ({ ...prev, serviceType }))}
          onClear={() => setFilters((prev) => ({ ...prev, serviceType: [] }))}
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
                searchPlaceholder="Buscar campo..."
                emptyLabel="Nenhum campo encontrado."
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

        {hasTags ? (
          <ComercialMultiFilterChip
            label="ETIQUETAS"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={tagOptions}
            value={filters.tagIds}
            onChange={(tagIds) => setFilters((prev) => ({ ...prev, tagIds }))}
            onClear={() => setFilters((prev) => ({ ...prev, tagIds: [] }))}
          />
        ) : null}

        {hasInsider ? (
          <ComercialMultiFilterChip
            label="INSIDER"
            icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
            options={insiders}
            value={filters.insiderName}
            onChange={(insiderName) => setFilters((prev) => ({ ...prev, insiderName }))}
            onClear={() => setFilters((prev) => ({ ...prev, insiderName: [] }))}
          />
        ) : null}

        {hasSupplyStatus ? (
          <ComercialMultiFilterChip
            label="STATUS DE SUPLEMENTAÇÃO"
            icon={<ShoppingCart className="h-4 w-4 min-h-4 min-w-4" />}
            options={PurchaseControlStatus}
            value={filters.supplyStatus}
            onChange={(supplyStatus) => setFilters((prev) => ({ ...prev, supplyStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, supplyStatus: [] }))}
          />
        ) : null}

        {hasGrantingStatus ? (
          <ComercialMultiFilterChip
            label="STATUS DO PARECER"
            icon={<Hash className="h-4 w-4 min-h-4 min-w-4" />}
            options={HomologationControlStatus}
            value={filters.grantingStatus}
            onChange={(grantingStatus) => setFilters((prev) => ({ ...prev, grantingStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, grantingStatus: [] }))}
          />
        ) : null}

        {hasIdentifier ? (
          <ComercialTextFilterChip
            label="CÓDIGO CRM"
            icon={<Hash className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.identifier}
            onChange={(identifier) =>
              setFilters((prev) => ({
                ...prev,
                identifier: identifier.trim() ? identifier : null,
              }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, identifier: null }))}
            placeholder="Digite o código CRM..."
          />
        ) : null}

        {hasPendingSupply ? (
          <ComercialBooleanFilterChip
            label="LIBERAÇÃO DE COMPRA PENDENTE"
            icon={<ShoppingCart className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.pendingSupplyLiberation}
            onChange={(pendingSupplyLiberation) =>
              setFilters((prev) => ({ ...prev, pendingSupplyLiberation }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, pendingSupplyLiberation: false }))}
          />
        ) : null}

        {hasSignaturePendency ? (
          <ComercialBooleanFilterChip
            label="ASSINATURA PENDENTE"
            icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.signaturePendency}
            onChange={(signaturePendency) => setFilters((prev) => ({ ...prev, signaturePendency }))}
            onClear={() => setFilters((prev) => ({ ...prev, signaturePendency: false }))}
          />
        ) : null}

        {hasNoAnalysis ? (
          <ComercialBooleanFilterChip
            label="SEM VINCULAÇÃO DE ANÁLISE TÉCNICA"
            icon={<Link2 className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.noAnalysisVinculation}
            onChange={(noAnalysisVinculation) =>
              setFilters((prev) => ({ ...prev, noAnalysisVinculation }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, noAnalysisVinculation: false }))}
          />
        ) : null}

        {hasNoCrm ? (
          <ComercialBooleanFilterChip
            label="SEM VINCULAÇÃO DE PROJETO CRM"
            icon={<Link2 className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.noCRMVinculation}
            onChange={(noCRMVinculation) => setFilters((prev) => ({ ...prev, noCRMVinculation }))}
            onClear={() => setFilters((prev) => ({ ...prev, noCRMVinculation: false }))}
          />
        ) : null}

        <InteractiveFilter.AddFilterRoot className="w-fit">
          <InteractiveFilter.AddFilterTrigger>
            <ListFilter className="h-4 w-4 min-h-4 min-w-4" />
            <InteractiveFilter.Label>MAIS FILTROS</InteractiveFilter.Label>
          </InteractiveFilter.AddFilterTrigger>
          <InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
            <InteractiveFilter.AddFilterSection heading="Filtros">
              {!hasIdentifier ? (
                <InteractiveFilter.AddFilterItem
                  id="identifier"
                  label="CÓDIGO CRM"
                  icon={<Hash className="h-4 w-4" />}
                >
                  <InteractiveFilter.TextContent
                    value={filters.identifier}
                    onChange={(identifier) =>
                      setFilters((prev) => ({
                        ...prev,
                        identifier: identifier.trim() ? identifier : null,
                      }))
                    }
                    onClear={() => setFilters((prev) => ({ ...prev, identifier: null }))}
                    placeholder="Digite o código CRM..."
                    autoCloseOnSubmit={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasTags ? (
                <InteractiveFilter.AddFilterItem
                  id="tags"
                  label="ETIQUETAS"
                  icon={<Tag className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={tagOptions}
                    value={filters.tagIds}
                    onChange={(tagIds) => setFilters((prev) => ({ ...prev, tagIds }))}
                    onClear={() => setFilters((prev) => ({ ...prev, tagIds: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasInsider ? (
                <InteractiveFilter.AddFilterItem
                  id="insider"
                  label="INSIDER"
                  icon={<UserRound className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={insiders}
                    value={filters.insiderName}
                    onChange={(insiderName) => setFilters((prev) => ({ ...prev, insiderName }))}
                    onClear={() => setFilters((prev) => ({ ...prev, insiderName: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasSupplyStatus ? (
                <InteractiveFilter.AddFilterItem
                  id="supplyStatus"
                  label="STATUS DE SUPLEMENTAÇÃO"
                  icon={<ShoppingCart className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={PurchaseControlStatus}
                    value={filters.supplyStatus}
                    onChange={(supplyStatus) => setFilters((prev) => ({ ...prev, supplyStatus }))}
                    onClear={() => setFilters((prev) => ({ ...prev, supplyStatus: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasGrantingStatus ? (
                <InteractiveFilter.AddFilterItem
                  id="grantingStatus"
                  label="STATUS DO PARECER"
                  icon={<Hash className="h-4 w-4" />}
                >
                  <InteractiveFilter.MultiContent
                    options={HomologationControlStatus}
                    value={filters.grantingStatus}
                    onChange={(grantingStatus) =>
                      setFilters((prev) => ({ ...prev, grantingStatus }))
                    }
                    onClear={() => setFilters((prev) => ({ ...prev, grantingStatus: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasPendingSupply ? (
                <InteractiveFilter.AddFilterItem
                  id="pendingSupply"
                  label="LIBERAÇÃO DE COMPRA PENDENTE"
                  icon={<ShoppingCart className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.pendingSupplyLiberation}
                    onChange={(pendingSupplyLiberation) =>
                      setFilters((prev) => ({ ...prev, pendingSupplyLiberation }))
                    }
                    label="LIBERAÇÃO DE COMPRA PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasSignaturePendency ? (
                <InteractiveFilter.AddFilterItem
                  id="signaturePendency"
                  label="ASSINATURA PENDENTE"
                  icon={<FileSignature className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.signaturePendency}
                    onChange={(signaturePendency) =>
                      setFilters((prev) => ({ ...prev, signaturePendency }))
                    }
                    label="ASSINATURA PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasNoAnalysis ? (
                <InteractiveFilter.AddFilterItem
                  id="noAnalysis"
                  label="SEM VINCULAÇÃO DE ANÁLISE TÉCNICA"
                  icon={<Link2 className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.noAnalysisVinculation}
                    onChange={(noAnalysisVinculation) =>
                      setFilters((prev) => ({ ...prev, noAnalysisVinculation }))
                    }
                    label="SEM VINCULAÇÃO DE ANÁLISE TÉCNICA"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasNoCrm ? (
                <InteractiveFilter.AddFilterItem
                  id="noCrm"
                  label="SEM VINCULAÇÃO DE PROJETO CRM"
                  icon={<Link2 className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.noCRMVinculation}
                    onChange={(noCRMVinculation) =>
                      setFilters((prev) => ({ ...prev, noCRMVinculation }))
                    }
                    label="SEM VINCULAÇÃO DE PROJETO CRM"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}
            </InteractiveFilter.AddFilterSection>
          </InteractiveFilter.AddFilterContent>
        </InteractiveFilter.AddFilterRoot>

        <Link
          href="/comercial/analise"
          className="inline-flex h-auto items-center rounded-lg border border-[#fead61] px-3 py-2 text-xs font-medium text-[#fead61] transition-colors hover:bg-[#fead61]/10"
        >
          ANALÍTICO
        </Link>
      </div>
    </div>
  );
}

function ComercialMultiFilterChip({
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

function ComercialTextFilterChip({
  label,
  icon,
  value,
  onChange,
  onClear,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string | null;
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
          {value?.trim() ? <strong>{value}</strong> : <span>N/A</span>}
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

function ComercialBooleanFilterChip({
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
