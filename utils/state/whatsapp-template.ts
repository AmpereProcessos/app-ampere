import type {
	TWhatsappTemplate,
	TWhatsappTemplateBodyParameter,
	TWhatsappTemplateButton,
	TWhatsappTemplateComponents,
} from "@/utils/schemas/whatsapp-templates";
import { useState } from "react";

type WhatsappTemplateState = {
	template: Omit<TWhatsappTemplate, "_id" | "autor" | "dataInsercao" | "status" | "whatsappTemplateId" | "qualidade">;
};

type WhatsappTemplateActions = {
	updateTemplate: (update: Partial<Omit<TWhatsappTemplate, "_id" | "autor" | "dataInsercao" | "status" | "whatsappTemplateId" | "qualidade">>) => void;
	updateComponents: (update: Partial<TWhatsappTemplateComponents>) => void;
	updateBodyParameters: (parameters: TWhatsappTemplateBodyParameter[]) => void;
	addBodyParameter: (parameter: TWhatsappTemplateBodyParameter) => void;
	removeBodyParameter: (index: number) => void;
	updateButton: (index: number, button: TWhatsappTemplateButton) => void;
	addButton: (button: TWhatsappTemplateButton) => void;
	removeButton: (index: number) => void;
	redefineState: (newState: WhatsappTemplateState) => void;
	resetState: () => void;
};

type UseWhatsappTemplateStateProps = {
	initialState?: Partial<WhatsappTemplateState>;
};

export const useWhatsappTemplateState = ({ initialState }: UseWhatsappTemplateStateProps) => {
	const [state, setState] = useState<WhatsappTemplateState>({
		template: initialState?.template || {
			nome: "",
			categoria: "marketing",
			idioma: "pt_BR",
			formatoParametros: "named",
			componentes: {
				cabecalho: null,
				corpo: {
					conteudo: "",
					parametros: [],
				},
				rodape: null,
				botoes: null,
			},
		},
	});

	function updateTemplate(changes: Partial<WhatsappTemplateState["template"]>) {
		return setState((prev) => ({ ...prev, template: { ...prev.template, ...changes } as WhatsappTemplateState["template"] }));
	}

	function updateComponents(changes: Partial<WhatsappTemplateState["template"]["componentes"]>) {
		return setState((prev) => ({
			...prev,
			template: { ...prev.template, componentes: { ...prev.template.componentes, ...changes } as WhatsappTemplateState["template"]["componentes"] },
		}));
	}

	function updateBodyParameters(parameters: TWhatsappTemplateBodyParameter[]) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: { ...prev.template.componentes, corpo: { ...prev.template.componentes.corpo, parametros: parameters } },
			},
		}));
	}

	function addBodyParameter(parameter: TWhatsappTemplateBodyParameter) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: {
					...prev.template.componentes,
					corpo: {
						...prev.template.componentes.corpo,
						parametros: [...prev.template.componentes.corpo.parametros, parameter] as TWhatsappTemplateBodyParameter[],
					},
				},
			},
		}));
	}

	function removeBodyParameter(index: number) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: {
					...prev.template.componentes,
					corpo: {
						...prev.template.componentes.corpo,
						parametros: prev.template.componentes.corpo.parametros.filter((_, i) => i !== index) as TWhatsappTemplateBodyParameter[],
					},
				},
			},
		}));
	}

	function updateButton(index: number, button: TWhatsappTemplateButton) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: {
					...prev.template.componentes,
					botoes: prev.template.componentes.botoes?.map((b, i) => (i === index ? button : b)) as TWhatsappTemplateButton[],
				},
			},
		}));
	}

	function addButton(button: TWhatsappTemplateButton) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: { ...prev.template.componentes, botoes: [...(prev.template.componentes.botoes || []), button] as TWhatsappTemplateButton[] },
			},
		}));
	}

	function removeButton(index: number) {
		return setState((prev) => ({
			...prev,
			template: {
				...prev.template,
				componentes: {
					...prev.template.componentes,
					botoes: prev.template.componentes.botoes?.filter((_, i) => i !== index) as TWhatsappTemplateButton[],
				},
			},
		}));
	}

	function resetState() {
		return setState({
			template: {
				nome: "",
				categoria: "utility",
				idioma: "pt_BR",
				formatoParametros: "positional",
				componentes: {
					cabecalho: null,
					corpo: {
						conteudo: "",
						parametros: [],
					},
					rodape: null,
					botoes: null,
				},
			},
		});
	}
	function redefineState(state: WhatsappTemplateState) {
		return setState(state);
	}

	return {
		state,
		updateTemplate,
		updateComponents,
		updateBodyParameters,
		addBodyParameter,
		removeBodyParameter,
		updateButton,
		addButton,
		removeButton,
		redefineState,
		resetState,
	};
};
export type TUseWhatsappTemplateState = ReturnType<typeof useWhatsappTemplateState>;
