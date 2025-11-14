import type { TUserComissionItem } from "@/utils/schemas/crm/users.schema";

type GetComissionDefinitionsParams = {
	systemPeakPower: number;
	saleValue: number;
	saleProjectValue: number;
	saleStructureValue: number;
	saleEnergyPaValue: number;
	saleOeMValue: number;
	saleInsuranceValue: number;
	saleResponsiblesCombination: string;
	salePartnerId: string;
	saleSellerPartnerId: string;
	saleSDRPartnerId: string;
};
export function getComissionDefinitions({
	systemPeakPower,
	saleValue,
	saleProjectValue,
	saleStructureValue,
	saleEnergyPaValue,
	saleOeMValue,
	saleInsuranceValue,
	saleResponsiblesCombination,
	salePartnerId,
	saleSellerPartnerId,
	saleSDRPartnerId,
}: GetComissionDefinitionsParams) {
	return [
		{
			identifier: "potencia_pico",
			value: systemPeakPower.toString(),
		},
		{
			identifier: "valor_venda",
			value: saleValue.toString(),
		},
		{
			identifier: "valor_projeto",
			value: saleProjectValue.toString(),
		},
		{
			identifier: "valor_padrao",
			value: saleStructureValue.toString(),
		},
		{
			identifier: "valor_estrutura",
			value: saleEnergyPaValue.toString(),
		},
		{
			identifier: "valor_oem",
			value: saleOeMValue.toString(),
		},
		{
			identifier: "valor_seguro",
			value: saleInsuranceValue.toString(),
		},
		{
			identifier: "combinacao_responsaveis",
			value: saleResponsiblesCombination,
		},
		{
			identifier: "parceiro_venda",
			value: salePartnerId,
		},
		{
			identifier: "parceiro_vendedor",
			value: saleSellerPartnerId,
		},
		{
			identifier: "parceiro_sdr",
			value: saleSDRPartnerId,
		},
	];
}
type TComissionDefinitionWithValue = {
	identifier: string;
	value: string;
};
type isComissionConditionMatchedParams = {
	conditionConfig: TUserComissionItem["resultados"][number]["condicao"];
	definitions: TComissionDefinitionWithValue[];
};
function isComissionConditionMatched({ conditionConfig, definitions }: isComissionConditionMatchedParams) {
	const { tipo, variavel, igual, maiorQue, menorQue, entre, inclui } = conditionConfig;

	if (!tipo)
		// Shouldnt happen. but just in case
		return false;
	const checkConditionIdentifier = variavel;
	const checkPremisseValue = definitions.find((p) => p.identifier === checkConditionIdentifier)?.value;

	if (tipo === "IGUAL_TEXTO" || tipo === "IGUAL_NÚMERICO") {
		if (checkPremisseValue === igual) return true;
	}
	// If there's no value, then the condition is not applicable
	if (!checkPremisseValue) return false;

	if (tipo === "IGUAL_TEXTO") {
		const checkConditionValue = igual;
		return checkConditionValue === checkPremisseValue;
	}
	if (tipo === "IGUAL_NÚMERICO") {
		const checkConditionValue = igual;
		return Number(checkPremisseValue) === Number(checkConditionValue);
	}
	if (tipo === "MAIOR_QUE_NÚMERICO") {
		const checkConditionValue = maiorQue;
		return Number(checkPremisseValue) > Number(checkConditionValue);
	}
	if (tipo === "MENOR_QUE_NÚMERICO") {
		const checkConditionValue = menorQue;
		return Number(checkPremisseValue) < Number(checkConditionValue);
	}
	if (tipo === "INTERVALO_NÚMERICO") {
		// Getting the values as numbers
		const checkConditionValueMinNumber = Number(entre?.minimo || 0);
		const checkConditionValueMaxNumber = Number(entre?.maximo || 0);
		const checkPremisseValueNumber = Number(checkPremisseValue);

		return checkPremisseValueNumber >= checkConditionValueMinNumber && checkPremisseValueNumber <= checkConditionValueMaxNumber;
	}
	if (inclui) {
		const checkConditionValuesList = inclui || [];
		return checkConditionValuesList.includes(checkPremisseValue);
	}

	return false;
}
type GetComissionValueParams = {
	userComissionConfig: TUserComissionItem[];
	projectTypeId: string;
	userRole: string;
	definitions: TComissionDefinitionWithValue[];
};
export function getComissionValue({ userComissionConfig, projectTypeId, userRole, definitions }: GetComissionValueParams) {
	const comissionConfig = userComissionConfig.find((c) => c.tipoProjeto.id === projectTypeId && c.papel === userRole);
	if (!comissionConfig) return { comissionValue: 0, comissionFormula: [], comissionFormulaPopulated: "" };

	const orderedPossibleResults = comissionConfig.resultados.sort((a, b) =>
		a.condicao.aplicavel === b.condicao.aplicavel ? 0 : a.condicao.aplicavel ? -1 : 1,
	);

	const applicableResult = orderedPossibleResults.find((r) => {
		// Since general formulas are last, if condicao aplicavel equals false, either:
		// 1. no result matched the condition
		// 2. there is only one possible result (the general one)
		if (!r.condicao.aplicavel) return true;

		return isComissionConditionMatched({ conditionConfig: r.condicao, definitions });
	});
	// If no result is applicable, then the comission is 0
	if (!applicableResult) return { comissionValue: 0, comissionFormula: [], comissionFormulaPopulated: "" };
	try {
		const populatedFormula = applicableResult.formulaArr
			.map((f) => {
				// Extracting the variable, which is determined by outer brackets
				const isVariable = f.includes("[") && f.includes("]");
				if (!isVariable)
					// If there is not variable, then returning the original value
					return f;
				// Else, exchanging the variable key by the variable value itself and returning it
				const variableIdentifier = f.replace("[", "").replace("]", "");

				// Checking if variable used was from definitions, if so, returning it
				const premisseValue = definitions.find((p) => p.identifier === variableIdentifier)?.value;
				if (premisseValue) return premisseValue;

				// If any (definitions) matched, returning 0
				return 0;
			})
			.join("");
		const evaluatedComission = eval(populatedFormula);

		return { comissionValue: Number(evaluatedComission), comissionFormula: applicableResult.formulaArr, comissionFormulaPopulated: populatedFormula };
	} catch (error) {
		console.log("Error processing comission formula", error);
		return { comissionValue: 0, comissionFormula: applicableResult.formulaArr, comissionFormulaPopulated: "" };
	}
}
