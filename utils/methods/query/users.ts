import type { TEmployeeDTO, TUserDTO } from "@/utils/schemas/users";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatWithoutDiacritics } from "../formatting";
import type { TEmployeeSearchInput, TEmployeeSearchOutput } from "@/pages/api/colaboradores/pesquisa-vinculacao";
import { useDebounceMemo } from "@/lib/hooks/debounce";

async function fetchUsers() {
	try {
		const { data } = await axios.get("/api/usuarios");
		return data.data as TUserDTO[];
	} catch (error) {
		throw error;
	}
}
export function useUsers() {
	const [filters, setFilters] = useState({
		search: "",
	});

	function matchSearch(user: TUserDTO) {
		if (filters.search.trim().length === 0) return true;
		return formatWithoutDiacritics(user.nome, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function handleModelData(data: TUserDTO[]) {
		return data.filter((user) => matchSearch(user));
	}
	return {
		...useQuery({
			queryKey: ["users-simplified"],
			queryFn: fetchUsers,
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}
async function fetchUserById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/usuarios?id=${id}`);
		return data.data as TUserDTO;
	} catch (error) {}
}
export function useUserById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["user-by-id", id],
		queryFn: async () => await fetchUserById({ id }),
	});
}
async function fetchEmployees({ active }: { active: boolean }) {
	try {
		const { data } = await axios.get(`/api/colaboradores?active=${active}`);
		return data.data as TEmployeeDTO[];
	} catch (error) {
		throw error;
	}
}

export function useEmployees({ active }: { active: boolean }) {
	const [filters, setFilters] = useState({
		search: "",
	});

	function matchSearch(employee: TEmployeeDTO) {
		if (filters.search.trim().length === 0) return true;
		return formatWithoutDiacritics(employee.nome, true).includes(formatWithoutDiacritics(filters.search, true));
	}
	function handleModelData(data: TEmployeeDTO[]) {
		return data.filter((employee) => matchSearch(employee));
	}
	return {
		...useQuery({
			queryKey: ["employees", active],
			queryFn: async () => await fetchEmployees({ active }),
			select: (data) => handleModelData(data),
		}),
		filters,
		setFilters,
	};
}

async function fetchEmployeeById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/colaboradores?id=${id}`);
		return data.data as TEmployeeDTO;
	} catch (error) {
		throw error;
	}
}

export function useEmployeeById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["employee-by-id", id],
		queryFn: async () => fetchEmployeeById({ id }),
	});
}

export async function fetchEmployeeBySearch({ input }: { input: TEmployeeSearchInput }) {
	try {
		const { data }: { data: TEmployeeSearchOutput } = await axios.get(`/api/colaboradores/pesquisa-vinculacao?cpf=${input.cpf}&email=${input.email}`);
		return data.data;
	} catch (error) {
		throw error;
	}
}

type UseEmployeeBySearchParams = {
	initialQueryParams?: Partial<TEmployeeSearchInput>;
};
export function useEmployeeBySearch({ initialQueryParams }: UseEmployeeBySearchParams = {}) {
	const [queryParams, setQueryParams] = useState<TEmployeeSearchInput>({ cpf: initialQueryParams?.cpf ?? "", email: initialQueryParams?.email ?? "" });
	function updateQueryParams(params: Partial<TEmployeeSearchInput>) {
		setQueryParams((prev) => ({ ...prev, ...params }));
	}
	const debouncedQueryParams = useDebounceMemo(queryParams, 1000);
	return {
		...useQuery({
			queryKey: ["employee-by-search", debouncedQueryParams],
			queryFn: async () => await fetchEmployeeBySearch({ input: debouncedQueryParams }),
			enabled: debouncedQueryParams.cpf.length >= 14 || debouncedQueryParams.email.length >= 5,
			retry: false,
		}),

		queryParams,
		updateQueryParams,
	};
}
