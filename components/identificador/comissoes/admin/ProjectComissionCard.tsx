import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { formatDecimalPlaces, formatToMoney, getProjectTypeCollors } from "@/utils/constants";
import { AlertTriangle, Check, ExternalLink, Hourglass, OctagonAlert, Pencil, UserPlus, Wand2 } from "lucide-react";
import ComissionStageBadge from "./ComissionStageBadge";
import { ACTION_META, STEP_META, TONE_CLASSES } from "./tones";
import {
	COMISSION_STEPS,
	type ComissionBulkAction,
	type TComissionProject,
	canApplySuggestedValue,
	getComissionedNextStep,
	getComissionedStepDate,
	getComissionedValue,
	getCrmOpportunityUrl,
	getEffectivationPending,
	getPaymentPending,
	getProjectComissionTotal,
	getProjectReferenceDate,
	getProjectStage,
	hasComissionableValue,
	isComissionableValueDivergent,
} from "./utils";

const ITEM_LABELS: Record<string, string> = {
	SISTEMA: "Projeto",
	PADRÃO: "Padrão",
	"ESTRUTURA PERSONALIZADA": "Estrutura personalizada",
	OEM: "O&M",
	SEGURO: "Seguro",
};
const ROLE_LABELS: Record<string, string> = {
	VENDEDOR: "Vendedor",
	INSIDER: "SDR",
	INDICADOR: "Indicador",
	"ANALISTA TÉCNICO": "Analista técnico",
};

