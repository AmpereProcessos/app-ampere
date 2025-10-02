import type {
	TCreateContractTemplateInput,
	TCreateContractTemplateOutput,
	TUpdateContractTemplateInput,
	TUpdateContractTemplateOutput,
} from "@/pages/api/templates-contrato";
import axios from "axios";

export async function createContractTemplate(input: TCreateContractTemplateInput) {
	const { data } = await axios.post<TCreateContractTemplateOutput>("/api/templates-contrato", input);
	return data;
}

export async function updateContractTemplate(input: TUpdateContractTemplateInput) {
	const { data } = await axios.put<TUpdateContractTemplateOutput>("/api/templates-contrato", input);
	return data;
}
