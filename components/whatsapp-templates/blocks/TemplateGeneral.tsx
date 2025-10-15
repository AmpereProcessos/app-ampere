import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { TemplateCategoryOptions, TemplateLanguageOptions, TemplateParameterFormatOptions } from "@/lib/whatsapp/templates";
import type { TUseWhatsappTemplateState } from "@/utils/state/whatsapp-template";
import { LayoutGrid } from "lucide-react";

type TemplateGeneralProps = {
	template: TUseWhatsappTemplateState["state"]["template"];
	updateTemplate: TUseWhatsappTemplateState["updateTemplate"];
	whatsappTemplateId: string | null;
};
export default function TemplateGeneral({ template, updateTemplate, whatsappTemplateId }: TemplateGeneralProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="INFORMAÇÕES BÁSICAS" sectionTitleIcon={<LayoutGrid size={15} />}>
			{whatsappTemplateId && (
				<p className="w-fit self-center bg-orange-100 text-orange-500 text-xs rounded-lg px-2 py-1">
					⚠️ Nome do template não pode ser alterado após sincronização com WhatsApp.
				</p>
			)}
			<div className="w-full flex items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<TextInput
						label="NOME DO TEMPLATE"
						value={template.nome}
						placeholder="nome_do_template"
						handleChange={(value) => updateTemplate({ nome: value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })}
						width="100%"
						editable={!whatsappTemplateId}
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="CATEGORIA"
						value={template.categoria}
						options={TemplateCategoryOptions}
						selectedItemLabel="label"
						onReset={() => updateTemplate({ categoria: "marketing" })}
						handleChange={(value) => updateTemplate({ categoria: value as "authentication" | "marketing" | "utility" })}
						width="100%"
					/>
				</div>
			</div>

			<div className="w-full flex items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="IDIOMA"
						value={template.idioma}
						options={TemplateLanguageOptions}
						selectedItemLabel="label"
						onReset={() => updateTemplate({ idioma: "pt_BR" })}
						handleChange={(value) => updateTemplate({ idioma: value as string })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="FORMATO DE PARÂMETROS"
						value={template.formatoParametros}
						options={TemplateParameterFormatOptions}
						selectedItemLabel="label"
						onReset={() => updateTemplate({ formatoParametros: "named" })}
						handleChange={(value) => updateTemplate({ formatoParametros: value as "named" | "positional" })}
						width="100%"
					/>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}
