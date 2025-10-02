import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { ContractTemplateVariableConditionPhrase } from "@/lib/contract-templates";
import { formatAsNumber } from "@/utils/methods/formatting";
import { useContractTemplateVariableById, useContractTemplateVariables } from "@/utils/methods/query/contract-templates-variables";
import { isValidNumber } from "@/utils/methods/validating";
import type { TContractTemplateVariableComputed } from "@/utils/schemas/contract-templates-variables";
import { ConditionTypes } from "@/utils/select-options";
import type { TUseContractTemplateVariableState } from "@/utils/state/contract-template-variable";
import { LayoutGrid, Pencil, Plus, Trash, Variable } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ContractTemplatesVariableValueProps = {
	state: TUseContractTemplateVariableState["state"];
	updateVariable: TUseContractTemplateVariableState["updateVariable"];
	addVariableConditional: TUseContractTemplateVariableState["addVariableConditional"];
	removeVariableConditional: TUseContractTemplateVariableState["removeVariableConditional"];
	updateVariableConditional: TUseContractTemplateVariableState["updateVariableConditional"];
};
export default function ContractTemplatesVariableValue({
	state,
	updateVariable,
	addVariableConditional,
	removeVariableConditional,
	updateVariableConditional,
}: ContractTemplatesVariableValueProps) {
	if (state.variable.categoria === "NATIVA") return null;
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="VALOR" sectionTitleIcon={<Variable size={15} />}>
			<TextInput
				label="VALOR PADRÃO"
				value={state.variable.fallback}
				placeholder="Preencha o valor padrão da variável"
				handleChange={(value) => updateVariable({ fallback: value })}
				width="100%"
			/>
			<ContractTemplatesVariableValueConditional
				conditionals={state.variable.condicionais}
				addVariableConditional={addVariableConditional}
				removeVariableConditional={removeVariableConditional}
				updateVariableConditional={updateVariableConditional}
			/>
		</ResponsiveDialogDrawerSection>
	);
}

