import type { TUpdateProjectRestrictionInput, TUpdateProjectRestrictionOutput } from "@/pages/api/projects/restricao";
import axios from "axios";

type UpdateProjectParams = {
	id: string;
	changes: { [key: string]: any };
};
export async function updateProject({ id, changes }: UpdateProjectParams) {
	try {
		const { data: response } = await axios.post(`/api/projects/update/${id}`, changes);
		return response;
	} catch (error) {
		throw error;
	}
}

export async function updateProjectRestriction(payload: TUpdateProjectRestrictionInput) {
	try {
		const { data: response } = await axios.post<TUpdateProjectRestrictionOutput>("/api/projects/restricao", payload);
		return response;
	} catch (error) {
		throw error;
	}
}
