import type {
	TCreateTransportControlInput,
	TCreateTransportControlOutput,
	TUpdateTransportControlInput,
	TUpdateTransportControlOutput,
} from "@/pages/api/controles-transportes";
import type { TUpdateTransportControlItemInput, TUpdateTransportControlItemOutput } from "@/pages/api/controles-transportes/itens";
import axios from "axios";

export async function createTransportControl(info: TCreateTransportControlInput) {
	const { data } = await axios.post<TCreateTransportControlOutput>("/api/controles-transportes", info);
	return data;
}

export async function updateTransportControl(info: TUpdateTransportControlInput) {
	const { data } = await axios.put<TUpdateTransportControlOutput>(`/api/controles-transportes?id=${info.transportControlId}`, info);
	return data;
}

export async function updateTransportControlItem(info: TUpdateTransportControlItemInput) {
	const { data } = await axios.put<TUpdateTransportControlItemOutput>("/api/controles-transportes/itens", info);
	return data;
}
