import axios from "axios";
import type { TServiceOrder, TServiceOrderTag } from "@/utils/schemas/service-order";

type CreateServiceOrderParams = {
	info: TServiceOrder;
};

export async function createServiceOrder({ info }: CreateServiceOrderParams) {
	try {
		const { data } = await axios.post("/api/ordensDeServico", info);
		if (typeof data.message !== "string") return "Ordem criada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

type UpdateServiceOrderParams = { changes: Partial<TServiceOrder>; id: string };
export async function updateServiceOrder({ changes, id }: UpdateServiceOrderParams) {
	try {
		const { data } = await axios.put(`/api/ordensDeServico?id=${id}`, changes);
		if (typeof data.message !== "string") return "Ordem atualizada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

type UpdateManyServiceOrdersByProjectIdParams = { projectId: string; filters: Record<string, any>; changes: Partial<TServiceOrder> };
export async function updateManyServiceOrdersByProjectId({ projectId, filters, changes }: UpdateManyServiceOrdersByProjectIdParams) {
	try {
		const { data } = await axios.put(`/api/ordensDeServico/many?projectId=${projectId}`, { filters, changes });
		if (typeof data.message !== "string") return "Ordem atualizada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

export type DeleteServiceOrderParams = {
	id: string;
};
export async function deleteServiceOrder({ id }: DeleteServiceOrderParams) {
	try {
		const { data } = await axios.delete(`/api/ordensDeServico?id=${id}`);
		if (typeof data.message !== "string") return "Ordem de serviço excluída com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

type CreateServiceOrderTagParams = {
	info: TServiceOrderTag;
};
export async function createServiceOrderTag({ info }: CreateServiceOrderTagParams) {
	try {
		const { data } = await axios.post("/api/ordensDeServico/tags", info);
		if (typeof data.message !== "string") return "Etiqueta de ordem de serviço criada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}

type UpdateServiceOrderTagParams = {
	id: string;
	changes: Partial<TServiceOrderTag>;
};

export async function updateServiceOrderTag({ id, changes }: UpdateServiceOrderTagParams) {
	try {
		const { data } = await axios.put(`/api/ordensDeServico/tags?id=${id}`, changes);
		if (typeof data.message !== "string") return "Etiqueta de ordem de serviço atualizada com sucesso !";
		return data.message as string;
	} catch (error) {
		throw error;
	}
}
