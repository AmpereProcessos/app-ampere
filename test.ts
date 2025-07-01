type TComissionConfiguration = {
	tipoProjeto: {
		id: string;
		nome: string;
	};
	resultados: {
		papel: "VENDEDOR" | "INSIDER" | "ANALISTA";
		condicao: {
			aplicavel: boolean;
			tipo: "IGUAL_TEXTO" | "IGUAL_NÚMERICO" | "MAIOR_QUE_NÚMERICO" | "MENOR_QUE_NÚMERICO" | "INTERVALO_NÚMERICO" | "INCLUI_LISTA";
			variavel: string;
			igual?: string;
			maiorQue?: number;
			menorQue?: number;
			entre?: {
				minimo: number;
				maximo: number;
			};
			inclui?: string[];
		};
		formulaArr: string[];
	}[];
};
