import type { TGetContaAzulV2IntegrationOutput } from "@/pages/api/integracao/conta-azul-v2";
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

async function fetchContaAzulV2Integration() {
	const { data } = await axios.get<TGetContaAzulV2IntegrationOutput>("/api/integracao/conta-azul-v2");
	return data.data;
}

export function useContaAzulV2Integration() {
	return {
		...useQuery({
			queryKey: ["conta-azul-v2-integration"],
			queryFn: fetchContaAzulV2Integration,
		}),
		queryKey: ["conta-azul-v2-integration"],
	};
}
