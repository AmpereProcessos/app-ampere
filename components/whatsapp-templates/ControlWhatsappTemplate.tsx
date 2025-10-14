import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { deleteWhatsappTemplate, updateWhatsappTemplate } from "@/utils/methods/mutation/whatsapp-templates";
import { useWhatsappTemplateById } from "@/utils/methods/query/whatsapp-templates";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useWhatsappTemplateState } from "@/utils/state/whatsapp-template";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TemplateBodyEditor from "./blocks/TemplateBodyEditor";
import TemplateButtonsConfig from "./blocks/TemplateButtonsConfig";
import TemplateFooterConfig from "./blocks/TemplateFooterConfig";
import TemplateHeaderConfig from "./blocks/TemplateHeaderConfig";
import TemplatePreview from "./blocks/TemplatePreview";

type ControlWhatsappTemplateProps = {
	whatsappTemplateId: string;
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};

function ControlWhatsappTemplate({ whatsappTemplateId, session, closeMenu, callbacks }: ControlWhatsappTemplateProps) {
	const [mode, setMode] = useState<"editor" | "preview">("editor");
	const [deleteFromWhatsapp, setDeleteFromWhatsapp] = useState(true);

	const { data: templateData, isLoading, isError, error } = useWhatsappTemplateById({ id: whatsappTemplateId });

	const { state, updateTemplate, updateComponents, updateBodyParameters, redefineState } = useWhatsappTemplateState();

	// Initialize state with fetched data
	useEffect(() => {
		if (templateData) {
			redefineState({
				template: {
					nome: templateData.nome,
					categoria: templateData.categoria,
					idioma: templateData.idioma,
					formatoParametros: templateData.formatoParametros,
					componentes: templateData.componentes,
				},
			});
		}
	}, [templateData, redefineState]);

	const { mutate: handleUpdateTemplate, isPending: isUpdating } = useMutation({
		mutationKey: ["update-whatsapp-template"],
		mutationFn: updateWhatsappTemplate,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
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

	const { mutate: handleDeleteTemplate, isPending: isDeleting } = useMutation({
		mutationKey: ["delete-whatsapp-template"],
		mutationFn: deleteWhatsappTemplate,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			toast.success(data.message);
			closeMenu();
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
		{ id: "authentication", nome: "Autenticação", value: "authentication", label: "Autenticação" },
		{ id: "marketing", nome: "Marketing", value: "marketing", label: "Marketing" },
		{ id: "utility", nome: "Utilidade", value: "utility", label: "Utilidade" },
	];

	const languageOptions = [
		{ id: "pt_BR", nome: "Português (Brasil)", value: "pt_BR", label: "Português (Brasil)" },
		{ id: "en_US", nome: "Inglês (EUA)", value: "en_US", label: "Inglês (EUA)" },
		{ id: "es_ES", nome: "Espanhol", value: "es_ES", label: "Espanhol" },
	];

	const parameterFormatOptions = [
		{ id: "positional", nome: "Posicional ({{1}}, {{2}})", value: "positional", label: "Posicional ({{1}}, {{2}})" },
		{ id: "named", nome: "Nomeado ({{cliente_nome}})", value: "named", label: "Nomeado ({{cliente_nome}})" },
	];

	const handleDelete = () => {
		if (confirm("Tem certeza que deseja deletar este template?")) {
			handleDeleteTemplate({
				id: whatsappTemplateId,
				deleteFromWhatsapp,
			});
		}
	};

	if (isLoading) {
		return (
			<ResponsiveDialogDrawer
				menuTitle="EDITAR TEMPLATE WHATSAPP"
				menuDescription="Carregando dados do template..."
				menuActionButtonText="SALVAR"
				menuCancelButtonText="CANCELAR"
				actionFunction={() => {}}
				actionIsPending={false}
				stateIsLoading={true}
				closeMenu={closeMenu}
				dialogVariant="lg"
			>
				<LoadingComponent />
			</ResponsiveDialogDrawer>
		);
	}

	if (isError) {
		return (
			<ResponsiveDialogDrawer
				menuTitle="EDITAR TEMPLATE WHATSAPP"
				menuDescription="Erro ao carregar template"
				menuActionButtonText="SALVAR"
				menuCancelButtonText="CANCELAR"
				actionFunction={() => {}}
				actionIsPending={false}
				stateIsLoading={false}
				closeMenu={closeMenu}
				dialogVariant="lg"
			>
				<ErrorComponent msg={getErrorMessage(error)} />
			</ResponsiveDialogDrawer>
		);
	}

	return (
		<ResponsiveDialogDrawer
			menuTitle="EDITAR TEMPLATE WHATSAPP"
			menuDescription="Edite as informações do template."
			menuActionButtonText="SALVAR ALTERAÇÕES"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => {
				handleUpdateTemplate({
					id: whatsappTemplateId,
					template: state.template,
				});
			}}
			actionIsPending={isUpdating}
			stateIsLoading={false}
			closeMenu={closeMenu}
			dialogVariant="lg"
		>
			<div className="space-y-4">
				{/* Status Information */}
				{templateData && (
					<div className="p-3 bg-gray-50 dark:bg-gray-800 rounded space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Status:</span>
							<span
								className={`text-sm px-2 py-1 rounded ${
									templateData.status === "APROVADO"
										? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
										: templateData.status === "PENDENTE"
											? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
											: templateData.status === "REJEITADO"
												? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
												: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
								}`}
							>
								{templateData.status}
							</span>
						</div>

						{templateData.qualidade && (
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Qualidade:</span>
								<span className="text-sm">{templateData.qualidade}</span>
							</div>
						)}

						{templateData.whatsappTemplateId && (
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">ID WhatsApp:</span>
								<span className="text-xs font-mono">{templateData.whatsappTemplateId}</span>
							</div>
						)}
					</div>
				)}

				{/* Basic Information */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold border-b border-primary/10 pb-2">INFORMAÇÕES BÁSICAS</h3>

					<TextInput
						label="NOME DO TEMPLATE"
						value={state.template.nome}
						placeholder="nome_do_template"
						handleChange={(value) => updateTemplate({ nome: value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })}
						width="100%"
						editable={!templateData?.whatsappTemplateId}
					/>

					{templateData?.whatsappTemplateId && (
						<p className="text-xs text-orange-500">⚠️ Nome do template não pode ser alterado após sincronização com WhatsApp.</p>
					)}

					<SelectInput
						label="CATEGORIA"
						value={state.template.categoria}
						options={categoryOptions}
						selectedItemLabel="label"
						onReset={() => updateTemplate({ categoria: "authentication" })}
						handleChange={(value) => updateTemplate({ categoria: value as "authentication" | "marketing" | "utility" })}
						width="100%"
					/>

					<div className="grid grid-cols-2 gap-3">
						<SelectInput
							label="IDIOMA"
							value={state.template.idioma}
							options={languageOptions}
							selectedItemLabel="label"
							onReset={() => updateTemplate({ idioma: "pt_BR" })}
							handleChange={(value) => updateTemplate({ idioma: value as string })}
							width="100%"
						/>

						<SelectInput
							label="FORMATO DE PARÂMETROS"
							value={state.template.formatoParametros}
							options={parameterFormatOptions}
							selectedItemLabel="label"
							onReset={() => updateTemplate({ formatoParametros: "positional" })}
							handleChange={(value) => updateTemplate({ formatoParametros: value as "named" | "positional" })}
							width="100%"
						/>
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

				{/* Delete Section */}
				<div className="border-t border-red-200 pt-4 space-y-3">
					<h3 className="text-sm font-semibold text-red-600">ZONA DE PERIGO</h3>

					<div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded">
						<Checkbox checked={deleteFromWhatsapp} onCheckedChange={(checked) => setDeleteFromWhatsapp(checked as boolean)} id="delete-whatsapp" />
						<label htmlFor="delete-whatsapp" className="text-sm cursor-pointer">
							Deletar também do WhatsApp Business API
						</label>
					</div>

					<Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full">
						{isDeleting ? "DELETANDO..." : "DELETAR TEMPLATE"}
					</Button>
				</div>
			</div>
		</ResponsiveDialogDrawer>
	);
}

export default ControlWhatsappTemplate;
