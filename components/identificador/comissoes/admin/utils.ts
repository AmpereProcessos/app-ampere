import type { TGetComissionDataOutputDefault } from "@/app/api/comissoes/route";
import type { TBulkUpdateProjectsComissionInput } from "@/app/api/comissoes/bulk/route";

export type TComissionProject = TGetComissionDataOutputDefault[number];
export type TComissionedUser = TComissionProject["comissoes"]["comissionados"][number];

/**
 * Commission lifecycle (per commissioned user), in order:
 * 1. EFETIVAÇÃO (`dataEfetivacao`): admin/finance confirms and locks the commission values (this page).
 * 2. VALIDAÇÃO (`dataValidacao`): the commissioned user acknowledges their commission in the CRM.
 * 3. PAGAMENTO (`dataPagamento`): finance records that the commission was paid.
 *
 * A project's stage is the first step that is still missing for any of its commissioned users.
 */
export type ComissionStage = "SEM_COMISSIONADOS" | "EFETIVACAO" | "VALIDACAO" | "PAGAMENTO" | "CONCLUIDA";

export const COMISSION_STAGES: Record<ComissionStage, { label: string; description: string; needsAdminAction: boolean }> = {
	SEM_COMISSIONADOS: {
		label: "Sem comissionados",
		description: "Nenhum comissionado definido para o projeto.",
		needsAdminAction: true,
	},
	EFETIVACAO: {
		label: "A efetivar",
		description: "Valores ainda não confirmados pelo administrativo/financeiro.",
		needsAdminAction: true,
	},
	VALIDACAO: {
		label: "Aguardando validação",
		description: "Comissão efetivada. Aguardando o comissionado validar no CRM.",
		needsAdminAction: false,
	},
	PAGAMENTO: {
		label: "A pagar",
		description: "Comissão efetivada e validada. Pagamento ainda não registrado.",
		needsAdminAction: true,
	},
	CONCLUIDA: {
		label: "Concluída",
		description: "Comissão efetivada, validada e paga.",
		needsAdminAction: false,
	},
};

export const COMISSION_STAGES_ORDER: ComissionStage[] = ["SEM_COMISSIONADOS", "EFETIVACAO", "VALIDACAO", "PAGAMENTO", "CONCLUIDA"];

export type ComissionStep = "EFETIVACAO" | "VALIDACAO" | "PAGAMENTO";
export const COMISSION_STEPS: { step: ComissionStep; doneLabel: string; pendingLabel: string }[] = [
	{ step: "EFETIVACAO", doneLabel: "Efetivada", pendingLabel: "Efetivação pendente" },
	{ step: "VALIDACAO", doneLabel: "Validada", pendingLabel: "Validação pendente" },
	{ step: "PAGAMENTO", doneLabel: "Paga", pendingLabel: "Pagamento pendente" },
];

export function getComissionedStepDate(comissioned: TComissionedUser, step: ComissionStep) {
	if (step === "EFETIVACAO") return comissioned.dataEfetivacao ?? null;
	if (step === "VALIDACAO") return comissioned.dataValidacao ?? null;
	return comissioned.dataPagamento ?? null;
}

/** First lifecycle step still missing for the commissioned user (null if all done). */
export function getComissionedNextStep(comissioned: TComissionedUser): ComissionStep | null {
	return COMISSION_STEPS.find(({ step }) => !getComissionedStepDate(comissioned, step))?.step ?? null;
}

/** Same rule used by the edit spreadsheet: the stored value wins, falling back to the percentage. */
export function getComissionedValue(comissioned: TComissionedUser, comissionableValue: number) {
	if (comissioned.valor != null) return comissioned.valor;
	return (comissioned.porcentagem / 100) * comissionableValue;
}

export function getProjectComissionTotal(project: TComissionProject) {
	return project.comissoes.comissionados.reduce((acc, comissioned) => acc + getComissionedValue(comissioned, project.comissoes.valorComissionavel), 0);
}

export function getProjectStage(project: TComissionProject): ComissionStage {
	const comissioned = project.comissoes.comissionados;
	if (comissioned.length === 0) return "SEM_COMISSIONADOS";
	if (comissioned.some((c) => !c.dataEfetivacao)) return "EFETIVACAO";
	if (comissioned.some((c) => !c.dataValidacao)) return "VALIDACAO";
	if (comissioned.some((c) => !c.dataPagamento)) return "PAGAMENTO";
	return "CONCLUIDA";
}

export function hasComissionableValue(project: TComissionProject) {
	return project.comissoes.valorComissionavel > 0;
}

