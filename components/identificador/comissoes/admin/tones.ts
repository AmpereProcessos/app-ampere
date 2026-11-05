import { Banknote, CircleCheckBig, Layers, type LucideIcon, ShieldCheck, UserCheck, UserX, Wand2 } from "lucide-react";
import type { ComissionBulkAction, ComissionStage, ComissionStep } from "./utils";

/**
 * Semantic colors for the commission lifecycle. Each step owns one hue, reused by the stage badges,
 * stage chips, per-person step pills and the action buttons, so the same color always means the same step.
 * Amber stays reserved for warnings (Amber Scarcity Rule in DESIGN.md); finished items stay neutral.
 * Every class pairs a light and a dark variant to keep AA contrast in both themes.
 */
export type ComissionTone = "blue" | "violet" | "emerald" | "neutral" | "red";

type ToneClasses = {
	/** Tinted pill/badge: border + soft fill + strong text */
	soft: string;
	/** Outlined, unfilled variant (e.g. the next pending step) */
	outline: string;
	/** Icon/text accent only */
	text: string;
	/** Solid primary button, hover darkens the same hue */
	solid: string;
	/** Outline button tinted with the hue */
	button: string;
	/** Ring + fill for an active (pressed) chip */
	active: string;
};

export const TONE_CLASSES: Record<ComissionTone, ToneClasses> = {
	blue: {
		soft: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-200",
		outline: "border-dashed border-blue-400 text-blue-700 dark:border-blue-600 dark:text-blue-300",
		text: "text-blue-600 dark:text-blue-400",
		solid: "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
		button:
			"border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/60 dark:hover:text-blue-200",
		active: "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:border-blue-500 dark:bg-blue-950/60",
	},
	violet: {
		soft: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-200",
		outline: "border-dashed border-violet-400 text-violet-700 dark:border-violet-600 dark:text-violet-300",
		text: "text-violet-600 dark:text-violet-400",
		solid: "bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700",
		button:
			"border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950/60 dark:hover:text-violet-200",
		active: "border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:border-violet-500 dark:bg-violet-950/60",
	},
	emerald: {
		soft: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200",
		outline: "border-dashed border-emerald-500 text-emerald-700 dark:border-emerald-600 dark:text-emerald-300",
		text: "text-emerald-600 dark:text-emerald-400",
		solid: "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700",
		button:
			"border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200",
		active: "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/60",
	},
	neutral: {
		soft: "border-border bg-secondary text-muted-foreground",
		outline: "border-dashed border-border text-muted-foreground",
		text: "text-muted-foreground",
		solid: "bg-foreground text-background hover:bg-foreground/90",
		button: "border-border text-foreground hover:bg-secondary",
		active: "border-foreground/40 bg-secondary ring-1 ring-foreground/40",
	},
	red: {
		soft: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200",
		outline: "border-dashed border-red-400 text-red-700 dark:border-red-600 dark:text-red-300",
		text: "text-red-600 dark:text-red-400",
		solid: "bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
		button:
			"border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/60 dark:hover:text-red-200",
		active: "border-red-500 bg-red-50 ring-1 ring-red-500 dark:border-red-500 dark:bg-red-950/60",
	},
};

export const STEP_META: Record<ComissionStep, { tone: ComissionTone; icon: LucideIcon }> = {
	EFETIVACAO: { tone: "blue", icon: ShieldCheck },
	VALIDACAO: { tone: "violet", icon: UserCheck },
	PAGAMENTO: { tone: "emerald", icon: Banknote },
};

/** A project's stage is "the next step to do", so it borrows that step's color and icon. */
export const STAGE_META: Record<ComissionStage, { tone: ComissionTone; icon: LucideIcon; iconTone?: ComissionTone }> = {
	SEM_COMISSIONADOS: { tone: "red", icon: UserX },
	EFETIVACAO: STEP_META.EFETIVACAO,
	VALIDACAO: STEP_META.VALIDACAO,
	PAGAMENTO: STEP_META.PAGAMENTO,
	// Done items recede: neutral surface, with a success-colored check as the only accent.
	CONCLUIDA: { tone: "neutral", icon: CircleCheckBig, iconTone: "emerald" },
};

export const ALL_STAGES_ICON = Layers;

export const ACTION_META: Record<ComissionBulkAction, { tone: ComissionTone; icon: LucideIcon }> = {
	EFETIVAR: STEP_META.EFETIVACAO,
	PAGAR: STEP_META.PAGAMENTO,
	APLICAR_SUGERIDO: { tone: "neutral", icon: Wand2 },
};
