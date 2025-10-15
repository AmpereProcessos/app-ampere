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
import TemplateGeneral from "./blocks/TemplateGeneral";
import TemplateHeaderConfig from "./blocks/TemplateHeaderConfig";
import TemplatePreview from "./blocks/TemplatePreview";
import TemplateStatus from "./blocks/TemplateStatus";

type NewWhatsappTemplateProps = {
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};

function NewWhatsappTemplate({ session, closeMenu, callbacks }: NewWhatsappTemplateProps) {
	const { state, updateTemplate, updateComponents, updateBodyParameters, resetState } = useWhatsappTemplateState({
		initialState: {},
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
					syncToWhatsapp: true,
				});
			}}
			actionIsPending={isPending}
			stateIsLoading={false}
			closeMenu={closeMenu}
			dialogVariant="xl"
		>
			{/* Status Information */}
			<TemplateStatus whatsappTemplateId={null} status={null} quality={null} />
			{/* Basic Information */}
			<TemplateGeneral template={state.template} updateTemplate={updateTemplate} whatsappTemplateId={null} />
			<div className="w-full flex items-start gap-2 flex-col lg:flex-row grow">
				<div className="grow w-full lg:w-2/3 flex flex-col gap-3 flex-1 p-2 rounded-lg border border-primary/30 shadow-sm">
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
				<div className="grow w-full lg:w-1/3 p-2 rounded-lg border border-primary/30 shadow-sm flex flex-col flex-1">
					<TemplatePreview components={state.template.componentes} />
				</div>
			</div>
		</ResponsiveDialogDrawer>
	);
}

export default NewWhatsappTemplate;
