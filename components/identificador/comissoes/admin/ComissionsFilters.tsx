import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InteractiveFilter, type InteractiveFilterDateRange, type InteractiveFilterOption } from "@/components/ui/interactive-filter";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/crm/users";
import { serviceTypes } from "@/utils/select-options";
import dayjs from "dayjs";
import { CalendarDays, Diamond, Download, ListFilter, UserRound } from "lucide-react";

type ComissionsPeriod = { after: string; before: string };

// The app stores/compares dates shifted by 3h (see `formatDateAsLocale` and the default period in
// `useComissionData`), so the calendar converts with the same offset to show the same days.
function toCalendarDate(value: string) {
	return dayjs(value).add(3, "hour").toDate();
}
function toPeriod(range: { from: Date; to: Date }): ComissionsPeriod {
	return {
		after: dayjs(range.from).startOf("day").subtract(3, "hour").toISOString(),
		before: dayjs(range.to).endOf("day").subtract(3, "hour").toISOString(),
	};
}
function getPreviousMonthPeriod(): ComissionsPeriod {
	const month = dayjs().subtract(1, "month");
	return toPeriod({ from: month.startOf("month").toDate(), to: month.endOf("month").toDate() });
}

function joinLabels(values: string[], options: InteractiveFilterOption<string>[]) {
	return values.map((value) => options.find((option) => option.value === value)?.label ?? value).join(", ");
}

type ComissionsFiltersProps = {
	search: string;
	onSearchChange: (search: string) => void;
	period: ComissionsPeriod;
	onPeriodChange: (period: ComissionsPeriod) => void;
	serviceTypesValue: string[];
	onServiceTypesChange: (serviceTypes: string[]) => void;
	comissionedIds: string[];
	onComissionedIdsChange: (ids: string[]) => void;
	onExport: () => void;
	exportDisabled?: boolean;
};
export default function ComissionsFilters({
	search,
	onSearchChange,
	period,
	onPeriodChange,
	serviceTypesValue,
	onServiceTypesChange,
	comissionedIds,
	onComissionedIdsChange,
	onExport,
	exportDisabled,
}: ComissionsFiltersProps) {
	const { data: crmUsers } = useUsers({ includeDeleted: false });

	const serviceTypeOptions = serviceTypes as InteractiveFilterOption<string>[];
	const comissionedOptions = useMemo<InteractiveFilterOption<string>[]>(() => {
		if (!crmUsers) return [];
		return [...crmUsers]
			.sort((a, b) => a.nome.localeCompare(b.nome))
			.map((user) => ({
				id: user._id,
				value: user._id,
				label: user.nome,
				keywords: [user.nome, user.email ?? ""],
				startContent: (
					<Avatar className="h-5 w-5 min-h-5 min-w-5">
						<AvatarImage src={user.avatar_url ?? undefined} />
						<AvatarFallback className="text-[0.6rem]">{formatNameAsInitials(user.nome)}</AvatarFallback>
					</Avatar>
				),
			}));
	}, [crmUsers]);

	const hasServiceTypes = serviceTypesValue.length > 0;
	const hasComissioned = comissionedIds.length > 0;

	return (
		<div className="flex w-full flex-col gap-3">
			<div className="flex w-full items-center gap-2">
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Pesquisar por contrato, ID, CRM ou cidade..."
					aria-label="Pesquisar projetos"
					className="grow rounded-xl"
				/>
				<Button variant="ghost" size="sm" className="flex shrink-0 items-center gap-2" onClick={onExport} disabled={exportDisabled}>
					<Download className="h-4 w-4 min-h-4 min-w-4" aria-hidden />
					EXPORTAR
				</Button>
			</div>

			<div className="flex w-full flex-wrap items-center gap-2">
				<PeriodFilter period={period} onPeriodChange={onPeriodChange} />

				{hasServiceTypes ? (
					<MultiFilterChip
						label="TIPO DE SERVIÇO"
						icon={<Diamond className="h-4 w-4 min-h-4 min-w-4" />}
						options={serviceTypeOptions}
						value={serviceTypesValue}
						onChange={onServiceTypesChange}
						onClear={() => onServiceTypesChange([])}
					/>
				) : null}
				{hasComissioned ? (
					<MultiFilterChip
						label="COMISSIONADO"
						icon={<UserRound className="h-4 w-4 min-h-4 min-w-4" />}
						options={comissionedOptions}
						value={comissionedIds}
						onChange={onComissionedIdsChange}
						onClear={() => onComissionedIdsChange([])}
						searchPlaceholder="Buscar comissionado..."
						emptyLabel={crmUsers ? "Nenhum usuário encontrado." : "Carregando usuários..."}
					/>
				) : null}

				{!hasServiceTypes || !hasComissioned ? (
					<InteractiveFilter.AddFilterRoot className="w-fit">
						<InteractiveFilter.AddFilterTrigger>
							<ListFilter className="h-4 w-4 min-h-4 min-w-4" />
							<InteractiveFilter.Label>ADICIONAR FILTRO</InteractiveFilter.Label>
						</InteractiveFilter.AddFilterTrigger>
						<InteractiveFilter.AddFilterContent searchPlaceholder="Adicionar filtro...">
							<InteractiveFilter.AddFilterSection heading="Filtros">
								{!hasServiceTypes ? (
									<InteractiveFilter.AddFilterItem id="serviceTypes" label="TIPO DE SERVIÇO" icon={<Diamond className="h-4 w-4" />}>
										<InteractiveFilter.MultiContent
											options={serviceTypeOptions}
											value={serviceTypesValue}
											onChange={onServiceTypesChange}
											onClear={() => onServiceTypesChange([])}
											clearLabel="TODOS"
										/>
									</InteractiveFilter.AddFilterItem>
								) : null}
								{!hasComissioned ? (
									<InteractiveFilter.AddFilterItem id="comissioned" label="COMISSIONADO" icon={<UserRound className="h-4 w-4" />}>
										<InteractiveFilter.MultiContent
											options={comissionedOptions}
											value={comissionedIds}
											onChange={onComissionedIdsChange}
											onClear={() => onComissionedIdsChange([])}
											searchPlaceholder="Buscar comissionado..."
											emptyLabel={crmUsers ? "Nenhum usuário encontrado." : "Carregando usuários..."}
											clearLabel="TODOS"
										/>
									</InteractiveFilter.AddFilterItem>
								) : null}
							</InteractiveFilter.AddFilterSection>
						</InteractiveFilter.AddFilterContent>
					</InteractiveFilter.AddFilterRoot>
				) : null}
			</div>
		</div>
	);
}

