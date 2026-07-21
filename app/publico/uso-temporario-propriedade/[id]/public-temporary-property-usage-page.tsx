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
    // a key força a store a ser recriada quando o uso em aberto muda (ex.: após iniciar
    // o uso e o router.refresh() trocar a tela de início pela de finalização), já que o
    // provider mantém a store em um useRef e ignoraria o novo estado inicial.
    <PropertyUsageProvider
      key={openUsage.openUsage?._id ?? "nova-utilizacao"}
      propertyUsage={initialPropertyUsage}
      attachments={[]}
    >
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
