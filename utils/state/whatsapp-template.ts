import type {
	TWhatsappTemplate,
	TWhatsappTemplateBodyParameter,
	TWhatsappTemplateButton,
	TWhatsappTemplateComponents,
} from "@/utils/schemas/whatsapp-templates";
import { create } from "zustand";

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

const initialState: WhatsappTemplateState = {
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
};

type UseWhatsappTemplateStateProps = {
	initialState?: Partial<WhatsappTemplateState>;
};

export const useWhatsappTemplateState = (props?: UseWhatsappTemplateStateProps) => {
	const store = create<WhatsappTemplateState & WhatsappTemplateActions>((set) => ({
		...(props?.initialState ? { ...initialState, ...props.initialState } : initialState),

		updateTemplate: (update) =>
			set((state) => ({
				template: { ...state.template, ...update },
			})),

		updateComponents: (update) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						...update,
					},
				},
			})),

		updateBodyParameters: (parameters) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						corpo: {
							...state.template.componentes.corpo,
							parametros: parameters,
						},
					},
				},
			})),

		addBodyParameter: (parameter) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						corpo: {
							...state.template.componentes.corpo,
							parametros: [...state.template.componentes.corpo.parametros, parameter],
						},
					},
				},
			})),

		removeBodyParameter: (index) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						corpo: {
							...state.template.componentes.corpo,
							parametros: state.template.componentes.corpo.parametros.filter((_, i) => i !== index),
						},
					},
				},
			})),

		updateButton: (index, button) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						botoes: state.template.componentes.botoes?.map((b, i) => (i === index ? button : b)) || null,
					},
				},
			})),

		addButton: (button) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						botoes: [...(state.template.componentes.botoes || []), button],
					},
				},
			})),

		removeButton: (index) =>
			set((state) => ({
				template: {
					...state.template,
					componentes: {
						...state.template.componentes,
						botoes: state.template.componentes.botoes?.filter((_, i) => i !== index) || null,
					},
				},
			})),

		redefineState: (newState) => set(newState),

		resetState: () => set(initialState),
	}));

	const storeState = store();

	return {
		state: {
			template: storeState.template,
		},
		updateTemplate: storeState.updateTemplate,
		updateComponents: storeState.updateComponents,
		updateBodyParameters: storeState.updateBodyParameters,
		addBodyParameter: storeState.addBodyParameter,
		removeBodyParameter: storeState.removeBodyParameter,
		updateButton: storeState.updateButton,
		addButton: storeState.addButton,
		removeButton: storeState.removeButton,
		redefineState: storeState.redefineState,
		resetState: storeState.resetState,
	};
};