export function isComissionableValueDivergent(project: TComissionProject) {
	return Math.abs(project.comissoes.valorComissionavel - project.comissoes.valorComissionavelSugerido) >= 0.01;
}

/** Commissioned users that can be effectivated now. Requires a defined comissionable value. */
export function getEffectivationPending(project: TComissionProject) {
	if (!hasComissionableValue(project)) return [];
	return project.comissoes.comissionados.filter((c) => !c.dataEfetivacao);
}

/** Commissioned users that can have their payment registered now (effectivated and unpaid). */
export function getPaymentPending(project: TComissionProject) {
	return project.comissoes.comissionados.filter((c) => !!c.dataEfetivacao && !c.dataPagamento);
}

/** The suggested value can only be applied while nothing has been effectivated yet. */
export function canApplySuggestedValue(project: TComissionProject) {
	return (
		project.comissoes.valorComissionavelSugerido > 0 &&
		isComissionableValueDivergent(project) &&
		project.comissoes.comissionados.every((c) => !c.dataEfetivacao)
	);
}

export function getProjectReferenceDate(project: TComissionProject) {
	if (["SISTEMA FOTOVOLTAICO", "AUMENTO DE SISTEMA FOTOVOLTAICO"].includes(project.tipo)) {
		return project.dataRecebimentoParcial;
	}
	return project.dataAssinatura;
}

export function getCrmOpportunityUrl(project: TComissionProject) {
	return `https://crm.ampereenergias.com.br/comercial/oportunidades/id/${project.idOportunidadeCRM}`;
}

/**
 * BULK ACTIONS
 */
export type ComissionBulkAction = "EFETIVAR" | "PAGAR" | "APLICAR_SUGERIDO";

export const COMISSION_BULK_ACTIONS: Record<ComissionBulkAction, { label: string; confirmLabel: string; title: string; description: string }> = {
	EFETIVAR: {
		label: "EFETIVAR",
		confirmLabel: "EFETIVAR COMISSÕES",
		title: "Efetivar comissões",
		description: "Confirma os valores atuais das comissões. Depois disso, cada comissionado poderá validar a sua comissão no CRM.",
	},
	PAGAR: {
		label: "REGISTRAR PAGAMENTO",
		confirmLabel: "REGISTRAR PAGAMENTO",
		title: "Registrar pagamento de comissões",
		description: "Marca como pagas, com a data de hoje, as comissões já efetivadas e ainda não pagas.",
	},
	APLICAR_SUGERIDO: {
		label: "APLICAR SUGERIDO",
		confirmLabel: "APLICAR VALOR SUGERIDO",
		title: "Aplicar valor comissionável sugerido",
		description:
			"Substitui o valor comissionável pelo sugerido (soma dos itens comissionáveis) e recalcula o valor de cada comissionado pela sua porcentagem.",
	},
};

type BulkUpdateItem = TBulkUpdateProjectsComissionInput[number];

function getBaseUpdate(project: TComissionProject): BulkUpdateItem {
	return {
		projectId: project._id,
		comissionableValue: project.comissoes.valorComissionavel,
		comissionableItems: project.comissoes.itensComissionaveis as BulkUpdateItem["comissionableItems"],
		comissioned: project.comissoes.comissionados,
	};
}

export function getProjectsEligibleForAction(projects: TComissionProject[], action: ComissionBulkAction) {
	if (action === "EFETIVAR") return projects.filter((p) => getEffectivationPending(p).length > 0);
	if (action === "PAGAR") return projects.filter((p) => getPaymentPending(p).length > 0);
	return projects.filter(canApplySuggestedValue);
}

export function buildBulkActionUpdates(
	projects: TComissionProject[],
	action: ComissionBulkAction,
	now: string = new Date().toISOString(),
): TBulkUpdateProjectsComissionInput {
	const eligible = getProjectsEligibleForAction(projects, action);
	return eligible.map((project) => {
		const base = getBaseUpdate(project);
		if (action === "EFETIVAR") {
			return {
				...base,
				comissioned: base.comissioned.map((c) => (c.dataEfetivacao ? c : { ...c, dataEfetivacao: now })),
			};
		}
		if (action === "PAGAR") {
			return {
				...base,
				comissioned: base.comissioned.map((c) => (c.dataEfetivacao && !c.dataPagamento ? { ...c, dataPagamento: now } : c)),
			};
		}
		const suggested = project.comissoes.valorComissionavelSugerido;
		return {
			...base,
			comissionableValue: suggested,
			comissioned: base.comissioned.map((c) => ({ ...c, valor: (c.porcentagem / 100) * suggested })),
		};
	});
}

