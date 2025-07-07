import { create } from "zustand";
import type { TPosVendaCall } from "../schemas/pos-venda-calls";

interface PosVendaCallStore extends TPosVendaCall {
	getState: () => TPosVendaCall;
	redefineState: (info: TPosVendaCall) => void;
	updateCall: (info: Partial<TPosVendaCall>) => void;
	addUpdateItem: (info: TPosVendaCall["atualizacoes"][number]) => void;
	updateUpdateItem: (info: { index: number; item: Partial<TPosVendaCall["atualizacoes"][number]> }) => void;
	removeUpdateItem: (index: number) => void;
	vinculateProject: (info: TPosVendaCall["projeto"]) => void;
	unvinculateProject: () => void;
	reset: () => void;
}

const initialState: TPosVendaCall = {
	titulo: "",
	status: "PENDENTE",
	descricao: "",
	projeto: null as TPosVendaCall["projeto"],
	atualizacoes: [],
	autor: null,
	metadados: {} as TPosVendaCall["metadados"],
	dataInsercao: new Date().toISOString(),
	dataUltimaAtualizacao: new Date().toISOString(),
};

export const usePosVendaCallStore = create<PosVendaCallStore>((set, get) => ({
	...initialState,
	redefineState: (info) => set(() => ({ ...info })),

	updateCall: (info) =>
		set((state) => ({
			...state,
			...info,
		})),

	addUpdateItem: (info) =>
		set((state) => ({
			...state,
			atualizacoes: [...state.atualizacoes, info],
		})),

	updateUpdateItem: (info) =>
		set((state) => ({
			...state,
			atualizacoes: state.atualizacoes.map((item, index) => (index === info.index ? { ...item, ...info.item } : item)),
		})),

	removeUpdateItem: (index) =>
		set((state) => ({
			...state,
			atualizacoes: state.atualizacoes.filter((_, i) => i !== index),
		})),

	vinculateProject: (info) =>
		set((state) => ({
			...state,
			projeto: info,
		})),

	unvinculateProject: () =>
		set((state) => ({
			...state,
			projeto: null,
		})),

	reset: () => set(() => ({ ...initialState })),

	getState: () => get(),
}));
