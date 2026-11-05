import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useSession } from "@/components/providers/SessionProvider";

import { BsFunnel } from "react-icons/bs";

import ErrorComponent from "../../components/utils/ErrorComponent";
import LoadingPage from "../../components/utils/LoadingPage";

import type { TGetComissionDataOutputDefault } from "@/app/api/comissoes/route";
import ControlProjectComission from "@/components/identificador/comissoes/ControlProjectComission";
import ComissionBulkActionDialog, { type ComissionBulkActionRequest } from "@/components/identificador/comissoes/admin/ComissionBulkActionDialog";
import ComissionsFilters from "@/components/identificador/comissoes/admin/ComissionsFilters";
import ComissionsOverview from "@/components/identificador/comissoes/admin/ComissionsOverview";
import { ACTION_META, ALL_STAGES_ICON, STAGE_META, TONE_CLASSES } from "@/components/identificador/comissoes/admin/tones";
import ProjectComissionCard from "@/components/identificador/comissoes/admin/ProjectComissionCard";
import {
	COMISSION_BULK_ACTIONS,
	COMISSION_STAGES,
	COMISSION_STAGES_ORDER,
	type ComissionBulkAction,
	type ComissionStage,
	type TComissionProject,
	buildBulkActionUpdates,
	getComissionStats,
	getProjectComissionTotal,
	getProjectStage,
	getProjectsEligibleForAction,
} from "@/components/identificador/comissoes/admin/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { getExcelFromJSON } from "@/lib/excel-utils";
import { cn } from "@/lib/utils";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { bulkUpdateProjectsComission } from "@/utils/methods/mutation/comission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeDollarSign, ChevronDown, ChevronUp, ListChecks, Percent, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaDiamond } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { formatDecimalPlaces, formatToMoney, getProjectTypeCollors } from "../../utils/constants";
import { useComissionData } from "../../utils/methods/query/comissions";

function CommissionMain() {
	const { session, status } = useSession();

	const userHasFinancesEditPermission = !!session?.user.permissoes.financeiro.editar;
	const userHasAdministrativeEditPermission = !!session?.user.permissoes.administrativo.editar;

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!userHasFinancesEditPermission && !userHasAdministrativeEditPermission) return <UnauthorizedComponent />;
	return <ComissionsDatabaseViewContent session={session} />;
}

export default CommissionMain;

