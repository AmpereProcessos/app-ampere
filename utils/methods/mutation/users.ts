import type { TUpdateProfileInput, TUpdateProfileOutput } from "@/pages/api/colaboradores/perfil";
import axios from "axios";

export async function updateProfile({ input }: { input: TUpdateProfileInput }) {
	try {
		const { data } = await axios.put<TUpdateProfileOutput>("/api/colaboradores/perfil", input);
		return data;
	} catch (error) {
		console.log("Error updating profile", error);
		throw error;
	}
}
