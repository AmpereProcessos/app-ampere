import type {
	TCreateCertificationInput,
	TCreateCertificationOutput,
	TUpdateCertificationInput,
	TUpdateCertificationOutput,
} from "@/pages/api/certificacoes";
import axios from "axios";

export async function createCertification(input: TCreateCertificationInput) {
	const { data } = await axios.post<TCreateCertificationOutput>("/api/certificacoes", input);
	return data;
}

export async function updateCertification(input: TUpdateCertificationInput) {
	const { data } = await axios.put<TUpdateCertificationOutput>("/api/certificacoes", input);
	return data;
}