function normalizeSearch(value: string) {
	return value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

type ComissionsDatabaseViewContentProps = {
	session: TAuthSession;
};
function ComissionsDatabaseViewContent({ session }: ComissionsDatabaseViewContentProps) {
	const queryClient = useQueryClient();

	// Kept local (not in the query filters) so typing does not refetch the list
	const [search, setSearch] = useState("");
	const [stageFilter, setStageFilter] = useState<ComissionStage | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [actionRequest, setActionRequest] = useState<ComissionBulkActionRequest | null>(null);
	const [editComissionProjectId, setEditComissionProjectId] = useState<string | null>(null);

	const { data: projects, isSuccess, isLoading, isError, filters, updateFilters } = useComissionData({});

	// Search is applied client-side (the API does not filter by it)
	const searchedProjects = useMemo(() => {
		const allProjects = projects ?? [];
		const normalizedSearch = normalizeSearch(search);
		if (!normalizedSearch) return allProjects;
		return allProjects.filter((project) =>
			[project.nome, project.identificadorApp, project.identificadorCrm, project.cidade].some(
				(field) => field != null && normalizeSearch(String(field)).includes(normalizedSearch),
			),
		);
	}, [projects, search]);

	const stats = useMemo(() => getComissionStats(searchedProjects), [searchedProjects]);

	const visibleProjects = useMemo(
		() => (stageFilter ? searchedProjects.filter((project) => getProjectStage(project) === stageFilter) : searchedProjects),
		[searchedProjects, stageFilter],
	);
	// Only visible projects can be acted upon, so hidden selections never get changed by accident
	const selectedProjects = visibleProjects.filter((project) => selectedIds.has(project._id));
	const allVisibleSelected = visibleProjects.length > 0 && selectedProjects.length === visibleProjects.length;

	function toggleSelected(projectId: string, selected: boolean) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (selected) next.add(projectId);
			else next.delete(projectId);
			return next;
		});
	}
	function toggleAllVisible() {
		setSelectedIds(allVisibleSelected ? new Set() : new Set(visibleProjects.map((p) => p._id)));
	}
	function toggleUserFilter(userId: string) {
		updateFilters({
			sellerIds: filters.sellerIds.includes(userId) ? filters.sellerIds.filter((id) => id !== userId) : [...filters.sellerIds, userId],
		});
	}

	const { mutate: runBulkAction, isPending: isBulkActionPending } = useMutation({
		mutationKey: ["comissions-bulk-action"],
		mutationFn: async (request: ComissionBulkActionRequest) =>
			await bulkUpdateProjectsComission(buildBulkActionUpdates(request.projects, request.action)),
		onSuccess: (message) => {
			toast.success(message);
			setActionRequest(null);
			setSelectedIds(new Set());
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["comissions"] });
		},
	});

	async function exportData() {
		if (!projects) return toast.error("Opps, parece que os dados não estão disponíveis para exportação.");
		const formattedJSON = visibleProjects.map((project) => {
			const comissioned = project.comissoes.comissionados;
			const hasComissioned = comissioned.length > 0;
			return {
				ID: project.identificadorApp,
				NOME: project.nome,
				"TIPO DO SERVIÇO": project.tipo,
				"IDENTIFICADOR APP": project.identificadorApp,
				"IDENTIFICADOR CRM": project.identificadorCrm,
				"LINK DA OPORTUNIDADE": `https://crm.ampereenergias.com.br/comercial/oportunidades/id/${project.idOportunidadeCRM}`,
				CIDADE: project.cidade,
				VENDEDOR: project.vendedorApp,
				INSIDER: project.insiderApp,
				"DATA DE ASSINATURA": formatDateAsLocale(project.dataAssinatura) || null,
				"DATA RECEBIMENTO PARCIAL": formatDateAsLocale(project.dataRecebimentoParcial) || null,
				"POTÊNCIA PICO": project.potenciaPico,
				"VALOR DO PROJETO": project.valorProjeto || 0,
				"VALOR DO PADRÃO": project.valorPadrao || 0,
				"VALOR DO ESTRUTURA": project.valorEstruturaPersonalizada || 0,
				"VALOR DO O&M": project.valorOem || 0,
				"VALOR DO SEGURO": project.valorSeguro || 0,
				"VALOR DO CONTRATO": project.valorContrato || 0,
				"VALOR COMISSIONÁVEL": project.comissoes.valorComissionavel || 0,
				"VALOR COMISSIONÁVEL SUGERIDO": project.comissoes.valorComissionavelSugerido || 0,
				"COMISSÃO TOTAL": getProjectComissionTotal(project),
				"ETAPA DA COMISSÃO": COMISSION_STAGES[getProjectStage(project)].label.toUpperCase(),
				"COMISSÃO DEFINIDA": hasComissioned && comissioned.every((c) => c.dataEfetivacao) ? "SIM" : "NÃO",
				"COMISSÃO VALIDADA": hasComissioned && comissioned.every((c) => c.dataValidacao) ? "SIM" : "NÃO",
				"COMISSÃO PAGA": hasComissioned && comissioned.every((c) => c.dataPagamento) ? "SIM" : "NÃO",
				COMISSIONADOS: comissioned.map((c) => `${c.nome} (${c.papel} - ${formatDecimalPlaces(c.porcentagem)}%)`).join(", "),
			};
		});
		const periodStart = formatDateAsLocale(filters.period.after)?.replaceAll("/", "-") || "";
		const periodEnd = formatDateAsLocale(filters.period.before)?.replaceAll("/", "-") || "";
		const periodString = periodStart && periodEnd ? ` ${periodStart} - ${periodEnd}` : "";
		await getExcelFromJSON(formattedJSON, `COMISSÕES DE PROJETOS${periodString}`);
		return toast.success("Dados exportados com sucesso !");
	}

	return (
		<div className="flex grow flex-col gap-4 p-6">
			{/* HEADER */}
			<header className="flex flex-col gap-0.5">
				<h1 className="text-primary text-2xl font-black uppercase">Comissão de projetos</h1>
				<p className="text-muted-foreground text-sm">
					{isSuccess ? `${searchedProjects.length} projeto(s) no período de referência` : "Carregando projetos..."}
				</p>
			</header>

			<ComissionsFilters
				search={search}
				onSearchChange={setSearch}
				period={filters.period}
				onPeriodChange={(period) => updateFilters({ period })}
				serviceTypesValue={filters.serviceType}
				onServiceTypesChange={(serviceType) => updateFilters({ serviceType })}
				comissionedIds={filters.sellerIds}
				onComissionedIdsChange={(sellerIds) => updateFilters({ sellerIds })}
				onExport={exportData}
				exportDisabled={!isSuccess}
			/>

			{isSuccess ? <ComissionsOverview stats={stats} selectedUserIds={filters.sellerIds} onUserClick={toggleUserFilter} /> : null}

			{isLoading ? <LoadingPage /> : null}
			{isError ? <ErrorComponent msg={"Erro ao carregar informações da análise. Tente novamente."} /> : null}
			{isSuccess && projects ? (
				<Tabs defaultValue="database">
					<TabsList>
						<TabsTrigger value="database">LISTA</TabsTrigger>
						<TabsTrigger value="report">RELATÓRIO</TabsTrigger>
					</TabsList>
					<TabsContent value="database" className="flex flex-col gap-3">
						{/* STAGE FILTER */}
						<fieldset className="flex flex-wrap items-center gap-1.5">
							<legend className="sr-only">Filtrar por etapa</legend>
							<StageChip label="TODAS" count={searchedProjects.length} isActive={stageFilter === null} onClick={() => setStageFilter(null)} />
							{COMISSION_STAGES_ORDER.map((stage) => {
								const stageStats = stats.porEtapa[stage];
								if (stage === "SEM_COMISSIONADOS" && stageStats.projetos === 0) return null;
								return (
									<StageChip
										key={stage}
										stage={stage}
										label={COMISSION_STAGES[stage].label}
										description={COMISSION_STAGES[stage].description}
										count={stageStats.projetos}
										value={stage === "SEM_COMISSIONADOS" ? undefined : stageStats.valor}
										isActive={stageFilter === stage}
										onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
									/>
								);
							})}
						</fieldset>

						{visibleProjects.length > 0 ? (
							<BulkActionsRow
								visibleCount={visibleProjects.length}
								selectedProjects={selectedProjects}
								allVisibleSelected={allVisibleSelected}
								onToggleAll={toggleAllVisible}
								onClear={() => setSelectedIds(new Set())}
								onAction={(action) => setActionRequest({ action, projects: selectedProjects })}
							/>
						) : null}

						<ComissionsDatabaseView
							projects={visibleProjects}
							selectedIds={selectedIds}
							onSelectedChange={toggleSelected}
							onEdit={(id) => setEditComissionProjectId(id)}
							onAction={(action, project) => setActionRequest({ action, projects: [project] })}
						/>
					</TabsContent>
					<TabsContent value="report">
						<ComissionsReportView projects={searchedProjects} />
					</TabsContent>
				</Tabs>
			) : null}

			<ComissionBulkActionDialog
				request={actionRequest}
				isPending={isBulkActionPending}
				onCancel={() => setActionRequest(null)}
				onConfirm={(request) => runBulkAction(request)}
			/>
			{editComissionProjectId ? (
				<ControlProjectComission
					projectId={editComissionProjectId}
					session={session.user}
					closeModal={() => setEditComissionProjectId(null)}
					callbacks={{
						onSettled: () => queryClient.invalidateQueries({ queryKey: ["comissions"] }),
					}}
				/>
			) : null}
		</div>
	);
}

