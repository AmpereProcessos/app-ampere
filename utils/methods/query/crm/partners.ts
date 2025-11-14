import { TPartnerSimplifiedDTO } from "@/utils/schemas/crm/partner.schema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

async function fetchPartners() {
	try {
		const { data } = await axios.get("/api/crm/partners");
		return data.data as TPartnerSimplifiedDTO[];
	} catch (error) {
		throw error;
	}
}

export function usePartnersSimplified() {
	return useQuery({
		queryKey: ["partners"],
		queryFn: fetchPartners,
	});
}
