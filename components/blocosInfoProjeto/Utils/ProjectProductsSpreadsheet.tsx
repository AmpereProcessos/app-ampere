"use client";

import DeleteRowButton from "@/components/Spreadsheet/DeleteRowButton";
import EditableNumberCell from "@/components/Spreadsheet/EditableNumberCell";
import EditableTextCell from "@/components/Spreadsheet/EditableTextCell";
import MobileEditableField from "@/components/Spreadsheet/MobileEditableField";
import SpreadsheetCellWrapper from "@/components/Spreadsheet/SpreadsheetCellWrapper";
import SelectInput from "@/components/inputs/Select";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import { cn } from "@/lib/utils";
import {
	consumeProgrammaticSpreadsheetFocus,
	handleSpreadsheetNavigationKeyDown,
	SPREADSHEET_TABLE_ATTR,
	type SpreadsheetGridBounds,
} from "@/lib/spreadsheet-navigation";
import { useEquipments } from "@/utils/methods/query/crm/equipments";
import type { TEquipmentDTO } from "@/utils/schemas/crm/equipments";
import type { TProductItem } from "@/utils/schemas/crm/kits.schema";
import { ProductItemCategories } from "@/utils/select-options";
import { Plus } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";
import toast from "react-hot-toast";

const PRODUCT_GRID_COL = {
	CATEGORY: 0,
	CATALOG: 1,
	MANUFACTURER: 2,
	MODEL: 3,
	QTY: 4,
	POWER: 5,
	WARRANTY: 6,
} as const;

const PRODUCT_GRID_COL_COUNT = 7;

const TABLE_GRID_COLS =
	"grid-cols-[minmax(6.5rem,10fr)_minmax(9rem,16fr)_minmax(5.5rem,10fr)_minmax(7rem,14fr)_minmax(3.5rem,6fr)_minmax(4.5rem,7fr)_minmax(4rem,6fr)_minmax(2.5rem,4fr)]";

const DESKTOP_ROW = cn("hidden w-full min-w-[56rem] lg:grid", TABLE_GRID_COLS, "items-center gap-x-1 px-2");

const CELL_TRIGGER_CLASSNAME =
	"h-8 min-h-8 justify-between rounded-md border-transparent bg-transparent px-2 py-0 text-xs font-medium shadow-none hover:border-border hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/40";

type ProjectProductsSpreadsheetProps = {
	products: TProductItem[];
	editable?: boolean;
	onAdd: (product: TProductItem) => void;
	onUpdate: (index: number, changes: Partial<TProductItem>) => void;
	onRemove: (index: number) => void;
};

export function sortProjectProducts(products: TProductItem[]) {
	return [...products].sort((a, b) => a.categoria.localeCompare(b.categoria));
}

export default function ProjectProductsSpreadsheet({
	products,
	editable = true,
	onAdd,
	onUpdate,
	onRemove,
}: ProjectProductsSpreadsheetProps) {
	const { data: equipments } = useEquipments({ category: null });
	const gridBounds: SpreadsheetGridBounds = useMemo(
		() => ({
			rowCount: products.length + (editable ? 1 : 0),
			colCount: PRODUCT_GRID_COL_COUNT,
		}),
		[products.length, editable],
	);

	const totalQty = products.reduce((sum, row) => sum + (row.qtde || 0), 0);

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
						<p className="min-w-0 px-1 text-start">Categoria</p>
						<p className="min-w-0 px-1 text-center">Catálogo</p>
						<p className="min-w-0 px-1 text-center">Fabricante</p>
						<p className="min-w-0 px-1 text-center">Modelo</p>
						<p className="min-w-0 px-1 text-center">Qtde</p>
						<p className="min-w-0 px-1 text-center">Potência (W)</p>
						<p className="min-w-0 px-1 text-center">Garantia</p>
						<p className="min-w-0 px-1 text-center">Ações</p>
					</div>

					<div className="flex w-full flex-col bg-background">
						{products.map((row, index) => (
							<ProductTableRow
								key={`${row.categoria}-${row.modelo}-${index}`}
								row={row}
								gridRow={index}
								gridBounds={gridBounds}
								equipments={equipments ?? []}
								editable={editable}
								onUpdate={(changes) => onUpdate(index, changes)}
								onRemove={() => onRemove(index)}
							/>
						))}

						{editable ? (
							<DraftProductTableRow
								gridRow={products.length}
								gridBounds={gridBounds}
								equipments={equipments ?? []}
								onAdd={onAdd}
							/>
						) : null}

						{products.length === 0 ? (
							<div className="flex w-full items-center justify-center border-t border-border px-3 py-3">
								<p className="text-center text-xs font-medium tracking-tight text-muted-foreground">
									{editable
										? "Preencha a linha tracejada para incluir um produto."
										: "Sem produtos adicionados."}
								</p>
							</div>
						) : null}
					</div>
				</div>
			</div>
			{products.length > 0 ? (
				<p className="px-1 text-xs text-muted-foreground">Total {totalQty} unidade(s) em {products.length} item(ns)</p>
			) : null}
		</div>
	);
}

