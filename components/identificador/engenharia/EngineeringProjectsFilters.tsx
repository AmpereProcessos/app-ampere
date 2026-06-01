"use client";

import {
  InteractiveFilter,
  type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import type { TEngineeringProjectsFilters } from "@/utils/methods/query/engineering";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useUsers } from "@/utils/methods/query/crm/users";
import {
  HomologationControlStatus,
  ServiceOrderStatus,
  deliveryStatus,
  inspectionStatus,
  serviceTypes,
} from "@/utils/select-options";
import {
  CalendarDays,
  DraftingCompass,
  FileSignature,
  LayoutGrid,
  ListFilter,
  MapPin,
  PanelsTopLeft,
  PiggyBankIcon,
  ShieldCheck,
  ShieldOff,
  Tag,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";

const DATE_FIELD_OPTIONS = [
  { id: 1, value: "compra.dataPagamento", label: "DATA DE PAGAMENTO" },
  { id: 2, value: "contrato.dataAssinatura", label: "DATA ASS.CONTRATO" },
  { id: 3, value: "homologacao.documentacao.dataLiberacao", label: "DATA LIB.DOCUMENTAÇÃO" },
  { id: 4, value: "homologacao.documentacao.dataAssinatura", label: "DATA ASS.DOCUMENTAÇÃO" },
  { id: 5, value: "homologacao.acesso.dataSolicitacao", label: "DATA DE SOLICITAÇÃO DO PARECER" },
  { id: 6, value: "homologacao.acesso.dataResposta", label: "DATA DE RESPOSTA DO PARECER" },
  { id: 7, value: "homologacao.vistoria.dataSolicitacao", label: "DATA DE PEDIDO DA VISTORIA" },
  { id: 8, value: "homologacao.vistoria.dataEfetivacao", label: "TROCA DO MEDIDOR" },
] as const;

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((city, index) => ({
  id: index + 1,
  value: city,
  label: city,
}));

type EngineeringProjectsFiltersProps = {
  filters: TEngineeringProjectsFilters;
  setFilters: React.Dispatch<React.SetStateAction<TEngineeringProjectsFilters>>;
  tagOptions: InteractiveFilterOption<string>[];
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
  return values
    .map((value) => options.find((option) => option.value === value)?.label ?? value)
    .join(", ");
}

export default function EngineeringProjectsFilters({
  filters,
  setFilters,
  tagOptions,
}: EngineeringProjectsFiltersProps) {
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

  const selectedPeriodLabel = useMemo(() => {
    if (!filters.date.after || !filters.date.before || !filters.date.field) return "N/A";
    const fieldLabel =
      DATE_FIELD_OPTIONS.find((option) => option.value === filters.date.field)?.label ??
      filters.date.field;
    return `${fieldLabel}: ${formatDateAsLocale(filters.date.after)} - ${formatDateAsLocale(filters.date.before)}`;
  }, [filters.date]);

  const hasTags = filters.tagIds.length > 0;
  const hasCity = filters.city.length > 0;
  const hasExecutionStatus = filters.executionStatus.length > 0;
  const hasInspectionStatus = filters.inspectionStatus.length > 0;
  const hasPaidOnly = filters.paidOnly;
  const hasNecessaryDistribution = filters.necessaryDistribution;
  const hasNecessaryHomologation = filters.necessaryHomologation;
  const hasNotNecessaryHomologation = filters.notNecessaryHomologation;
  const hasDrawReady = filters.drawReady;
  const hasMissingDiagram = filters.missingDiagram;
  const hasMissingDraw = filters.missingDraw;
  const hasMissingSignature = filters.missingSignature;

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
        <EngineeringMultiFilterChip
          label="TIPO DE SERVIÇO"
          icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
          options={serviceTypes}
          value={filters.serviceType}
          onChange={(serviceType) => setFilters((prev) => ({ ...prev, serviceType }))}
          onClear={() => setFilters((prev) => ({ ...prev, serviceType: [] }))}
          contentClassName="w-80"
        />

        <EngineeringMultiFilterChip
          label="VENDEDOR"
          icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
          options={sellerOptions}
          value={filters.sellerName}
          onChange={(sellerName) => setFilters((prev) => ({ ...prev, sellerName }))}
          onClear={() => setFilters((prev) => ({ ...prev, sellerName: [] }))}
          searchPlaceholder="Buscar vendedor..."
          emptyLabel={crmUsers ? "Nenhum vendedor encontrado." : "Carregando vendedores..."}
        />

        <EngineeringMultiFilterChip
          label="STATUS DE ENTREGA"
          icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
          options={deliveryStatus}
          value={filters.deliveryStatus}
          onChange={(deliveryStatus) => setFilters((prev) => ({ ...prev, deliveryStatus }))}
          onClear={() => setFilters((prev) => ({ ...prev, deliveryStatus: [] }))}
        />

        <EngineeringMultiFilterChip
          label="STATUS DO PARECER"
          icon={<ShieldCheck className="h-4 w-4 min-h-4 min-w-4" />}
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
          <EngineeringMultiFilterChip
            label="ETIQUETAS"
            icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
            options={tagOptions}
            value={filters.tagIds}
            onChange={(tagIds) => setFilters((prev) => ({ ...prev, tagIds }))}
            onClear={() => setFilters((prev) => ({ ...prev, tagIds: [] }))}
          />
        ) : null}

        {hasCity ? (
          <EngineeringMultiFilterChip
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
          <EngineeringMultiFilterChip
            label="STATUS DA OBRA"
            icon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
            options={ServiceOrderStatus}
            value={filters.executionStatus}
            onChange={(executionStatus) => setFilters((prev) => ({ ...prev, executionStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, executionStatus: [] }))}
          />
        ) : null}

        {hasInspectionStatus ? (
          <EngineeringMultiFilterChip
            label="STATUS DA VISTORIA"
            icon={<ShieldCheck className="h-4 w-4 min-h-4 min-w-4" />}
            options={inspectionStatus}
            value={filters.inspectionStatus}
            onChange={(inspectionStatus) => setFilters((prev) => ({ ...prev, inspectionStatus }))}
            onClear={() => setFilters((prev) => ({ ...prev, inspectionStatus: [] }))}
          />
        ) : null}

        {hasPaidOnly ? (
          <EngineeringBooleanFilterChip
            label="SOMENTE PAGOS"
            icon={<PiggyBankIcon className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.paidOnly}
            onChange={(paidOnly) => setFilters((prev) => ({ ...prev, paidOnly }))}
            onClear={() => setFilters((prev) => ({ ...prev, paidOnly: false }))}
          />
        ) : null}

        {hasNecessaryDistribution ? (
          <EngineeringBooleanFilterChip
            label="NECESSÁRIO DISTRIBUIÇÃO"
            icon={<Truck className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.necessaryDistribution}
            onChange={(necessaryDistribution) =>
              setFilters((prev) => ({ ...prev, necessaryDistribution }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, necessaryDistribution: false }))}
          />
        ) : null}

        {hasNecessaryHomologation ? (
          <EngineeringBooleanFilterChip
            label="NECESSÁRIO HOMOLOGAÇÃO"
            icon={<ShieldCheck className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.necessaryHomologation}
            onChange={(necessaryHomologation) =>
              setFilters((prev) => ({ ...prev, necessaryHomologation }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, necessaryHomologation: false }))}
          />
        ) : null}

        {hasNotNecessaryHomologation ? (
          <EngineeringBooleanFilterChip
            label="NÃO NECESSÁRIO HOMOLOGAÇÃO"
            icon={<ShieldOff className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.notNecessaryHomologation}
            onChange={(notNecessaryHomologation) =>
              setFilters((prev) => ({ ...prev, notNecessaryHomologation }))
            }
            onClear={() => setFilters((prev) => ({ ...prev, notNecessaryHomologation: false }))}
          />
        ) : null}

        {hasDrawReady ? (
          <EngineeringBooleanFilterChip
            label="DESENHO PRONTO"
            icon={<DraftingCompass className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.drawReady}
            onChange={(drawReady) => setFilters((prev) => ({ ...prev, drawReady }))}
            onClear={() => setFilters((prev) => ({ ...prev, drawReady: false }))}
          />
        ) : null}

        {hasMissingDiagram ? (
          <EngineeringBooleanFilterChip
            label="DIAGRAMA PENDENTE"
            icon={<LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.missingDiagram}
            onChange={(missingDiagram) => setFilters((prev) => ({ ...prev, missingDiagram }))}
            onClear={() => setFilters((prev) => ({ ...prev, missingDiagram: false }))}
          />
        ) : null}

        {hasMissingDraw ? (
          <EngineeringBooleanFilterChip
            label="DESENHO PENDENTE"
            icon={<PanelsTopLeft className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.missingDraw}
            onChange={(missingDraw) => setFilters((prev) => ({ ...prev, missingDraw }))}
            onClear={() => setFilters((prev) => ({ ...prev, missingDraw: false }))}
          />
        ) : null}

        {hasMissingSignature ? (
          <EngineeringBooleanFilterChip
            label="FALTANDO ASSINATURA"
            icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
            value={filters.missingSignature}
            onChange={(missingSignature) => setFilters((prev) => ({ ...prev, missingSignature }))}
            onClear={() => setFilters((prev) => ({ ...prev, missingSignature: false }))}
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
                    onChange={(tagIds) => setFilters((prev) => ({ ...prev, tagIds }))}
                    onClear={() => setFilters((prev) => ({ ...prev, tagIds: [] }))}
                    clearLabel="N/A"
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
                    onChange={(executionStatus) => setFilters((prev) => ({ ...prev, executionStatus }))}
                    onClear={() => setFilters((prev) => ({ ...prev, executionStatus: [] }))}
                    clearLabel="N/A"
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasInspectionStatus ? (
                <InteractiveFilter.AddFilterItem
                  id="inspectionStatus"
                  label="STATUS DA VISTORIA"
                  icon={<ShieldCheck className="h-4 w-4" />}
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

              {!hasPaidOnly ? (
                <InteractiveFilter.AddFilterItem
                  id="paidOnly"
                  label="SOMENTE PAGOS"
                  icon={<PiggyBankIcon className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.paidOnly}
                    onChange={(paidOnly) => setFilters((prev) => ({ ...prev, paidOnly }))}
                    label="SOMENTE PAGOS"
                    autoCloseOnChange={false}
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

              {!hasNecessaryHomologation ? (
                <InteractiveFilter.AddFilterItem
                  id="necessaryHomologation"
                  label="NECESSÁRIO HOMOLOGAÇÃO"
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.necessaryHomologation}
                    onChange={(necessaryHomologation) =>
                      setFilters((prev) => ({ ...prev, necessaryHomologation }))
                    }
                    label="NECESSÁRIO HOMOLOGAÇÃO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasNotNecessaryHomologation ? (
                <InteractiveFilter.AddFilterItem
                  id="notNecessaryHomologation"
                  label="NÃO NECESSÁRIO HOMOLOGAÇÃO"
                  icon={<ShieldOff className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.notNecessaryHomologation}
                    onChange={(notNecessaryHomologation) =>
                      setFilters((prev) => ({ ...prev, notNecessaryHomologation }))
                    }
                    label="NÃO NECESSÁRIO HOMOLOGAÇÃO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasDrawReady ? (
                <InteractiveFilter.AddFilterItem
                  id="drawReady"
                  label="DESENHO PRONTO"
                  icon={<DraftingCompass className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.drawReady}
                    onChange={(drawReady) => setFilters((prev) => ({ ...prev, drawReady }))}
                    label="DESENHO PRONTO"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasMissingDiagram ? (
                <InteractiveFilter.AddFilterItem
                  id="missingDiagram"
                  label="DIAGRAMA PENDENTE"
                  icon={<LayoutGrid className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.missingDiagram}
                    onChange={(missingDiagram) => setFilters((prev) => ({ ...prev, missingDiagram }))}
                    label="DIAGRAMA PENDENTE"
                    autoCloseOnChange={false}
                  />
                </InteractiveFilter.AddFilterItem>
              ) : null}

              {!hasMissingDraw ? (
                <InteractiveFilter.AddFilterItem
                  id="missingDraw"
                  label="DESENHO PENDENTE"
                  icon={<PanelsTopLeft className="h-4 w-4" />}
                >
                  <InteractiveFilter.BooleanContent
                    value={filters.missingDraw}
                    onChange={(missingDraw) => setFilters((prev) => ({ ...prev, missingDraw }))}
                    label="DESENHO PENDENTE"
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
            </InteractiveFilter.AddFilterSection>
          </InteractiveFilter.AddFilterContent>
        </InteractiveFilter.AddFilterRoot>

        <Link
          href="/projetos/analises-tecnicas"
          className="inline-flex h-auto items-center rounded-lg border border-[#15599a] px-3 py-2 text-xs font-medium text-[#15599a] transition-colors hover:bg-[#15599a]/10"
        >
          ANÁLISES TÉCNICAS
        </Link>
        <Link
          href="/projetos/homologacoes"
          className="inline-flex h-auto items-center rounded-lg border border-[#fead41] px-3 py-2 text-xs font-medium text-[#fead41] transition-colors hover:bg-[#fead41]/10"
        >
          HOMOLOGAÇÕES AVULSAS
        </Link>
      </div>
    </div>
  );
}

function EngineeringMultiFilterChip({
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

function EngineeringBooleanFilterChip({
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
