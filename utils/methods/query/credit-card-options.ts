import { TCreditCardOptionDTO } from "@/utils/schemas/credit-card-options";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function fetchCreditCardOptions() {
	try {
		const { data } = await axios.get("/api/utils/opcoes-cartoes-credito");

		return data.data as TCreditCardOptionDTO[];
	} catch (error) {
		throw error;
	}
}

export function useCreditCardOptions() {
	return useQuery({
		queryKey: ["credit-card-options"],
		queryFn: fetchCreditCardOptions,
	});
}

async function fetchCreditCardOptionById({ id }: { id: string }) {
	try {
		const { data } = await axios.get(`/api/utils/opcoes-cartoes-credito?id=${id}`);

		return data.data as TCreditCardOptionDTO;
	} catch (error) {
		throw error;
	}
}

export function useCreditCardOptionById({ id }: { id: string }) {
	return useQuery({
		queryKey: ["credit-card-option-by-id", id],
		queryFn: async () => await fetchCreditCardOptionById({ id }),
	});
}