type ProjectComissionCardProps = {
	project: TComissionProject;
	isSelected: boolean;
	onSelectedChange: (selected: boolean) => void;
	onEdit: () => void;
	onAction: (action: ComissionBulkAction) => void;
};
export default function ProjectComissionCard({ project, isSelected, onSelectedChange, onEdit, onAction }: ProjectComissionCardProps) {
	const stage = getProjectStage(project);
	const total = getProjectComissionTotal(project);
	const base = project.comissoes.valorComissionavel;
	const effectivationPending = getEffectivationPending(project);
	const paymentPending = getPaymentPending(project);
	const isMissingBase = !hasComissionableValue(project);
	const isDivergent = !isMissingBase && isComissionableValueDivergent(project);
	const showApplySuggested = canApplySuggestedValue(project);
	const awaitingValidation = project.comissoes.comissionados.filter((c) => c.dataEfetivacao && !c.dataValidacao);
	const referenceDate = formatDateAsLocale(getProjectReferenceDate(project));
	const checkboxId = `comission-select-${project._id}`;

	return (
		<article
			className={cn("bg-card border-border flex w-full flex-col rounded-lg border transition-colors", {
				"border-primary ring-primary ring-1": isSelected,
			})}
		>
			{/* Header */}
			<div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex min-w-0 items-start gap-3">
					<Checkbox
						id={checkboxId}
						className="mt-0.5"
						checked={isSelected}
						onCheckedChange={(v) => onSelectedChange(v === true)}
						aria-label={`Selecionar ${project.nome}`}
					/>
					<div className="flex min-w-0 flex-col gap-1">
						<label htmlFor={checkboxId} className="flex min-w-0 cursor-pointer items-baseline gap-2">
							<span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">#{project.identificadorApp}</span>
							<span className="truncate text-sm font-semibold">{project.nome}</span>
						</label>
						<div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
							<a
								href={getCrmOpportunityUrl(project)}
								target="_blank"
								rel="noreferrer"
								className="hover:text-primary inline-flex items-center gap-1 underline-offset-2 hover:underline"
							>
								CRM {project.identificadorCrm}
								<ExternalLink className="h-3 w-3" aria-hidden />
							</a>
							<span className={cn("rounded px-1.5 py-0.5 text-[0.6rem] font-semibold", getProjectTypeCollors(project.tipo))}>{project.tipo}</span>
							<span>Referência {referenceDate || "não definida"}</span>
							{project.cidade ? <span>{project.cidade}</span> : null}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 pl-7 sm:pl-0">
					<ComissionStageBadge stage={stage} />
					<ComissionBreakdown project={project} total={total} />
				</div>
			</div>

			{/* Commissioned users */}
			{project.comissoes.comissionados.length > 0 ? (
				<ul className="border-border divide-border divide-y border-t">
					{project.comissoes.comissionados.map((comissioned, index) => {
						const nextStep = getComissionedNextStep(comissioned);
						return (
							<li
								key={`${comissioned.idCrm ?? comissioned.nome}-${index}`}
								className="grid grid-cols-1 items-center gap-2 px-3 py-2 text-sm md:grid-cols-[minmax(0,1.4fr)_auto_minmax(0,2fr)]"
							>
								<div className="flex min-w-0 items-center gap-2">
									<Avatar className="h-6 w-6">
										<AvatarImage src={comissioned.avatar_url || undefined} alt="" />
										<AvatarFallback className="text-[0.6rem]">{formatNameAsInitials(comissioned.nome || "NA")}</AvatarFallback>
									</Avatar>
									<span className="truncate font-medium">{comissioned.nome}</span>
									<span className="text-muted-foreground shrink-0 text-xs">{ROLE_LABELS[comissioned.papel] ?? comissioned.papel}</span>
								</div>
								<div className="flex items-baseline gap-2 tabular-nums md:justify-end">
									<span className="text-muted-foreground text-xs">{formatDecimalPlaces(comissioned.porcentagem)}%</span>
									<span className="font-semibold">{formatToMoney(getComissionedValue(comissioned, base))}</span>
								</div>
								<ol className="flex flex-wrap items-center gap-1.5 md:justify-end" aria-label="Etapas da comissão">
									{COMISSION_STEPS.map(({ step, doneLabel, pendingLabel }) => {
										const date = getComissionedStepDate(comissioned, step);
										const isNext = nextStep === step;
										const { tone, icon: StepIcon } = STEP_META[step];
										// Done: filled in the step's hue. Next: dashed outline in the hue. Later: muted.
										const toneClasses = date ? TONE_CLASSES[tone].soft : isNext ? TONE_CLASSES[tone].outline : TONE_CLASSES.neutral.outline;
										return (
											<li
												key={step}
												className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.7rem]", toneClasses, {
													"font-medium": !!date || isNext,
													"opacity-70": !date && !isNext,
												})}
											>
												{date ? <Check className="h-3 w-3" aria-hidden /> : <StepIcon className="h-3 w-3" aria-hidden />}
												{date ? `${doneLabel} ${formatDateAsLocale(date)}` : pendingLabel}
											</li>
										);
									})}
								</ol>
							</li>
						);
					})}
				</ul>
			) : null}

			{/* Warnings + actions */}
			<div className="border-border flex flex-col gap-2 border-t px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 flex-col gap-1 text-xs">
					{stage === "SEM_COMISSIONADOS" ? <Warning tone="blocking">Nenhum comissionado definido. Edite para adicionar.</Warning> : null}
					{isMissingBase ? (
						<Warning tone="blocking">
							Valor comissionável não definido
							{project.comissoes.valorComissionavelSugerido > 0 ? ` (sugerido ${formatToMoney(project.comissoes.valorComissionavelSugerido)})` : ""}. Não é
							possível efetivar.
						</Warning>
					) : null}
					{isDivergent ? (
						<Warning>
							Valor comissionável {formatToMoney(base)} difere do sugerido {formatToMoney(project.comissoes.valorComissionavelSugerido)}.
						</Warning>
					) : null}
					{stage === "VALIDACAO" && awaitingValidation.length > 0 ? (
						<p className="text-muted-foreground flex items-start gap-1.5">
							<Hourglass className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", TONE_CLASSES.violet.text)} aria-hidden />
							<span>Aguardando {awaitingValidation.map((c) => c.nome).join(", ")} validar no CRM.</span>
						</p>
					) : null}
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2">
					{showApplySuggested ? (
						<Button variant="ghost" size="xs" className="gap-1" onClick={() => onAction("APLICAR_SUGERIDO")}>
							<Wand2 className="h-3.5 w-3.5" aria-hidden />
							APLICAR SUGERIDO
						</Button>
					) : null}
					<Button variant="outline" size="xs" className="gap-1" onClick={onEdit}>
						{stage === "SEM_COMISSIONADOS" ? <UserPlus className="h-3.5 w-3.5" aria-hidden /> : <Pencil className="h-3.5 w-3.5" aria-hidden />}
						{stage === "SEM_COMISSIONADOS" ? "DEFINIR COMISSIONADOS" : "EDITAR"}
					</Button>
					{effectivationPending.length > 0 ? (
						<ActionButton action="EFETIVAR" solid onClick={() => onAction("EFETIVAR")}>
							EFETIVAR
							{effectivationPending.length < project.comissoes.comissionados.length ? ` (${effectivationPending.length})` : ""}
						</ActionButton>
					) : null}
					{paymentPending.length > 0 ? (
						// Solid only when payment is the next step; before validation it stays a secondary (outline) option.
						<ActionButton action="PAGAR" solid={stage === "PAGAMENTO"} onClick={() => onAction("PAGAR")}>
							REGISTRAR PAGAMENTO
							{paymentPending.length < project.comissoes.comissionados.length ? ` (${paymentPending.length})` : ""}
						</ActionButton>
					) : null}
				</div>
			</div>
		</article>
	);
}

