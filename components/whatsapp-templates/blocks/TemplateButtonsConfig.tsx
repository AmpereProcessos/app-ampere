import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TWhatsappTemplateButton } from "@/utils/schemas/whatsapp-templates";
import { MousePointerClick, Trash2, X } from "lucide-react";

type TemplateButtonsConfigProps = {
	buttons: TWhatsappTemplateButton[] | null;
	onButtonsChange: (buttons: TWhatsappTemplateButton[] | null) => void;
};

function TemplateButtonsConfig({ buttons, onButtonsChange }: TemplateButtonsConfigProps) {
	const buttonTypeOptions = [
		{ id: "quick_reply", nome: "Resposta Rápida", value: "quick_reply", label: "Resposta Rápida" },
		{ id: "url", nome: "URL", value: "url", label: "URL" },
		{ id: "phone_number", nome: "Número de Telefone", value: "phone_number", label: "Número de Telefone" },
	];

	const handleAddButtons = () => {
		onButtonsChange([
			{
				tipo: "quick_reply",
				texto: "",
				dados: null,
			},
		]);
	};

	const handleRemoveButtons = () => {
		onButtonsChange(null);
	};

	const handleAddButton = () => {
		if (!buttons) return;
		onButtonsChange([
			...buttons,
			{
				tipo: "quick_reply",
				texto: "",
				dados: null,
			},
		]);
	};

	const handleRemoveButton = (index: number) => {
		if (!buttons) return;
		const newButtons = buttons.filter((_, i) => i !== index);
		if (newButtons.length === 0) {
			onButtonsChange(null);
		} else {
			onButtonsChange(newButtons);
		}
	};

	const handleButtonChange = (index: number, button: TWhatsappTemplateButton) => {
		if (!buttons) return;
		const newButtons = [...buttons];
		newButtons[index] = button;
		onButtonsChange(newButtons);
	};

	if (!buttons) {
		return (
			<ResponsiveDialogDrawerSection sectionTitleText="BOTÕES (OPCIONAL)" sectionTitleIcon={<MousePointerClick size={15} />}>
				<Button type="button" variant="outline" onClick={handleAddButtons}>
					+ ADICIONAR BOTÕES
				</Button>
			</ResponsiveDialogDrawerSection>
		);
	}

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="BOTÕES" sectionTitleIcon={<MousePointerClick size={15} />}>
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<p className="text-sm text-primary/60">Configure até 10 botões para seu template</p>
					<Button type="button" variant="ghost" size="sm" onClick={handleRemoveButtons}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{buttons.map((button, index) => (
					<div key={index.toString()} className="border border-primary/10 rounded-lg p-3 space-y-2">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-semibold">Botão {index + 1}</h4>
							<Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveButton(index)}>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>

						<SelectInput
							label="TIPO DE BOTÃO"
							value={button.tipo}
							options={buttonTypeOptions}
							selectedItemLabel="label"
							onReset={() => handleButtonChange(index, { ...button, tipo: "quick_reply" })}
							handleChange={(value) => {
								const newButton = {
									...button,
									tipo: value as "quick_reply" | "url" | "phone_number",
									dados: value === "quick_reply" ? null : { url: null, telefone: null },
								};
								handleButtonChange(index, newButton);
							}}
							width="100%"
						/>

						<TextInput
							label="TEXTO DO BOTÃO"
							value={button.texto}
							placeholder="Digite o texto do botão (máx. 25 caracteres)"
							handleChange={(value) => handleButtonChange(index, { ...button, texto: value })}
							width="100%"
						/>

						{button.tipo === "url" && (
							<TextInput
								label="URL"
								value={button.dados?.url || ""}
								placeholder="https://exemplo.com"
								handleChange={(value) =>
									handleButtonChange(index, {
										...button,
										dados: { ...button.dados, url: value },
									})
								}
								width="100%"
							/>
						)}

						{button.tipo === "phone_number" && (
							<TextInput
								label="NÚMERO DE TELEFONE"
								value={button.dados?.telefone || ""}
								placeholder="+5534999999999"
								handleChange={(value) =>
									handleButtonChange(index, {
										...button,
										dados: { ...button.dados, telefone: value },
									})
								}
								width="100%"
							/>
						)}

						{button.texto.length > 25 && <p className="text-xs text-red-500">Atenção: O texto do botão deve ter no máximo 25 caracteres.</p>}
					</div>
				))}

				{buttons.length < 10 && (
					<Button type="button" variant="outline" onClick={handleAddButton} className="w-full">
						+ ADICIONAR MAIS UM BOTÃO
					</Button>
				)}
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default TemplateButtonsConfig;
