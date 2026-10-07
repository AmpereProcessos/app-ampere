"use client";

import DeleteRowButton from "@/components/Spreadsheet/DeleteRowButton";
import EditableDateTimeCell from "@/components/Spreadsheet/EditableDateTimeCell";
import EditableTextCell from "@/components/Spreadsheet/EditableTextCell";
import MobileEditableField from "@/components/Spreadsheet/MobileEditableField";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	SPREADSHEET_TABLE_ATTR,
	type SpreadsheetGridBounds,
} from "@/lib/spreadsheet-navigation";
import { formatDateTimeForInput } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import {
	derivePeriodoFromHistorico,
	formatDurationMs,
	getPeriodHistoryRowDurationMs,
	getTotalWorkedDurationMs,
	periodoIsLinkedToHistorico,
	sortPeriodHistory,
	type TServiceOrderPeriodHistoryEntry,
} from "@/utils/methods/util/service-order-period";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { Link2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const GRID_COL = {
	ENTRADA: 0,
	SAIDA: 1,
	DURACAO: 2,
	DESCRICAO: 3,
	ACOES: 4,
} as const;

const GRID_COL_COUNT = 5;

const TABLE_GRID_COLS =
	"grid-cols-[minmax(8.5rem,14fr)_minmax(8.5rem,14fr)_minmax(4.5rem,7fr)_minmax(10rem,24fr)_minmax(2.5rem,4fr)]";

const DESKTOP_ROW = cn("hidden w-full min-w-[44rem] lg:grid", TABLE_GRID_COLS, "items-center gap-x-1 px-2");

type ExecutionHistorySpreadsheetProps = {
	historico: TServiceOrderPeriodHistoryEntry[];
	periodoInicio: string | null | undefined;
	periodoFim: string | null | undefined;
	editable?: boolean;
	onPeriodoCommit: (changes: Partial<TServiceOrder["periodo"]>) => void;
};

export default function ExecutionHistorySpreadsheet({
	historico,
	periodoInicio,
	periodoFim,
	editable = true,
	onPeriodoCommit,
}: ExecutionHistorySpreadsheetProps) {
	const rows = historico ?? [];
	const derivedPeriodo = useMemo(() => derivePeriodoFromHistorico(rows), [rows]);
	const linkedToHistorico = useMemo(
		() => periodoIsLinkedToHistorico({ inicio: periodoInicio, fim: periodoFim }, rows),
		[periodoInicio, periodoFim, rows],
	);
	const totalWorkedMs = useMemo(() => getTotalWorkedDurationMs(rows), [rows]);

	const gridBounds: SpreadsheetGridBounds = useMemo(
		() => ({
			rowCount: rows.length + (editable ? 1 : 0),
			colCount: GRID_COL_COUNT,
		}),
		[rows.length, editable],
	);

	function commitHistorico(nextHistorico: TServiceOrderPeriodHistoryEntry[]) {
		const sorted = sortPeriodHistory(nextHistorico);
		const changes: Partial<TServiceOrder["periodo"]> = { historico: sorted };

		if (periodoIsLinkedToHistorico({ inicio: periodoInicio, fim: periodoFim }, rows)) {
			const derived = derivePeriodoFromHistorico(sorted);
			if (derived) {
				changes.inicio = derived.inicio;
				changes.fim = derived.fim;
			}
		}

		onPeriodoCommit(changes);
	}

	function updateRow(index: number, changes: Partial<TServiceOrderPeriodHistoryEntry>) {
		const next = rows.map((row, i) => (i === index ? { ...row, ...changes } : row));
		if (changes.entrada !== undefined || changes.saida !== undefined) {
			const updated = next[index];
			if (updated.entrada && updated.saida && new Date(updated.saida) < new Date(updated.entrada)) {
				return toast.error("A saída não pode ser anterior à entrada.");
			}
		}
		commitHistorico(next);
	}

	function removeRow(index: number) {
		commitHistorico(rows.filter((_, i) => i !== index));
	}

	function addRow(entry: TServiceOrderPeriodHistoryEntry) {
		if (!entry.entrada || !entry.saida) return toast.error("Preencha entrada e saída do período.");
		if (new Date(entry.saida) < new Date(entry.entrada)) {
			return toast.error("A saída não pode ser anterior à entrada.");
		}
		commitHistorico([...rows, entry]);
	}

	function applyDerivedPeriodo() {
		if (!derivedPeriodo) return toast.error("Adicione períodos completos para derivar início e fim.");
		onPeriodoCommit({ inicio: derivedPeriodo.inicio, fim: derivedPeriodo.fim });
		toast.success("Período geral sincronizado com os registros.");
	}

	return (
		<div className="flex w-full flex-col gap-3">
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
						<p className="min-w-0 px-1 text-center">Entrada</p>
						<p className="min-w-0 px-1 text-center">Saída</p>
						<p className="min-w-0 px-1 text-center">Duração</p>
						<p className="min-w-0 px-1 text-start">Descrição</p>
						<p className="min-w-0 px-1 text-center">Ações</p>
					</div>

					<div className="flex w-full flex-col bg-background">
						{rows.map((row, index) => (
							<HistoryTableRow
								key={`${row.entrada}-${index}`}
								row={row}
								gridRow={index}
								gridBounds={gridBounds}
								editable={editable}
								onUpdate={(changes) => updateRow(index, changes)}
								onRemove={() => removeRow(index)}
							/>
						))}

						{editable ? (
							<DraftHistoryTableRow gridRow={rows.length} gridBounds={gridBounds} onAdd={addRow} />
						) : null}

						{rows.length === 0 ? (
							<div className="flex w-full items-center justify-center border-t border-border px-3 py-3">
								<p className="text-center text-xs font-medium tracking-tight text-muted-foreground">
									{editable
										? "Preencha a linha abaixo para registrar um período de trabalho (pausas = novas linhas)."
										: "Nenhum período registrado."}
								</p>
							</div>
						) : null}
					</div>

					<div className="border-t border-border bg-muted/30 px-3 py-3">
						<div className="flex flex-col gap-3">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<p className="text-xs text-muted-foreground">
									Tempo trabalhado (soma dos períodos):{" "}
									<span className="font-medium text-foreground">{formatDurationMs(totalWorkedMs)}</span>
								</p>
								{derivedPeriodo && !linkedToHistorico ? (
									<Button type="button" variant="outline" size="xs" className="gap-1" onClick={applyDerivedPeriodo}>
										<Link2 className="h-3 w-3" />
										Sincronizar início/fim com períodos
									</Button>
								) : linkedToHistorico && derivedPeriodo ? (
									<p className="text-[0.65rem] font-medium text-emerald-700 dark:text-emerald-400">
										Início e fim vinculados aos períodos
									</p>
								) : null}
							</div>

							<div className="flex w-full flex-col items-stretch gap-2 lg:flex-row">
								<div className="w-full lg:w-1/2">
									<DateTimeInput
										label="DATA-HORÁRIO DE INÍCIO"
										editable={editable}
										value={formatDateTimeForInput(periodoInicio)}
										handleChange={(value) =>
											onPeriodoCommit({
												inicio: value ? (formatDateInputChange(value, "string", false) as string) : null,
											})
										}
										width="100%"
									/>
									{derivedPeriodo ? (
										<p className="mt-0.5 text-[0.65rem] text-muted-foreground">
											Derivado: {formatDateTimeAsShort(derivedPeriodo.inicio)}
										</p>
									) : null}
								</div>
								<div className="w-full lg:w-1/2">
									<DateTimeInput
										label="DATA-HORÁRIO DE CONCLUSÃO"
										editable={editable}
										value={formatDateTimeForInput(periodoFim)}
										handleChange={(value) =>
											onPeriodoCommit({
												fim: value ? (formatDateInputChange(value, "string", false) as string) : null,
											})
										}
										width="100%"
									/>
									{derivedPeriodo ? (
										<p className="mt-0.5 text-[0.65rem] text-muted-foreground">
											Derivado: {formatDateTimeAsShort(derivedPeriodo.fim)}
										</p>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type HistoryRowProps = {
	row: TServiceOrderPeriodHistoryEntry;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (changes: Partial<TServiceOrderPeriodHistoryEntry>) => void;
	onRemove?: () => void;
};

function HistoryTableRow({ row, gridRow, gridBounds, editable = true, onUpdate, onRemove }: HistoryRowProps) {
	const durationMs = getPeriodHistoryRowDurationMs(row);

	return (
		<div className="border-t border-border first:border-t-0">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="min-w-0 px-1">
					<EditableDateTimeCell
						value={row.entrada}
						ariaLabel="Editar entrada do período"
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? GRID_COL.ENTRADA : undefined}
						gridBounds={gridBounds}
						onCommit={(entrada) => entrada && onUpdate({ entrada })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateTimeCell
						value={row.saida}
						ariaLabel="Editar saída do período"
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? GRID_COL.SAIDA : undefined}
						gridBounds={gridBounds}
						onCommit={(saida) => saida && onUpdate({ saida })}
					/>
				</div>
				<div className="flex min-h-8 items-center justify-center px-1 font-mono text-xs tabular-nums text-muted-foreground">
					{formatDurationMs(durationMs)}
				</div>
				<div className="min-w-0 px-1">
					<EditableTextCell
						value={row.anotacoes}
						ariaLabel="Editar descrição do período"
						emptyDisplay="Sem descrição"
						align="left"
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? GRID_COL.DESCRICAO : undefined}
						gridBounds={gridBounds}
						onCommit={(anotacoes) => onUpdate({ anotacoes })}
					/>
				</div>
				<div className="flex min-w-0 justify-center px-1">
					{onRemove ? (
						<DeleteRowButton onRemove={onRemove} ariaLabel="Remover período" disabled={!editable} />
					) : null}
				</div>
			</div>

			<div className="flex w-full flex-col gap-2 border-t border-border p-2 lg:hidden">
				<div className="flex items-start gap-2">
					<div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
						<MobileEditableField label="Entrada">
							<EditableDateTimeCell
								value={row.entrada}
								ariaLabel="Editar entrada do período"
								editable={editable}
								onCommit={(entrada) => entrada && onUpdate({ entrada })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Saída">
							<EditableDateTimeCell
								value={row.saida}
								ariaLabel="Editar saída do período"
								editable={editable}
								onCommit={(saida) => saida && onUpdate({ saida })}
							/>
						</MobileEditableField>
					</div>
					{onRemove ? (
						<DeleteRowButton onRemove={onRemove} ariaLabel="Remover período" disabled={!editable} />
					) : null}
				</div>
				<MobileEditableField label={`Descrição · ${formatDurationMs(durationMs)}`}>
					<EditableTextCell
						value={row.anotacoes}
						ariaLabel="Editar descrição do período"
						emptyDisplay="Sem descrição"
						align="left"
						editable={editable}
						onCommit={(anotacoes) => onUpdate({ anotacoes })}
					/>
				</MobileEditableField>
			</div>
		</div>
	);
}

function DraftHistoryTableRow({
	gridRow,
	gridBounds,
	onAdd,
}: {
	gridRow: number;
	gridBounds: SpreadsheetGridBounds;
	onAdd: (entry: TServiceOrderPeriodHistoryEntry) => void;
}) {
	const [draft, setDraft] = useState<TServiceOrderPeriodHistoryEntry>(() => createEmptyHistoryEntry());

	function tryAdd(changes: Partial<TServiceOrderPeriodHistoryEntry>) {
		const next = { ...draft, ...changes };
		setDraft(next);
		if (isDraftReady(next)) {
			onAdd(next);
			setDraft(createEmptyHistoryEntry());
		}
	}

	return (
		<div className="border-t border-dashed border-border bg-muted/20">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="flex min-w-0 items-center gap-1 px-1">
					<Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<div className="min-w-0 flex-1">
						<EditableDateTimeCell
							value={draft.entrada}
							ariaLabel="Entrada do novo período"
							emptyDisplay="Entrada"
							gridRow={gridRow}
							gridCol={GRID_COL.ENTRADA}
							gridBounds={gridBounds}
							onCommit={(entrada) => entrada && tryAdd({ entrada })}
						/>
					</div>
				</div>
				<div className="min-w-0 px-1">
					<EditableDateTimeCell
						value={draft.saida}
						ariaLabel="Saída do novo período"
						emptyDisplay="Saída"
						gridRow={gridRow}
						gridCol={GRID_COL.SAIDA}
						gridBounds={gridBounds}
						onCommit={(saida) => saida && tryAdd({ saida })}
					/>
				</div>
				<div className="flex min-h-8 items-center justify-center px-1 text-muted-foreground">—</div>
				<div className="min-w-0 px-1">
					<EditableTextCell
						value={draft.anotacoes}
						ariaLabel="Descrição do novo período"
						emptyDisplay="Descrição (opcional)"
						align="left"
						gridRow={gridRow}
						gridCol={GRID_COL.DESCRICAO}
						gridBounds={gridBounds}
						onCommit={(anotacoes) => tryAdd({ anotacoes })}
					/>
				</div>
				<div className="min-w-0 px-1" />
			</div>

			<div className="flex w-full flex-col gap-2 border-t border-dashed border-border p-2 lg:hidden">
				<p className="text-[0.65rem] font-medium uppercase text-muted-foreground">Novo período</p>
				<div className="grid grid-cols-2 gap-2">
					<MobileEditableField label="Entrada">
						<EditableDateTimeCell
							value={draft.entrada}
							ariaLabel="Entrada do novo período"
							emptyDisplay="Entrada"
							onCommit={(entrada) => entrada && tryAdd({ entrada })}
						/>
					</MobileEditableField>
					<MobileEditableField label="Saída">
						<EditableDateTimeCell
							value={draft.saida}
							ariaLabel="Saída do novo período"
							emptyDisplay="Saída"
							onCommit={(saida) => saida && tryAdd({ saida })}
						/>
					</MobileEditableField>
				</div>
				<MobileEditableField label="Descrição">
					<EditableTextCell
						value={draft.anotacoes}
						ariaLabel="Descrição do novo período"
						emptyDisplay="Descrição (opcional)"
						align="left"
						onCommit={(anotacoes) => tryAdd({ anotacoes })}
					/>
				</MobileEditableField>
			</div>
		</div>
	);
}

function createEmptyHistoryEntry(): TServiceOrderPeriodHistoryEntry {
	const now = new Date().toISOString();
	return { anotacoes: "", entrada: now, saida: now };
}

function isDraftReady(row: TServiceOrderPeriodHistoryEntry) {
	return Boolean(row.entrada && row.saida);
}

function formatDateTimeAsShort(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}
