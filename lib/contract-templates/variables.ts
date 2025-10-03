import type { TGetContractTemplateVariablesOutputDefault } from "@/pages/api/templates-contrato/variaveis";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatAsNumber } from "@/utils/methods/formatting";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import type { TContractTemplateVariableComputedCondition } from "@/utils/schemas/contract-templates-variables";
import dayjs from "dayjs";
// @ts-ignore
import numeroPorExtenso from "numero-por-extenso";
import { getNativeVariableByIdentifier } from "./native-variables";

type TGetContractTemplateNativeVariablesValues = {
	contractRequest: TContractRequestDTO;
};
export function getContractTemplateNativeVariablesValues({ contractRequest }: TGetContractTemplateNativeVariablesValues): {
	id: string;
	value: string;
}[] {
	try {
		const totalValue =
			formatAsNumber(contractRequest.valorContrato) +
			formatAsNumber(contractRequest.valorSeguro) +
			formatAsNumber(contractRequest.valorPadrao) +
			formatAsNumber(contractRequest.valorEstrutura) +
			formatAsNumber(contractRequest.valorOeMOuSeguro);

		const nativeVariables: {
			id: string;
			value: string;
		}[] = [
			{
				id: getNativeVariableByIdentifier("nome-do-cliente"),
				value: contractRequest.nomeDoContrato,
			},
			{
				id: getNativeVariableByIdentifier("telefone-do-cliente"),
				value: contractRequest.telefone,
			},
			{
				id: getNativeVariableByIdentifier("email-do-cliente"),
				value: contractRequest.email,
			},
			{
				id: getNativeVariableByIdentifier("estado-civil"),
				value: contractRequest.estadoCivil ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("cpfcnpj"),
				value: contractRequest.cpf_cnpj,
			},
			{
				id: getNativeVariableByIdentifier("rg"),
				value: contractRequest.rg,
			},
			{
				id: getNativeVariableByIdentifier("endereco"),
				value: contractRequest.enderecoCobranca,
			},
			{
				id: getNativeVariableByIdentifier("numero-do-endereco"),
				value: contractRequest.numeroResCobranca,
			},
			{
				id: getNativeVariableByIdentifier("complemento"),
				value: contractRequest.pontoDeReferencia,
			},
			{
				id: getNativeVariableByIdentifier("bairro"),
				value: contractRequest.bairro,
			},
			{
				id: getNativeVariableByIdentifier("cep"),
				value: contractRequest.cep,
			},
			{
				id: getNativeVariableByIdentifier("cidade"),
				value: contractRequest.cidade ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("estado"),
				value: contractRequest.uf ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("topologia-do-sistema"),
				value: contractRequest.topologia ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("potencia-total"),
				value: contractRequest.potPico ? `${formatDecimalPlaces(contractRequest.potPico)} kWp` : "0",
			},
			{
				id: getNativeVariableByIdentifier("endereco-de-instalacao"),
				value: contractRequest.enderecoInstalacao,
			},
			{
				id: getNativeVariableByIdentifier("numero-instalacao"),
				value: contractRequest.numeroResInstalacao ?? "",
			},
			{
				id: getNativeVariableByIdentifier("bairro-instalacao"),
				value: contractRequest.bairroInstalacao,
			},
			{
				id: getNativeVariableByIdentifier("cep-instalacao"),
				value: contractRequest.cepInstalacao,
			},
			{
				id: getNativeVariableByIdentifier("cidade-instalacao"),
				value: contractRequest.cidadeInstalacao ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("estado-instalacao"),
				value: contractRequest.ufInstalacao ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("lista-de-modulos"),
				value:
					contractRequest.produtos
						?.filter((p) => p.categoria === "MÓDULO")
						.map((r) => `- ${r.qtde} módulos ${r.modelo} ${r.potencia}W`)
						.join("\n") ?? "",
			},
			{
				id: getNativeVariableByIdentifier("lista-de-inversores"),
				value:
					contractRequest.produtos
						?.filter((p) => p.categoria === "INVERSOR")
						.map((r) => `- ${r.qtde} ${contractRequest.topologia === "INVERSOR" ? "inversores" : "micro-inversores"} ${r.modelo} ${r.potencia}W`)
						.join("\n") ?? "",
			},
			{
				id: getNativeVariableByIdentifier("garantia-dos-modulos"),
				value: Math.min(...(contractRequest.produtos?.filter((p) => p.categoria === "MÓDULO").map((r) => r.garantia) ?? [0])).toString() ?? "0",
			},
			{
				id: getNativeVariableByIdentifier("garantia-dos-inversores"),
				value: Math.min(...(contractRequest.produtos?.filter((p) => p.categoria === "INVERSOR").map((r) => r.garantia) ?? [0])).toString() ?? "0",
			},
			{
				id: getNativeVariableByIdentifier("valor-total"),
				value: formatToMoney(totalValue),
			},
			{
				id: getNativeVariableByIdentifier("valor-por-extenso"),
				value: numeroPorExtenso.porExtenso(totalValue, numeroPorExtenso.estilo.monetario) ?? "0",
			},
			{
				id: getNativeVariableByIdentifier("origem-do-recurso"),
				value: contractRequest.origemRecurso ?? "NÃO DEFINIDO",
			},
			{
				id: getNativeVariableByIdentifier("forma-de-negociacao"),
				value: contractRequest.formaDePagamento === "80% A VISTA NA ENTRADA + 20% NA FINALIZAÇÃO DA INSTALAÇÃO" ? "80-20" : "100%",
			},
			{
				id: getNativeVariableByIdentifier("adequacao-de-padrao"),
				value: contractRequest.aumentoDeCarga === "SIM" ? "SIM" : "NÃO",
			},
			{
				id: getNativeVariableByIdentifier("adequacao-de-estrutura"),
				value: contractRequest.estruturaAmpere === "SIM" ? "SIM" : "NÃO",
			},
			{
				id: getNativeVariableByIdentifier("nome-da-empresa"),
				value: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
			},
			{
				id: getNativeVariableByIdentifier("cnpj-da-empresa"),
				value: "27.901.968/0001-45",
			},
			{
				id: getNativeVariableByIdentifier("endereco-da-empresa"),
				value: "Rua 28, n.º 1842, Centro, CEP 38300-082, Ituiutaba/MG",
			},
			{
				id: getNativeVariableByIdentifier("data-do-contrato"),
				value: dayjs().format("DD/MM/YYYY"),
			},
			{
				id: getNativeVariableByIdentifier("data-atual"),
				value: dayjs().format("DD/MM/YYYY"),
			},
		];

		return nativeVariables;
	} catch (error) {
		console.error(error);
		return [];
	}
}

