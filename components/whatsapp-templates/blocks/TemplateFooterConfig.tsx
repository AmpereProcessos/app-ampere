import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TWhatsappTemplateFooter } from "@/utils/schemas/whatsapp-templates";
import { AlignLeft, X } from "lucide-react";

type TemplateFooterConfigProps = {
	footer: TWhatsappTemplateFooter | null;
	onFooterChange: (footer: TWhatsappTemplateFooter | null) => void;
};

function TemplateFooterConfig({ footer, onFooterChange }: TemplateFooterConfigProps) {
	const handleAddFooter = () => {
		onFooterChange({
			conteudo: "",
		});
	};

	const handleRemoveFooter = () => {
		onFooterChange(null);
	};

	const handleFooterContentChange = (conteudo: string) => {
		if (!footer) return;
		onFooterChange({
			...footer,
			conteudo,
		});
	};

	if (!footer) {
		return (
			<ResponsiveDialogDrawerSection sectionTitleText="RODAPÉ (OPCIONAL)" sectionTitleIcon={<AlignLeft size={15} />}>
				<Button type="button" variant="outline" onClick={handleAddFooter}>
					+ ADICIONAR RODAPÉ
				</Button>
			</ResponsiveDialogDrawerSection>
		);
	}

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="RODAPÉ" sectionTitleIcon={<AlignLeft size={15} />}>
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<TextInput
						label="TEXTO DO RODAPÉ"
						value={footer.conteudo}
						placeholder="Digite o texto do rodapé (máx. 60 caracteres)"
						handleChange={handleFooterContentChange}
						width="100%"
					/>
					<Button type="button" variant="ghost" size="sm" onClick={handleRemoveFooter} className="mt-6">
						<X className="w-4 h-4" />
					</Button>
				</div>

				{footer.conteudo.length > 60 && <p className="text-xs text-red-500">Atenção: O rodapé deve ter no máximo 60 caracteres.</p>}
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default TemplateFooterConfig;
