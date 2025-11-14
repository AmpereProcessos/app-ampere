import { z } from "zod";

export type TDashboardStats = {
	instalacao: {
		anterior: {
			identificador: string;
			valor: number;
			contagem: number;
		};
		atual: {
			identificador: string;
			valor: number;
			contagem: number;
		};
	};
	homologacao: {
		anterior: {
			identificador: string;
			tempoMedio: number;
			potencia: number;
		};
		atual: {
			identificador: string;
			tempoMedio: number;
			potencia: number;
		};
	};
	suprimentos: {
		anterior: {
			identificador: string;
			tempoMedio: number;
		};
		atual: {
			identificador: string;
			tempoMedio: number;
		};
	};
	ranking: {
		primeiro: {
			nome: string;
			potencia: number;
		};
		segundo: {
			nome: string;
			potencia: number;
		};
		terceiro: {
			nome: string;
			potencia: number;
		};
		quarto: {
			nome: string;
			potencia: number;
		};
		quinto: {
			nome: string;
			potencia: number;
		};
	};
	meta: TCompanyGoalsResults;
	nps: number;
};

type TCompanyGoalsResultsItemValue = {
	TOTAL: number;
	RANKING: {
		RESPONSAVEL: string;
		TOTAL: number;
	}[];
};
export type TCompanyGoalsResults = {
	"SISTEMA FOTOVOLTAICO": TCompanyGoalsResultsItemValue;
	"OPERAÇÃO E MANUTENÇÃO": TCompanyGoalsResultsItemValue;
	"INSIDE SALES": TCompanyGoalsResultsItemValue;
	"SEGURO DE SISTEMA FOTOVOLTAICO": TCompanyGoalsResultsItemValue;
	"CONSÓRCIO DE ENERGIA": TCompanyGoalsResultsItemValue;
};

export type TSaleGraphStat = {
	IDENTIFICADOR: string;
	VALOR: number;
};

export type TBirthdayRecord = {
	nome: string;
	telefone: string;
	dataNascimento: string;
};

export const SalesRakingQueryParams = z.object({
	type: z.enum(["current-month", "current-semester", "current-year"], {
		required_error: "Tipo de ranking é obrigatório",
		invalid_type_error: "Tipo de ranking inválido",
	}),
	rankBy: z.enum(["sales-total-qty", "sales-total-value", "sales-total-power"], {
		required_error: "Tipo de ranking é obrigatório",
		invalid_type_error: "Tipo de ranking inválido",
	}),
	projectTypes: z
		.string({
			required_error: "Tipos de projetos são obrigatórios",
			invalid_type_error: "Tipos de projetos inválidos",
		})
		.transform((value) => value.split(",")),
});
export type TSalesRakingInput = z.infer<typeof SalesRakingQueryParams>;

export type TSalesRakingOutput = {
	data: {
		first?: {
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		};
		second?: {
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		};
		third?: {
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		};
		fourth?: {
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		};
		fifth?: {
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		};
		others: {
			index: number;
			name: string;
			avatar?: string;
			totalSoldValue: number;
			totalSoldQty: number;
			totalSoldPower: number;
		}[];
	};
};
