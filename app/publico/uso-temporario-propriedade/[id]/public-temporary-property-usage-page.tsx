"use client";
import { PropertyUsageProvider } from "@/utils/stores/property-usage";
import VehicleUsage from "@/components/identificador/propriedades/usos-temporarios/VehicleUsage";
import { TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";

type PublicTemporaryPropertyUsagePageProps = {
  initialPropertyUsage: TPropertyTemporaryUsage;
  openUsage: TGetTemporaryUsageByPropertyOutput["data"];
};
export default function PublicTemporaryPropertyUsagePage({
  initialPropertyUsage,
  openUsage,
}: PublicTemporaryPropertyUsagePageProps) {
  return (
    <PropertyUsageProvider propertyUsage={initialPropertyUsage} attachments={[]}>
      {openUsage.property.metadados.tipo === "VEÍCULO" ? (
        <VehicleUsage usageId={openUsage.openUsage?._id} property={openUsage.property} />
      ) : (
        <p className="w-full text-center text-sm font-light tracking-tight">
          Tipo de uso não suportado.
        </p>
      )}
    </PropertyUsageProvider>
  );
}
