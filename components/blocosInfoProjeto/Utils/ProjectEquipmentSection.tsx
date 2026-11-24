"use client";

import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { getProductOrigin, getProjectEquipmentForOrigin, isMaintenanceService, normalizeSystemTopology } from "@/lib/projects/equipment";
import type { TProductItem, TProductOrigin } from "@/utils/schemas/crm/kits.schema";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { cn } from "@/lib/utils";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import { ArrowRightLeft, Cable, ChevronDown, History, House, Info, Pencil, Plus, ShoppingCart, Sun, TriangleAlert, Zap } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import ProjectProductsSpreadsheet from "./ProjectProductsSpreadsheet";

type LegacyChanges = { sistema: Partial<TProjectDTO["sistema"]>; oem?: Partial<TProjectDTO["oem"]> };
type Props = {
	project: TProjectDTO;
	editable: boolean;
	onProductsChange: (updater: (items: TProductItem[]) => TProductItem[]) => void;
	onLegacyChange: (changes: LegacyChanges) => void;
};

const groups: { origin: TProductOrigin; title: string; description: string; addLabel: string; icon: typeof House; tone: string }[] = [
	{
		origin: "EXISTENTE",
		icon: House,
		tone: "bg-muted text-foreground",
		title: "Equipamentos do cliente",
		description: "Equipamentos que o cliente já possui, utilizados nos serviços de O&M.",
		addLabel: "Adicionar equipamento do cliente",
	},
	{
		origin: "VENDA",
		icon: ShoppingCart,
		tone: "bg-primary/10 text-primary",
		title: "Produtos vendidos neste projeto",
		description: "Itens fornecidos por este projeto, separados dos equipamentos existentes.",
		addLabel: "Adicionar produto à venda",
	},
];
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const MISSING = "Não informado";
const knownQuantity = (value: number) => (value > 0 ? number.format(value) : MISSING);

function SummaryItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
	const missing = value === MISSING;
	return (
		<div className="min-w-0">
			<dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
				<span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center [&_svg]:h-3.5 [&_svg]:w-3.5" aria-hidden="true">
					{icon}
				</span>
				{label}
			</dt>
			<dd className={cn("mt-1 text-sm tabular-nums", missing ? "text-muted-foreground font-normal" : "text-foreground font-semibold")}>{value}</dd>
		</div>
	);
}

