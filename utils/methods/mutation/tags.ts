import type { TCreateTagRouteInput, TCreateTagRouteOutput, TUpdateTagRouteInput, TUpdateTagRouteOutput } from "@/pages/api/tags";
import axios from "axios";

export async function createTag({ tag }: { tag: TCreateTagRouteInput }) {
	try {
		if (tag.titulo.trim().length < 2) throw new Error("O título da tag deve conter pelo menos 2 caracteres.");
		const { data } = await axios.post("/api/tags", tag);
		const result = data.data as TCreateTagRouteOutput;
		if (!result.insertedId) throw new Error("Oops, houve um erro desconhecido ao criar a tag.");
		return result;
	} catch (error) {
		console.log("Error running createTag");
		throw error;
	}
}

export async function updateTag({ id, changes }: { id: string; changes: TUpdateTagRouteInput }) {
	try {
		const { data } = await axios.put(`/api/tags/${id}`, changes);
		const result = data.data as TUpdateTagRouteOutput;
		if (!result.updatedId) throw new Error("Oops, houve um erro desconhecido ao atualizar a tag.");
		return result.message;
	} catch (error) {
		console.log("Error running updateTag");
		throw error;
	}
}
