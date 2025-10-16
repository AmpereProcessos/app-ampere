import { useDebounceMemo } from "@/lib/hooks/debounce";
import type {
	TGetCertificationsInput,
	TGetCertificationsOutput,
	TGetCertificationsOutputById,
	TGetCertificationsOutputDefault,
} from "@/pages/api/certificacoes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

async function fetchCertifications(input: Pick<TGetCertificationsInput, "search">) {
	const urlParams = new URLSearchParams();
	if ("search" in input) urlParams.set("search", input.search || "");
	const { data } = await axios.get<TGetCertificationsOutput>(`/api/certificacoes?${urlParams.toString()}`);
	if (!data.data.default) throw new Error("Erro ao buscar certificações.");
	return data.data.default;
}

type useCertificationsProps = {
	initialFilters?: Pick<TGetCertificationsInput, "search">;
};
export function useCertifications({ initialFilters }: useCertificationsProps = {}) {
	const [filters, setFilters] = useState<Pick<TGetCertificationsInput, "search">>({
		search: initialFilters?.search ?? "",
	});
	function updateFilters(changes: Partial<Pick<TGetCertificationsInput, "search">>) {
		setFilters((prev) => ({ ...prev, ...changes }));
	}
	const queryParamsDebounced = useDebounceMemo(filters, 1000);
	return {
		...useQuery({
			queryKey: ["certifications", queryParamsDebounced],
			queryFn: () => fetchCertifications(queryParamsDebounced),
		}),
		queryKey: ["certifications", queryParamsDebounced],
		filters,
		updateFilters,
	};
}

async function fetchCertificationById(input: TGetCertificationsInput) {
	const { data } = await axios.get<TGetCertificationsOutput>(`/api/certificacoes?id=${input.id}`);
	if (!data.data.byId) throw new Error("Erro ao buscar certificação.");
	return data.data.byId;
}

export function useCertificationById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["certification-by-id", id],
			queryFn: () => fetchCertificationById({ id }),
		}),
		queryKey: ["certification-by-id", id],
	};
}
