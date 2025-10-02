import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatAsSlug } from "@/utils/methods/formatting";
import type { TUseContractTemplateVariableState } from "@/utils/state/contract-template-variable";
import { LayoutGrid } from "lucide-react";

type ContractTemplatesVariableGeneralProps = {
	state: TUseContractTemplateVariableState["state"];
	updateVariable: TUseContractTemplateVariableState["updateVariable"];
};
export default function ContractTemplatesVariableGeneral({ state, updateVariable }: ContractTemplatesVariableGeneralProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="INFORMAÇÕES GERAIS" sectionTitleIcon={<LayoutGrid size={15} />}>
			<TextInput
				label="TÍTULO"
				value={state.variable.titulo}
				placeholder="Preencha o título da variável"
				handleChange={(value) => updateVariable({ titulo: value, identificador: formatAsSlug(value) })}
				width="100%"
			/>
			<TextInput
				label="IDENTIFICADOR"
				value={state.variable.identificador}
				placeholder="Preencha o identificador da variável"
				handleChange={(value) => updateVariable({ identificador: formatAsSlug(value) })}
				width="100%"
			/>
			<TextareaInput
				label="DESCRIÇÃO"
				value={state.variable.descricao}
				placeholder="Preencha a descrição da variável"
				handleChange={(value) => updateVariable({ descricao: value })}
			/>
		</ResponsiveDialogDrawerSection>
	);
}
