import type { TUpdateFunnelReferenceInput } from "@/pages/api/crm/opportunities/funnel-references";
import type { TCreateInteractionInput } from "@/pages/api/crm/opportunities/interactions";
import type { TOpportunity } from "@/utils/schemas/crm/opportunity.schema";
import axios from "axios";

export async function updateOpportunity({ id, changes }: { id: string; changes: Partial<TOpportunity> | any }) {
	try {
		const { data } = await axios.put(`/api/crm/opportunities?id=${id}`, changes);
		if (typeof data.message !== "string") return "Oportunidade atualizada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

export async function createOpportunityInteraction({ info }: { info: TCreateInteractionInput }) {
	try {
		const { data } = await axios.post("/api/crm/opportunities/interactions", info);
		if (typeof data.message !== "string") return "Interação criada com sucesso !";
		return data.message as string;
	} catch (error) {
		console.log("Error creating opportunity interaction", error);
		throw error;
	}
}

export async function updateOpportunityFunnelReference({ id, changes }: { id: string; changes: TUpdateFunnelReferenceInput }) {
	try {
		const { data } = await axios.put(`/api/crm/opportunities/funnel-references?id=${id}`, changes);
		if (typeof data.message !== "string") return "Referência atualizada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}
