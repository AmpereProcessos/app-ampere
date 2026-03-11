import type { TProperty, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import type { TAttachmentState } from "@/utils/methods/uploading";
import { Airplay } from "lucide-react";
import type { ComponentType } from "react";

export function getVehicleReviewAlertLevelByKmDifference(kmDifference: number) {
  if (kmDifference <= 0)
    return {
      text: "REVISÃO EM ATRASO",
      call: "Atenção, a revisão desse veículo está atrasada.",
      color: "bg-red-200 text-red-700",
    };
  if (kmDifference <= 100)
    return {
      text: `REVISÃO EM ${kmDifference}KM`,
      call: `Atenção, a revisão desse veículo está próxima (em ${kmDifference}km).`,
      color: "bg-red-200 text-red-700",
    };
  if (kmDifference <= 200)
    return {
      text: `REVISÃO EM ${kmDifference}KM`,
      call: `Atenção, a revisão desse veículo está próxima (em ${kmDifference}km).`,
      color: "bg-yellow-200 text-yellow-700",
    };
  if (kmDifference <= 300)
    return {
      text: `REVISÃO EM ${kmDifference}KM`,
      call: `Atenção, a revisão desse veículo será necessária em ${kmDifference}km.`,
      color: "bg-green-200 text-green-700",
    };
  if (kmDifference <= 500)
    return {
      text: `REVISÃO EM ${kmDifference}KM`,
      call: `Atenção, a revisão desse veículo será necessária em ${kmDifference}km.`,
      color: "bg-blue-200 text-blue-700",
    };
  return null;
}

export const PropertyTemporaryUsageMetadataTypeByPropertyType: Record<
  TProperty["metadados"]["tipo"],
  TPropertyTemporaryUsage["metadados"]["tipo"]
> = {
  VEÍCULO: "USO DE VEÍCULO",
};

type TDocumentConfig = {
  identifier: string;
  icon: React.ComponentType;
  title: string;
  call: string;
  multiple: boolean;
  optional: boolean;
  acceptedExtensions: string[];
};
export const DOCUMENTS_BY_USAGE_TYPE: Record<
  TPropertyTemporaryUsage["metadados"]["tipo"],
  {
    start: TDocumentConfig[];
    finish: TDocumentConfig[];
  }
> = {
  "USO DE VEÍCULO": {
    start: [
      {
        identifier: "foto_painel_inicial",
        icon: Airplay as ComponentType,
        title: "FOTO DO PAINEL",
        call: "Anexe uma foto do painel do veículo de modo que seja visível a kilometragem do veículo.",
        multiple: false,
        optional: false,
        acceptedExtensions: ["image/*"],
      },
    ],
    finish: [
      {
        identifier: "foto_painel_final",
        icon: Airplay as ComponentType,
        title: "FOTO DO PAINEL",
        call: "Anexe uma foto do painel do veículo de modo que seja visível a kilometragem do veículo.",
        multiple: false,
        optional: false,
        acceptedExtensions: ["image/*"],
      },
    ],
  },
};

function hasValidAttachment(attachments: TAttachmentState[], identifier: string) {
  const attachment = attachments.find((item) => item.identificador === identifier);
  if (!attachment) return false;
  return attachment.arquivos.some((file) => !!file.arquivo);
}

export function validateVehicleUsageStartSubmission({
  attachments,
  authorId,
}: {
  attachments: TAttachmentState[];
  authorId: string;
}) {
  if (!authorId) return "Informe um responsável válido para iniciar o uso.";
  if (!hasValidAttachment(attachments, "foto_painel_inicial")) {
    return "Anexe a imagem obrigatória da quilometragem inicial.";
  }
  return null;
}

export function validateVehicleUsageFinishSubmission({
  attachments,
  authorId,
  kmInicial,
  kmFinal,
}: {
  attachments: TAttachmentState[];
  authorId: string;
  kmInicial: number;
  kmFinal: number | null | undefined;
}) {
  if (!authorId) return "Informe um responsável válido para finalizar o uso.";
  if (kmFinal === null || kmFinal === undefined || Number.isNaN(kmFinal)) {
    return "Informe a kilometragem final.";
  }
  if (kmFinal < kmInicial) {
    return "A kilometragem final não pode ser menor que a inicial.";
  }
  if (!hasValidAttachment(attachments, "foto_painel_final")) {
    return "Anexe a imagem obrigatória da quilometragem final.";
  }
  return null;
}
