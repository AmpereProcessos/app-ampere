import type { TGetRefreshContaAzulV2IntegrationOutput } from "@/pages/api/integracao/conta-azul-v2";
import type { TDisconnectWhatsappIntegrationOutput } from "@/pages/api/integracao/whatsapp/connect";
import axios from "axios";

export async function disconnectWhatsappIntegration() {
	const { data } = await axios.delete<TDisconnectWhatsappIntegrationOutput>("/api/integracao/whatsapp/connect");
	return data;
}
export async function refreshContaAzulV2Integration() {
	const { data } = await axios.post<TGetRefreshContaAzulV2IntegrationOutput>("/api/integracao/conta-azul-v2");
	return data;
}
