import type { TGetContractTemplateVariablesOutputDefault } from "@/pages/api/templates-contrato/variaveis";
import type { TContractTemplateVariableComputedCondition } from "@/utils/schemas/contract-templates-variables";

type ConditionPhraseProps = {
	condition: TContractTemplateVariableComputedCondition;
	variables: TGetContractTemplateVariablesOutputDefault;
};
export function ContractTemplateVariableConditionPhrase({ condition, variables }: ConditionPhraseProps) {
	const variable = variables.find((variable) => variable._id === condition.variavelId);
	if (!variable) return null;
	if (condition.tipo === "IGUAL_TEXTO")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR IGUAL A <strong className="text-cyan-500 font-bold">{condition.igual}</strong>
			</h3>
		);

	if (condition.tipo === "IGUAL_NÚMERICO")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR IGUAL A <strong className="text-cyan-500 font-bold">{condition.igual}</strong>
			</h3>
		);

	if (condition.tipo === "MAIOR_QUE_NÚMERICO")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR MAIOR QUE <strong className="text-cyan-500 font-bold">{condition.maiorQue}</strong>
			</h3>
		);

	if (condition.tipo === "MENOR_QUE_NÚMERICO")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR MENOR QUE <strong className="text-cyan-500 font-bold">{condition.menorQue}</strong>
			</h3>
		);

	if (condition.tipo === "INTERVALO_NÚMERICO")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR ENTRE <strong className="text-cyan-500 font-bold">{condition.intervaloMinimo}</strong> E{" "}
				<strong className="text-cyan-500 font-bold">{condition.intervaloMaximo}</strong>
			</h3>
		);

	if (condition.tipo === "INCLUI_LISTA")
		return (
			<h3 className="text-sm font-medium tracking-tight">
				SE {variable.titulo} FOR INCLUIDO NA LISTA <strong className="text-cyan-500 font-bold">{condition.incluiLista?.join(", ")}</strong>
			</h3>
		);

	return null;
}