/** `advisory` (amber) flags something worth reviewing; `blocking` (red) stops the next step. */
function Warning({ children, tone = "advisory" }: { children: React.ReactNode; tone?: "advisory" | "blocking" }) {
	const Icon = tone === "blocking" ? OctagonAlert : AlertTriangle;
	return (
		<p className={cn("flex items-start gap-1.5", tone === "blocking" ? TONE_CLASSES.red.text : "text-foreground")}>
			<Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone === "advisory" ? "text-accent-amber-hover" : null)} aria-hidden />
			<span>{children}</span>
		</p>
	);
}

/** Lifecycle action button colored by its step (see `tones.ts`). */
export function ActionButton({
	action,
	solid,
	onClick,
	children,
	className,
	disabled,
}: {
	action: ComissionBulkAction;
	solid?: boolean;
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	const { tone, icon: Icon } = ACTION_META[action];
	return (
		<Button
			type="button"
			size="xs"
			variant={solid ? "default" : "outline"}
			disabled={disabled}
			onClick={onClick}
			className={cn("gap-1", solid ? TONE_CLASSES[tone].solid : TONE_CLASSES[tone].button, className)}
		>
			<Icon className="h-3.5 w-3.5" aria-hidden />
			{children}
		</Button>
	);
}

function ComissionBreakdown({ project, total }: { project: TComissionProject; total: number }) {
	const valueByItem: Record<string, number | null | undefined> = {
		SISTEMA: project.valorProjeto,
		PADRÃO: project.valorPadrao,
		"ESTRUTURA PERSONALIZADA": project.valorEstruturaPersonalizada,
		OEM: project.valorOem,
		SEGURO: project.valorSeguro,
	};
	const totalPercentage = project.comissoes.comissionados.reduce((acc, c) => acc + c.porcentagem, 0) / 100;
	return (
		<HoverCard openDelay={150}>
			<HoverCardTrigger asChild>
				<button type="button" className="hover:text-primary text-right text-base font-bold tabular-nums underline decoration-dotted underline-offset-4">
					{formatToMoney(total)}
				</button>
			</HoverCardTrigger>
			<HoverCardContent align="end" className="w-80 text-sm">
				<div className="flex items-center justify-between gap-2">
					<span className="text-muted-foreground">Valor comissionável</span>
					<span className="font-semibold tabular-nums">{formatToMoney(project.comissoes.valorComissionavel)}</span>
				</div>
				<div className="flex items-center justify-between gap-2">
					<span className="text-muted-foreground">Sugerido</span>
					<span className="tabular-nums">{formatToMoney(project.comissoes.valorComissionavelSugerido)}</span>
				</div>
				<div className="bg-border my-2 h-px" />
				<p className="text-muted-foreground mb-1 text-xs font-medium uppercase">Itens comissionáveis</p>
				{project.comissoes.itensComissionaveis.length > 0 ? (
					project.comissoes.itensComissionaveis.map((item) => {
						const value = valueByItem[item] || 0;
						return (
							<div key={item} className="flex items-center justify-between gap-2">
								<span>
									{ITEM_LABELS[item] ?? item} <span className="text-muted-foreground text-xs">{formatToMoney(value)}</span>
								</span>
								<span className="tabular-nums">{formatToMoney(value * totalPercentage)}</span>
							</div>
						);
					})
				) : (
					<p className="text-muted-foreground text-xs">Nenhum item selecionado.</p>
				)}
				<div className="bg-border my-2 h-px" />
				<div className="flex items-center justify-between gap-2 font-semibold">
					<span>Comissão total</span>
					<span className="tabular-nums">{formatToMoney(total)}</span>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
