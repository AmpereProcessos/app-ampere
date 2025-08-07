import type {
	TCreateTemporaryUsageInput,
	TCreateTemporaryUsageOutput,
	TUpdatePropertyTemporaryUsageInput,
	TUpdatePropertyTemporaryUsageOutput,
} from "@/pages/api/propriedades/uso-temporario";
import type { TProperty } from "@/utils/schemas/properties";
import axios from "axios";

export async function createProperty({ info }: { info: TProperty }) {
	try {
		const { data } = await axios.post("/api/propriedades", info);
		if (typeof data.message !== "string") return "Propriedade criada com sucesso !";
		return data.message;
	} catch (error) {
		throw error;
	}
}

export async function updateProperty({ id, changes }: { id: string; changes: Partial<TProperty> }) {
	try {
		const { data } = await axios.put(`/api/propriedades?id=${id}`, changes);
		if (typeof data.message !== "string") return "Atualização feita com sucesso !";
		return data.message;
	} catch (error) {
		throw error;
	}
}

export async function createPropertyUsage({ info }: { info: TCreateTemporaryUsageInput }) {
	try {
		const { data }: { data: TCreateTemporaryUsageOutput } = await axios.post("/api/propriedades/uso-temporario", info);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function updatePropertyUsage({ id, changes }: TUpdatePropertyTemporaryUsageInput) {
	try {
		const { data }: { data: TUpdatePropertyTemporaryUsageOutput } = await axios.put(`/api/propriedades/uso-temporario?id=${id}`, {
			id,
			changes,
		});
		return data;
	} catch (error) {
		throw error;
	}
}
