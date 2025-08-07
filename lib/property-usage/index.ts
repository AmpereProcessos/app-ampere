import type { TProperty, TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import { Airplay, ShieldOff } from "lucide-react";
import type { ComponentType } from "react";

export function getVehicleReviewAlertLevelByKmDifference(kmDifference: number) {
	if (kmDifference <= 0)
		return {
			text: "REVISÃO EM ATRASO",
			color: "bg-red-200 text-red-700",
		};
	if (kmDifference <= 100)
		return {
			text: `REVISÃO EM ${kmDifference}KM`,
			color: "bg-red-200 text-red-700",
		};
	if (kmDifference <= 200)
		return {
			text: `REVISÃO EM ${kmDifference}KM`,
			color: "bg-yellow-200 text-yellow-700",
		};
	if (kmDifference <= 300)
		return {
			text: `REVISÃO EM ${kmDifference}KM`,
			color: "bg-green-200 text-green-700",
		};
	if (kmDifference <= 500)
		return {
			text: `REVISÃO EM ${kmDifference}KM`,
			color: "bg-blue-200 text-blue-700",
		};
	return null;
}

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
