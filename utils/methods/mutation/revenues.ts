import { TUpdateReceiptPayload } from "@/pages/api/receitas/recebimentos";
import { TRevenue, TRevenueDTO } from "@/utils/schemas/revenues";
import axios from "axios";

export async function createRevenue({ info }: { info: TRevenue }) {
	try {
		const { data } = await axios.post("/api/receitas", info);
		if (typeof data.message != "string") return "Receita criada com sucesso!";
		return data.message;
	} catch (error) {
		throw error;
	}
}

export async function editRevenue({ id, changes }: { id: string; changes: Partial<TRevenueDTO> }) {
	try {
		const { data } = await axios.put(`/api/receitas?id=${id}`, changes);
		if (typeof data.message != "string") return "Receita atualizada com sucesso!";
		return data.message;
	} catch (error) {
		throw error;
	}
}

export async function updateRevenueReceipt({ receiptRevenueId, receiptIndex, receiptChanges }: TUpdateReceiptPayload) {
	try {
		const { data } = await axios.put(`/api/receitas/recebimentos`, { receiptRevenueId, receiptIndex, receiptChanges });
		if (typeof data.message != "string") return "Receita atualizada com sucesso!";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}
