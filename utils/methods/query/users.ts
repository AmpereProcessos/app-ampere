import { useDebounceMemo } from "@/lib/hooks/debounce";
import type {
  TGetEmployeesDefaultInput,
  TGetEmployeesOutput,
  TGetEmployeesSimplifiedInput,
} from "@/pages/api/colaboradores";
import type { TGetProfileOutput } from "@/pages/api/colaboradores/perfil";
import type {
  TEmployeeSearchInput,
  TEmployeeSearchOutput,
} from "@/pages/api/colaboradores/pesquisa-vinculacao";
import {
  type TGetUsersDefaultInput,
  TGetUsersInput,
  type TGetUsersOutput,
} from "@/pages/api/usuarios";
import type { TEmployeeDTO, TUserDTO } from "@/utils/schemas/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { formatWithoutDiacritics } from "../formatting";

async function fetchUsers(input: TGetUsersDefaultInput) {
  try {
    const searchParams = new URLSearchParams();
    if (input.search) searchParams.set("search", input.search);
    if (input.activeOnly) searchParams.set("activeOnly", input.activeOnly.toString());
    if (input.activeEmployeesOnly)
      searchParams.set("activeEmployeesOnly", input.activeEmployeesOnly.toString());
    if (input.byPermission) searchParams.set("byPermission", input.byPermission);
    const url = `/api/usuarios?${searchParams.toString()}`;
    const { data } = await axios.get<TGetUsersOutput>(url);
    if (!data.data.default) throw new Error("Usuários não encontrados.");
    return data.data.default;
  } catch (error) {
    console.log("Error fetching users", error);
    throw error;
  }
}

export type UseUsersParams = {
  initialFilters?: Partial<TGetUsersDefaultInput>;
};
export function useUsers({ initialFilters }: UseUsersParams = {}) {
  const [filters, setFilters] = useState<TGetUsersDefaultInput>({
    search: initialFilters?.search ?? "",
    activeOnly: initialFilters?.activeOnly ?? true,
    activeEmployeesOnly: initialFilters?.activeEmployeesOnly ?? false,
    byPermission: initialFilters?.byPermission ?? undefined,
  });

  function updateFilters(filters: Partial<TGetUsersDefaultInput>) {
    setFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  }
  const debouncedFilters = useDebounceMemo(filters, 1000);
  return {
    ...useQuery({
      queryKey: ["users-simplified", debouncedFilters],
      queryFn: async () => await fetchUsers(debouncedFilters),
    }),
    queryKey: ["users-simplified", debouncedFilters],
    filters,
    setFilters,
    updateFilters,
  };
}
async function fetchUserById({ id }: { id: string }) {
  try {
    const { data } = await axios.get<TGetUsersOutput>(`/api/usuarios?id=${id}`);
    if (!data.data.byId) throw new Error("Usuário não encontrado.");
    return data.data.byId;
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
    if (input.accessActiveOnly)
      searchParams.set("accessActiveOnly", input.accessActiveOnly.toString());
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

async function fetchEmployeesSimplified(input: TGetEmployeesSimplifiedInput) {
  const searchParams = new URLSearchParams();
  if (input.search) searchParams.set("search", input.search);
  if (input.activeOnly) searchParams.set("activeOnly", input.activeOnly.toString());
  if (input.accessActiveOnly)
    searchParams.set("accessActiveOnly", input.accessActiveOnly.toString());
  const url = `/api/colaboradores?simplified=true&${searchParams.toString()}`;
  const { data } = await axios.get<TGetEmployeesOutput>(url);
  const simplifiedReturn = data.data.simplified;
  if (!simplifiedReturn) throw new Error("Colaboradores não encontrados.");
  return simplifiedReturn;
}
type UseEmployeesSimplifiedParams = {
  initialFilters?: Partial<TGetEmployeesSimplifiedInput>;
};
export function useEmployeesSimplified({ initialFilters }: UseEmployeesSimplifiedParams) {
  const [filters, setFilters] = useState<TGetEmployeesSimplifiedInput>({
    search: initialFilters?.search ?? "",
    activeOnly: initialFilters?.activeOnly ?? true,
    accessActiveOnly: initialFilters?.accessActiveOnly ?? false,
    simplified: true,
  });
  function updateFilters(filters: Partial<TGetEmployeesSimplifiedInput>) {
    setFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  }
  const debouncedFilters = useDebounceMemo(filters, 1000);
  return {
    ...useQuery({
      queryKey: ["employees-simplified", debouncedFilters],
      queryFn: async () => await fetchEmployeesSimplified(debouncedFilters),
    }),
    queryKey: ["employees-simplified", debouncedFilters],
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
    const { data }: { data: TEmployeeSearchOutput } = await axios.get(
      `/api/colaboradores/pesquisa-vinculacao?cpf=${input.cpf}&email=${input.email}`,
    );
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
  const [queryParams, setQueryParams] = useState<TEmployeeSearchInput>({
    cpf: initialQueryParams?.cpf ?? "",
    email: initialQueryParams?.email ?? "",
  });
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
