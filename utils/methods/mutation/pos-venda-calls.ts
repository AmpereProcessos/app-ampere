import type {
	TCreatePosVendaCallInput,
	TCreatePosVendaCallOutput,
	TUpdatePosVendaCallOutput,
	TUpdatePosVendaCallInput,
	TDeletePosVendaCallOutput,
	TDeletePosVendaCallInput,
} from "@/app/api/chamados/posvenda/route";
import axios from "axios";

export async function createPosVendaCall(info: TCreatePosVendaCallInput) {
	try {
		const { data }: { data: TCreatePosVendaCallOutput } = await axios.post("/api/chamados/posvenda", info);

		return data;
	} catch (error) {
		console.log("Error running createPosVendaCall", error);
		throw error;
	}
}

export async function updatePosVendaCall({ id, call }: TUpdatePosVendaCallInput) {
	try {
		const { data }: { data: TUpdatePosVendaCallOutput } = await axios.put(`/api/chamados/posvenda?id=${id}`, { id, call });
		return data;
	} catch (error) {
		console.log("Error running updatePosVendaCall", error);
		throw error;
	}
}

export async function deletePosVendaCall({ id }: TDeletePosVendaCallInput) {
	try {
		const { data }: { data: TDeletePosVendaCallOutput } = await axios.delete("/api/chamados/posvenda", {
			data: { id },
		});

		return data.data;
	} catch (error) {
		console.log("Error running deletePosVendaCall", error);
		throw error;
	}
}
