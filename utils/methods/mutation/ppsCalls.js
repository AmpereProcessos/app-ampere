import axios from "axios";

export async function saveCallChanges({ id, changes }) {
	try {
		const { data } = await axios.put(`/api/chamados/pps/mainData?id=${id}`, { changes: changes });
		console.log(data);
		return data;
	} catch (error) {
		throw error;
	}
}
export async function createCall({ info }) {
	try {
		const { data } = await axios.post("/api/chamados/pps/mainData", info);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function deletePPSCall({ id }) {
	try {
		const { data } = await axios.delete("/api/chamados/pps/mainData", {
			data: { id },
		});
		return data;
	} catch (error) {
		throw error;
	}
}
