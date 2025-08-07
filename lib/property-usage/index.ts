import type { TProperty, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import { Airplay, ShieldOff } from "lucide-react";
import type { ComponentType } from "react";

export const PropertyTemporaryUsageMetadataTypeByPropertyType: Record<TProperty["metadados"]["tipo"], TPropertyTemporaryUsage["metadados"]["tipo"]> = {
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
export const DOCUMENTS_BY_USAGE_TYPE: Record<TPropertyTemporaryUsage["metadados"]["tipo"], TDocumentConfig[]> = {
	"USO DE VEÍCULO": [
		{
			identifier: "foto_painel",
			icon: Airplay as ComponentType,
			title: "FOTO DO PAINEL",
			call: "Anexe uma foto do painel do veículo de modo que seja visível a kilometragem do veículo.",
			multiple: false,
			optional: false,
			acceptedExtensions: ["image/*"],
		},
		{
			identifier: "avarias",
			icon: ShieldOff as ComponentType,
			title: "AVARIAS",
			call: "Se houve alguma avaria, anexe foto ou vídeo de possíveis avarias do veículo.",
			multiple: true,
			optional: true,
			acceptedExtensions: ["image/*", "video/*"],
		},
	],
};
