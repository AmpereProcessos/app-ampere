import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TWhatsappTemplateHeader } from "@/utils/schemas/whatsapp-templates";
import { ImageIcon, X } from "lucide-react";

type TemplateHeaderConfigProps = {
	header: TWhatsappTemplateHeader | null;
	onHeaderChange: (header: TWhatsappTemplateHeader | null) => void;
};

function TemplateHeaderConfig({ header, onHeaderChange }: TemplateHeaderConfigProps) {
	const headerTypeOptions = [
		{ id: "text", nome: "Texto", value: "text", label: "Texto" },
		{ id: "image", nome: "Imagem", value: "image", label: "Imagem" },
		{ id: "video", nome: "Vídeo", value: "video", label: "Vídeo" },
		{ id: "document", nome: "Documento", value: "document", label: "Documento" },
	];

	const handleAddHeader = () => {
		onHeaderChange({
			tipo: "text",
			conteudo: "",
			exemplo: null,
		});
	};

	const handleRemoveHeader = () => {
		onHeaderChange(null);
	};

	const handleHeaderTypeChange = (tipo: "text" | "image" | "video" | "document") => {
		if (!header) return;
		onHeaderChange({
			...header,
			tipo,
			conteudo: "",
			exemplo: tipo !== "text" ? "" : null,
		});
	};

	const handleHeaderContentChange = (conteudo: string) => {
		if (!header) return;
		onHeaderChange({
			...header,
			conteudo,
		});
	};

	const handleHeaderExampleChange = (exemplo: string) => {
		if (!header) return;
		onHeaderChange({
			...header,
			exemplo,
		});
	};

	if (!header) {
		return (
			<ResponsiveDialogDrawerSection sectionTitleText="CABEÇALHO (OPCIONAL)" sectionTitleIcon={<ImageIcon size={15} />}>
				<Button type="button" variant="outline" onClick={handleAddHeader}>
					+ ADICIONAR CABEÇALHO
				</Button>
			</ResponsiveDialogDrawerSection>
		);
	}

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="CABEÇALHO" sectionTitleIcon={<ImageIcon size={15} />}>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<SelectInput
						label="TIPO DE CABEÇALHO"
						value={header.tipo}
						options={headerTypeOptions}
						selectedItemLabel="label"
						onReset={() => handleHeaderTypeChange("text")}
						handleChange={(value) => handleHeaderTypeChange(value as "text" | "image" | "video" | "document")}
						width="70%"
					/>
					<Button type="button" variant="ghost" size="sm" onClick={handleRemoveHeader}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{header.tipo === "text" ? (
					<TextInput
						label="TEXTO DO CABEÇALHO"
						value={header.conteudo}
						placeholder="Digite o texto do cabeçalho (máx. 60 caracteres)"
						handleChange={handleHeaderContentChange}
						width="100%"
					/>
				) : (
					<>
						<TextInput
							label="URL DA MÍDIA"
							value={header.conteudo}
							placeholder="URL pública da mídia (será usado como padrão)"
							handleChange={handleHeaderContentChange}
							width="100%"
						/>
						<TextInput
							label="EXEMPLO (HANDLE)"
							value={header.exemplo || ""}
							placeholder="Handle de exemplo da mídia (para aprovação)"
							handleChange={handleHeaderExampleChange}
							width="100%"
						/>
						<p className="text-xs text-primary/60">Para mídias, você deve fazer upload via Resumable Upload API e fornecer o handle aqui.</p>
					</>
				)}

				{header.tipo === "text" && header.conteudo.length > 60 && (
					<p className="text-xs text-red-500">Atenção: O cabeçalho de texto deve ter no máximo 60 caracteres.</p>
				)}
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default TemplateHeaderConfig;