type RowProps = {
	row: TProductItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	equipments: TEquipmentDTO[];
	editable?: boolean;
	onUpdate: (changes: Partial<TProductItem>) => void;
	onRemove?: () => void;
};

function ProductTableRow({ row, gridRow, gridBounds, equipments, editable = true, onUpdate, onRemove }: RowProps) {
	return (
		<div className="border-t border-border first:border-t-0">
			<div className={cn(DESKTOP_ROW, "min-h-11 py-1 text-xs transition-colors hover:bg-muted/40")}>
				<ProductRowCells
					row={row}
					gridRow={gridRow}
					gridBounds={gridBounds}
					equipments={equipments}
					editable={editable}
					onUpdate={onUpdate}
				/>
				<div className="flex min-w-0 justify-center px-1">
					{onRemove ? (
						<DeleteRowButton onRemove={onRemove} ariaLabel={`Remover ${row.modelo || "produto"}`} disabled={!editable} />
					) : null}
				</div>
			</div>

			<div className="flex w-full flex-col gap-2 p-2 lg:hidden">
				<div className="flex items-start justify-between gap-2">
					<div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
						<MobileEditableField label="Categoria">
							<CategoryCell row={row} editable={editable} onUpdate={onUpdate} />
						</MobileEditableField>
						<MobileEditableField label="Catálogo">
							<CatalogCell row={row} equipments={equipments} editable={editable} onUpdate={onUpdate} />
						</MobileEditableField>
						<MobileEditableField label="Fabricante">
							<EditableTextCell
								value={row.fabricante}
								ariaLabel="Editar fabricante"
								editable={editable}
								onCommit={(fabricante) => onUpdate({ fabricante })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Modelo">
							<EditableTextCell
								value={row.modelo}
								ariaLabel="Editar modelo"
								editable={editable}
								onCommit={(modelo) => onUpdate({ modelo })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Qtde">
							<EditableNumberCell
								value={row.qtde}
								ariaLabel="Editar quantidade"
								min={1}
								editable={editable}
								format={(v) => String(Math.round(v))}
								onCommit={(qtde) => onUpdate({ qtde: Math.max(1, Math.round(qtde)) })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Potência (W)">
							<EditableNumberCell
								value={row.potencia ?? 0}
								ariaLabel="Editar potência"
								min={0}
								editable={editable}
								onCommit={(potencia) => onUpdate({ potencia })}
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

function ProductRowCells({
	row,
	gridRow,
	gridBounds,
	equipments,
	editable,
	onUpdate,
}: {
	row: TProductItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	equipments: TEquipmentDTO[];
	editable?: boolean;
	onUpdate: (changes: Partial<TProductItem>) => void;
}) {
	return (
		<>
			<div className="min-w-0 px-1">
				<CategoryCell row={row} gridRow={gridRow} gridBounds={gridBounds} editable={editable} onUpdate={onUpdate} />
			</div>
			<div className="min-w-0 px-1">
				<CatalogCell
					row={row}
					gridRow={gridRow}
					gridBounds={gridBounds}
					equipments={equipments}
					editable={editable}
					onUpdate={onUpdate}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableTextCell
					value={row.fabricante}
					ariaLabel="Editar fabricante do produto"
					align="center"
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? PRODUCT_GRID_COL.MANUFACTURER : undefined}
					gridBounds={gridBounds}
					onCommit={(fabricante) => onUpdate({ fabricante })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableTextCell
					value={row.modelo}
					ariaLabel="Editar modelo do produto"
					align="center"
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? PRODUCT_GRID_COL.MODEL : undefined}
					gridBounds={gridBounds}
					onCommit={(modelo) => onUpdate({ modelo })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableNumberCell
					value={row.qtde}
					ariaLabel="Editar quantidade"
					min={1}
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? PRODUCT_GRID_COL.QTY : undefined}
					gridBounds={gridBounds}
					format={(v) => String(Math.round(v))}
					onCommit={(qtde) => onUpdate({ qtde: Math.max(1, Math.round(qtde)) })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableNumberCell
					value={row.potencia ?? 0}
					ariaLabel="Editar potência em watts"
					min={0}
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? PRODUCT_GRID_COL.POWER : undefined}
					gridBounds={gridBounds}
					emptyDisplay="-"
					onCommit={(potencia) => onUpdate({ potencia })}
				/>
			</div>
			<div className="min-w-0 px-1">
				<EditableNumberCell
					value={row.garantia}
					ariaLabel="Editar garantia em anos"
					min={0}
					editable={editable}
					gridRow={gridRow}
					gridCol={gridRow !== undefined ? PRODUCT_GRID_COL.WARRANTY : undefined}
					gridBounds={gridBounds}
					format={(v) => `${Math.round(v)}`}
					onCommit={(garantia) => onUpdate({ garantia: Math.round(garantia) })}
				/>
			</div>
		</>
	);
}

function DraftProductTableRow({
	gridRow,
	gridBounds,
	equipments,
	onAdd,
}: {
	gridRow: number;
	gridBounds: SpreadsheetGridBounds;
	equipments: TEquipmentDTO[];
	onAdd: (product: TProductItem) => void;
}) {
	const [draft, setDraft] = useState<TProductItem>(createEmptyProduct);

	function updateDraft(changes: Partial<TProductItem>) {
		const next = { ...draft, ...changes };
		if (isProductDraftReady(next)) {
			if (!validateProductDraft(next)) {
				setDraft(next);
				return;
			}
			onAdd(next);
			setDraft(createEmptyProduct());
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
						<CategoryCell row={draft} gridRow={gridRow} gridBounds={gridBounds} onUpdate={updateDraft} />
					</div>
				</div>
				<div className="min-w-0 px-1">
					<CatalogCell
						row={draft}
						gridRow={gridRow}
						gridBounds={gridBounds}
						equipments={equipments}
						onUpdate={updateDraft}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableTextCell
						value={draft.fabricante}
						ariaLabel="Fabricante do novo produto"
						align="center"
						gridRow={gridRow}
						gridCol={PRODUCT_GRID_COL.MANUFACTURER}
						gridBounds={gridBounds}
						onCommit={(fabricante) => updateDraft({ fabricante })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableTextCell
						value={draft.modelo}
						ariaLabel="Modelo do novo produto"
						align="center"
						gridRow={gridRow}
						gridCol={PRODUCT_GRID_COL.MODEL}
						gridBounds={gridBounds}
						onCommit={(modelo) => updateDraft({ modelo })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={draft.qtde}
						ariaLabel="Quantidade do novo produto"
						min={1}
						gridRow={gridRow}
						gridCol={PRODUCT_GRID_COL.QTY}
						gridBounds={gridBounds}
						format={(v) => String(Math.round(v))}
						onCommit={(qtde) => updateDraft({ qtde: Math.max(1, Math.round(qtde)) })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={draft.potencia ?? 0}
						ariaLabel="Potência do novo produto"
						min={0}
						gridRow={gridRow}
						gridCol={PRODUCT_GRID_COL.POWER}
						gridBounds={gridBounds}
						emptyDisplay="-"
						onCommit={(potencia) => updateDraft({ potencia })}
					/>
				</div>
				<div className="min-w-0 px-1">
					<EditableNumberCell
						value={draft.garantia}
						ariaLabel="Garantia do novo produto"
						min={0}
						gridRow={gridRow}
						gridCol={PRODUCT_GRID_COL.WARRANTY}
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
					<div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
						<MobileEditableField label="Categoria">
							<CategoryCell row={draft} onUpdate={updateDraft} />
						</MobileEditableField>
						<MobileEditableField label="Catálogo">
							<CatalogCell row={draft} equipments={equipments} onUpdate={updateDraft} />
						</MobileEditableField>
						<MobileEditableField label="Fabricante">
							<EditableTextCell
								value={draft.fabricante}
								ariaLabel="Fabricante do novo produto"
								onCommit={(fabricante) => updateDraft({ fabricante })}
							/>
						</MobileEditableField>
						<MobileEditableField label="Modelo">
							<EditableTextCell
								value={draft.modelo}
								ariaLabel="Modelo do novo produto"
								onCommit={(modelo) => updateDraft({ modelo })}
							/>
						</MobileEditableField>
					</div>
				</div>
			</div>
		</div>
	);
}

function CategoryCell({
	row,
	gridRow,
	gridBounds,
	editable = true,
	onUpdate,
}: {
	row: TProductItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	editable?: boolean;
	onUpdate: (changes: Partial<TProductItem>) => void;
}) {
	const { triggerProps, hasGridNavigation } = getGridTriggerProps({
		gridRow,
		gridCol: PRODUCT_GRID_COL.CATEGORY,
		gridBounds,
	});

	const select = (
		<SelectInput
			label="Categoria do produto"
			showLabel={false}
			width="100%"
			editable={editable}
			selectedItemLabel="Categoria"
			options={ProductItemCategories}
			value={row.categoria}
			holderClassName={CELL_TRIGGER_CLASSNAME}
			triggerProps={triggerProps}
			handleChange={(categoria) => onUpdate({ categoria, id: null })}
			onReset={() => onUpdate({ categoria: "OUTROS", id: null })}
		/>
	);

	if (!hasGridNavigation || gridRow === undefined) return select;

	return (
		<SpreadsheetCellWrapper gridRow={gridRow} gridCol={PRODUCT_GRID_COL.CATEGORY}>
			{select}
		</SpreadsheetCellWrapper>
	);
}

function CatalogCell({
	row,
	gridRow,
	gridBounds,
	equipments,
	editable = true,
	onUpdate,
}: {
	row: TProductItem;
	gridRow?: number;
	gridBounds?: SpreadsheetGridBounds;
	equipments: TEquipmentDTO[];
	editable?: boolean;
	onUpdate: (changes: Partial<TProductItem>) => void;
}) {
	const { triggerProps, hasGridNavigation } = getGridTriggerProps({
		gridRow,
		gridCol: PRODUCT_GRID_COL.CATALOG,
		gridBounds,
	});

	const catalogCategory = row.categoria === "MÓDULO" || row.categoria === "INVERSOR" ? row.categoria : null;
	const options = useMemo(
		() =>
			equipments
				.filter((e) => e.categoria === catalogCategory)
				.map((equipment) => ({
					id: equipment._id,
					label: `${equipment.fabricante} - ${equipment.modelo}`,
					value: equipment,
				})),
		[equipments, catalogCategory],
	);

	const selectedEquipment =
		equipments.find((e) => e._id === row.id && e.categoria === row.categoria) ?? null;

	if (!catalogCategory) {
		return (
			<div className="flex h-8 items-center justify-center rounded-md px-2 text-xs text-muted-foreground">—</div>
		);
	}

	const select = (
		<SelectVirtualizedInput
			label="Equipamento do catálogo"
			showLabel={false}
			width="100%"
			editable={editable}
			selectedItemLabel="Selecionar"
			options={options}
			value={selectedEquipment}
			holderClassName={CELL_TRIGGER_CLASSNAME}
			triggerProps={triggerProps}
			handleChange={(equipment) =>
				onUpdate({
					id: equipment._id,
					fabricante: equipment.fabricante,
					modelo: equipment.modelo,
					potencia: equipment.potencia ?? 0,
					garantia: equipment.garantia ?? row.garantia,
				})
			}
			onReset={() => onUpdate({ id: null })}
		/>
	);

	if (!hasGridNavigation || gridRow === undefined) return select;

	return (
		<SpreadsheetCellWrapper gridRow={gridRow} gridCol={PRODUCT_GRID_COL.CATALOG}>
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

function createEmptyProduct(): TProductItem {
	return {
		id: null,
		categoria: "OUTROS",
		fabricante: "",
		modelo: "",
		qtde: 1,
		potencia: 0,
		garantia: 10,
	};
}

function isProductDraftReady(row: TProductItem) {
	return row.fabricante.trim().length >= 3 && row.modelo.trim().length >= 3 && row.qtde > 0;
}

function validateProductDraft(row: TProductItem) {
	if (row.fabricante.trim().length < 3) {
		toast.error("Fabricante do produto não especificado.");
		return false;
	}
	if (row.modelo.trim().length < 3) {
		toast.error("Modelo do produto não especificado.");
		return false;
	}
	if (row.qtde <= 0) {
		toast.error("Quantidade do produto inválida.");
		return false;
	}
	return true;
}