export type ComissionBulkActionSummary = {
	projects: number;
	comissioned: number;
	value: number;
	skippedProjects: number;
	/** Only for PAGAR: commissioned users being paid before validating in the CRM. */
	notValidated: number;
	/** Only for EFETIVAR: projects skipped because they have no comissionable value. */
	missingComissionableValue: number;
};
export function getBulkActionSummary(projects: TComissionProject[], action: ComissionBulkAction): ComissionBulkActionSummary {
	const eligible = getProjectsEligibleForAction(projects, action);
	const summary: ComissionBulkActionSummary = {
		projects: eligible.length,
		comissioned: 0,
		value: 0,
		skippedProjects: projects.length - eligible.length,
		notValidated: 0,
		missingComissionableValue: 0,
	};
	if (action === "EFETIVAR") {
		summary.missingComissionableValue = projects.filter(
			(p) => !hasComissionableValue(p) && p.comissoes.comissionados.some((c) => !c.dataEfetivacao),
		).length;
	}
	for (const project of eligible) {
		const base = project.comissoes.valorComissionavel;
		if (action === "EFETIVAR") {
			const pending = getEffectivationPending(project);
			summary.comissioned += pending.length;
			summary.value += pending.reduce((acc, c) => acc + getComissionedValue(c, base), 0);
		} else if (action === "PAGAR") {
			const pending = getPaymentPending(project);
			summary.comissioned += pending.length;
			summary.notValidated += pending.filter((c) => !c.dataValidacao).length;
			summary.value += pending.reduce((acc, c) => acc + getComissionedValue(c, base), 0);
		} else {
			const suggested = project.comissoes.valorComissionavelSugerido;
			summary.comissioned += project.comissoes.comissionados.length;
			summary.value += project.comissoes.comissionados.reduce((acc, c) => acc + (c.porcentagem / 100) * suggested, 0);
		}
	}
	return summary;
}

/**
 * STATS
 */
export function getComissionStats(projects: TComissionProject[]) {
	const stats = {
		totalVendido: 0,
		potenciaVendida: 0,
		comissaoTotal: 0,
		porItem: { SISTEMA: 0, PADRÃO: 0, "ESTRUTURA PERSONALIZADA": 0, OEM: 0, SEGURO: 0 },
		porTime: { vendas: 0, sdr: 0, outros: 0 },
		porUsuario: {} as Record<string, { id: string; nome: string; avatar_url?: string | null; comissaoTotal: number }>,
		porEtapa: Object.fromEntries(COMISSION_STAGES_ORDER.map((stage) => [stage, { projetos: 0, valor: 0 }])) as Record<
			ComissionStage,
			{ projetos: number; valor: number }
		>,
	};

	for (const project of projects) {
		const base = project.comissoes.valorComissionavel;
		stats.totalVendido += project.valorContrato || 0;
		stats.potenciaVendida += project.potenciaPico || 0;

		const projectTotal = getProjectComissionTotal(project);
		stats.comissaoTotal += projectTotal;

		const stage = getProjectStage(project);
		stats.porEtapa[stage].projetos += 1;
		stats.porEtapa[stage].valor += projectTotal;

		for (const comissioned of project.comissoes.comissionados) {
			const value = getComissionedValue(comissioned, base);
			const percentage = comissioned.porcentagem / 100;
			stats.porItem.SISTEMA += percentage * (project.valorProjeto || 0);
			stats.porItem.PADRÃO += percentage * (project.valorPadrao || 0);
			stats.porItem["ESTRUTURA PERSONALIZADA"] += percentage * (project.valorEstruturaPersonalizada || 0);
			stats.porItem.OEM += percentage * (project.valorOem || 0);
			stats.porItem.SEGURO += percentage * (project.valorSeguro || 0);

			if (comissioned.papel === "VENDEDOR") stats.porTime.vendas += value;
			else if (comissioned.papel === "INSIDER") stats.porTime.sdr += value;
			else stats.porTime.outros += value;

			const userId = comissioned.idCrm || `sem-id:${comissioned.nome}`;
			if (!stats.porUsuario[userId]) {
				stats.porUsuario[userId] = {
					id: userId,
					nome: comissioned.nome,
					avatar_url: comissioned.avatar_url,
					comissaoTotal: 0,
				};
			}
			stats.porUsuario[userId].comissaoTotal += value;
		}
	}
	return stats;
}
export type TComissionStats = ReturnType<typeof getComissionStats>;
