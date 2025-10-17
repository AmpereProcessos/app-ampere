import type { TGetWhatsappIntegrationOutput } from "@/pages/api/integracao/whatsapp/connect";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchWhatsappIntegration() {
	const { data } = await axios.get<TGetWhatsappIntegrationOutput>("/api/integracao/whatsapp/connect");
	return data.data;
}

export function useWhatsappIntegration() {
	return {
		...useQuery({
			queryKey: ["whatsapp-integration"],
			queryFn: fetchWhatsappIntegration,
		}),
		queryKey: ["whatsapp-integration"],
	};
}
