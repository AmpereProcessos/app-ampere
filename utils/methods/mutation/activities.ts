import { TActivity } from "@/utils/schemas/activities";
import axios from "axios";

export async function createActivity({ info }: { info: TActivity }) {
	try {
		const { data } = await axios.post("/api/atividades", info);
		if (typeof data.message != "string") return "Atividade criada com sucesso !";
		return data.message;
	} catch (error) {
		throw error;
	}
}

type UpdateActivityParams = {
	id: string;
	changes: Partial<TActivity>;
};
export async function updateActivity({ id, changes }: UpdateActivityParams) {
	try {
		const { data } = await axios.put(`/api/atividades?id=${id}`, changes);
		if (typeof data.message != "string") return "Atividade atualizada com sucesso !";
		return data.message;
	} catch (error) {
		throw error;
	}
}
