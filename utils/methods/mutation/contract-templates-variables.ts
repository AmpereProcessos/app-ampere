import type { TUpdateContractTemplateVariableOutput } from "@/pages/api/templates-contrato/variaveis";
import type {
	TCreateContractTemplateVariableInput,
	TCreateContractTemplateVariableOutput,
	TUpdateContractTemplateVariableInput,
} from "@/pages/api/templates-contrato/variaveis";
import axios from "axios";

export async function createContractTemplateVariable(input: TCreateContractTemplateVariableInput) {
	const { data } = await axios.post<TCreateContractTemplateVariableOutput>("/api/templates-contrato/variaveis", input);
	return data;
}

export async function updateContractTemplateVariable(input: TUpdateContractTemplateVariableInput) {
	const { data } = await axios.put<TUpdateContractTemplateVariableOutput>("/api/templates-contrato/variaveis", input);
	return data;
}