type StageChipProps = {
	label: string;
	description?: string;
	count: number;
	value?: number;
	stage?: ComissionStage;
	isActive: boolean;
	onClick: () => void;
};
function StageChip({ label, description, count, value, stage, isActive, onClick }: StageChipProps) {
	const meta = stage ? STAGE_META[stage] : null;
	const Icon = meta?.icon ?? ALL_STAGES_ICON;
	const tone = meta?.tone ?? "neutral";
	return (
		<button
			type="button"
			title={description}
			aria-pressed={isActive}
			onClick={onClick}
			className={cn(
				"border-border hover:bg-secondary inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium uppercase transition-colors",
				isActive ? TONE_CLASSES[tone].active : null,
			)}
		>
			<Icon className={cn("h-3.5 w-3.5", TONE_CLASSES[meta?.iconTone ?? tone].text)} aria-hidden />
			<span>{label}</span>
			<span
				className={cn(
					"rounded border px-1.5 font-semibold tabular-nums",
					count > 0 ? TONE_CLASSES[tone].soft : "border-transparent text-muted-foreground",
				)}
			>
				{count}
			</span>
			{value !== undefined && count > 0 ? (
				<span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">{formatToMoney(value)}</span>
			) : null}
		</button>
	);
}

const BULK_ACTIONS: { action: ComissionBulkAction; hideWhenEmpty?: boolean }[] = [
	{ action: "EFETIVAR" },
	{ action: "PAGAR" },
	{ action: "APLICAR_SUGERIDO", hideWhenEmpty: true },
];
const COMPACT_BUTTON_CLASSES = "h-7 gap-1.5 px-2.5 text-[0.65rem] font-bold uppercase tracking-tight";

