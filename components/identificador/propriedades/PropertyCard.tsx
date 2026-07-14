import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PROPERTY_METADATA_TYPES_CONFIG } from "@/lib/properties";
import { getVehicleReviewAlertLevelByKmDifference } from "@/lib/property-usage";
import { cn } from "@/lib/utils";
import type { TGetPropertiesDefaultOutput } from "@/pages/api/propriedades";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
import { CheckCircle2, CircleGauge, Code, Landmark, Pencil, ScanSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsCalendarPlus } from "react-icons/bs";

type PropertyCardProps = {
  property: TGetPropertiesDefaultOutput[number];
  openModal: (id: string) => void;
};
function PropertyCard({ property, openModal }: PropertyCardProps) {
  const openUsages = property.usosTemporarios || [];

  const vehicleReviewAlertLevel =
    property.metadados.tipo === "VEÍCULO"
      ? getVehicleReviewAlertLevelByKmDifference(
          property.metadados.kmProximaRevisao - property.metadados.kmAcumulado,
        )
      : null;
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs sm:flex-row dark:bg-[#121212]">
      <div className="flex items-center justify-center">
        <div className="relative h-20 max-h-20 min-h-20 w-20 max-w-20 min-w-20 overflow-hidden rounded-lg">
          {property.imagemUrl ? (
            <Image src={property.imagemUrl} alt={property.nome} fill={true} objectFit="cover" />
          ) : (
            <div className="bg-primary/50 text-primary-foreground flex h-full w-full items-center justify-center">
              <Landmark className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="flex h-full grow flex-col justify-between gap-2">
        <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                PROPERTY_METADATA_TYPES_CONFIG[property.metadados.tipo].stylingClassName,
                "rounded-full text-[0.65rem]",
              )}
            >
              {renderIconWithClassNames(
                PROPERTY_METADATA_TYPES_CONFIG[property.metadados.tipo].icon,
                "h-4 w-4 min-w-4 min-h-4",
              )}
              {property.metadados.tipo}
            </Badge>
            <p className="text-sm leading-none font-bold tracking-tight">{property.nome}</p>
            <div className={cn("flex items-center gap-1")}>
              <Code className="h-4 w-4" />
              <p className="text-xs font-medium tracking-tight">
                {property.identificador || "N/A"}
              </p>
            </div>
            {property.metadados.tipo === "VEÍCULO" ? (
              <>
                {vehicleReviewAlertLevel ? (
                  <Badge
                    className={cn(vehicleReviewAlertLevel.color, "rounded-full text-[0.65rem]")}
                  >
                    <ScanSearch size={12} />
                    <p>{vehicleReviewAlertLevel.text}</p>
                  </Badge>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {openUsages.length > 0 ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant={"ghost"} size={"fit"} className="text-xs">
                    {openUsages.length} USOS EM ANDAMENTO
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h1 className="text-[0.65rem] font-medium">USOS EM ANDAMENTO</h1>
                  <div className="flex flex-col gap-3">
                    {openUsages.map((usage) => (
                      <Link
                        key={usage._id}
                        href={`/adm/propriedades/usos-temporarios?propertyUsageId=${usage._id}`}
                        className="bg-primary/10 hover:bg-primary/20 flex w-full flex-col gap-1 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex w-full items-center justify-between">
                          <Badge className="rounded-full text-[0.65rem]">
                            {usage.metadados.tipo}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <BsCalendarPlus className="h-4 w-4" />
                            <p className="text-xs font-medium tracking-tight">
                              {formatDateAsLocale(usage.dataInicio) || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 min-h-4 w-4 min-w-4">
                              <AvatarImage src={usage.autor.avatar_url ?? undefined} />
                              <AvatarFallback className="text-xs">
                                {formatNameAsInitials(usage.autor.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs font-medium tracking-tight">{usage.autor.nome}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <div />
            )}
            <Badge
              className={cn("rounded-full text-[0.65rem]", {
                "bg-green-600 text-white": property.ativo,
                "bg-red-600 text-white": !property.ativo,
              })}
            >
              <CheckCircle2 className="h-4 w-4" />
              {property.ativo ? "ATIVO" : "INATIVO"}
            </Badge>
          </div>
        </div>
        <div className="w-full flex items-center justify-start gap-x-2 gap-y-1 flex-wrap">
          {property.metadados.tipo === "VEÍCULO" ? <VehicleMetadata property={property} /> : null}
        </div>
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-foreground text-xs font-medium">
              {formatDateAsLocale(property.dataInsercao, true) || "N/A"}
            </p>
          </div>
          <Button
            variant={"ghost"}
            className="flex items-center gap-1 px-2 py-1"
            size={"fit"}
            onClick={() => openModal(property._id)}
          >
            <Pencil size={16} />
            <p className="text-foreground text-sm font-semibold">EDITAR</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;

type VehicleMetadataProps = {
  property: TGetPropertiesDefaultOutput[number];
};
function VehicleMetadata({ property }: VehicleMetadataProps) {
  return (
    <>
      <div className="flex items-center gap-1">
        <CircleGauge className="h-4 w-4" />
        <h2 className="text-xs font-medium tracking-tight">
          KM ATUAL: <strong>{formatDecimalPlaces(property.metadados.kmAcumulado)}km</strong>
        </h2>
      </div>
      <div className="flex items-center gap-1">
        <ScanSearch className="h-4 w-4" />
        <h2 className="text-xs font-medium tracking-tight">
          PRÓXIMA REVISÃO:{" "}
          <strong>{formatDecimalPlaces(property.metadados.kmProximaRevisao)}km</strong>
        </h2>
      </div>
    </>
  );
}
