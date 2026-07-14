"use client";

import { TPropertyUsageStore, usePropertyUsageStore } from "@/utils/stores/property-usage";
import { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import { validateVehicleUsageStartSubmission } from "@/lib/property-usage";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { handleMultipleAttachmentsUpdate } from "@/utils/methods/uploading";
import { createPropertyUsage } from "@/utils/methods/mutation/properties";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TextareaInput from "@/components/inputs/TextareaInput";
import { getErrorMessage } from "@/utils/methods/handlers";
import VehicleUsagePropertyHeader from "./blocks/VehicleUsagePropertyHeader";
import VehicleUsageResponsibleSelector from "./blocks/VehicleUsageResponsibleSelector";
import VehicleUsageKilometerAttachment from "./blocks/VehicleUsageKilometerAttachment";
import VehicleUsageSuccessScreen from "./blocks/VehicleUsageSuccessScreen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullscreenUploadProgress from "@/components/utils/FullscreenUploadProgress";

type VehicleUsageStartProps = {
  property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
};
export default function VehicleUsageStart({ property }: VehicleUsageStartProps) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const attachments = usePropertyUsageStore((state) => state.attachments);
  const propertyUsage = usePropertyUsageStore((state) => state.propertyUsage);
  const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage);
  const reset = usePropertyUsageStore((state) => state.reset);
  const propertyUsageNotes = usePropertyUsageStore((state) => state.propertyUsage.anotacoes);

  async function handleStartPropertyUsage({
    stateHolder,
    property,
    attachments,
  }: {
    property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
    stateHolder: TPropertyUsageStore["propertyUsage"];
    attachments: TPropertyUsageStore["attachments"];
  }) {
    setUploadProgress(0);
    const filesMetadata = await handleMultipleAttachmentsUpdate({
      attachments,
      vinculationId: property._id,
      onProgress: setUploadProgress,
    });

    return await createPropertyUsage({
      info: { ...stateHolder, arquivos: filesMetadata, dataInicio: new Date().toISOString() },
    });
  }

  const {
    mutate: handleUsageMutation,
    isPending: isUsageMutationLoading,
    isSuccess: isUsageMutationSuccess,
  } = useMutation({
    mutationKey: ["handle-usage-mutation"],
    mutationFn: handleStartPropertyUsage,
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
    },
    onError: (error) => {
      setUploadProgress(null);
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!isUsageMutationSuccess) return;
    const timeout = setTimeout(() => {
      router.refresh();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isUsageMutationSuccess, router]);

  if (isUsageMutationSuccess) {
    return (
      <VehicleUsageSuccessScreen
        title="USO INICIADO COM SUCESSO"
        message="As informações foram registradas com sucesso."
      />
    );
  }

  return (
    <div className="bg-background flex min-h-dvh w-full max-w-lg flex-col justify-start gap-4 mx-auto px-4 py-6 sm:py-10">
      <div className="bg-card border-border flex w-full flex-col items-center gap-6 rounded-lg border p-4 shadow-xs sm:p-6">
        <VehicleUsagePropertyHeader title="INICIALIZAÇÃO DO USO DO VEÍCULO" property={property} />

        <VehicleUsageResponsibleSelector />
        <VehicleUsageKilometerAttachment
          property={property}
          attachmentIdentifier="foto_painel_inicial"
          title="IMAGEM DA QUILOMETRAGEM INICIAL"
          helper="Anexe uma foto do painel do veículo."
          previewAlt="Imagem da quilometragem inicial."
        />
        <TextareaInput
          label="ANOTAÇÕES"
          placeholder="Preencha aqui qualquer detalhe relevante, como detalhes de uma possível avaria, etc..."
          value={propertyUsageNotes ?? ""}
          handleChange={(value) => updatePropertyUsage({ anotacoes: value })}
        />
        <FullscreenUploadProgress
          value={isUsageMutationLoading ? uploadProgress : null}
          title="Iniciando o uso do veículo"
          messages={[
            "Enviando as imagens…",
            "Registrando o uso…",
            "Sincronizando os dados…",
          ]}
        />
        <div className="flex w-full items-center justify-end">
          <LoadingButton
            loading={isUsageMutationLoading}
            onClick={() => {
              const validationError = validateVehicleUsageStartSubmission({
                attachments,
                authorId: propertyUsage.autor.id,
              });
              if (validationError) {
                toast.error(validationError);
                return;
              }
              handleUsageMutation({
                property,
                stateHolder: propertyUsage,
                attachments,
              });
            }}
          >
            INICIAR USO
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
