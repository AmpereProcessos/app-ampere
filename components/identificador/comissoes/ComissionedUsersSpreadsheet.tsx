"use client";

import DeleteRowButton from "@/components/Spreadsheet/DeleteRowButton";
import EditableDateCell from "@/components/Spreadsheet/EditableDateCell";
import EditableNumberCell from "@/components/Spreadsheet/EditableNumberCell";
import MobileEditableField from "@/components/Spreadsheet/MobileEditableField";
import SpreadsheetCellWrapper from "@/components/Spreadsheet/SpreadsheetCellWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SelectInput from "@/components/inputs/Select";
import { cn } from "@/lib/utils";
import {
	consumeProgrammaticSpreadsheetFocus,
	handleSpreadsheetNavigationKeyDown,
	SPREADSHEET_TABLE_ATTR,
	type SpreadsheetGridBounds,
} from "@/lib/spreadsheet-navigation";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useUsers } from "@/utils/methods/query/crm/users";
import type { TProjectComissionedUser } from "@/utils/schemas/projects";
import { Plus } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";

const COMMISSION_GRID_COL = {
	PERSON: 0,
	ROLE: 1,
	PERCENT: 2,
	VALUE: 3,
	EFFECTED: 4,
	PAID: 5,
	VALIDATED: 6,
} as const;

const COMMISSION_GRID_COL_COUNT = 7;

const TABLE_GRID_COLS =
	"grid-cols-[minmax(9rem,22fr)_minmax(7rem,12fr)_minmax(4.5rem,8fr)_minmax(5.5rem,10fr)_minmax(5.5rem,10fr)_minmax(5.5rem,10fr)_minmax(5.5rem,10fr)_minmax(2.5rem,4fr)]";

const DESKTOP_ROW = cn("hidden w-full min-w-[52rem] lg:grid", TABLE_GRID_COLS, "items-center gap-x-1 px-2");

const CELL_TRIGGER_CLASSNAME =
	"h-8 min-h-8 justify-between rounded-md border-transparent bg-transparent px-2 py-0 text-xs font-medium shadow-none hover:border-border hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40";

const ROLE_OPTIONS: { id: number; label: string; value: TProjectComissionedUser["papel"] }[] = [
	{ id: 1, label: "VENDEDOR", value: "VENDEDOR" },
	{ id: 2, label: "INSIDER", value: "INSIDER" },
	{ id: 3, label: "INDICADOR", value: "INDICADOR" },
	{ id: 4, label: "ANALISTA TÉCNICO", value: "ANALISTA TÉCNICO" },
];

type ComissionedUsersSpreadsheetProps = {
	comissioned: TProjectComissionedUser[];
	comissionableValue: number;
	editable?: boolean;
	onAdd: (comissioned: TProjectComissionedUser) => void;
	onUpdate: (index: number, changes: Partial<TProjectComissionedUser>) => void;
	onRemove: (index: number) => void;
};

