import axios from "axios";
import { useMutation } from "@tanstack/react-query";

async function createApportionment(info) {
	try {
		const { data } = await axios.post("/api/configuracoes/centrosDeCusto", { data: info });
		return data;
	} catch (error) {
		throw error;
	}
}

export function useInsertApportionment() {
	return useMutation({
		mutationKey: ["create-apportionment"],
		mutationFn: createApportionment,
	});
}

async function editApportionment({ id, info }) {
	console.log(id, info);
	try {
		const { data } = await axios.put(`/api/configuracoes/centrosDeCusto?id=${id}`, { data: info });
		return data;
	} catch (error) {
		throw error;
	}
}
export function useEditApportionment() {
	return useMutation({
		mutationKey: ["edit-apportionment"],
		mutationFn: editApportionment,
	});
}