/** Always visible: the API requires a period, so "clear" goes back to the default (previous month). */
function PeriodFilter({ period, onPeriodChange }: { period: ComissionsPeriod; onPeriodChange: (period: ComissionsPeriod) => void }) {
	const [open, setOpen] = useState(false);
	// Only complete ranges are applied; the first click of a range stays local so the list doesn't refetch.
	const [draft, setDraft] = useState<InteractiveFilterDateRange | null>(null);

	const value = draft ?? { from: toCalendarDate(period.after), to: toCalendarDate(period.before) };
	const label = `${formatDateAsLocale(period.after)} - ${formatDateAsLocale(period.before)}`;

	function handleChange(range: InteractiveFilterDateRange) {
		if (range.from && range.to) {
			onPeriodChange(toPeriod({ from: range.from, to: range.to }));
			setDraft(null);
			setOpen(false);
			return;
		}
		setDraft(range);
	}

	return (
		<InteractiveFilter.Root
			className="w-fit"
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) setDraft(null);
			}}
		>
			<InteractiveFilter.Trigger>
				<InteractiveFilter.Icon>
					<CalendarDays className="h-4 w-4 min-h-4 min-w-4" />
					<InteractiveFilter.Label>REFERÊNCIA</InteractiveFilter.Label>
				</InteractiveFilter.Icon>
				<InteractiveFilter.Value>
					<strong>{label}</strong>
				</InteractiveFilter.Value>
				<InteractiveFilter.Clear onClear={() => onPeriodChange(getPreviousMonthPeriod())} label="Voltar ao mês anterior" />
			</InteractiveFilter.Trigger>
			<InteractiveFilter.Content className="w-auto p-0">
				<InteractiveFilter.DateRangeContent value={value} onChange={handleChange} />
			</InteractiveFilter.Content>
		</InteractiveFilter.Root>
	);
}

function MultiFilterChip({
	label,
	icon,
	options,
	value,
	onChange,
	onClear,
	searchPlaceholder = "Buscar...",
	emptyLabel = "Nenhuma opção encontrada.",
}: {
	label: string;
	icon: React.ReactNode;
	options: InteractiveFilterOption<string>[];
	value: string[];
	onChange: (value: string[]) => void;
	onClear: () => void;
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
				<InteractiveFilter.Value>{selectedLabel.length > 0 ? <strong>{selectedLabel}</strong> : <span>TODOS</span>}</InteractiveFilter.Value>
				<InteractiveFilter.Clear onClear={onClear} />
			</InteractiveFilter.Trigger>
			<InteractiveFilter.Content className="w-72 p-0">
				<InteractiveFilter.MultiContent
					options={options}
					value={value}
					onChange={onChange}
					onClear={onClear}
					isCleared={value.length === 0}
					searchPlaceholder={searchPlaceholder}
					emptyLabel={emptyLabel}
					clearLabel="TODOS"
				/>
			</InteractiveFilter.Content>
		</InteractiveFilter.Root>
	);
}
