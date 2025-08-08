import type { TCreateNotificationInput, TCreateNotificationOutput } from "@/pages/api/notificacoes";
import type { TNotificationDTO } from "@/utils/schemas/notifications";
import axios from "axios";

export async function createNotification({ info }: { info: TCreateNotificationInput }) {
	try {
		const { data } = await axios.post<TCreateNotificationOutput>("/api/notificacoes", info);
		return data;
	} catch (error) {
		throw error;
	}
}

// deprecated
export async function editNotification({ id, changes }: { id: string; changes: Partial<TNotificationDTO> }) {
	try {
		const { data } = await axios.put(`/api/notificacoes?id=${id}`, changes);
		if (typeof data.message !== "string") return "Notificação atualizada com sucesso !";
		return data.message;
	} catch (error) {
		throw error;
	}
}
