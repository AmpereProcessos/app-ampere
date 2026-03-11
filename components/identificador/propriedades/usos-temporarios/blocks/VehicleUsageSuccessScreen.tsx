import { CheckCircle2 } from "lucide-react";

type VehicleUsageSuccessScreenProps = {
  title: string;
  message: string;
};

export default function VehicleUsageSuccessScreen({
  title,
  message,
}: VehicleUsageSuccessScreenProps) {
  return (
    <div className="bg-background flex flex-col h-full justify-center gap-4 container mx-auto py-12 px-6">
      <div className="bg-background border-primary/20 flex w-full flex-col items-center gap-4 rounded-lg border p-6 shadow-xs dark:bg-[#121212]">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <h1 className="text-center text-base leading-none font-bold tracking-tight lg:text-lg">
          {title}
        </h1>
        <p className="text-center text-sm font-light tracking-tight text-primary/80">{message}</p>
        <p className="text-center text-xs font-medium tracking-tight text-primary/70">
          Atualizando automaticamente em 5 segundos...
        </p>
      </div>
    </div>
  );
}