export default function ComissionedUsersSpreadsheet({
	comissioned,
	comissionableValue,
	editable = true,
	onAdd,
	onUpdate,
	onRemove,
}: ComissionedUsersSpreadsheetProps) {
	const { data: crmUsers } = useUsers({ includeDeleted: false });
	const gridBounds: SpreadsheetGridBounds = useMemo(
		() => ({
			rowCount: comissioned.length + (editable ? 1 : 0),
			colCount: COMMISSION_GRID_COL_COUNT,
		}),
		[comissioned.length, editable],
	);

	const totalValue = comissioned.reduce((sum, row) => sum + commissionValue(row, comissionableValue), 0);
	const totalPercent = comissionableValue > 0 ? (totalValue / comissionableValue) * 100 : comissioned.reduce((sum, row) => sum + (row.porcentagem || 0), 0);
	const exceedsCommissionable = comissionableValue > 0 && totalValue - comissionableValue > 0.01;

	const selectedIds = useMemo(() => new Set(comissioned.map((row) => row.idCrm).filter(Boolean)), [comissioned]);
	const personOptions = useMemo(
		() =>
			(crmUsers ?? []).map((user) => ({
				id: user._id,
				label: user.nome,
				value: user._id,
				avatar_url: user.avatar_url ?? null,
				startContent: (
					<Avatar className="h-5 w-5 min-h-5 min-w-5">
						<AvatarImage src={user.avatar_url ?? undefined} alt={user.nome} />
						<AvatarFallback className="text-[0.55rem]">{formatNameAsInitials(user.nome)}</AvatarFallback>
					</Avatar>
				),
			})),
		[crmUsers],
	);

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="w-full overflow-x-auto">
				<div
					{...{ [SPREADSHEET_TABLE_ATTR]: "true" }}
					className="flex min-w-full flex-col overflow-hidden rounded-md border border-border bg-background"
				>
					<div
						className={cn(
							DESKTOP_ROW,
							"min-h-9 border-b border-border bg-muted/60 py-1.5 text-[0.68rem] font-medium uppercase text-muted-foreground",
						)}
					>
						<p className="min-w-0 px-1 text-start">Pessoa</p>
						<p className="min-w-0 px-1 text-center">Papel</p>
						<p className="min-w-0 px-1 text-center">%</p>
						<p className="min-w-0 px-1 text-center">Valor</p>
						<p className="min-w-0 px-1 text-center">Efetivação</p>
						<p className="min-w-0 px-1 text-center">Pagamento</p>
						<p className="min-w-0 px-1 text-center">Validação</p>
						<p className="min-w-0 px-1 text-center">Ações</p>
					</div>

					<div className="flex w-full flex-col bg-background">
						{comissioned.map((row, index) => (
							<ComissionedTableRow
								key={`${row.idCrm ?? row.nome}-${index}`}
								row={row}
								gridRow={index}
								gridBounds={gridBounds}
								comissionableValue={comissionableValue}
								personOptions={personOptions}
								selectedIds={selectedIds}
								editable={editable}
								onUpdate={(changes) => onUpdate(index, changes)}
								onRemove={() => onRemove(index)}
							/>
						))}

						{editable ? (
							<DraftComissionedTableRow
								gridRow={comissioned.length}
								gridBounds={gridBounds}
								comissionableValue={comissionableValue}
								personOptions={personOptions}
								selectedIds={selectedIds}
								onAdd={onAdd}
							/>
						) : null}

						{comissioned.length === 0 ? (
							<div className="flex w-full items-center justify-center border-t border-border px-3 py-3">
								<p className="text-center text-xs font-medium tracking-tight text-muted-foreground">
									{editable ? "Selecione uma pessoa na linha abaixo para incluir um comissionado." : "Nenhum comissionado cadastrado."}
								</p>
							</div>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-2 px-1">
				<p className="text-xs text-muted-foreground">
					Total {formatToMoney(totalValue)} · {formatDecimalPlaces(totalPercent)}%
				</p>
				{exceedsCommissionable ? (
					<p className="rounded-md bg-[#fead41] px-2 py-0.5 text-[0.7rem] font-medium text-[#1a1200]">
						A soma ultrapassa o valor comissionável ({formatToMoney(comissionableValue)})
					</p>
				) : null}
			</div>
		</div>
	);
}

type PersonOption = {
	id: string;
	label: string;
	value: string;
	avatar_url: string | null;
	startContent: React.ReactNode;
};

type RowProps = {
	row: TProjectComissionedUser;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	comissionableValue: number;
	personOptions: PersonOption[];
	selectedIds: Set<string | null | undefined>;
	editable?: boolean;
	onUpdate: (changes: Partial<TProjectComissionedUser>) => void;
	onRemove?: () => void;
	isDraft?: boolean;
};

function ComissionedTableRow({
	row,
	gridRow,
	gridBounds,
	comissionableValue,
	personOptions,
	selectedIds,
	editable = true,
	onUpdate,
	onRemove,
}: RowProps) {
	return (
		<div className="border-t border-border first:border-t-0">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="min-w-0 px-1">
					<PersonCell
						row={row}
						gridRow={gridRow}
						gridBounds={gridBounds}
						personOptions={personOptions}
						selectedIds={selectedIds}
						editable={editable}
						onUpdate={onUpdate}
					/>
				</div>
				<div className="min-w-0 px-1">
					<RoleCell row={row} gridRow={gridRow} gridBounds={gridBounds} editable={editable} onUpdate={onUpdate} />
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={row.porcentagem}
						ariaLabel="Editar porcentagem da comissão"
						min={0}
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? COMMISSION_GRID_COL.PERCENT : undefined}
						gridBounds={gridBounds}
						format={(value) => `${formatDecimalPlaces(value)}%`}
						onCommit={(porcentagem) => onUpdate(patchFromPercent(porcentagem, comissionableValue))}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={commissionValue(row, comissionableValue)}
						ariaLabel="Editar valor da comissão"
						min={0}
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? COMMISSION_GRID_COL.VALUE : undefined}
						gridBounds={gridBounds}
						format={(value) => (value > 0 ? formatToMoney(value) : "-")}
						onCommit={(valor) => onUpdate(patchFromValue(valor, comissionableValue))}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={row.dataEfetivacao}
						ariaLabel="Editar data de efetivação"
						emptyDisplay="Pendente"
						allowEmpty
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? COMMISSION_GRID_COL.EFFECTED : undefined}
						gridBounds={gridBounds}
						onCommit={(date) => onUpdate({ dataEfetivacao: serializeDate(date) })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={row.dataPagamento}
						ariaLabel="Editar data de pagamento"
						emptyDisplay="Pendente"
						allowEmpty
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? COMMISSION_GRID_COL.PAID : undefined}
						gridBounds={gridBounds}
						onCommit={(date) => onUpdate({ dataPagamento: serializeDate(date) })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={row.dataValidacao}
						ariaLabel="Editar data de validação"
						emptyDisplay="Pendente"
						allowEmpty
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? COMMISSION_GRID_COL.VALIDATED : undefined}
						gridBounds={gridBounds}
						onCommit={(date) => onUpdate({ dataValidacao: serializeDate(date) })}
					/>
				</div>
				<div className="flex min-w-0 justify-center px-1">
					{onRemove ? <DeleteRowButton onRemove={onRemove} ariaLabel={`Remover ${row.nome || "comissionado"}`} disabled={!editable} /> : null}
				</div>
			</div>

			<div className="flex w-full flex-col gap-2 p-2 lg:hidden">
				<div className="flex items-start gap-2">
					<div className="min-w-0 flex-1">
						<MobileEditableField label="Pessoa">
							<PersonCell
								row={row}
								personOptions={personOptions}
								selectedIds={selectedIds}
								editable={editable}
								onUpdate={onUpdate}
							/>
						</MobileEditableField>
					</div>
					{onRemove ? <DeleteRowButton onRemove={onRemove} ariaLabel={`Remover ${row.nome || "comissionado"}`} disabled={!editable} /> : null}
				</div>
				<div className="grid w-full grid-cols-2 gap-2">
					<MobileEditableField label="Papel">
						<RoleCell row={row} editable={editable} onUpdate={onUpdate} />
					</MobileEditableField>
					<MobileEditableField label="%">
						<EditableNumberCell
							value={row.porcentagem}
							ariaLabel="Editar porcentagem da comissão"
							min={0}
							editable={editable}
							format={(value) => `${formatDecimalPlaces(value)}%`}
							onCommit={(porcentagem) => onUpdate(patchFromPercent(porcentagem, comissionableValue))}
						/>
					</MobileEditableField>
					<MobileEditableField label="Valor">
						<EditableNumberCell
							value={commissionValue(row, comissionableValue)}
							ariaLabel="Editar valor da comissão"
							min={0}
							editable={editable}
							format={(value) => (value > 0 ? formatToMoney(value) : "-")}
							onCommit={(valor) => onUpdate(patchFromValue(valor, comissionableValue))}
						/>
					</MobileEditableField>
					<MobileEditableField label="Efetivação">
						<EditableDateCell
							value={row.dataEfetivacao}
							ariaLabel="Editar data de efetivação"
							emptyDisplay="Pendente"
							allowEmpty
							editable={editable}
							onCommit={(date) => onUpdate({ dataEfetivacao: serializeDate(date) })}
						/>
					</MobileEditableField>
					<MobileEditableField label="Pagamento">
						<EditableDateCell
							value={row.dataPagamento}
							ariaLabel="Editar data de pagamento"
							emptyDisplay="Pendente"
							allowEmpty
							editable={editable}
							onCommit={(date) => onUpdate({ dataPagamento: serializeDate(date) })}
						/>
					</MobileEditableField>
					<MobileEditableField label="Validação">
						<EditableDateCell
							value={row.dataValidacao}
							ariaLabel="Editar data de validação"
							emptyDisplay="Pendente"
							allowEmpty
							editable={editable}
							onCommit={(date) => onUpdate({ dataValidacao: serializeDate(date) })}
						/>
					</MobileEditableField>
				</div>
			</div>
		</div>
	);
}

