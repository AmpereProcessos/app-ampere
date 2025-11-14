import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export async function fetchReceiptAccounts() {
	try {
		const { data } = await axios.get("/api/configuracoes/contasDeRecebimento");
		if (!data) return [];
		if (!Array.isArray(data)) return [];
		return data;
	} catch (error) {
		throw error;
	}
}

export function useReceiptAccounts(enabled) {
	return useQuery({
		queryKey: ["receiptAccounts"],
		queryFn: fetchReceiptAccounts,
		refetchOnWindowFocus: false,
		enabled: !!enabled,
	});
}
export async function fetchReceiptAccountById(id) {
	try {
		const { data } = await axios.get(`/api/configuracoes/contasDeRecebimento?id=${id}`);
		if (!data) throw new Error("Conta não encontrada.");
		return data;
	} catch (error) {
		throw error;
	}
}
export function useReceiptAccountById(id) {
	return useQuery({
		queryKey: ["receiptAccount", id],
		queryFn: async () => fetchReceiptAccountById(id),
		refetchOnWindowFocus: false,
	});
}