type ContractTemplatesVariableValueConditionalProps = {
	conditionals: TContractTemplateVariableComputed["condicionais"];
	addVariableConditional: TUseContractTemplateVariableState["addVariableConditional"];
	removeVariableConditional: TUseContractTemplateVariableState["removeVariableConditional"];
	updateVariableConditional: TUseContractTemplateVariableState["updateVariableConditional"];
};
function ContractTemplatesVariableValueConditional({
	conditionals,
	addVariableConditional,
	removeVariableConditional,
	updateVariableConditional,
}: ContractTemplatesVariableValueConditionalProps) {
	const { data: variables } = useContractTemplateVariables();
	const [newConditionalMenuIsOpen, setNewConditionalMenuIsOpen] = useState(false);
	const [conditionalToEditIndex, setConditionalToEditIndex] = useState<number | null>(null);

	const conditionalToEdit = isValidNumber(conditionalToEditIndex) ? conditionals[conditionalToEditIndex as number] : null;
	return (
		<div className="w-full flex flex-col gap-1">
			<h1 className="text-sm tracking-tight">CONDIÇÕES</h1>
			<div className="w-full flex flex-col gap-2">
				{conditionals.length > 0 ? (
					conditionals.map((conditional, index) => (
						<div key={index.toString()} className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs dark:bg-[#121212]">
							<ContractTemplateVariableConditionPhrase condition={conditional} variables={variables ?? []} />
							<p className="w-full py-1 rounded bg-primary/20 text-xs tracking-tight italic px-3 font-medium">{conditional.valor}</p>
							<div className="w-full flex items-center justify-end gap-2">
								<Button variant={"destructive"} size={"xs"} onClick={() => removeVariableConditional(index)}>
									<Trash className="h-3 min-h-3 w-3 min-w-3" />
								</Button>
								<Button variant={"ghost"} size={"xs"} onClick={() => setConditionalToEditIndex(index)}>
									<Pencil className="h-3 min-h-3 w-3 min-w-3" />
								</Button>
							</div>
						</div>
					))
				) : (
					<p className="text-sm tracking-tight text-center">Nenhuma condição encontrada</p>
				)}
			</div>
			<div className="w-full flex items-center justify-center">
				<Button onClick={() => setNewConditionalMenuIsOpen(true)} className="flex items-center gap-2" size="xs" variant={"ghost"}>
					<Plus className="h-4 min-h-4 w-4 min-w-4" />
					<p className="text-xs tracking-tight">ADICIONAR CONDIÇÃO</p>
				</Button>
			</div>
			{newConditionalMenuIsOpen ? (
				<ConditionalMenu
					initialConditional={null}
					commitConditional={(info) => addVariableConditional(info)}
					closeMenu={() => setNewConditionalMenuIsOpen(false)}
				/>
			) : null}
			{isValidNumber(conditionalToEditIndex) && conditionalToEdit ? (
				<ConditionalMenu
					initialConditional={conditionalToEdit}
					commitConditional={(info) => {
						setConditionalToEditIndex(null);
						updateVariableConditional(conditionalToEditIndex as number, info);
					}}
					closeMenu={() => setConditionalToEditIndex(null)}
				/>
			) : null}
		</div>
	);
}

type ConditionalMenuProps = {
	initialConditional: TContractTemplateVariableComputed["condicionais"][number] | null;
	commitConditional: (info: TContractTemplateVariableComputed["condicionais"][number]) => void;
	closeMenu: () => void;
};
function ConditionalMenu({ initialConditional, commitConditional, closeMenu }: ConditionalMenuProps) {
	const { data: variables } = useContractTemplateVariables();
	const [conditionalHolder, setConditionalHolder] = useState<TContractTemplateVariableComputed["condicionais"][number]>({
		tipo: initialConditional?.tipo ?? "IGUAL_TEXTO",
		variavelId: initialConditional?.variavelId ?? "",
		igual: initialConditional?.igual ?? "",
		valor: initialConditional?.valor ?? "",
		maiorQue: initialConditional?.maiorQue ?? null,
		menorQue: initialConditional?.menorQue ?? null,
		intervaloMinimo: initialConditional?.intervaloMinimo ?? null,
		intervaloMaximo: initialConditional?.intervaloMaximo ?? null,
		incluiLista: initialConditional?.incluiLista ?? null,
	});

	function handleCommitConditional(info: TContractTemplateVariableComputed["condicionais"][number]) {
		if (!conditionalHolder.variavelId) return toast.error("Variável não informada");
		if (conditionalHolder.valor.trim().length < 3) return toast.error("Resultado deve possuir ao menos 3 caracteres");
		if (conditionalHolder.tipo === "IGUAL_TEXTO" && !conditionalHolder.igual) return toast.error("Valor igual não informado");
		if (conditionalHolder.tipo === "IGUAL_NÚMERICO" && !conditionalHolder.igual) return toast.error("Valor igual não informado");
		if (conditionalHolder.tipo === "MAIOR_QUE_NÚMERICO" && !conditionalHolder.maiorQue) return toast.error("Valor maior que não informado");
		if (conditionalHolder.tipo === "MENOR_QUE_NÚMERICO" && !conditionalHolder.menorQue) return toast.error("Valor menor que não informado");
		if (conditionalHolder.tipo === "INTERVALO_NÚMERICO" && !conditionalHolder.intervaloMinimo)
			return toast.error("Valor mínimo do intervalo não informado");
		if (conditionalHolder.tipo === "INTERVALO_NÚMERICO" && !conditionalHolder.intervaloMaximo)
			return toast.error("Valor máximo do intervalo não informado");

		commitConditional(info);
		closeMenu();
		return toast.success("Condição definida com sucesso");
	}
	return (
		<ResponsiveDialogDrawer
			menuTitle="CONDIÇÃO"
			menuDescription="Preencha os campos abaixo sobre a condição."
			menuActionButtonText="DEFINIR CONDIÇÃO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => handleCommitConditional(conditionalHolder)}
			actionIsPending={false}
			stateIsLoading={false}
			closeMenu={closeMenu}
		>
			<SelectInput
				label="TIPO DA CONDIÇÃO"
				options={ConditionTypes}
				selectedItemLabel="NÃO DEFINIDO"
				value={conditionalHolder.tipo}
				handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, tipo: value }))}
				onReset={() => setConditionalHolder((prev) => ({ ...prev, tipo: "IGUAL_TEXTO" }))}
				width="100%"
			/>
			<TextareaInput
				label="RESULTADO"
				value={conditionalHolder.valor}
				placeholder="Preencha o resultado dessa condição..."
				handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, valor: value }))}
			/>
			<SelectInput
				label="VARIÁVEL"
				options={variables?.map((variable) => ({ id: variable._id, label: variable.titulo, value: variable._id })) ?? []}
				selectedItemLabel="NÃO DEFINIDO"
				value={conditionalHolder.variavelId}
				handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, variavelId: value }))}
				onReset={() => setConditionalHolder((prev) => ({ ...prev, variavelId: "" }))}
				width="100%"
			/>
			{conditionalHolder.tipo === "IGUAL_TEXTO" ? (
				<TextInput
					label="VALOR IGUAL"
					value={conditionalHolder.igual ?? ""}
					placeholder="Preencha o valor igual"
					handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, igual: value }))}
					width="100%"
				/>
			) : null}
			{conditionalHolder.tipo === "IGUAL_NÚMERICO" ? (
				<NumberInput
					label="VALOR IGUAL"
					value={formatAsNumber(conditionalHolder.igual)}
					placeholder="Preencha o valor igual"
					handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, igual: value.toString() }))}
					width="100%"
				/>
			) : null}
			{conditionalHolder.tipo === "MAIOR_QUE_NÚMERICO" ? (
				<NumberInput
					label="VALOR MAIOR QUE"
					value={conditionalHolder.maiorQue ?? null}
					placeholder="Preencha o valor maior que"
					handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, maiorQue: value }))}
					width="100%"
				/>
			) : null}
			{conditionalHolder.tipo === "MENOR_QUE_NÚMERICO" ? (
				<NumberInput
					label="VALOR MENOR QUE"
					value={conditionalHolder.menorQue ?? null}
					placeholder="Preencha o valor menor que"
					handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, menorQue: value }))}
					width="100%"
				/>
			) : null}
			{conditionalHolder.tipo === "INTERVALO_NÚMERICO" ? (
				<div className="w-full flex items-center gap-2">
					<div className="w-1/2">
						<NumberInput
							label="VALOR MÍNIMO DO INTERVALO"
							value={conditionalHolder.intervaloMinimo ?? null}
							placeholder="Preencha o valor mínimo do intervalo"
							handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, intervaloMinimo: value }))}
							width="100%"
						/>
					</div>
					<div className="w-1/2">
						<NumberInput
							label="VALOR MÍNIMO DO INTERVALO"
							value={conditionalHolder.intervaloMaximo ?? null}
							placeholder="Preencha o valor mínimo do intervalo"
							handleChange={(value) => setConditionalHolder((prev) => ({ ...prev, intervaloMaximo: value }))}
							width="100%"
						/>
					</div>
				</div>
			) : null}
			{/** TODO: INCLUI LISTA */}
		</ResponsiveDialogDrawer>
	);
}
