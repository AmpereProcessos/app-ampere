"use client";

import DeleteRowButton from "@/components/Spreadsheet/DeleteRowButton";
import EditableNumberCell from "@/components/Spreadsheet/EditableNumberCell";
import EditableTextCell from "@/components/Spreadsheet/EditableTextCell";
import MobileEditableField from "@/components/Spreadsheet/MobileEditableField";
import { cn } from "@/lib/utils";
import { SPREADSHEET_TABLE_ATTR, type SpreadsheetGridBounds } from "@/lib/spreadsheet-navigation";
import type { TServiceItem } from "@/utils/schemas/crm/kits.schema";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const SERVICE_GRID_COL = {
	DESCRIPTION: 0,
	NOTES: 1,
	WARRANTY: 2,
} as const;

const SERVICE_GRID_COL_COUNT = 3;

const TABLE_GRID_COLS =
	"grid-cols-[minmax(8rem,18fr)_minmax(8rem,18fr)_minmax(4.5rem,8fr)_minmax(2.5rem,4fr)]";

const DESKTOP_ROW = cn("hidden w-full min-w-[36rem] lg:grid", TABLE_GRID_COLS, "items-center gap-x-1 px-2");

type ProjectServicesSpreadsheetProps = {
	services: TServiceItem[];
	editable?: boolean;
	onAdd: (service: TServiceItem) => void;
	onUpdate: (index: number, changes: Partial<TServiceItem>) => void;
	onRemove: (index: number) => void;
};

