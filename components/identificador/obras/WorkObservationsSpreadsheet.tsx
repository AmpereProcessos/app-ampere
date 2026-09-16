"use client";

import DeleteRowButton from "@/components/Spreadsheet/DeleteRowButton";
import EditableTextCell from "@/components/Spreadsheet/EditableTextCell";
import MobileEditableField from "@/components/Spreadsheet/MobileEditableField";
import { cn } from "@/lib/utils";
import { SPREADSHEET_TABLE_ATTR, type SpreadsheetGridBounds } from "@/lib/spreadsheet-navigation";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const OBSERVATION_GRID_COL = { TEXT: 0 } as const;
const OBSERVATION_GRID_COL_COUNT = 1;

const TABLE_GRID_COLS = "grid-cols-[minmax(0,1fr)_minmax(2.5rem,4rem)]";
const DESKTOP_ROW = cn("hidden w-full md:grid", TABLE_GRID_COLS, "items-center gap-x-1 px-2");

export function getObservationsAsList(str: string) {
	if (!str) return [];
	return str.split("/").filter((item) => item.length > 0);
}

export function joinObservations(observations: string[]) {
	return observations.filter((item) => item.trim().length > 0).join("/");
}

type WorkObservationsSpreadsheetProps = {
	observations: string[];
	editable?: boolean;
	onAdd: (observation: string) => void;
	onUpdate: (index: number, observation: string) => void;
	onRemove: (index: number) => void;
};

export default function WorkObservationsSpreadsheet({
	observations,
	editable = true,
	onAdd,
	onUpdate,
	onRemove,
}: WorkObservationsSpreadsheetProps) {
	const gridBounds: SpreadsheetGridBounds = useMemo(
		() => ({
			rowCount: observations.length + (editable ? 1 : 0),
			colCount: OBSERVATION_GRID_COL_COUNT,
		}),
		[observations.length, editable],
	);

	return (
		<div className="flex w-full min-w-0 flex-col gap-2">
			<div className="w-full min-w-0 overflow-x-auto">
				<div
					{...{ [SPREADSHEET_TABLE_ATTR]: "true" }}
					className="flex w-full min-w-full flex-col overflow-hidden rounded-md border border-border bg-background"
				>
					<div
						className={cn(
							DESKTOP_ROW,
							"min-h-9 border-b border-border bg-muted/60 py-1.5 text-[0.68rem] font-medium uppercase text-muted-foreground",
						)}
					>
						<p className="min-w-0 px-1 text-start">Observação</p>
						<p className="min-w-0 px-1 text-center">Ações</p>
					</div>

					<div className="flex w-full flex-col bg-background">
						{observations.map((observation, index) => (
							<ObservationTableRow
								key={`${index}-${observation.slice(0, 24)}`}
								observation={observation}
								gridRow={index}
								gridBounds={gridBounds}
								editable={editable}
								onUpdate={(value) => onUpdate(index, value)}
								onRemove={() => onRemove(index)}
							/>
						))}

						{editable ? (
							<DraftObservationTableRow gridRow={observations.length} gridBounds={gridBounds} onAdd={onAdd} />
						) : null}

						{observations.length === 0 ? (
							<div className="flex w-full items-center justify-center border-t border-border px-3 py-4">
								<p className="text-center text-xs font-medium italic tracking-tight text-muted-foreground">
									{editable
										? "Preencha a linha tracejada para incluir uma observação."
										: "Nenhuma observação adicionada."}
								</p>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

function ObservationTableRow({
	observation,
	gridRow,
	gridBounds,
	editable = true,
	onUpdate,
	onRemove,
}: {
	observation: string;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (value: string) => void;
	onRemove?: () => void;
}) {
	function commitObservation(value: string) {
		if (value.trim().length === 0) {
			toast.error("Preencha uma observação válida.");
			return;
		}
		onUpdate(value);
	}

	return (
		<div className="w-full border-t border-border first:border-t-0">
			<div className={cn(DESKTOP_ROW, "min-h-11 w-full py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="min-w-0 w-full px-1">
					<EditableTextCell
						value={observation}
						ariaLabel="Editar observação de obra"
						align="left"
						editable={editable}
						gridRow={gridRow}
						gridCol={gridRow !== undefined ? OBSERVATION_GRID_COL.TEXT : undefined}
						gridBounds={gridBounds}
						validate={(value) => value.trim().length > 0}
						onCommit={commitObservation}
					/>
				</div>
				<div className="flex min-w-0 justify-center px-1">
					{onRemove ? (
						<DeleteRowButton onRemove={onRemove} ariaLabel="Remover observação" disabled={!editable} />
					) : null}
				</div>
			</div>

			<div className="flex w-full flex-col gap-2 p-2 md:hidden">
				<div className="flex items-start justify-between gap-2">
					<MobileEditableField label="Observação">
						<EditableTextCell
							value={observation}
							ariaLabel="Editar observação de obra"
							editable={editable}
							validate={(value) => value.trim().length > 0}
							onCommit={commitObservation}
						/>
					</MobileEditableField>
					{onRemove ? <DeleteRowButton onRemove={onRemove} disabled={!editable} /> : null}
				</div>
			</div>
		</div>
	);
}

function DraftObservationTableRow({
	gridRow,
	gridBounds,
	onAdd,
}: {
	gridRow: number;
	gridBounds: SpreadsheetGridBounds;
	onAdd: (observation: string) => void;
}) {
	const [draft, setDraft] = useState("");

	function commitDraft(value: string) {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			toast.error("Preencha uma observação válida.");
			return;
		}
		onAdd(trimmed);
		setDraft("");
	}

	return (
		<div className="w-full border-t border-dashed border-border bg-muted/20">
			<div className={cn(DESKTOP_ROW, "min-h-11 w-full py-1 text-xs transition-colors hover:bg-muted/40")}>
				<div className="flex min-w-0 items-center gap-1 px-1">
					<Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<div className="min-w-0 flex-1">
						<EditableTextCell
							value={draft}
							ariaLabel="Nova observação de obra"
							align="left"
							gridRow={gridRow}
							gridCol={OBSERVATION_GRID_COL.TEXT}
							gridBounds={gridBounds}
							emptyDisplay=""
							onCommit={commitDraft}
						/>
					</div>
				</div>
				<div aria-hidden className="min-w-0 px-1" />
			</div>

			<div className="flex w-full flex-col gap-2 p-2 md:hidden">
				<div className="flex items-start gap-2">
					<Plus className="mt-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
					<MobileEditableField label="Nova observação">
						<EditableTextCell
							value={draft}
							ariaLabel="Nova observação de obra"
							emptyDisplay=""
							onCommit={commitDraft}
						/>
					</MobileEditableField>
				</div>
			</div>
		</div>
	);
}
