import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { orientacoes } from "../constants";
import genFactors from "../jsons/fatores-geracao.json";

export async function getCEPInfo(cep) {
	try {
		const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
		console.log(data.erro);
		if (data.erro) throw new Error("Erro");
		return data;
	} catch (error) {
		console.log(error);
		toast.error("Erro ao buscar informações à partir do CEP.");
		return null;
	}
}

export function isEmpty(value) {
	return value == null || (typeof value === "string" && value.trim().length === 0);
}

export function formatDateInputChange<T extends "date" | "string" | undefined>(
	value: any,
	returnType?: T,
	normalizeHours = true,
): T extends "date" ? Date : string | null {
	if (value === null) return null as any;
	if (Number.isNaN(new Date(value).getMilliseconds())) return null as any;
	if (!returnType || returnType === "string") {
		if (!normalizeHours) return new Date(value).toISOString() as any;
		return dayjs(new Date(value)).add(3, "hours").toISOString() as any;
	}
	if (!normalizeHours) return new Date(value) as any;
	return dayjs(new Date(value)).add(3, "hours").toDate() as any;
}

export function pushToAuthPage(router) {
	router.push("/auth/signin");
}
export function getGenFactorByOrientation({ city, uf, orientation }) {
	if (!city || !uf) return 127;
	var cityFactor = genFactors.find((genFactor) => genFactor.CIDADE == city && genFactor.UF == uf);
	if (!cityFactor) return 127;

	// Checking for existing orientations
	if (orientation && orientacoes.includes(orientation)) return cityFactor[orientation];
	// In case no orientation or invalid orientation is provided, returning annual generation factor
	else return cityFactor.ANUAL;
}

export function getFirstDayOfMonth(year, month) {
	return new Date(year, month, 1);
}
export function getLastDayOfMonth(year, month) {
	return new Date(year, month + 1, 0);
}

export type TMutationCallbacks = {
	onMutate?: () => void;
	onSuccess?: () => void;
	onError?: () => void;
	onSettled?: () => void;
};
