import type { TDisconnectWhatsappIntegrationOutput } from "@/pages/api/integracao/whatsapp/connect";
import axios from "axios";

export default async function disconnectWhatsappIntegration() {
	const { data } = await axios.delete<TDisconnectWhatsappIntegrationOutput>("/api/integracao/whatsapp/connect");
	return data;
}
