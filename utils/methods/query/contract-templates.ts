import type { TGetContractTemplatesInput, TGetContractTemplatesOutput } from "@/pages/api/templates-contrato";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchContractTemplates() {
	const { data } = await axios.get<TGetContractTemplatesOutput>("/api/templates-contrato");
	if (!data.data.default) throw new Error("Erro ao buscar templates de contrato.");
	return data.data.default;
}

export function useContractTemplates() {
	return {
		...useQuery({
			queryKey: ["contract-templates"],
			queryFn: fetchContractTemplates,
		}),
		queryKey: ["contract-templates"],
	};
}

async function fetchContractTemplateById(input: TGetContractTemplatesInput) {
	const { data } = await axios.get<TGetContractTemplatesOutput>(`/api/templates-contrato?id=${input.id}`);
	if (!data.data.byId) throw new Error("Erro ao buscar template de contrato.");
	return data.data.byId;
}

export function useContractTemplateById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["contract-template-by-id", id],
			queryFn: () => fetchContractTemplateById({ id }),
		}),
		queryKey: ["contract-template-by-id", id],
	};
}