type getContractTemplateVariablesValues = {
	definitions: TGetContractTemplateVariablesOutputDefault;
	nativeVariablesValues: {
		id: string;
		value: string;
	}[];
};

type VariableValue = {
	id: string;
	value: string;
};

/**
 * Evaluates if a condition matches based on the variable value
 */
function evaluateCondition(condition: TContractTemplateVariableComputedCondition, variableValue: string | undefined): boolean {
	if (!variableValue) return false;

	switch (condition.tipo) {
		case "IGUAL_TEXTO":
			return variableValue === condition.igual;

		case "IGUAL_NÚMERICO":
			if (condition.igual === null || condition.igual === undefined) return false;
			return Number(variableValue) === Number(condition.igual);

		case "MAIOR_QUE_NÚMERICO":
			if (condition.maiorQue === null || condition.maiorQue === undefined) return false;
			return Number(variableValue) > condition.maiorQue;

		case "MENOR_QUE_NÚMERICO":
			if (condition.menorQue === null || condition.menorQue === undefined) return false;
			return Number(variableValue) < condition.menorQue;

		case "INTERVALO_NÚMERICO": {
			if (condition.intervaloMinimo === null || condition.intervaloMinimo === undefined) return false;
			if (condition.intervaloMaximo === null || condition.intervaloMaximo === undefined) return false;
			const numValue = Number(variableValue);
			return numValue >= condition.intervaloMinimo && numValue <= condition.intervaloMaximo;
		}

		case "INCLUI_LISTA":
			if (!condition.incluiLista || condition.incluiLista.length === 0) return false;
			return condition.incluiLista.includes(variableValue);

		default:
			return false;
	}
}

/**
 * Computes the value of a computed variable based on its conditions
 */
function computeVariableValue(variableDefinition: TGetContractTemplateVariablesOutputDefault[number], resolvedValues: Map<string, string>): string {
	if (variableDefinition.categoria === "NATIVA") {
		return resolvedValues.get(variableDefinition._id) || "";
	}

	// For computed variables, evaluate conditions
	for (const condition of variableDefinition.condicionais) {
		const dependentVariableValue = resolvedValues.get(condition.variavelId);
		if (evaluateCondition(condition, dependentVariableValue)) {
			return condition.valor;
		}
	}

	// If no condition matched, return fallback
	return variableDefinition.fallback;
}

/**
 * Recursively resolves a variable value, computing dependencies as needed
 */
function resolveVariable(
	variableId: string,
	definitions: TGetContractTemplateVariablesOutputDefault,
	resolvedValues: Map<string, string>,
	resolvingStack: Set<string>,
): string {
	// If already resolved, return the value
	if (resolvedValues.has(variableId)) {
		const value = resolvedValues.get(variableId);
		return value || "";
	}

	// Check for circular dependency
	if (resolvingStack.has(variableId)) {
		console.warn(`Circular dependency detected for variable: ${variableId}`);
		return "";
	}

	// Find the variable definition
	const variableDefinition = definitions.find((def) => def._id === variableId);
	if (!variableDefinition) {
		console.warn(`Variable definition not found for id: ${variableId}`);
		return "";
	}

	// If it's a native variable and not yet resolved, return empty
	if (variableDefinition.categoria === "NATIVA") {
		return "";
	}

	// Add to resolving stack to detect circular dependencies
	resolvingStack.add(variableId);

	try {
		// Resolve all dependent variables first
		for (const condition of variableDefinition.condicionais) {
			if (!resolvedValues.has(condition.variavelId)) {
				resolveVariable(condition.variavelId, definitions, resolvedValues, resolvingStack);
			}
		}

		// Compute the value
		const computedValue = computeVariableValue(variableDefinition, resolvedValues);
		resolvedValues.set(variableId, computedValue);

		return computedValue;
	} finally {
		// Remove from resolving stack
		resolvingStack.delete(variableId);
	}
}

/**
 * Computes all variable values, handling dependencies and conditions
 */
export function getContractTemplateVariablesValues({ definitions, nativeVariablesValues }: getContractTemplateVariablesValues): VariableValue[] {
	// Initialize resolved values with native variables
	const resolvedValues = new Map<string, string>();
	for (const nativeVar of nativeVariablesValues) {
		resolvedValues.set(nativeVar.id, nativeVar.value);
	}

	// Resolve all computed variables
	const resolvingStack = new Set<string>();
	for (const definition of definitions) {
		if (definition.categoria === "COMPUTADA" && !resolvedValues.has(definition._id)) {
			resolveVariable(definition._id, definitions, resolvedValues, resolvingStack);
		}
	}

	// Convert map to array of objects
	return Array.from(resolvedValues.entries()).map(([id, value]) => ({
		id,
		value,
	}));
}
