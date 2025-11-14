import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export async function createReceiptAccount(info) {
	try {
		const { data } = await axios.post("/api/configuracoes/contasDeRecebimento", { data: info });
		return data;
	} catch (error) {
		throw error;
	}
}

export function useInsertReceiptAccount() {
	return useMutation({
		mutationKey: ["create-receipt-account"],
		mutationFn: createReceiptAccount,
	});
}

async function editReceiptAccount({ id, info }) {
	try {
		const { data } = await axios.put(`/api/configuracoes/contasDeRecebimento?id=${id}`, { data: info });
		return data;
	} catch (error) {
		throw error;
	}
}
export function useEditReceiptAccount() {
	return useMutation({
		mutationKey: ["edit-receipt-account"],
		mutationFn: editReceiptAccount,
	});
}