type BulkActionsRowProps = {
	visibleCount: number;
	selectedProjects: TComissionProject[];
	allVisibleSelected: boolean;
	onToggleAll: () => void;
	onClear: () => void;
	onAction: (action: ComissionBulkAction) => void;
};
/** Inline bulk actions (RecompraCRM pattern): always visible, disabled until something eligible is selected. */
function BulkActionsRow({ visibleCount, selectedProjects, allVisibleSelected, onToggleAll, onClear, onAction }: BulkActionsRowProps) {
	const selectedCount = selectedProjects.length;
	const total = selectedProjects.reduce((acc, p) => acc + getProjectComissionTotal(p), 0);
	return (
		<section
			aria-label="Ações em lote"
			className="bg-card border-border flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
		>
			<p className="text-muted-foreground text-xs font-medium uppercase">
				{selectedCount > 0 ? (
					<>
						<span className="text-foreground font-bold tabular-nums">{selectedCount}</span> selecionado(s) ·{" "}
						<span className="text-foreground font-bold tabular-nums">{formatToMoney(total)}</span>
					</>
				) : (
					"Selecione projetos para agir em lote"
				)}
			</p>
			<div className="flex flex-wrap items-center gap-1.5">
				<Button type="button" size="sm" variant="ghost" className={COMPACT_BUTTON_CLASSES} onClick={onToggleAll}>
					<ListChecks className="h-3.5 w-3.5" aria-hidden />
					{allVisibleSelected ? "Limpar seleção" : `Selecionar todos (${visibleCount})`}
				</Button>
				{selectedCount > 0 && !allVisibleSelected ? (
					<Button type="button" size="sm" variant="ghost" className={COMPACT_BUTTON_CLASSES} onClick={onClear}>
						<X className="h-3.5 w-3.5" aria-hidden />
						Limpar seleção
					</Button>
				) : null}
				{BULK_ACTIONS.map(({ action, hideWhenEmpty }) => {
					const eligible = getProjectsEligibleForAction(selectedProjects, action).length;
					if (hideWhenEmpty && eligible === 0) return null;
					const { tone, icon: Icon } = ACTION_META[action];
					return (
						<Button
							key={action}
							type="button"
							size="sm"
							variant="outline"
							className={cn(COMPACT_BUTTON_CLASSES, TONE_CLASSES[tone].button)}
							disabled={eligible === 0}
							onClick={() => onAction(action)}
						>
							<Icon className="h-3.5 w-3.5" aria-hidden />
							{COMISSION_BULK_ACTIONS[action].label} ({eligible})
						</Button>
					);
				})}
			</div>
		</section>
	);
}

type ComissionsDatabaseViewProps = {
	projects: TComissionProject[];
	selectedIds: Set<string>;
	onSelectedChange: (projectId: string, selected: boolean) => void;
	onEdit: (projectId: string) => void;
	onAction: (action: ComissionBulkAction, project: TComissionProject) => void;
};
function ComissionsDatabaseView({ projects, selectedIds, onSelectedChange, onEdit, onAction }: ComissionsDatabaseViewProps) {
	if (projects.length === 0)
		return (
			<div className="flex grow items-center justify-center py-10">
				<p className="text-muted-foreground text-base">Nenhum projeto encontrado para os filtros selecionados.</p>
			</div>
		);
	return (
		<div className="flex w-full flex-col gap-2">
			{projects.map((project) => (
				<ProjectComissionCard
					key={project._id}
					project={project}
					isSelected={selectedIds.has(project._id)}
					onSelectedChange={(selected) => onSelectedChange(project._id, selected)}
					onEdit={() => onEdit(project._id)}
					onAction={(action) => onAction(action, project)}
				/>
			))}
		</div>
	);
}

