import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import {
  deleteWhatsappTemplate,
  updateWhatsappTemplate,
} from "@/utils/methods/mutation/whatsapp-templates";
import { useWhatsappTemplateById } from "@/utils/methods/query/whatsapp-templates";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useWhatsappTemplateState } from "@/utils/state/whatsapp-template";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TemplateBodyEditor from "./blocks/TemplateBodyEditor";
import TemplateButtonsConfig from "./blocks/TemplateButtonsConfig";
import TemplateFooterConfig from "./blocks/TemplateFooterConfig";
import TemplateGeneral from "./blocks/TemplateGeneral";
import TemplateHeaderConfig from "./blocks/TemplateHeaderConfig";
import TemplatePreview from "./blocks/TemplatePreview";
import TemplateStatus from "./blocks/TemplateStatus";

type ControlWhatsappTemplateProps = {
  whatsappTemplateId: string;
  session: TAuthSession;
  closeMenu: () => void;
  callbacks?: TMutationCallbacks;
};

function ControlWhatsappTemplate({
  whatsappTemplateId,
  session,
  closeMenu,
  callbacks,
}: ControlWhatsappTemplateProps) {
  const {
    data: templateData,
    isLoading,
    isError,
    error,
  } = useWhatsappTemplateById({ id: whatsappTemplateId });

  const { state, updateTemplate, updateComponents, updateBodyParameters, redefineState } =
    useWhatsappTemplateState({
      initialState: {},
    });

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
      stateIsLoading={isLoading}
      stateError={isError ? getErrorMessage(error) : null}
      closeMenu={closeMenu}
      dialogVariant="xl"
    >
      <div className="w-full flex items-start gap-2 flex-col lg:flex-row lg:max-h-full lg:h-full">
        <div className="w-full lg:w-2/3 flex flex-col gap-3 p-2 rounded-lg border border-border shadow-sm overflow-y-auto lg:h-full scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
          {/* Status Information */}
          <TemplateStatus
            whatsappTemplateId={templateData?.whatsappTemplateId ?? null}
            status={templateData?.status ?? null}
            quality={templateData?.qualidade ?? null}
            motivoRejeicao={templateData?.motivoRejeicao ?? null}
          />
          {/* Basic Information */}
          <TemplateGeneral
            template={state.template}
            updateTemplate={updateTemplate}
            whatsappTemplateId={templateData?.whatsappTemplateId ?? null}
          />
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

          <TemplateFooterConfig
            footer={state.template.componentes.rodape ?? null}
            onFooterChange={(footer) => updateComponents({ rodape: footer })}
          />

          <TemplateButtonsConfig
            buttons={state.template.componentes.botoes ?? null}
            onButtonsChange={(buttons) => updateComponents({ botoes: buttons })}
          />
        </div>
        <div className="w-full lg:w-1/3 p-2 rounded-lg border border-border shadow-sm flex flex-col lg:h-full lg:sticky lg:top-0">
          <TemplatePreview components={state.template.componentes} />
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
}

export default ControlWhatsappTemplate;
