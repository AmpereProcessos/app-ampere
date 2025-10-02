import { useState } from "react";
import z from "zod";
import type { ContractTemplateVariableComputedSchema, TContractTemplateVariableComputed } from "../schemas/contract-templates-variables";
import { ContractTemplateVariableSchema } from "../schemas/contract-templates-variables";

const ContractTemplateVariableState = z.object({
	variable: ContractTemplateVariableSchema,
});
export type TContractTemplateVariableState = z.infer<typeof ContractTemplateVariableState>;

type TUseContractTemplateVariableStateParams = {
	initialState?: Partial<TContractTemplateVariableState>;
};
export function useContractTemplateVariableState({ initialState }: TUseContractTemplateVariableStateParams) {
	const [state, setState] = useState<TContractTemplateVariableState>({
		variable: {
			titulo: initialState?.variable?.titulo || "",
			identificador: initialState?.variable?.identificador || "",
			descricao: initialState?.variable?.descricao || "",
			categoria: initialState?.variable?.categoria || "COMPUTADA",
			fallback: initialState?.variable?.categoria === "COMPUTADA" ? initialState?.variable?.fallback || "" : "",
			condicionais: initialState?.variable?.categoria === "COMPUTADA" ? initialState?.variable?.condicionais || [] : [],
		},
	});

	function updateVariable(changes: Partial<TContractTemplateVariableState["variable"]>) {
		return setState((prev) => ({ ...prev, variable: { ...prev.variable, ...changes } as TContractTemplateVariableState["variable"] }));
	}

	function addVariableConditional(info: TContractTemplateVariableComputed["condicionais"][number]) {
		return setState((prev) => {
			// Type guard to ensure we're working with a COMPUTADA variable
			if (prev.variable.categoria !== "COMPUTADA") {
				console.warn("Cannot add conditional to a non-COMPUTADA variable");
				return prev;
			}

			return {
				...prev,
				variable: {
					...prev.variable,
					condicionais: [...prev.variable.condicionais, info],
				},
			};
		});
	}
	function removeVariableConditional(index: number) {
		return setState((prev) => {
			if (prev.variable.categoria !== "COMPUTADA") {
				console.warn("Cannot remove conditional from a non-COMPUTADA variable");
				return prev;
			}
			return {
				...prev,
				variable: {
					...prev.variable,
					condicionais: prev.variable.condicionais.filter((_, i) => i !== index),
				},
			};
		});
	}
	function updateVariableConditional(index: number, changes: Partial<TContractTemplateVariableComputed["condicionais"][number]>) {
		return setState((prev) => {
			if (prev.variable.categoria !== "COMPUTADA") {
				console.warn("Cannot update conditional from a non-COMPUTADA variable");
				return prev;
			}
			return {
				...prev,
				variable: {
					...prev.variable,
					condicionais: prev.variable.condicionais.map((item, i) => (i === index ? { ...item, ...changes } : item)),
				},
			};
		});
	}
	function redefineState(state: TContractTemplateVariableState) {
		return setState(state);
	}
	function resetState() {
		return setState({
			variable: {
				titulo: "",
				identificador: "",
				descricao: "",
				categoria: "COMPUTADA",
				fallback: "",
				condicionais: [],
			},
		});
	}
	return {
		state,
		updateVariable,
		addVariableConditional,
		removeVariableConditional,
		updateVariableConditional,
		redefineState,
		resetState,
	};
}
export type TUseContractTemplateVariableState = ReturnType<typeof useContractTemplateVariableState>;
