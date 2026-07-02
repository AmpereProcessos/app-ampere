import type { TSimilarClientSimplifiedDTO } from "@/utils/schemas/crm/client.schema";
import type { TProject } from "@/utils/schemas/projects";

export const NEW_PROJECT_STAGE_ORDER = ["cliente", "venda", "padrao", "estrutura", "sistema", "pagamento", "revisao"] as const;

export type TNewProjectStage = (typeof NEW_PROJECT_STAGE_ORDER)[number];

export type TDirectProjectClientDraft = {
	clientId: string | null;
	clientData: {
		nome: string;
		cpfCnpj: string;
		telefonePrimario: string;
		email: string;
		cep: string;
		uf: string;
		cidade: string;
		bairro: string;
		endereco: string;
		numeroOuIdentificador: string;
		complemento: string;
	};
	selectedClient: TSimilarClientSimplifiedDTO | null;
};

export type TDirectProjectDraft = {
	client: TDirectProjectClientDraft;
	project: TProject;
};

export type TDirectProjectValidationResult = {
	valid: boolean;
	errors: string[];
};
