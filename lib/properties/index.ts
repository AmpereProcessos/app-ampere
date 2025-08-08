import type { TProperty } from "@/utils/schemas/properties";
import { Car } from "lucide-react";

type TPropertyMetadataTypeConfig = {
	name: string;
	icon: React.ComponentType;
	stylingClassName: string;
};
export const PROPERTY_METADATA_TYPES_CONFIG: Record<TProperty["metadados"]["tipo"], TPropertyMetadataTypeConfig> = {
	VEÍCULO: {
		name: "VEÍCULO",
		icon: Car,
		stylingClassName: "bg-blue-600 text-white",
	},
};
