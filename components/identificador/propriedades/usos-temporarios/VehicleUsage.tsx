import { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import VehicleUsageStart from "./VehicleUsageStart";
import VehicleUsageFinish from "./VehicleUsageFinish";

type VehicleUsageProps = {
  usageId: string | undefined;
  property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
};
export default function VehicleUsage({ usageId, property }: VehicleUsageProps) {
  if (!usageId) return <VehicleUsageStart property={property} />;
  return <VehicleUsageFinish usageId={usageId} property={property} />;
}