export default function ProjectEquipmentSection({ project, editable, onProductsChange, onLegacyChange }: Props) {
	const id = useId();
	const [editingOrigin, setEditingOrigin] = useState<TProductOrigin | null>(null);
	const [editingLegacy, setEditingLegacy] = useState(false);
	const [editingTopology, setEditingTopology] = useState(false);
	const [move, setMove] = useState<{ index: number; item: TProductItem; target: TProductOrigin } | null>(null);
	const [announcement, setAnnouncement] = useState("");
	const groupRefs = useRef<Partial<Record<TProductOrigin, HTMLHeadingElement | null>>>({});
	const maintenance = isMaintenanceService(project.tipoDeServico);
	const legacyOrigin = maintenance ? "EXISTENTE" : "VENDA";
	const legacyEquipment = getProjectEquipmentForOrigin(project, legacyOrigin);
	const items = project.produtos ?? [];
	const legacyItems = items.filter((item) => getProductOrigin(item) === legacyOrigin);
	const hasModuleItems = legacyItems.some((item) => item.categoria === "MÓDULO" && item.qtde > 0);
	const hasInverterItems = legacyItems.some((item) => item.categoria === "INVERSOR" && item.qtde > 0);
	const topology = normalizeSystemTopology(project.sistema?.topologia);
	const canEditLegacy = !hasModuleItems || !hasInverterItems || !legacyEquipment.derived.modulePower || !legacyEquipment.derived.peakPower;

	function confirmMove() {
		if (!editable || !move) return;
		onProductsChange((current) => current.map((item, index) => (index === move.index && item === move.item ? { ...item, origem: move.target } : item)));
		setEditingOrigin(move.target);
		setAnnouncement(
			`Classificação alterada para ${groups.find((group) => group.origin === move.target)?.title}. Salve as alterações do projeto para concluir.`,
		);
		const target = move.target;
		setMove(null);
		requestAnimationFrame(() => groupRefs.current[target]?.focus());
	}

	return (
		<div className="flex min-w-0 flex-col gap-6 px-2">
			<div className="border-border flex flex-wrap items-center justify-between gap-3 border-b pb-4">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground flex items-center gap-1.5 text-sm">
						<Cable className="h-4 w-4" aria-hidden="true" />
						Topologia do sistema
					</span>
					{topology ? <strong className="text-sm font-semibold">{topology}</strong> : <span className="text-muted-foreground text-sm">{MISSING}</span>}
				</div>
				{editable ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						aria-expanded={editingTopology}
						aria-controls={`${id}-topology`}
						onClick={() => setEditingTopology(!editingTopology)}
					>
						<Pencil className="mr-2 h-4 w-4" />
						{editingTopology ? "Fechar edição da topologia" : "Editar topologia"}
					</Button>
				) : null}
			</div>
			{editable && editingTopology ? (
				<div id={`${id}-topology`} className="max-w-sm">
					<SelectInput
						label="Topologia do sistema"
						value={normalizeSystemTopology(project.sistema?.topologia)}
						options={[
							{ id: 1, label: "INVERSOR", value: "INVERSOR" },
							{ id: 2, label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
							{ id: 3, label: "OTIMIZADOR", value: "OTIMIZADOR" },
						]}
						selectedItemLabel="Não informado"
						handleChange={(value) => onLegacyChange({ sistema: { topologia: normalizeSystemTopology(value) } })}
						onReset={() => onLegacyChange({ sistema: { topologia: null } })}
						width="100%"
					/>
				</div>
			) : null}

			{groups.map((group) => {
				const rows = items.map((item, index) => ({ item, index })).filter(({ item }) => getProductOrigin(item) === group.origin);
				const equipment = getProjectEquipmentForOrigin(project, group.origin);
				const editing = editable && editingOrigin === group.origin;
				const hasSummary =
					rows.length > 0 ||
					equipment.modulos.qtde > 0 ||
					equipment.inversor.qtde > 0 ||
					equipment.potPico > 0 ||
					Boolean(equipment.modulos.potencia) ||
					Boolean(equipment.inversorDescricao);
				const usesLegacy =
					hasSummary &&
					((!rows.some(({ item }) => item.categoria === "MÓDULO") && equipment.modulos.qtde > 0) ||
						(!rows.some(({ item }) => item.categoria === "INVERSOR") && equipment.inversor.qtde > 0) ||
						(!equipment.derived.modulePower && Boolean(equipment.modulos.potencia)) ||
						(!equipment.derived.peakPower && equipment.potPico > 0) ||
						(!rows.some(({ item }) => item.categoria === "INVERSOR") && Boolean(equipment.inversorDescricao)));
				const GroupIcon = group.icon;
				// O&M service orders take the module count from the client's equipment, so a missing count is this view's one attention item.
				const missingMaintenanceModules = maintenance && group.origin === "EXISTENTE" && equipment.modulos.qtde <= 0;
				return (
					<section key={group.origin} aria-labelledby={`${id}-${group.origin}`} className="border-border min-w-0 border-b pb-6 last:border-b-0 last:pb-0">
						<div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
							<div className="flex min-w-0 flex-1 items-start gap-3">
								<span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", group.tone)} aria-hidden="true">
									<GroupIcon className="h-4 w-4" />
								</span>
								<div className="min-w-0">
									<h3
										id={`${id}-${group.origin}`}
										ref={(element) => {
											groupRefs.current[group.origin] = element;
										}}
										tabIndex={-1}
										className="focus-visible:ring-ring w-fit rounded text-base font-semibold focus-visible:ring-2 focus-visible:outline-none"
									>
										{group.title}
									</h3>
									<p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
								</div>
							</div>
							{editable ? (
								<Button
									type="button"
									variant={editing ? "secondary" : "outline"}
									size="sm"
									aria-expanded={editing}
									aria-controls={`${id}-${group.origin}-items`}
									onClick={() => setEditingOrigin(editing ? null : group.origin)}
								>
									{editing ? (
										"Concluir edição dos itens"
									) : rows.length ? (
										<>
											<Pencil className="mr-2 h-4 w-4" />
											Editar equipamentos
										</>
									) : (
										<>
											<Plus className="mr-2 h-4 w-4" />
											{group.addLabel}
										</>
									)}
								</Button>
							) : null}
						</div>
						{hasSummary ? (
							<dl className="my-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
								<SummaryItem
									icon={renderProductCategoryIcon("MÓDULO")}
									label={group.origin === "EXISTENTE" ? "Módulos no sistema" : "Módulos na venda"}
									value={knownQuantity(equipment.modulos.qtde)}
								/>
								<SummaryItem icon={<Zap />} label="Potência dos módulos" value={equipment.modulos.potencia ? `${equipment.modulos.potencia} W` : MISSING} />
								<SummaryItem icon={<Sun />} label="Potência pico" value={equipment.potPico > 0 ? `${number.format(equipment.potPico)} kWp` : MISSING} />
								<SummaryItem
									icon={renderProductCategoryIcon("INVERSOR")}
									label="Inversores"
									value={
										equipment.inversor.qtde > 0 && equipment.inversor.potencia
											? `${knownQuantity(equipment.inversor.qtde)} · ${equipment.inversor.potencia} W`
											: knownQuantity(equipment.inversor.qtde)
									}
								/>
							</dl>
						) : null}
						{missingMaintenanceModules ? (
							<div role="note" className="border-accent-amber/60 bg-accent-amber/10 mt-4 flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm">
								<TriangleAlert className="dark:text-accent-amber mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
								<div className="min-w-0">
									<p className="font-medium">Quantidade de módulos não informada</p>
									<p className="text-muted-foreground mt-0.5">
										As ordens de manutenção deste projeto usam essa quantidade. Detalhe os módulos do cliente ou informe o número de módulos.
									</p>
									{editable && canEditLegacy && !editingLegacy ? (
										<Button
											type="button"
											variant="link"
											size="sm"
											className="mt-1 h-auto px-0"
											aria-controls={`${id}-legacy`}
											onClick={() => setEditingLegacy(true)}
										>
											Informar número de módulos
										</Button>
									) : null}
								</div>
							</div>
						) : null}
						{usesLegacy ? (
							<p className="text-muted-foreground mt-3 flex items-start gap-1.5 text-xs">
								<History className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
								<span>
									Dados do cadastro anterior
									{rows.length ? ", complementados pelos equipamentos detalhados." : ". Você pode mantê-los sem detalhar os equipamentos."}
								</span>
							</p>
						) : null}
						{!rows.some(({ item }) => item.categoria === "INVERSOR") && equipment.inversorDescricao ? (
							<p className="mt-3 flex items-start gap-1.5 text-sm break-words">
								<span className="text-muted-foreground mt-0.5 shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5" aria-hidden="true">
									{renderProductCategoryIcon("INVERSOR")}
								</span>
								<span className="min-w-0">
									<span className="text-muted-foreground">Inversores cadastrados: </span>
									{equipment.inversorDescricao}
								</span>
							</p>
						) : null}
						{!rows.length && !editing ? (
							<p className="text-muted-foreground mt-4 text-sm">
								{hasSummary
									? "Equipamentos ainda não detalhados."
									: group.origin === "EXISTENTE"
										? "Nenhum equipamento do cliente informado."
										: "Nenhum produto à venda informado neste projeto."}
							</p>
						) : null}
						{rows.length || editing ? (
							<div id={`${id}-${group.origin}-items`} className="mt-4">
								{editing && usesLegacy ? (
									<p className="text-muted-foreground mb-3 flex items-start gap-1.5 text-sm">
										<Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
										Ao detalhar módulos ou inversores, inclua todos os itens dessa categoria. O resumo passará a usar as quantidades da tabela.
									</p>
								) : null}
								<ProjectProductsSpreadsheet
									explicitAdd
									products={rows.map(({ item }) => item)}
									editable={editing}
									onAdd={(item) => onProductsChange((current) => [...current, { ...item, origem: group.origin }])}
									onUpdate={(index, changes) =>
										onProductsChange((current) =>
											current.map((item, originalIndex) => (originalIndex === rows[index]?.index ? { ...item, ...changes, origem: group.origin } : item)),
										)
									}
									onRemove={(index) => onProductsChange((current) => current.filter((_, originalIndex) => originalIndex !== rows[index]?.index))}
									onChangeOrigin={(index) => {
										const row = rows[index];
										if (row) setMove({ index: row.index, item: row.item, target: group.origin === "EXISTENTE" ? "VENDA" : "EXISTENTE" });
									}}
								/>
							</div>
						) : null}
						{group.origin === legacyOrigin && editable && canEditLegacy ? (
							<Button
								type="button"
								variant="link"
								size="sm"
								className="mt-3 px-0"
								aria-expanded={editingLegacy}
								aria-controls={`${id}-legacy`}
								onClick={() => setEditingLegacy(!editingLegacy)}
							>
								<ChevronDown className="mr-2 h-4 w-4" />
								{editingLegacy ? "Fechar dados do cadastro anterior" : "Editar dados do sistema"}
							</Button>
						) : null}
						{group.origin === legacyOrigin && editable && editingLegacy && canEditLegacy ? (
							<div id={`${id}-legacy`} className="border-border mt-3 grid gap-4 border-t pt-4 sm:grid-cols-2">
								{!hasModuleItems ? (
									<NumberInput
										label="Número de módulos"
										value={legacyEquipment.modulos.qtde || null}
										placeholder="Informe a quantidade"
										width="100%"
										handleChange={(value) => onLegacyChange({ sistema: { qtdeModulos: value }, ...(maintenance ? { oem: { qtdeModulos: value } } : {}) })}
									/>
								) : null}
								{!legacyEquipment.derived.modulePower ? (
									<TextInput
										label="Potência dos módulos (W)"
										value={project.sistema?.potModulos?.toString() || ""}
										placeholder="Informe a potência"
										width="100%"
										handleChange={(value) => onLegacyChange({ sistema: { potModulos: value } })}
									/>
								) : null}
								{!legacyEquipment.derived.peakPower ? (
									<NumberInput
										label="Potência pico (kWp)"
										value={project.sistema?.potPico || null}
										placeholder="Informe a potência pico"
										width="100%"
										handleChange={(value) => onLegacyChange({ sistema: { potPico: value } })}
									/>
								) : null}
								{!hasInverterItems ? (
									<TextInput
										label="Quantidade e potência dos inversores"
										value={project.sistema?.inversor || ""}
										placeholder="Ex.: 1x GROWATT (5000W)"
										width="100%"
										handleChange={(value) => onLegacyChange({ sistema: { inversor: value } })}
									/>
								) : null}
								{!hasInverterItems && maintenance ? (
									<NumberInput
										label="Número de inversores"
										value={project.oem?.qtdeInversores || legacyEquipment.inversor.qtde || null}
										placeholder="Informe a quantidade"
										width="100%"
										handleChange={(value) => onLegacyChange({ sistema: {}, oem: { qtdeInversores: value } })}
									/>
								) : null}
							</div>
						) : null}
					</section>
				);
			})}
			{editable && (editingOrigin || editingLegacy || editingTopology) ? (
				<p className="text-muted-foreground flex items-center gap-1.5 text-xs">
					<Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
					As edições serão concluídas ao salvar as alterações do projeto.
				</p>
			) : null}
			<p className="sr-only" role="status" aria-live="polite">
				{announcement}
			</p>
			<AlertDialog
				open={Boolean(move)}
				onOpenChange={(open) => {
					if (!open) setMove(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<ArrowRightLeft className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
							Alterar classificação do equipamento?
						</AlertDialogTitle>
						<AlertDialogDescription>
							{move?.item.qtde} × {move?.item.modelo || move?.item.fabricante || "Equipamento"} passará para “
							{groups.find((group) => group.origin === move?.target)?.title}”. O resumo deste projeto será atualizado. As ordens de serviço existentes serão
							preservadas.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction onClick={confirmMove}>Alterar classificação</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
