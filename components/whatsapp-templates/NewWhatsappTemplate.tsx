import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createWhatsappTemplate } from "@/utils/methods/mutation/whatsapp-templates";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useWhatsappTemplateState } from "@/utils/state/whatsapp-template";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import TemplateBodyEditor from "./blocks/TemplateBodyEditor";
import TemplateButtonsConfig from "./blocks/TemplateButtonsConfig";
import TemplateFooterConfig from "./blocks/TemplateFooterConfig";
import TemplateHeaderConfig from "./blocks/TemplateHeaderConfig";
import TemplatePreview from "./blocks/TemplatePreview";

type NewWhatsappTemplateProps = {
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};

function NewWhatsappTemplate({ session, closeMenu, callbacks }: NewWhatsappTemplateProps) {
	const [mode, setMode] = useState<"editor" | "preview">("editor");
	const [syncToWhatsapp, setSyncToWhatsapp] = useState(true);

	const { state, updateTemplate, updateComponents, updateBodyParameters, resetState } = useWhatsappTemplateState({
		initialState: {
			template: {
				nome: "",
				categoria: "utility",
				idioma: "pt_BR",
				formatoParametros: "positional",
				componentes: {
					cabecalho: null,
					corpo: {
						conteudo: "<p>Digite sua mensagem aqui...</p>",
						parametros: [],
					},
					rodape: null,
					botoes: null,
				},
			},
		},
	});

	const { mutate: handleCreateTemplate, isPending } = useMutation({
		mutationKey: ["create-whatsapp-template"],
		mutationFn: createWhatsappTemplate,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetState();
			toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			toast.error(getErrorMessage(error));
		},
	});

	const categoryOptions = [
		{ id: "authentication", value: "authentication", label: "Autenticação" },
		{ id: "marketing", value: "marketing", label: "Marketing" },
		{ id: "utility", value: "utility", label: "Utilidade" },
	];

	const languageOptions = [
		{ id: "pt_BR", value: "pt_BR", label: "Português (Brasil)" },
		{ id: "en_US", value: "en_US", label: "Inglês (EUA)" },
		{ id: "es_ES", value: "es_ES", label: "Espanhol" },
	];

	const parameterFormatOptions = [
		{ id: "positional", value: "positional", label: "Posicional ({{1}}, {{2}})" },
		{ id: "named", value: "named", label: "Nomeado ({{cliente_nome}})" },
	];
	console.log("STATE", state);
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVO TEMPLATE WHATSAPP"
			menuDescription="Crie um novo template de mensagem para WhatsApp Business."
			menuActionButtonText="CRIAR TEMPLATE"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => {
				handleCreateTemplate({
					template: state.template,
					syncToWhatsapp,
				});
			}}
			actionIsPending={isPending}
			stateIsLoading={false}
			closeMenu={closeMenu}
			dialogVariant="lg"
		>
			<div className="space-y-4">
				{/* Basic Information */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold border-b border-primary/10 pb-2">INFORMAÇÕES BÁSICAS</h3>

					<TextInput
						label="NOME DO TEMPLATE"
						value={state.template.nome}
						placeholder="nome_do_template (apenas minúsculas, números e underscore)"
						handleChange={(value) => updateTemplate({ nome: value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })}
						width="100%"
					/>

					<SelectInput
						label="CATEGORIA"
						value={state.template.categoria}
						options={categoryOptions}
						selectedItemLabel="label"
						handleChange={(value) => updateTemplate({ categoria: value as "authentication" | "marketing" | "utility" })}
						onReset={() => updateTemplate({ categoria: "utility" })}
						width="100%"
					/>

					<div className="grid grid-cols-2 gap-3">
						<SelectInput
							label="IDIOMA"
							value={state.template.idioma}
							options={languageOptions}
							selectedItemLabel="label"
							handleChange={(value) => updateTemplate({ idioma: value as string })}
							onReset={() => updateTemplate({ idioma: "pt_BR" })}
							width="100%"
						/>

						<SelectInput
							label="FORMATO DE PARÂMETROS"
							value={state.template.formatoParametros}
							options={parameterFormatOptions}
							selectedItemLabel="label"
							handleChange={(value) => updateTemplate({ formatoParametros: value as "named" | "positional" })}
							onReset={() => updateTemplate({ formatoParametros: "positional" })}
							width="100%"
						/>
					</div>

					<div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
						<Checkbox checked={syncToWhatsapp} onCheckedChange={(checked) => setSyncToWhatsapp(checked as boolean)} id="sync" />
						<label htmlFor="sync" className="text-sm cursor-pointer">
							Sincronizar com WhatsApp Business API (criar template para uso imediato)
						</label>
					</div>
				</div>

				{/* Mode Toggle */}
				<div className="w-full flex items-center justify-center gap-2 border-y border-primary/10 py-3">
					<Button variant={mode === "editor" ? "default" : "ghost"} size="sm" onClick={() => setMode("editor")}>
						EDITOR
					</Button>
					<Button variant={mode === "preview" ? "default" : "ghost"} size="sm" onClick={() => setMode("preview")}>
						PREVIEW
					</Button>
				</div>

				{/* Editor Mode */}
				{mode === "editor" && (
					<div className="space-y-4">
						<TemplateHeaderConfig
							header={state.template.componentes.cabecalho ?? null}
							onHeaderChange={(header) => updateComponents({ cabecalho: header })}
						/>

						<TemplateBodyEditor
							content={state.template.componentes.corpo.conteudo}
							contentChangeCallback={(content) =>
								updateComponents({
									corpo: {
										...state.template.componentes.corpo,
										conteudo: content,
									},
								})
							}
							formatoParametros={state.template.formatoParametros}
							parametros={state.template.componentes.corpo.parametros}
							onParametrosChange={updateBodyParameters}
						/>

						<TemplateFooterConfig footer={state.template.componentes.rodape ?? null} onFooterChange={(footer) => updateComponents({ rodape: footer })} />

						<TemplateButtonsConfig
							buttons={state.template.componentes.botoes ?? null}
							onButtonsChange={(buttons) => updateComponents({ botoes: buttons })}
						/>
					</div>
				)}

				{/* Preview Mode */}
				{mode === "preview" && <TemplatePreview components={state.template.componentes} />}
			</div>
		</ResponsiveDialogDrawer>
	);
}

export default NewWhatsappTemplate;
