import type { TGetWhatsappTemplatesInput, TGetWhatsappTemplatesOutput } from "@/pages/api/whatsapp/templates";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchWhatsappTemplates() {
	const { data } = await axios.get<TGetWhatsappTemplatesOutput>("/api/whatsapp/templates");
	if (!data.data.default) throw new Error("Erro ao buscar templates do WhatsApp.");
	return data.data.default;
}

export function useWhatsappTemplates() {
	return {
		...useQuery({
			queryKey: ["whatsapp-templates"],
			queryFn: fetchWhatsappTemplates,
		}),
		queryKey: ["whatsapp-templates"],
	};
}

async function fetchWhatsappTemplateById(input: TGetWhatsappTemplatesInput) {
	const { data } = await axios.get<TGetWhatsappTemplatesOutput>(`/api/whatsapp/templates?id=${input.id}`);
	if (!data.data.byId) throw new Error("Erro ao buscar template do WhatsApp.");
	return data.data.byId;
}

export function useWhatsappTemplateById({ id }: { id: string }) {
	return {
		...useQuery({
			queryKey: ["whatsapp-template-by-id", id],
			queryFn: () => fetchWhatsappTemplateById({ id }),
		}),
		queryKey: ["whatsapp-template-by-id", id],
	};
}
