import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useDebounce, useDebounceMemo } from "@/lib/hooks/debounce";
import { z } from "zod";
import type { TGetComissionDataOutput } from "@/app/api/comissoes/route";
// import type { TComissionData, TComissionDataByProjectId, TComissionDataGeneral } from "@/pages/api/gestao/comissoes";

export const ComissionDataGeneralQueryParamsInputSchema = z.object({
	after: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	before: z
		.string({ required_error: "Parâmetros de período inválidos.", invalid_type_error: "Parâmetros de período inválidos." })
		.datetime({ message: "Parâmetros de período inválidos." }),
	sellers: z.string({ invalid_type_error: "Tipo não válido para os vendedores." }).optional().nullable(),
	insiders: z.string({ invalid_type_error: "Tipo não válido para os insiders." }).optional().nullable(),
	serviceTypes: z.string({ invalid_type_error: "Tipo não válido para os tipos de serviço." }).optional().nullable(),
});

export const ComissionDataByProjectIdQueryParamsInputSchema = z.object({
	projectId: z.string({ required_error: "ID do projeto é obrigatório.", invalid_type_error: "ID do projeto é obrigatório." }),
});

export const ComissionDataQueryParamsInputSchema = z.union([ComissionDataGeneralQueryParamsInputSchema, ComissionDataByProjectIdQueryParamsInputSchema]);

export const GeneralComissionDataOutputSchema = z.object({
	_id: z.string(),
	nome: z.string(),
	tipo: z.string(),
	identificadorApp: z.number(),
	identificadorCrm: z.union([z.string(), z.number()]).optional().nullable(),
	uf: z.string().optional().nullable(),
	cidade: z.string().optional().nullable(),
	vendedorApp: z.string(),
	insiderApp: z.string().optional().nullable(),
	vendedor: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
		comissao: z.number(),
	}),
	insider: z.object({
		id: z.string().optional().nullable(),
		nome: z.string().optional().nullable(),
		avatar_url: z.string().optional().nullable(),
		comissao: z.number().optional().nullable(),
	}),

	dataAssinatura: z.string().optional().nullable(),
	dataRecebimentoParcial: z.string().optional().nullable(),
	potenciaPico: z.number().optional().nullable(),
	valorProjeto: z.number().optional().nullable(),
	valorPadrao: z.number().optional().nullable(),
	valorEstruturaPersonalizada: z.number().optional().nullable(),
	valorOem: z.number().optional().nullable(),
	valorSeguro: z.number().optional().nullable(),
	valorContrato: z.number(),
	comissoes: z.object({
		efetivado: z.boolean(),
		pagamentoRealizado: z.boolean(),
		itensComissionaveis: z.array(z.enum(["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"])),
		valorComissionavel: z.number(),
		valorComissionavelSugerido: z.number(),
		porcentagemVendedor: z.number(),
		porcentagemInsider: z.number(),
		dataValidacaoVendedor: z.string().optional().nullable(),
		dataValidacaoInsider: z.string().optional().nullable(),
	}),
});

export type TComissionDataGeneral = z.infer<typeof GeneralComissionDataOutputSchema>;

export const ComissionDataByProjectIdOutputSchema = z.object({});
async function fetchComissionDataByProjectId({ projectId }: { projectId: string }) {
	try {
		const { data }: { data: TGetComissionDataOutput } = await axios.get(`/api/comissoes?projectId=${projectId}`);
		if (!data.data.byProjectId) throw new Error("Não foi possível obter os dados das comissões.");
		return data.data.byProjectId;
	} catch (error) {
		throw error;
	}
}

async function fetchComissionData({ filters }: { filters: ComissionDataFilters }) {
	try {
		const { data }: { data: TGetComissionDataOutput } = await axios.get(
			`/api/comissoes?after=${filters.period.after}&before=${filters.period.before}&sellers=${filters.sellerIds.join(",")}&serviceTypes=${filters.serviceType.join(",")}`,
		);
		if (!data.data.default) throw new Error("Não foi possível obter os dados das comissões.");
		return data.data.default;
	} catch (error) {
		throw error;
	}
}

type ComissionDataFilters = {
	search: string;
	sellerIds: string[];
	sellerName: string[];
	insiderName: string[];
	serviceType: string[];
	period: {
		after: string;
		before: string;
	};
};
type UseComissionDataParams = {
	initialFilters?: Partial<ComissionDataFilters> | undefined;
};
export function useComissionData({ initialFilters }: UseComissionDataParams) {
	const startOfPreviousMonth = dayjs().subtract(1, "month").startOf("month").subtract(3, "hours").toISOString();
	const endOfPreviousMonth = dayjs().subtract(1, "month").endOf("month").subtract(3, "hours").toISOString();
	const [filters, setFilters] = useState<ComissionDataFilters>({
		search: initialFilters?.search ?? "",
		sellerIds: initialFilters?.sellerIds ?? [],
		sellerName: initialFilters?.sellerName ?? [],
		insiderName: initialFilters?.insiderName ?? [],
		serviceType: initialFilters?.serviceType ?? [],
		period: initialFilters?.period ?? {
			after: initialFilters?.period?.after ?? startOfPreviousMonth,
			before: initialFilters?.period?.before ?? endOfPreviousMonth,
		},
	});

	function updateFilters(changes: Partial<ComissionDataFilters>) {
		setFilters((prev) => ({
			...prev,
			...changes,
		}));
	}
	const debouncedParams = useDebounceMemo(filters, 500);
	return {
		...useQuery({
			queryKey: ["comissions", debouncedParams],
			queryFn: async () => await fetchComissionData({ filters: debouncedParams }),
		}),
		filters,
		updateFilters,
	};
}

export function useComissionDataByProjectId({ projectId }: { projectId: string }) {
	return useQuery({
		queryKey: ["comissions-by-project-id", projectId],
		queryFn: async () => await fetchComissionDataByProjectId({ projectId }),
	});
}
