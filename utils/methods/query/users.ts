import { useDebounceMemo } from "@/lib/hooks/debounce";
import type { TGetEmployeesDefaultInput, TGetEmployeesOutput } from "@/pages/api/colaboradores";
import type { TGetProfileOutput } from "@/pages/api/colaboradores/perfil";
import type { TEmployeeSearchInput, TEmployeeSearchOutput } from "@/pages/api/colaboradores/pesquisa-vinculacao";
import type { TEmployeeDTO, TUserDTO } from "@/utils/schemas/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics } from "../formatting";

async function fetchUsers() {
	try {
		const { data } = await axios.get("/api/usuarios");
		return data.data as TUserDTO[];
	} catch (error) {
		console.log("Error fetching users", error);
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
		queryKey: ["users-simplified"],
		filters,
		setFilters,
	};
}
async function fetchUserById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/usuarios?id=${id}`);
		return data.data as TUserDTO;
	} catch (error) {
		console.log("Error fetching user by id", error);
		throw error;
	}
}
export function useUserById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["user-by-id", id],
			queryFn: async () => await fetchUserById({ id }),
		}),
		queryKey: ["user-by-id", id],
	};
}
async function fetchEmployees(input: TGetEmployeesDefaultInput) {
	try {
		const searchParams = new URLSearchParams();
		if (input.search) searchParams.set("search", input.search);
		if (input.activeOnly) searchParams.set("activeOnly", input.activeOnly.toString());
		if (input.accessActiveOnly) searchParams.set("accessActiveOnly", input.accessActiveOnly.toString());
		const url = `/api/colaboradores?${searchParams.toString()}`;
		const { data } = await axios.get<TGetEmployeesOutput>(url);
		if (!data.data.default) throw new Error("Colaboradores não encontrados.");
		return data.data.default;
	} catch (error) {
		console.log("Error fetching employees", error);
		throw error;
	}
}

type UseEmployeesParams = {
	initialFilters?: Partial<TGetEmployeesDefaultInput>;
};
export function useEmployees({ initialFilters }: UseEmployeesParams = {}) {
	const [filters, setFilters] = useState<TGetEmployeesDefaultInput>({
		search: initialFilters?.search ?? "",
		activeOnly: initialFilters?.activeOnly ?? true,
		accessActiveOnly: initialFilters?.accessActiveOnly ?? false,
	});

	function updateFilters(filters: Partial<TGetEmployeesDefaultInput>) {
		setFilters((prev) => ({
			...prev,
			...filters,
		}));
	}
	const debouncedFilters = useDebounceMemo(filters, 1000);
	return {
		...useQuery({
			queryKey: ["employees", debouncedFilters],
			queryFn: async () => await fetchEmployees(debouncedFilters),
		}),
		queryKey: ["employees", debouncedFilters],
		filters,
		updateFilters,
	};
}

async function fetchEmployeeById({ id }: { id: string }) {
	try {
		const { data } = await axios.get<TGetEmployeesOutput>(`/api/colaboradores?id=${id}`);
		if (!data.data.byId) throw new Error("Colaborador não encontrado.");
		return data.data.byId;
	} catch (error) {
		console.log("Error fetching employee by id", error);
		throw error;
	}
}

export function useEmployeeById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["employee-by-id", id],
			queryFn: async () => fetchEmployeeById({ id }),
		}),
		queryKey: ["employee-by-id", id],
	};
}

export async function fetchEmployeeBySearch({ input }: { input: TEmployeeSearchInput }) {
	try {
		const { data }: { data: TEmployeeSearchOutput } = await axios.get(`/api/colaboradores/pesquisa-vinculacao?cpf=${input.cpf}&email=${input.email}`);
		return data.data;
	} catch (error) {
		console.log("Error fetching employee by search", error);
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

async function fetchProfile() {
	try {
		const { data } = await axios.get<TGetProfileOutput>("/api/colaboradores/perfil");
		return data.data;
	} catch (error) {
		console.log("Error fetching profile", error);
		throw error;
	}
}

export function useProfile() {
	return {
		...useQuery({
			queryKey: ["profile"],
			queryFn: fetchProfile,
		}),
		queryKey: ["profile"],
	};
}
