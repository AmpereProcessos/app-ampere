import type { TProjectADMSimplifiedWithRevenue } from "@/pages/api/projects/adm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { getProjectNestedFieldValue } from "../formatting";

async function fetchProjects() {
	const { data } = await axios.get("/api/projects/adm");
	return data as TProjectADMSimplifiedWithRevenue[];
}

export type TUseADMProjectsFilters = {
	search: string;
	contractStatus: string[];
	tagIds: string[];
	technicalTeam: string[];
	billingCompany: string[];
	inspectionStatus: string[];
	sellers: string[];
	toCharge: boolean;
	chargeDone: boolean;
	toBill: boolean;
	billingDone: boolean;
	receiptsUndefined: boolean;
	receiptToday: boolean;
	receiptThisWeek: boolean;
	receiptThisMonth: boolean;
	date: {
		after: string | null;
		before: string | null;
		field: string | null;
	};
};
export function useADMProjects() {
	const [filters, setFilters] = useState<TUseADMProjectsFilters>({
		search: "",
		contractStatus: [],
		tagIds: [],
		technicalTeam: [],
		billingCompany: [],
		inspectionStatus: [],
		sellers: [],
		toCharge: false,
		chargeDone: false,
		toBill: false,
		billingDone: false,
		receiptsUndefined: false,
		receiptToday: false,
		receiptThisWeek: false,
		receiptThisMonth: false,
		date: {
			after: null,
			before: null,
			field: null,
		},
	});

	function matchSearch(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.search.trim().length === 0) return true;
		return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase());
	}
	function matchContractStatus(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.contractStatus.length === 0) return true;
		return filters.contractStatus.includes(project.contrato?.status || "");
	}
	function matchTechnicalTeam(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.technicalTeam.length === 0) return true;
		return filters.technicalTeam.includes(project.obra.equipeResp || "");
	}
	function matchBillingCompany(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.billingCompany.length === 0) return true;
		return filters.billingCompany.includes(project.faturamento.empresaFaturamento || "");
	}
	function matchInspectionStatus(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.inspectionStatus.length === 0) return true;
		return filters.inspectionStatus.includes(project.vistoria.status || "");
	}
	function matchSellers(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.sellers.length === 0) return true;
		return filters.sellers.includes(project.vendedor.nome);
	}
	function matchTagIds(project: TProjectADMSimplifiedWithRevenue) {
		if (filters.tagIds.length === 0) return true;
		const projectTagIds = (project.etiquetas ?? []).map((e) => e.id);
		return filters.tagIds.some((t) => projectTagIds.includes(t));
	}
	function matchToCharge(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.toCharge) return true;
		return !project.pagamento.cobrancaFeita;
	}
	function matchChargeDone(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.chargeDone) return true;
		return !!project.pagamento.cobrancaFeita;
	}
	function matchToBill(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.toBill) return true;
		return !project.faturamento.concluido;
	}
	function matchBillingDone(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.billingDone) return true;
		return !!project.faturamento.concluido;
	}
	function matchReceiptsUndefined(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.receiptsUndefined) return true;
		return !project.receita || project.receita.fracionamento.length === 0;
	}
	function matchReceiptToday(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.receiptToday) return true;
		if (!project.receita) return false;
		const receiptForToday = project.receita.fracionamento.some((receipt) => {
			const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, "hours");
			return previewDate.isSame(dayjs(), "day") && !receipt.dataRecebimento;
		});
		return receiptForToday;
	}
	function matchReceiptThisWeek(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.receiptThisWeek) return true;
		if (!project.receita) return false;
		const receiptForThisWeek = project.receita.fracionamento.some((receipt) => {
			const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, "hours");
			return previewDate.isSame(dayjs(), "week") && !receipt.dataRecebimento;
		});
		return receiptForThisWeek;
	}

	function matchReceiptThisMonth(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.receiptThisMonth) return true;
		if (!project.receita) return false;
		const receiptForThisMonth = project.receita.fracionamento.some((receipt) => {
			const previewDate = dayjs(receipt.dataPrevisaoRecebimento).add(3, "hours");
			return previewDate.isSame(dayjs(), "month") && !receipt.dataRecebimento;
		});
		return receiptForThisMonth;
	}

	function matchDate(project: TProjectADMSimplifiedWithRevenue) {
		if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
		if (filters.date.field === "obra.saida") {
			return dayjs(project.obra.saida).isAfter(dayjs(filters.date.after)) && dayjs(project.obra.saida).isBefore(dayjs(filters.date.before));
		}
		if (filters.date.field === "medidor.data") {
			return dayjs(project.medidor.data).isAfter(dayjs(filters.date.after)) && dayjs(project.medidor.data).isBefore(dayjs(filters.date.before));
		}
		if (filters.date.field === "contrato.dataAssinatura") {
			return (
				dayjs(project.contrato.dataAssinatura).isAfter(dayjs(filters.date.after)) &&
				dayjs(project.contrato.dataAssinatura).isBefore(dayjs(filters.date.before))
			);
		}
		return false;
	}
	function handleModelData(data: TProjectADMSimplifiedWithRevenue[]) {
		return data.filter(
			(project) =>
				matchSearch(project) &&
				matchContractStatus(project) &&
				matchTagIds(project) &&
				matchTechnicalTeam(project) &&
				matchBillingCompany(project) &&
				matchInspectionStatus(project) &&
				matchSellers(project) &&
				matchToCharge(project) &&
				matchChargeDone(project) &&
				matchToBill(project) &&
				matchBillingDone(project) &&
				matchReceiptsUndefined(project) &&
				matchReceiptToday(project) &&
				matchReceiptThisWeek(project) &&
				matchReceiptThisMonth(project) &&
				matchDate(project),
		);
	}
	return {
		...useQuery({
			queryKey: ["adm-projects"],
			queryFn: fetchProjects,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}
