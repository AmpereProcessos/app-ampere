import type {
	TCreateWarehouseFormularyInput,
	TCreateWarehouseFormularyOutput,
	TDeleteWarehouseFormularyInput,
	TUpdateWarehouseFormularyInput,
} from "@/pages/api/almoxarifado/formularios/index-two";
import type { TNewWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import axios from "axios";

export async function createWarehouseFormulary(input: TCreateWarehouseFormularyInput) {
	const { data } = await axios.post<TCreateWarehouseFormularyOutput>("/api/almoxarifado/formularios/index-two", input);
	return data;
}

export async function updateWarehouseFormulary(input: TUpdateWarehouseFormularyInput) {
	const { data } = await axios.put(`/api/almoxarifado/formularios/index-two?id=${input.warehouseFormularyId}`, input);
	return data;
}

export async function deleteWarehouseFormulary(input: TDeleteWarehouseFormularyInput) {
	const { data } = await axios.delete(`/api/almoxarifado/formularios/index-two?warehouseFormularyId=${input.warehouseFormularyId}`);
	return data;
}