function DraftComissionedTableRow({
	gridRow,
	gridBounds,
	comissionableValue,
	personOptions,
	selectedIds,
	onAdd,
}: {
	gridRow: number;
	gridBounds: SpreadsheetGridBounds;
	comissionableValue: number;
	personOptions: PersonOption[];
	selectedIds: Set<string | null | undefined>;
	onAdd: (comissioned: TProjectComissionedUser) => void;
}) {
	const [draft, setDraft] = useState<TProjectComissionedUser>(createEmptyComissioned);

	function updateDraft(changes: Partial<TProjectComissionedUser>) {
		const next = { ...draft, ...changes };
		if (isDraftReady(next)) {
			onAdd(next);
			setDraft(createEmptyComissioned());
			return;
		}
		setDraft(next);
	}

	return (
		<div className="border-t border-dashed border-border bg-muted/20">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="flex min-w-0 items-center gap-1 px-1">
					<Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<div className="min-w-0 flex-1">
						<PersonCell
							row={draft}
							gridRow={gridRow}
							gridBounds={gridBounds}
							personOptions={personOptions}
							selectedIds={selectedIds}
							onUpdate={updateDraft}
						/>
					</div>
				</div>
				<div className="min-w-0 px-1">
					<RoleCell row={draft} gridRow={gridRow} gridBounds={gridBounds} onUpdate={updateDraft} />
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={draft.porcentagem}
						ariaLabel="Porcentagem da nova comissão"
						min={0}
						gridRow={gridRow}
						gridCol={COMMISSION_GRID_COL.PERCENT}
						gridBounds={gridBounds}
						format={(value) => `${formatDecimalPlaces(value)}%`}
						onCommit={(porcentagem) => updateDraft(patchFromPercent(porcentagem, comissionableValue))}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={commissionValue(draft, comissionableValue)}
						ariaLabel="Valor da nova comissão"
						min={0}
						gridRow={gridRow}
						gridCol={COMMISSION_GRID_COL.VALUE}
						gridBounds={gridBounds}
						format={(value) => (value > 0 ? formatToMoney(value) : "-")}
						onCommit={(valor) => updateDraft(patchFromValue(valor, comissionableValue))}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={draft.dataEfetivacao}
						ariaLabel="Efetivação da nova comissão"
						emptyDisplay="Pendente"
						allowEmpty
						gridRow={gridRow}
						gridCol={COMMISSION_GRID_COL.EFFECTED}
						gridBounds={gridBounds}
						onCommit={(date) => updateDraft({ dataEfetivacao: serializeDate(date) })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={draft.dataPagamento}
						ariaLabel="Pagamento da nova comissão"
						emptyDisplay="Pendente"
						allowEmpty
						gridRow={gridRow}
						gridCol={COMMISSION_GRID_COL.PAID}
						gridBounds={gridBounds}
						onCommit={(date) => updateDraft({ dataPagamento: serializeDate(date) })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateCell
						value={draft.dataValidacao}
						ariaLabel="Validação da nova comissão"
						emptyDisplay="Pendente"
						allowEmpty
						gridRow={gridRow}
						gridCol={COMMISSION_GRID_COL.VALIDATED}
						gridBounds={gridBounds}
						onCommit={(date) => updateDraft({ dataValidacao: serializeDate(date) })}
					/>
				</div>
				<div aria-hidden className="min-w-0 px-1" />
			</div>

			<div className="flex w-full flex-col gap-2 p-2 lg:hidden">
				<div className="flex items-start gap-2">
					<Plus className="mt-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<div className="min-w-0 flex-1">
						<MobileEditableField label="Pessoa">
							<PersonCell row={draft} personOptions={personOptions} selectedIds={selectedIds} onUpdate={updateDraft} />
						</MobileEditableField>
					</div>
				</div>
				<div className="grid w-full grid-cols-2 gap-2">
					<MobileEditableField label="Papel">
						<RoleCell row={draft} onUpdate={updateDraft} />
					</MobileEditableField>
					<MobileEditableField label="%">
						<EditableNumberCell
							value={draft.porcentagem}
							ariaLabel="Porcentagem da nova comissão"
							min={0}
							format={(value) => `${formatDecimalPlaces(value)}%`}
							onCommit={(porcentagem) => updateDraft(patchFromPercent(porcentagem, comissionableValue))}
						/>
					</MobileEditableField>
					<MobileEditableField label="Valor">
						<EditableNumberCell
							value={commissionValue(draft, comissionableValue)}
							ariaLabel="Valor da nova comissão"
							min={0}
							format={(value) => (value > 0 ? formatToMoney(value) : "-")}
							onCommit={(valor) => updateDraft(patchFromValue(valor, comissionableValue))}
						/>
					</MobileEditableField>
				</div>
			</div>
		</div>
	);
}

function PersonCell({
	row,
	gridRow,
	gridBounds,
	personOptions,
	selectedIds,
	editable = true,
	onUpdate,
}: {
	row: TProjectComissionedUser;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	personOptions: PersonOption[];
	selectedIds: Set<string | null | undefined>;
	editable?: boolean;
	onUpdate: (changes: Partial<TProjectComissionedUser>) => void;
}) {
	const { hasGridNavigation, triggerProps } = getGridTriggerProps({
		gridRow,
		gridCol: COMMISSION_GRID_COL.PERSON,
		gridBounds,
	});
	const options = personOptions.filter((option) => option.value === row.idCrm || !selectedIds.has(option.value));

	const select = (
		<SelectInput
			label="Pessoa comissionada"
			showLabel={false}
			width="100%"
			editable={editable}
			selectedItemLabel={row.nome || "Selecionar"}
			options={options}
			value={row.idCrm ?? null}
			holderClassName={CELL_TRIGGER_CLASSNAME}
			triggerProps={triggerProps}
			handleChange={(idCrm) => {
				const option = personOptions.find((item) => item.value === idCrm);
				if (!option) return;
				onUpdate({
					idCrm: option.value,
					nome: option.label,
					avatar_url: option.avatar_url,
				});
			}}
			onReset={() => onUpdate({ idCrm: null, nome: "" })}
		/>
	);

	if (!hasGridNavigation || gridRow === undefined) return select;

	return (
		<SpreadsheetCellWrapper gridRow={gridRow} gridCol={COMMISSION_GRID_COL.PERSON}>
			{select}
		</SpreadsheetCellWrapper>
	);
}

function RoleCell({
	row,
	gridRow,
	gridBounds,
	editable = true,
	onUpdate,
}: {
	row: TProjectComissionedUser;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (changes: Partial<TProjectComissionedUser>) => void;
}) {
	const { hasGridNavigation, triggerProps } = getGridTriggerProps({
		gridRow,
		gridCol: COMMISSION_GRID_COL.ROLE,
		gridBounds,
	});

	const select = (
		<SelectInput
			label="Papel do comissionado"
			showLabel={false}
			width="100%"
			editable={editable}
			selectedItemLabel="Papel"
			options={ROLE_OPTIONS}
			value={row.papel}
			holderClassName={CELL_TRIGGER_CLASSNAME}
			triggerProps={triggerProps}
			handleChange={(papel) => onUpdate({ papel })}
			onReset={() => onUpdate({ papel: "VENDEDOR" })}
		/>
	);

	if (!hasGridNavigation || gridRow === undefined) return select;

	return (
		<SpreadsheetCellWrapper gridRow={gridRow} gridCol={COMMISSION_GRID_COL.ROLE}>
			{select}
		</SpreadsheetCellWrapper>
	);
}

function getGridTriggerProps({
	gridRow,
	gridCol,
	gridBounds,
}: {
	gridRow?: number;
	gridCol: number;
	gridBounds?: SpreadsheetGridBounds;
}) {
	const hasGridNavigation = gridRow !== undefined && gridBounds !== undefined;
	if (!hasGridNavigation) return { hasGridNavigation, triggerProps: undefined };

	return {
		hasGridNavigation,
		triggerProps: {
			onFocus: () => {
				consumeProgrammaticSpreadsheetFocus();
			},
			onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
				if (event.key === "Enter" || event.key === " ") return;
				handleSpreadsheetNavigationKeyDown(event, {
					coords: { row: gridRow, col: gridCol },
					bounds: gridBounds,
				});
			},
		},
	};
}

function createEmptyComissioned(): TProjectComissionedUser {
	return {
		idCrm: null,
		nome: "",
		papel: "VENDEDOR",
		porcentagem: 0,
		valor: 0,
		avatar_url: null,
		dataEfetivacao: null,
		dataPagamento: null,
		dataValidacao: null,
	};
}

function isDraftReady(row: TProjectComissionedUser) {
	return Boolean(row.idCrm) && Boolean(row.nome.trim());
}

function commissionValue(row: TProjectComissionedUser, comissionableValue: number) {
	if (row.valor != null) return row.valor;
	return (row.porcentagem / 100) * comissionableValue;
}

function patchFromPercent(porcentagem: number, comissionableValue: number): Partial<TProjectComissionedUser> {
	return {
		porcentagem,
		valor: (porcentagem / 100) * comissionableValue,
	};
}

function patchFromValue(valor: number, comissionableValue: number): Partial<TProjectComissionedUser> {
	return {
		valor,
		porcentagem: comissionableValue > 0 ? (valor / comissionableValue) * 100 : 0,
	};
}

function serializeDate(date: Date | null) {
	if (!date) return null;
	return formatDateInputChange(date, "string");
}