export default function ProjectServicesSpreadsheet({
	services,
	editable = true,
	onAdd,
	onUpdate,
	onRemove,
}: ProjectServicesSpreadsheetProps) {
	const gridBounds: SpreadsheetGridBounds = useMemo(
		() => ({
			rowCount: services.length + (editable ? 1 : 0),
			colCount: SERVICE_GRID_COL_COUNT,
		}),
		[services.length, editable],
	);

	return (
		<div className="flex w-full flex-col gap-2 px-2">
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
						<p className="min-w-0 px-1 text-start">Descrição</p>
						<p className="min-w-0 px-1 text-center">Observações</p>
						<p className="min-w-0 px-1 text-center">Garantia (anos)</p>
						<p className="min-w-0 px-1 text-center">Ações</p>
					</div>

					<div className="flex w-full flex-col bg-background">
						{services.map((row, index) => (
							<ServiceTableRow
								key={`${row.descricao}-${index}`}
								row={row}
								gridRow={index}
								gridBounds={gridBounds}
								editable={editable}
								onUpdate={(changes) => onUpdate(index, changes)}
								onRemove={() => onRemove(index)}
							/>
						))}

						{editable ? (
							<DraftServiceTableRow gridRow={services.length} gridBounds={gridBounds} onAdd={onAdd} />
						) : null}

						{services.length === 0 ? (
							<div className="flex w-full items-center justify-center border-t border-border px-3 py-3">
								<p className="text-center text-xs font-medium tracking-tight text-muted-foreground">
									{editable
										? "Preencha a linha tracejada para incluir um serviço."
										: "Sem serviços adicionados."}
								</p>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

function ServiceTableRow({
	row,
	gridRow,
	gridBounds,
	editable = true,
	onUpdate,
	onRemove,
}: {
	row: TServiceItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (changes: Partial<TServiceItem>) => void;
	onRemove?: () => void;
}) {
	return (
		<div className="border-t border-border first:border-t-0">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<ServiceRowCells row={row} gridRow={gridRow} gridBounds={gridBounds} editable={editable} onUpdate={onUpdate} />
				<div className="flex min-w-0 justify-center px-1">
					{onRemove ? (
						<DeleteRowButton onRemove={onRemove} ariaLabel={`Remover ${row.descricao || "serviço"}`} disabled={!editable} />
					) : null}
				</div>
			</div>

			<div className="flex w-full flex-col gap-2 p-2 lg:hidden">
				<div className="flex items-start justify-between gap-2">
					<div className="grid min-w-0 flex-1 grid-cols-1 gap-2">
						<MobileEditableField label="Descrição">
							<EditableTextCell
								value={row.descricao}
								ariaLabel="Editar descrição"
								editable={editable}
								onCommit={(descricao) => onUpdate({ descricao })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Observações">
							<EditableTextCell
								value={row.observacoes}
								ariaLabel="Editar observações"
								editable={editable}
								emptyDisplay="-"
								onCommit={(observacoes) => onUpdate({ observacoes })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Garantia (anos)">
							<EditableNumberCell
								value={row.garantia}
								ariaLabel="Editar garantia"
								min={0}
								editable={editable}
								format={(v) => `${Math.round(v)}`}
								onCommit={(garantia) => onUpdate({ garantia: Math.round(garantia) })}
							/>
						</MobileEditableField>
					</div>
					{onRemove ? <DeleteRowButton onRemove={onRemove} disabled={!editable} /> : null}
				</div>
			</div>
		</div>
	);
}

function ServiceRowCells({
	row,
	gridRow,
	gridBounds,
	editable,
	onUpdate,
}: {
	row: TServiceItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (changes: Partial<TServiceItem>) => void;
}) {
	return (
		<>
			<div className="min-w-0 px-1">
				<EditableTextCell
					value={row.descricao}
					ariaLabel="Editar descrição do serviço"
					align="left"
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? SERVICE_GRID_COL.DESCRIPTION : undefined}
					gridBounds={gridBounds}
					onCommit={(descricao) => onUpdate({ descricao })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableTextCell
					value={row.observacoes}
					ariaLabel="Editar observações do serviço"
					align="center"
					editable={editable}
					emptyDisplay="-"
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? SERVICE_GRID_COL.NOTES : undefined}
					gridBounds={gridBounds}
					onCommit={(observacoes) => onUpdate({ observacoes })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableNumberCell
					value={row.garantia}
					ariaLabel="Editar garantia em anos"
					min={0}
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? SERVICE_GRID_COL.WARRANTY : undefined}
					gridBounds={gridBounds}
					format={(v) => `${Math.round(v)}`}
					onCommit={(garantia) => onUpdate({ garantia: Math.round(garantia) })}
				/>
			</div>
		</>
	);
}

function DraftServiceTableRow({
	gridRow,
	gridBounds,
	onAdd,
}: {
	gridRow: number;
	gridBounds: SpreadsheetGridBounds;
	onAdd: (service: TServiceItem) => void;
}) {
	const [draft, setDraft] = useState<TServiceItem>(createEmptyService);

	function updateDraft(changes: Partial<TServiceItem>) {
		const next = { ...draft, ...changes };
		const shouldTryAdd =
			("garantia" in changes || "observacoes" in changes) && next.descricao.trim().length >= 2 && next.garantia >= 0;
		if (shouldTryAdd && validateServiceDraft(next)) {
			onAdd(next);
			setDraft(createEmptyService());
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
						<EditableTextCell
							value={draft.descricao}
							ariaLabel="Descrição do novo serviço"
							align="left"
							gridRow={gridRow}
							gridCol={SERVICE_GRID_COL.DESCRIPTION}
							gridBounds={gridBounds}
							onCommit={(descricao) => updateDraft({ descricao })}
						/>
					</div>
				</div>
				<div className="min-w-0 px-1">
					<EditableTextCell
						value={draft.observacoes}
						ariaLabel="Observações do novo serviço"
						align="center"
						gridRow={gridRow}
						gridCol={SERVICE_GRID_COL.NOTES}
						gridBounds={gridBounds}
						emptyDisplay="-"
						onCommit={(observacoes) => updateDraft({ observacoes })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={draft.garantia}
						ariaLabel="Garantia do novo serviço"
						min={0}
						gridRow={gridRow}
						gridCol={SERVICE_GRID_COL.WARRANTY}
						gridBounds={gridBounds}
						format={(v) => `${Math.round(v)}`}
						onCommit={(garantia) => updateDraft({ garantia: Math.round(garantia) })}
					/>
				</div>
				<div aria-hidden className="min-w-0 px-1" />
			</div>

			<div className="flex w-full flex-col gap-2 p-2 lg:hidden">
				<div className="flex items-start gap-2">
					<Plus className="mt-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<div className="grid min-w-0 flex-1 grid-cols-1 gap-2">
						<MobileEditableField label="Descrição">
							<EditableTextCell
								value={draft.descricao}
								ariaLabel="Descrição do novo serviço"
								onCommit={(descricao) => updateDraft({ descricao })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Observações">
							<EditableTextCell
								value={draft.observacoes}
								ariaLabel="Observações do novo serviço"
								emptyDisplay="-"
								onCommit={(observacoes) => updateDraft({ observacoes })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Garantia (anos)">
							<EditableNumberCell
								value={draft.garantia}
								ariaLabel="Garantia do novo serviço"
								min={0}
								format={(v) => `${Math.round(v)}`}
								onCommit={(garantia) => updateDraft({ garantia: Math.round(garantia) })}
							/>
						</MobileEditableField>
					</div>
				</div>
			</div>
		</div>
	);
}

function createEmptyService(): TServiceItem {
	return {
		descricao: "",
		observacoes: "",
		garantia: 0,
	};
}

function validateServiceDraft(row: TServiceItem) {
	if (row.descricao.trim().length < 2) {
		toast.error("Preencha uma descrição de serviço válida.");
		return false;
	}
	if (row.garantia < 0) {
		toast.error("Preencha uma garantia válida.");
		return false;
	}
	return true;
}
