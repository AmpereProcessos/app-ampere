import type { TCreateColaboratorInput, TCreateColaboratorOutput, TEditColaboratorInput, TEditColaboratorOutput } from "@/pages/api/colaboradores";
import type { TEmployee } from "@/utils/schemas/users";
import axios from "axios";

export async function createEmployee(input: TCreateColaboratorInput) {
	const { data } = await axios.post<TCreateColaboratorOutput>("/api/colaboradores", input);
	return data;
}

export async function updateEmployee(input: TEditColaboratorInput) {
	const { data } = await axios.put<TEditColaboratorOutput>(`/api/colaboradores?id=${input.id}`, input.changes);
	return data;
}
