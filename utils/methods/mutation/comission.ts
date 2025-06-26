import axios from "axios";

type UpdateProjectsComissionParams = {
	projects: {
		crmProjectId?: string;
		projectId: string;
		sellerCommission: number;
		insiderCommission: number;
	}[];
};
export async function updateAppProjectsComission({ projects }: UpdateProjectsComissionParams) {
	try {
		const { data } = await axios.post("/api/gestao/comissoes", { changes: projects });
		if (typeof data == "string") return data;
		return "Atualizações realizadas com sucesso.";
	} catch (error) {
		throw error;
	}
}

export async function bulkUpdateProjectsComission(projects: any) {
	try {
		const { data }: { data: any } = await axios.post("/api/gestao/comissoes/bulk", { projects });
		return data.message;
	} catch (error) {
		throw error;
	}
}
