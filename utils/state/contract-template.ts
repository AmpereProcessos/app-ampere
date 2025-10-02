import { useState } from "react";
import { z } from "zod";
import { ContractTemplateSchema } from "../schemas/contract-templates";

const ContractTemplateState = z.object({
	template: ContractTemplateSchema.omit({
		autor: true,
		dataInsercao: true,
	}),
});

export type TContractTemplateState = z.infer<typeof ContractTemplateState>;

type UseContractTemplateStateParams = {
	initialState?: Partial<TContractTemplateState>;
};
export function useContractTemplateState({ initialState }: UseContractTemplateStateParams) {
	const [state, setState] = useState<TContractTemplateState>({
		template: initialState?.template || {
			titulo: "",
			descricao: "",
			conteudo: "",
		},
	});

	function updateTemplate(changes: Partial<TContractTemplateState["template"]>) {
		return setState((prev) => ({ ...prev, template: { ...prev.template, ...changes } as TContractTemplateState["template"] }));
	}

	function redefineState(state: TContractTemplateState) {
		return setState(state);
	}
	function resetState() {
		return setState({
			template: {
				titulo: "",
				descricao: "",
				conteudo: "",
			},
		});
	}

	return {
		state,
		updateTemplate,
		redefineState,
		resetState,
	};
}
export type TUseContractTemplateState = ReturnType<typeof useContractTemplateState>;
