import { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import { Car, Code } from "lucide-react";
import Image from "next/image";
import Logo from "@/utils/images/logo-sem-texto.png";
import { formatDecimalPlaces } from "@/utils/constants";

type VehicleUsagePropertyHeaderProps = {
  title: string;
  property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
};

export default function VehicleUsagePropertyHeader({
  title,
  property,
}: VehicleUsagePropertyHeaderProps) {
  return (
    <>
      <div className="flex w-full items-center justify-center gap-2">
        <Image src={Logo} alt="Logo" width={35} height={35} />
        <h1 className="text-center text-sm leading-none font-bold tracking-tight lg:text-lg">
          {title}
        </h1>
      </div>

      <div className="w-fit slef-center flex items-start justify-center gap-1.5">
        <div className="w-16 h-16 min-w-16 min-h-16 relative bg-primary/20 rounded-lg overflow-hidden">
          {property.imagemUrl ? (
            <Image
              src={property.imagemUrl}
              alt={`Imagem da propriedade ${property.nome}`}
              fill={true}
              className="object-cover"
            />
          ) : (
            <div className="bg-primary/20 flex items-center justify-center h-full w-full">
              <Car className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="h-full grow flex flex-col gap-1.5">
          <div className="w-full flex items-center justify-start gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-sm leading-none font-bold tracking-tight">{property.nome}</h1>
            </div>
            <div className="bg-primary/20 flex w-fit items-center gap-2 rounded-lg px-2 py-1">
              <Code size={15} />
              <h1 className="w-fit text-start text-[0.6rem] font-medium tracking-tight">
                {property.identificador}
              </h1>
            </div>
          </div>
          <div className="w-full flex items-center gap-2">
            <h2 className="text-xs font-light tracking-tight">QUILOMETRAGEM ATUAL</h2>
            <h2 className="text-sm font-bold tracking-tight">
              {formatDecimalPlaces(property.metadados.kmAcumulado)}km
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