type ComissionReportBySeller = {
	seller: {
		id: TGetComissionDataOutputDefault[number]["comissoes"]["comissionados"][number]["idCrm"];
		name: TGetComissionDataOutputDefault[number]["comissoes"]["comissionados"][number]["nome"];
		avatar_url: TGetComissionDataOutputDefault[number]["comissoes"]["comissionados"][number]["avatar_url"];
	};
	projects: TGetComissionDataOutputDefault[number][];
};
type ComissionsReportViewProps = {
	projects: TGetComissionDataOutputDefault;
};
function ComissionsReportView({ projects }: ComissionsReportViewProps) {
	const comissionsGroupedBySeller = projects.reduce(
		(acc: Record<string, ComissionReportBySeller>, project) => {
			for (const comissioned of project.comissoes.comissionados) {
				if (!acc[comissioned.nome])
					acc[comissioned.nome] = {
						seller: {
							id: comissioned.idCrm,
							name: comissioned.nome,
							avatar_url: comissioned.avatar_url,
						},
						projects: [],
					};
				acc[comissioned.nome].projects.push(project);
			}
			return acc;
		},
		{} as Record<string, ComissionReportBySeller>,
	);

	const comissionsGroupedBySellerSorted = Object.entries(comissionsGroupedBySeller).sort((a, b) => {
		return a[0].localeCompare(b[0]);
	});
	return (
		<div className="flex w-full flex-col gap-2">
			{comissionsGroupedBySellerSorted.map(([seller, data]) => (
				<ComissionsReportViewSeller key={seller} sellerKey={seller} seller={data.seller} projects={data.projects} />
			))}
		</div>
	);
}
function ComissionsReportViewSeller({
	sellerKey,
	seller,
	projects,
}: {
	sellerKey: string;
	seller: ComissionReportBySeller["seller"];
	projects: ComissionReportBySeller["projects"];
}) {
	const [showProjects, setShowProjects] = useState(false);

	const totalComissionValue = projects.reduce((acc, project) => {
		const comissioned = project.comissoes.comissionados.find((comissionado) => comissionado.nome === sellerKey);
		if (!comissioned) return acc;
		const comissionValue = project.comissoes.valorComissionavel * (comissioned.porcentagem / 100);
		return acc + comissionValue;
	}, 0);
	return (
		<AnimatePresence>
			<div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-wrap items-center gap-2">
						<div className="text-foreground flex items-center gap-1 text-center text-xs font-bold italic">
							<Avatar className="h-5 min-h-5 w-5 min-w-5">
								<AvatarImage src={seller.avatar_url || undefined} alt={seller.name} />
								<AvatarFallback>{formatNameAsInitials(seller.name || "NA")}</AvatarFallback>
							</Avatar>
							<p className="text-xs">{sellerKey}</p>
						</div>
					</div>
					<div className="flex min-w-fit items-center gap-2">
						<Button variant={"ghost"} onClick={() => setShowProjects((prev) => !prev)} className={cn("flex items-center gap-2 px-2 py-1")} size={"fit"}>
							<p>MOSTRAR PROJETOS</p>
							{!showProjects ? <ChevronDown width={14} height={14} /> : <ChevronUp width={14} height={14} />}
						</Button>
						<div className="flex items-center gap-1 px-2 py-1">
							<BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />
							<p className="text-foreground text-sm font-semibold">{formatToMoney(totalComissionValue)}</p>
						</div>
					</div>
				</div>
			</div>
			{showProjects
				? projects.map((project, index: number) => {
						const comissioned = project.comissoes.comissionados.find((comissionado) => comissionado.nome === sellerKey);
						if (!comissioned) return null;
						const comissionValue = project.comissoes.valorComissionavel * (comissioned.porcentagem / 100);
						return (
							<motion.div
								key={project._id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1, // Each item is delayed by 0.1s * its index
								}}
								className="flex flex-col items-center justify-between px-2 lg:flex-row"
							>
								<div className="flex flex-wrap items-center gap-2">
									<div className="text-foreground flex items-center gap-1 text-center text-xs font-bold italic">
										<MdDashboard size={12} />
										<p className="text-xs">{project.identificadorApp}</p>
									</div>
									<p className="text-sm leading-none font-bold tracking-tight">{project.nome}</p>
									<Link href={`https://crm.ampereenergias.com.br/comercial/oportunidades/id/${project.idOportunidadeCRM}`} target="_blank" rel="noreferrer">
										<div className="bg-secondary text-xxs text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic">
											<BsFunnel size={12} />
											<p>{project.identificadorCrm}</p>
										</div>
									</Link>

									<div
										className={cn(
											"bg-secondary text-[0.5rem] text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold italic",
											getProjectTypeCollors(project.tipo),
										)}
									>
										<FaDiamond size={12} />
										<p>{project.tipo}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1 px-2 py-1">
										<Percent className="h-4 min-h-4 w-4 min-w-4" />
										<p className="text-foreground text-sm font-semibold">{formatDecimalPlaces(comissioned.porcentagem)}%</p>
									</div>
									<div className="flex items-center gap-1 px-2 py-1">
										<BadgeDollarSign className="h-4 min-h-4 w-4 min-w-4" />
										<p className="text-foreground text-sm font-semibold">{formatToMoney(comissionValue)}</p>
									</div>
								</div>
							</motion.div>
						);
					})
				: null}
		</AnimatePresence>
	);
}
