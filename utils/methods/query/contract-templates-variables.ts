import type { TGetContractTemplateVariablesOutput, TGetContractTemplateVariablesOutputById } from "@/pages/api/templates-contrato/variaveis";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchContractTemplateVariables() {
	const { data } = await axios.get<TGetContractTemplateVariablesOutput>("/api/templates-contrato/variaveis");
	if (!data.data.default) throw new Error("Erro ao buscar variáveis de template de contrato.");
	return data.data.default;
}

export function useContractTemplateVariables() {
	return {
		...useQuery({
			queryKey: ["contract-template-variables"],
			queryFn: fetchContractTemplateVariables,
		}),
		queryKey: ["contract-template-variables"],
	};
}

async function fetchContractTemplateVariableById({ id }: { id: string }) {
	const { data } = await axios.get<TGetContractTemplateVariablesOutput>(`/api/templates-contrato/variaveis?id=${id}`);
	if (!data.data.byId) throw new Error("Erro ao buscar variável de template de contrato.");
	return data.data.byId;
}

export function useContractTemplateVariableById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["contract-template-variables-by-id", id],
			queryFn: () => fetchContractTemplateVariableById({ id }),
		}),
		queryKey: ["contract-template-variables-by-id", id],
	};
}
