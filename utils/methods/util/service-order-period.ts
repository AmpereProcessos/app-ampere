import type { TServiceOrder } from "@/utils/schemas/service-order";

export type TServiceOrderPeriodHistoryEntry = NonNullable<TServiceOrder["periodo"]["historico"]>[number];

export function sortPeriodHistory(historico: TServiceOrderPeriodHistoryEntry[]) {
	return [...historico].sort((a, b) => new Date(a.entrada).getTime() - new Date(b.entrada).getTime());
}

export function derivePeriodoFromHistorico(historico: TServiceOrderPeriodHistoryEntry[] | null | undefined) {
	if (!historico?.length) return null;

	const complete = historico.filter((row) => row.entrada && row.saida);
	if (complete.length === 0) return null;

	const entradas = complete
		.map((row) => new Date(row.entrada).getTime())
		.filter((time) => !Number.isNaN(time));
	const saidas = complete.map((row) => new Date(row.saida).getTime()).filter((time) => !Number.isNaN(time));

	if (entradas.length === 0 || saidas.length === 0) return null;

	return {
		inicio: new Date(Math.min(...entradas)).toISOString(),
		fim: new Date(Math.max(...saidas)).toISOString(),
	};
}

export function periodoIsLinkedToHistorico(
	periodo: Pick<TServiceOrder["periodo"], "inicio" | "fim">,
	historico: TServiceOrderPeriodHistoryEntry[] | null | undefined,
) {
	const derived = derivePeriodoFromHistorico(historico);
	if (!derived) return !periodo.inicio && !periodo.fim;

	return sameInstant(periodo.inicio, derived.inicio) && sameInstant(periodo.fim, derived.fim);
}

export function getPeriodHistoryRowDurationMs(row: Pick<TServiceOrderPeriodHistoryEntry, "entrada" | "saida">) {
	if (!row.entrada || !row.saida) return 0;
	const start = new Date(row.entrada).getTime();
	const end = new Date(row.saida).getTime();
	if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
	return end - start;
}

export function getTotalWorkedDurationMs(historico: TServiceOrderPeriodHistoryEntry[] | null | undefined) {
	if (!historico?.length) return 0;
	return historico.reduce((sum, row) => sum + getPeriodHistoryRowDurationMs(row), 0);
}

export function formatDurationMs(ms: number) {
	if (ms <= 0) return "-";
	const totalMinutes = Math.floor(ms / 60_000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours === 0) return `${minutes}min`;
	if (minutes === 0) return `${hours}h`;
	return `${hours}h ${minutes}min`;
}

function sameInstant(a: string | null | undefined, b: string | null | undefined) {
	if (!a && !b) return true;
	if (!a || !b) return false;
	return new Date(a).getTime() === new Date(b).getTime();
}
