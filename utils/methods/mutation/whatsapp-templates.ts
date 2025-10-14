import type {
	TCreateWhatsappTemplateInput,
	TCreateWhatsappTemplateOutput,
	TDeleteWhatsappTemplateInput,
	TDeleteWhatsappTemplateOutput,
	TUpdateWhatsappTemplateInput,
	TUpdateWhatsappTemplateOutput,
} from "@/pages/api/whatsapp/templates";
import axios from "axios";

export async function createWhatsappTemplate(input: TCreateWhatsappTemplateInput) {
	const { data } = await axios.post<TCreateWhatsappTemplateOutput>("/api/whatsapp/templates", input);
	return data;
}

export async function updateWhatsappTemplate(input: TUpdateWhatsappTemplateInput) {
	const { data } = await axios.put<TUpdateWhatsappTemplateOutput>("/api/whatsapp/templates", input);
	return data;
}

export async function deleteWhatsappTemplate(input: TDeleteWhatsappTemplateInput) {
	const { data } = await axios.delete<TDeleteWhatsappTemplateOutput>("/api/whatsapp/templates", {
		data: input,
	});
	return data;
}
