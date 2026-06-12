"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	InteractiveFilter,
	type InteractiveFilterOption,
} from "@/components/ui/interactive-filter";
import { equipesTecnicas } from "@/utils/constants";
import type { TUpdateADMProjectsFilters, TUseADMProjectsFilters } from "@/utils/methods/query/adm";
import { useUsers } from "@/utils/methods/query/crm/users";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { billableCompanies, contractStatus, inspectionStatus } from "@/utils/select-options";
import {
	Building2,
	CalendarDays,
	ClipboardCheck,
	FileSignature,
	Hash,
	ListFilter,
	Receipt,
	Tag,
	UserRound,
	Users,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const DATE_FIELD_OPTIONS = [
	{ id: 1, value: "obra.saida", label: "SAÍDA DE OBRA" },
	{ id: 2, value: "medidor.data", label: "TROCA DO MEDIDOR" },
	{ id: 3, value: "contrato.dataAssinatura", label: "DATA ASS.CONTRATO" },
] as const;

const technicalTeamOptions: InteractiveFilterOption<string>[] = equipesTecnicas.map((team) => ({
	id: team.id,
	value: team.value ?? team.label,
	label: team.label,
}));

type ADMProjectsFiltersProps = {
	filters: TUseADMProjectsFilters;
	setFilters: TUpdateADMProjectsFilters;
	tagOptions: InteractiveFilterOption<string>[];
};

function joinLabels(values: string[], options: { value: string; label: string }[]) {
	return values
		.map((value) => options.find((option) => option.value === value)?.label ?? value)
		.join(", ");
}

export default function ADMProjectsFilters({ filters, setFilters, tagOptions }: ADMProjectsFiltersProps) {
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
			DATE_FIELD_OPTIONS.find((option) => option.value === filters.date.field)?.label ?? filters.date.field;
		return `${fieldLabel}: ${formatDateAsLocale(filters.date.after)} - ${formatDateAsLocale(filters.date.before)}`;
	}, [filters.date]);

	const hasTags = filters.tagIds.length > 0;
	const hasTechnicalTeam = filters.technicalTeam.length > 0;
	const hasInspectionStatus = filters.inspectionStatus.length > 0;
	const hasToBill = filters.toBill;
	const hasBillingDone = filters.billingDone;
	const hasReceiptsUndefined = filters.receiptsUndefined;
	const hasReceiptToday = filters.receiptToday;
	const hasReceiptThisWeek = filters.receiptThisWeek;
	const hasReceiptThisMonth = filters.receiptThisMonth;

	function clearDateFilter() {
		setFilters({
			date: { after: null, before: null, field: null },
		});
	}

	return (
		<div className="mt-4 flex w-full flex-col gap-3">
			<Input
				value={filters.search}
				placeholder="Pesquisar por nome do contrato..."
				onChange={(e) => setFilters({ search: e.target.value })}
				className="grow rounded-xl"
			/>

			<div className="flex w-full flex-wrap items-center justify-end gap-2">
				<ADMMultiFilterChip
					label="STATUS DO CONTRATO"
					icon={<FileSignature className="h-4 w-4 min-h-4 min-w-4" />}
					options={contractStatus}
					value={filters.contractStatus}
					onChange={(contractStatus) => setFilters({ contractStatus })}
					onClear={() => setFilters({ contractStatus: [] })}
				/>

				<ADMMultiFilterChip
					label="VENDEDOR"
					icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
					options={sellerOptions}
					value={filters.sellers}
					onChange={(sellers) => setFilters({ sellers })}
					onClear={() => setFilters({ sellers: [] })}
					searchPlaceholder="Buscar vendedor..."
					emptyLabel={crmUsers ? "Nenhum vendedor encontrado." : "Carregando vendedores..."}
				/>

				<ADMMultiFilterChip
					label="EMPRESA A FATURAR"
					icon={<Building2 className="h-4 w-4 min-h-4 min-w-4" />}
					options={billableCompanies}
					value={filters.billingCompany}
					onChange={(billingCompany) => setFilters({ billingCompany })}
					onClear={() => setFilters({ billingCompany: [] })}
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
									setFilters({
										date: { ...filters.date, field: nextField },
									})
								}
								onClear={() => setFilters({ date: { ...filters.date, field: null } })}
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
								setFilters({
									date: {
										...filters.date,
										after: nextPeriod.from ? (formatDateInputChange(nextPeriod.from) as string) : null,
										before: nextPeriod.to ? (formatDateInputChange(nextPeriod.to) as string) : null,
									},
								})
							}
						/>
					</InteractiveFilter.Content>
				</InteractiveFilter.Root>

				<ADMBooleanFilterChip
					label="COBRANÇA PENDENTE"
					icon={<Wallet className="h-4 w-4 min-h-4 min-w-4" />}
					value={filters.toCharge}
					onChange={(toCharge) => setFilters({ toCharge })}
					onClear={() => setFilters({ toCharge: false })}
				/>

				<ADMBooleanFilterChip
					label="COBRANÇA CONCLUÍDA"
					icon={<Wallet className="h-4 w-4 min-h-4 min-w-4" />}
					value={filters.chargeDone}
					onChange={(chargeDone) => setFilters({ chargeDone })}
					onClear={() => setFilters({ chargeDone: false })}
				/>

				{hasTags ? (
					<ADMMultiFilterChip
						label="ETIQUETAS"
						icon={<Tag className="h-4 w-4 min-h-4 min-w-4" />}
						options={tagOptions}
						value={filters.tagIds}
						onChange={(tagIds) => setFilters({ tagIds })}
						onClear={() => setFilters({ tagIds: [] })}
					/>
				) : null}

				{hasTechnicalTeam ? (
					<ADMMultiFilterChip
						label="EQUIPE TÉCNICA"
						icon={<Users className="h-4 w-4 min-h-4 min-w-4" />}
						options={technicalTeamOptions}
						value={filters.technicalTeam}
						onChange={(technicalTeam) => setFilters({ technicalTeam })}
						onClear={() => setFilters({ technicalTeam: [] })}
						contentClassName="w-80"
					/>
				) : null}

				{hasInspectionStatus ? (
					<ADMMultiFilterChip
						label="STATUS DA VISTORIA"
						icon={<ClipboardCheck className="h-4 w-4 min-h-4 min-w-4" />}
						options={inspectionStatus}
						value={filters.inspectionStatus}
						onChange={(inspectionStatus) => setFilters({ inspectionStatus })}
						onClear={() => setFilters({ inspectionStatus: [] })}
					/>
				) : null}

				{hasToBill ? (
					<ADMBooleanFilterChip
						label="FATURAMENTOS PENDENTES"
						icon={<Hash className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.toBill}
						onChange={(toBill) => setFilters({ toBill })}
						onClear={() => setFilters({ toBill: false })}
					/>
				) : null}

				{hasBillingDone ? (
					<ADMBooleanFilterChip
						label="FATURAMENTOS CONCLUÍDOS"
						icon={<Hash className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.billingDone}
						onChange={(billingDone) => setFilters({ billingDone })}
						onClear={() => setFilters({ billingDone: false })}
					/>
				) : null}

				{hasReceiptsUndefined ? (
					<ADMBooleanFilterChip
						label="RECEBIMENTOS INDEFINIDOS"
						icon={<Receipt className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.receiptsUndefined}
						onChange={(receiptsUndefined) => setFilters({ receiptsUndefined })}
						onClear={() => setFilters({ receiptsUndefined: false })}
					/>
				) : null}

				{hasReceiptToday ? (
					<ADMBooleanFilterChip
						label="RECEBIMENTOS PARA HOJE"
						icon={<Receipt className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.receiptToday}
						onChange={(receiptToday) => setFilters({ receiptToday })}
						onClear={() => setFilters({ receiptToday: false })}
					/>
				) : null}

				{hasReceiptThisWeek ? (
					<ADMBooleanFilterChip
						label="RECEBIMENTOS PARA A SEMANA"
						icon={<Receipt className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.receiptThisWeek}
						onChange={(receiptThisWeek) => setFilters({ receiptThisWeek })}
						onClear={() => setFilters({ receiptThisWeek: false })}
					/>
				) : null}

				{hasReceiptThisMonth ? (
					<ADMBooleanFilterChip
						label="RECEBIMENTOS PARA O MÊS"
						icon={<Receipt className="h-4 w-4 min-h-4 min-w-4" />}
						value={filters.receiptThisMonth}
						onChange={(receiptThisMonth) => setFilters({ receiptThisMonth })}
						onClear={() => setFilters({ receiptThisMonth: false })}
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
										onChange={(tagIds) => setFilters({ tagIds })}
										onClear={() => setFilters({ tagIds: [] })}
										clearLabel="N/A"
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasTechnicalTeam ? (
								<InteractiveFilter.AddFilterItem id="technicalTeam" label="EQUIPE TÉCNICA" icon={<Users className="h-4 w-4" />}>
									<InteractiveFilter.MultiContent
										options={technicalTeamOptions}
										value={filters.technicalTeam}
										onChange={(technicalTeam) => setFilters({ technicalTeam })}
										onClear={() => setFilters({ technicalTeam: [] })}
										clearLabel="N/A"
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasInspectionStatus ? (
								<InteractiveFilter.AddFilterItem
									id="inspectionStatus"
									label="STATUS DA VISTORIA"
									icon={<ClipboardCheck className="h-4 w-4" />}
								>
									<InteractiveFilter.MultiContent
										options={inspectionStatus}
										value={filters.inspectionStatus}
										onChange={(inspectionStatus) => setFilters({ inspectionStatus })}
										onClear={() => setFilters({ inspectionStatus: [] })}
										clearLabel="N/A"
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasToBill ? (
								<InteractiveFilter.AddFilterItem
									id="toBill"
									label="FATURAMENTOS PENDENTES"
									icon={<Hash className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.toBill}
										onChange={(toBill) => setFilters({ toBill })}
										label="FATURAMENTOS PENDENTES"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasBillingDone ? (
								<InteractiveFilter.AddFilterItem
									id="billingDone"
									label="FATURAMENTOS CONCLUÍDOS"
									icon={<Hash className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.billingDone}
										onChange={(billingDone) => setFilters({ billingDone })}
										label="FATURAMENTOS CONCLUÍDOS"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasReceiptsUndefined ? (
								<InteractiveFilter.AddFilterItem
									id="receiptsUndefined"
									label="RECEBIMENTOS INDEFINIDOS"
									icon={<Receipt className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.receiptsUndefined}
										onChange={(receiptsUndefined) => setFilters({ receiptsUndefined })}
										label="RECEBIMENTOS INDEFINIDOS"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasReceiptToday ? (
								<InteractiveFilter.AddFilterItem
									id="receiptToday"
									label="RECEBIMENTOS PARA HOJE"
									icon={<Receipt className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.receiptToday}
										onChange={(receiptToday) => setFilters({ receiptToday })}
										label="RECEBIMENTOS PARA HOJE"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasReceiptThisWeek ? (
								<InteractiveFilter.AddFilterItem
									id="receiptThisWeek"
									label="RECEBIMENTOS PARA A SEMANA"
									icon={<Receipt className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.receiptThisWeek}
										onChange={(receiptThisWeek) => setFilters({ receiptThisWeek })}
										label="RECEBIMENTOS PARA A SEMANA"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}

							{!hasReceiptThisMonth ? (
								<InteractiveFilter.AddFilterItem
									id="receiptThisMonth"
									label="RECEBIMENTOS PARA O MÊS"
									icon={<Receipt className="h-4 w-4" />}
								>
									<InteractiveFilter.BooleanContent
										value={filters.receiptThisMonth}
										onChange={(receiptThisMonth) => setFilters({ receiptThisMonth })}
										label="RECEBIMENTOS PARA O MÊS"
										autoCloseOnChange={false}
									/>
								</InteractiveFilter.AddFilterItem>
							) : null}
						</InteractiveFilter.AddFilterSection>
					</InteractiveFilter.AddFilterContent>
				</InteractiveFilter.AddFilterRoot>

				<Link
					href="/financeiro/despesas"
					className="inline-flex h-auto items-center rounded-lg border border-[#ed174c] px-3 py-2 text-xs font-medium text-[#ed174c] transition-colors hover:bg-[#ed174c]/10"
				>
					DESPESAS
				</Link>
				<Link
					href="/financeiro/receitas"
					className="inline-flex h-auto items-center rounded-lg border border-green-500 px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-500/10"
				>
					RECEITAS
				</Link>
			</div>
		</div>
	);
}

function ADMMultiFilterChip({
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

function ADMBooleanFilterChip({
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
