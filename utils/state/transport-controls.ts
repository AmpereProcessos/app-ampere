import { useCallback, useState } from "react";
import z from "zod";
import { TransportControlCostItemSchema, TransportControlSchema, TransportControlTransportItemSchema } from "../schemas/transport-controls";

const TransportControlStateSchema = z.object({
	transportControl: TransportControlSchema.extend({
		itens: z.array(
			TransportControlTransportItemSchema.extend({
				anexos: z.array(
					z.object({
						idArquivoReferencia: z.string({
							required_error: "ID do arquivo de referência é obrigatório",
						}),
						titulo: z.string({
							required_error: "Título é obrigatório",
							invalid_type_error: "Título deve ser uma string",
						}),
						identificador: z
							.string({
								invalid_type_error: "Identificador deve ser uma string",
							})
							.optional()
							.nullable()
							.describe("Identificador de configuração do anexo."),
						url: z
							.string({
								required_error: "URL é obrigatória",
								invalid_type_error: "URL deve ser uma string",
							})
							.describe("URL do anexo."),
						formato: z.string({
							required_error: "Formato é obrigatório",
							invalid_type_error: "Formato deve ser uma string",
						}),
						tamanho: z.number({
							required_error: "Tamanho é obrigatório",
							invalid_type_error: "Tamanho deve ser um número",
						}),
						arquivo: z.instanceof(File).optional().nullable(),
						previewUrl: z.string().optional().nullable(),
					}),
				),
			}),
		),
		custos: z.array(
			TransportControlCostItemSchema.extend({
				anexos: z.array(
					z.object({
						idArquivoReferencia: z.string({
							required_error: "ID do arquivo de referência é obrigatório",
						}),
						titulo: z.string({
							required_error: "Título é obrigatório",
							invalid_type_error: "Título deve ser uma string",
						}),
						url: z.string({
							required_error: "URL é obrigatória",
							invalid_type_error: "URL deve ser uma string",
						}),
						formato: z.string({
							required_error: "Formato é obrigatório",
							invalid_type_error: "Formato deve ser uma string",
						}),
						tamanho: z.number({
							required_error: "Tamanho é obrigatório",
							invalid_type_error: "Tamanho deve ser um número",
						}),
						arquivo: z.instanceof(File).optional().nullable(),
						previewUrl: z.string().optional().nullable(),
					}),
				),
			}),
		),
	}),
});
export type TTransportControlState = z.infer<typeof TransportControlStateSchema>;

type UseTransportControlStateProps = {
	initialState?: Partial<TTransportControlState>;
};
export function useTransportControlState({ initialState }: UseTransportControlStateProps) {
	const [state, setState] = useState<TTransportControlState>({
		transportControl: {
			titulo: initialState?.transportControl?.titulo || "",
			identificador: initialState?.transportControl?.identificador || 0,
			itens: initialState?.transportControl?.itens || [],
			custos: initialState?.transportControl?.custos || [],
			autor: initialState?.transportControl?.autor || {
				id: "",
				nome: "",
				avatar_url: null,
			},
			dataInsercao: initialState?.transportControl?.dataInsercao || new Date().toISOString(),
		},
	});

	const updateTransportControl = useCallback((changes: Partial<TTransportControlState["transportControl"]>) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				...changes,
			},
		}));
	}, []);

	const addTransportControlItem = useCallback((item: TTransportControlState["transportControl"]["itens"][number]) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				itens: [...prev.transportControl.itens, item],
			},
		}));
	}, []);

	const removeTransportControlItem = useCallback((index: number) => {
		console.log("removeTransportControlItem", index);
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				itens: prev.transportControl.itens.filter((_, i) => i !== index),
			},
		}));
	}, []);

	const addTransportControlItemAttachment = useCallback(
		(index: number, attachment: TTransportControlState["transportControl"]["itens"][number]["anexos"][number]) => {
			setState((prev) => ({
				...prev,
				transportControl: {
					...prev.transportControl,
					itens: prev.transportControl.itens.map((item, i) => (i === index ? { ...item, anexos: [...item.anexos, attachment] } : item)),
				},
			}));
		},
		[],
	);

	const removeTransportControlItemAttachment = useCallback((index: number, attachmentIndex: number) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				itens: prev.transportControl.itens.map((item, i) =>
					i === index ? { ...item, anexos: item.anexos.filter((a, aIndex) => aIndex !== attachmentIndex) } : item,
				),
			},
		}));
	}, []);

	const addTransportControlCost = useCallback((cost: TTransportControlState["transportControl"]["custos"][number]) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				custos: [...prev.transportControl.custos, cost],
			},
		}));
	}, []);
	const removeTransportControlCost = useCallback((index: number) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				custos: prev.transportControl.custos.filter((_, i) => i !== index),
			},
		}));
	}, []);
	const addTransportControlCostAttachment = useCallback(
		(index: number, attachment: TTransportControlState["transportControl"]["custos"][number]["anexos"][number]) => {
			setState((prev) => ({
				...prev,
				transportControl: {
					...prev.transportControl,
					custos: prev.transportControl.custos.map((item, i) => (i === index ? { ...item, anexos: [...item.anexos, attachment] } : item)),
				},
			}));
		},
		[],
	);
	const removeTransportControlCostAttachment = useCallback((index: number, attachmentIndex: number) => {
		setState((prev) => ({
			...prev,
			transportControl: {
				...prev.transportControl,
				custos: prev.transportControl.custos.map((item, i) =>
					i === index ? { ...item, anexos: item.anexos.filter((a, aIndex) => aIndex !== attachmentIndex) } : item,
				),
			},
		}));
	}, []);

	return {
		state,
		updateTransportControl,
		addTransportControlItem,
		removeTransportControlItem,
		addTransportControlItemAttachment,
		removeTransportControlItemAttachment,
		addTransportControlCost,
		removeTransportControlCost,
		addTransportControlCostAttachment,
		removeTransportControlCostAttachment,
	};
}

export type TUseTransportControlState = ReturnType<typeof useTransportControlState>;
