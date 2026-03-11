import NumberInput from "@/components/inputs/Number";
import { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import { usePropertyUsageStore } from "@/utils/stores/property-usage";
import { AlertCircle, CloudUpload, Lock, Paperclip } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getVehicleReviewAlertLevelByKmDifference } from "@/lib/property-usage";

type VehicleUsageKilometerAttachmentProps = {
  property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
  attachmentIdentifier: "foto_painel_inicial" | "foto_painel_final";
  title: string;
  helper: string;
  previewAlt: string;
  kmValue?: number | null;
  onKmChange?: (value: number) => void;
};

export default function VehicleUsageKilometerAttachment({
  property,
  attachmentIdentifier,
  title,
  helper,
  previewAlt,
  kmValue,
  onKmChange,
}: VehicleUsageKilometerAttachmentProps) {
  const attachments = usePropertyUsageStore((state) => state.attachments);
  const mutateAttachment = usePropertyUsageStore((state) => state.mutateAttachment);

  const attachment = attachments.find((item) => item.identificador === attachmentIdentifier);
  const vehicleReviewAlertLevel = getVehicleReviewAlertLevelByKmDifference(
    property.metadados.kmProximaRevisao - property.metadados.kmAcumulado,
  );
  const inputId = `dropzone-${attachmentIdentifier}`;

  return (
    <div className="flex w-full flex-col gap-2">
      {vehicleReviewAlertLevel ? (
        <div
          className={cn(
            "flex w-fit self-center items-center justify-center gap-1 rounded px-2 py-1",
            vehicleReviewAlertLevel.color,
          )}
        >
          <AlertCircle size={15} />
          <h1 className="w-fit text-start text-xs font-medium tracking-tight">
            {vehicleReviewAlertLevel.call}
          </h1>
        </div>
      ) : null}

      {onKmChange ? (
        <NumberInput
          label="QUILOMETRAGEM FINAL"
          placeholder="Informe a kilometragem final..."
          value={kmValue ?? null}
          handleChange={onKmChange}
          width="100%"
        />
      ) : null}

      <div className="border-primary/20 bg-background flex w-full grow flex-col gap-4 rounded-md border p-6 shadow-xs dark:bg-[#121212]">
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 min-h-4 w-4 min-w-4" />
              <h1 className="text-sm leading-none font-bold tracking-tight">{title}</h1>
            </div>
            <div className="bg-primary/20 text-primary flex items-center gap-1 rounded-lg px-2 py-1">
              <Lock className="h-3 min-h-3 w-3 min-w-3" />
              <p className="text-[0.6rem] font-bold tracking-tight">OBRIGATÓRIO</p>
            </div>
          </div>
        </div>
        <p className="text-primary/80 text-xs leading-none font-light">{helper}</p>
        <div className="relative flex w-full items-center justify-center">
          <label
            htmlFor={inputId}
            className="relative flex aspect-square h-auto w-full max-w-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-primary/20 bg-background hover:bg-primary/10 dark:bg-[#121212] dark:hover:bg-bray-800"
          >
            {attachment?.arquivos[0]?.previewUrl ? (
              <Image
                src={attachment.arquivos[0].previewUrl}
                alt={previewAlt}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-primary flex flex-col items-center justify-center px-4 pt-5 pb-6">
                <CloudUpload className="h-6 min-h-6 w-6 min-w-6" />
                <p className="text-center text-xs font-medium tracking-tight">
                  Clique aqui para selecionar os arquivos ou arraste-os para área demarcada.
                </p>
              </div>
            )}
            <input
              onChange={(e) => {
                if (e.target.files) {
                  const file = Array.from(e.target.files)[0] ?? null;
                  if (!file) return;
                  mutateAttachment({
                    identifier: attachmentIdentifier,
                    attachment: {
                      titulo: title,
                      arquivos: [
                        { arquivo: file, previewUrl: URL.createObjectURL(file), tipo: file.type },
                      ],
                      identificador: attachmentIdentifier,
                    },
                  });
                }
              }}
              id={inputId}
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept=".png,.jpeg,.jpg"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
