import { TProjectUFVInsuranceDTO } from "@/pages/api/projects/seguro-fotovoltaico";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics } from "../formatting";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

async function fetchUFVInsuranceProjects() {
	try {
		const { data } = await axios.get("/api/projects/seguro-fotovoltaico");
		return data.data as TProjectUFVInsuranceDTO[];
	} catch (error) {
		throw error;
	}
}

export type UseUFVInsuranceProjectsFiltersParams = {
	search: string;
	cities: string[];
	ufs: string[];
	pendingReceipts: boolean;
	pendingReceiptsForWeek: boolean;
	pendingReceiptsForToday: boolean;
};
export function useUFVInsuranceProjects() {
	const [filters, setFilters] = useState<UseUFVInsuranceProjectsFiltersParams>({
		search: "",
		cities: [],
		ufs: [],
		pendingReceipts: false,
		pendingReceiptsForWeek: false,
		pendingReceiptsForToday: false,
	});

	function matchSearch(project: TProjectUFVInsuranceDTO) {
		if (filters.search.trim().length == 0) return true;
		return formatWithoutDiacritics(project.nomeDoContrato, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function matchCity(project: TProjectUFVInsuranceDTO) {
		if (filters.cities.length == 0) return true;
		return filters.cities.includes(project.cidade);
	}
	function matchUF(project: TProjectUFVInsuranceDTO) {
		if (filters.ufs.length == 0) return true;
		return filters.ufs.includes(project.uf);
	}

	function matchPendingReceipts(project: TProjectUFVInsuranceDTO) {
		if (!filters.pendingReceipts) return true;
		const revenue = project.receita;
		if (!revenue) return false;
		const pendingAnyReceipt = revenue.fracionamento.some((f) => !f.dataRecebimento);
		return pendingAnyReceipt;
	}
	function matchPendingReceiptsForWeek(project: TProjectUFVInsuranceDTO) {
		if (!filters.pendingReceiptsForWeek) return true;
		const revenue = project.receita;
		if (!revenue) return false;
		const pendingAnyReceiptForWeek = revenue.fracionamento.some((f) => {
			if (f.dataRecebimento) return true;
			return dayjs().isSame(dayjs(f.dataPrevisaoRecebimento), "w");
		});
		return pendingAnyReceiptForWeek;
	}
	function matchPendingReceiptsForToday(project: TProjectUFVInsuranceDTO) {
		if (!filters.pendingReceiptsForToday) return true;
		const revenue = project.receita;
		if (!revenue) return false;
		const pendingAnyReceiptForToday = revenue.fracionamento.some((f) => {
			if (f.dataRecebimento) return true;
			return dayjs().isSame(dayjs(f.dataPrevisaoRecebimento), "day");
		});
		return pendingAnyReceiptForToday;
	}

	function handleModelData(data: TProjectUFVInsuranceDTO[]) {
		return data.filter(
			(d) => matchSearch(d) && matchCity(d) && matchUF(d) && matchPendingReceipts(d) && matchPendingReceiptsForWeek(d) && matchPendingReceiptsForToday,
		);
	}

	const query = useQuery({
		queryKey: ["ufv-insurance-projects"],
		queryFn: fetchUFVInsuranceProjects,
		select: (data) => handleModelData(data),
	});

	return { ...query, filters, setFilters };
}
