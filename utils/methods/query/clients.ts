import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import type { TBirthdayRecord } from "@/utils/schemas/stats";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatWithoutDiacritics, getProjectNestedFieldValue } from "../formatting";

export async function fetchClients() {
	const { data } = await axios.get("/api/projects/todos");
	if (!data) return [];
	if (!Array.isArray(data)) return [];
	return data as TProjectDTO[];
}

export function useClients(enabled: boolean) {
	return useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients,
		refetchOnWindowFocus: false,
		enabled: !!enabled,
	});
}
export async function fetchProjectById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/projects/fetchDoc/${id}`);
		return data as TProjectDTO;
	} catch (error) {
		throw error;
	}
}
export function useClientById({ enabled, id }: { enabled: boolean; id: string }) {
	return useQuery({
		queryKey: ["project-by-id", id],
		queryFn: async () => await fetchProjectById({ id }),
		refetchOnWindowFocus: false,
	});
}

async function fetchBirthDays() {
	try {
		const { data } = await axios.get("/api/stats/clients-birthday");
		return data as TBirthdayRecord[];
	} catch (error) {
		throw error;
	}
}

type UseBirthdaysFilters = {
	name: string;
	isToday: boolean;
};
export function useClientsBirthdays() {
	const [filters, setFilters] = useState<UseBirthdaysFilters>({
		name: "",
		isToday: false,
	});
	function matchIsToday(birthday: TBirthdayRecord) {
		if (!filters.isToday) return true;
		const birthdayDate = new Date(birthday.dataNascimento).getDate();
		const todayDate = new Date().getDate();
		return birthdayDate === todayDate;
	}
	function matchName(birthday: TBirthdayRecord) {
		if (filters.name.trim().length === 0) return true;
		return birthday.nome.toUpperCase().includes(filters.name.toUpperCase());
	}
	function handelModelData(data: TBirthdayRecord[]) {
		return data.filter((birthday) => matchIsToday(birthday) && matchName(birthday));
	}
	return {
		...useQuery({
			queryKey: ["clients-birthdays"],
			queryFn: fetchBirthDays,
			select: (data) => handelModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchSellerSales() {
	try {
		const { data } = await axios.get("/api/projects/por-vendedor");
		return data.data as TProjectDTO[];
	} catch (error) {
		throw error;
	}
}

type UseSellerSalesFilters = {
	search: string;
	city: string[];
	deliveryStatus: string[];
	executionStatus: string[];
	inspectionStatus: string[];
	grantingStatus: string[];
	date: {
		after: string | null;
		before: string | null;
		field: string | null;
	};
};
export function useSellerSales() {
	const [filters, setFilters] = useState<UseSellerSalesFilters>({
		search: "",
		city: [],
		deliveryStatus: [],
		executionStatus: [],
		inspectionStatus: [],
		grantingStatus: [],
		date: {
			after: null,
			before: null,
			field: null,
		},
	});
	function matchSearch(project: TProjectDTO) {
		if (filters.search.trim().length === 0) return true;
		return formatWithoutDiacritics(project.nomeDoContrato, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function matchCity(project: TProjectDTO) {
		if (filters.city.length === 0) return true;
		return filters.city.includes(project.cidade);
	}
	function matchDeliveryStatus(project: TProjectDTO) {
		if (filters.deliveryStatus.length === 0) return true;
		return filters.deliveryStatus.includes(project.compra?.statusEntrega || "");
	}
	function matchExecutionStatus(project: TProjectDTO) {
		if (filters.executionStatus.length === 0) return true;
		return filters.executionStatus.includes(project.obra?.statusDaObra || "");
	}
	function matchInspectionStatus(project: TProjectDTO) {
		if (filters.inspectionStatus.length === 0) return true;
		return filters.inspectionStatus.includes(project.vistoria?.status || "");
	}
	function matchGrantingStatus(project: TProjectDTO) {
		if (filters.grantingStatus.length === 0) return true;
		return filters.grantingStatus.includes(project.homologacao.status);
	}
	function matchDate(project: TProjectDTO) {
		if (!filters.date.after || !filters.date.before || !filters.date.field) return true;
		const fieldValue = getProjectNestedFieldValue(project, filters.date.field);
		return (
			// @ts-ignore
			fieldValue >= filters.date.after &&
			// @ts-ignore
			fieldValue <= filters.date.before
		);
	}
	function handelModelData(data: TProjectDTO[]) {
		return data.filter(
			(project) =>
				matchSearch(project) &&
				matchCity(project) &&
				matchDeliveryStatus(project) &&
				matchExecutionStatus(project) &&
				matchInspectionStatus(project) &&
				matchGrantingStatus(project) &&
				matchDate(project),
		);
	}
	return {
		...useQuery({
			queryKey: ["seller-sales"],
			queryFn: fetchSellerSales,
			select: (data) => handelModelData(data),
		}),
		filters,
		setFilters,
	};
}
