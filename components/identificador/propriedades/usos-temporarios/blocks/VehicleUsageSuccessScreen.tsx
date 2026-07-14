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
    <div className="bg-background flex min-h-dvh w-full max-w-lg flex-col justify-center gap-4 mx-auto px-4 py-6 sm:py-10">
      <div className="bg-card border-border flex w-full flex-col items-center gap-4 rounded-lg border p-6 shadow-xs">
        <div className="bg-primary/10 grid h-16 w-16 place-items-center rounded-full">
          <CheckCircle2 className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-center text-base leading-none font-bold tracking-tight lg:text-lg">
          {title}
        </h1>
        <p className="text-muted-foreground text-center text-sm font-light tracking-tight">
          {message}
        </p>
        <p className="text-muted-foreground/80 text-center text-xs font-medium tracking-tight">
          Atualizando automaticamente em 5 segundos...
        </p>
      </div>
    </div>
  );
}
