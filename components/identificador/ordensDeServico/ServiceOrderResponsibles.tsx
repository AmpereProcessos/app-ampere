import { UserRound } from "lucide-react";

import Avatar from "@/components/utils/Avatar";
import { cn } from "@/lib/utils";
import { formatNameAsInitials } from "@/utils/methods/formatting";
import type { TServiceOrder } from "@/utils/schemas/service-order";

type ServiceOrderResponsiblesProps = {
  responsibles: TServiceOrder["responsaveis"] | null | undefined;
  maxVisible?: number;
  className?: string;
};

function ServiceOrderResponsibles({
  responsibles,
  maxVisible = 2,
  className,
}: ServiceOrderResponsiblesProps) {
  const list = responsibles ?? [];

  if (list.length === 0)
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <UserRound size={12} />
        <h1 className="text-foreground text-[0.6rem] font-medium">SEM RESPONSÁVEIS</h1>
      </div>
    );

  const visible = list.slice(0, maxVisible);
  const hidden = list.slice(maxVisible);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {visible.map((responsible) => (
        <div key={responsible.id} className="flex items-center gap-1">
          <Avatar
            url={responsible.avatar_url || undefined}
            fallback={formatNameAsInitials(responsible.nome)}
            height={16}
            width={16}
          />
          <h1 className="text-foreground text-[0.6rem] font-medium">{responsible.nome}</h1>
        </div>
      ))}
      {hidden.length > 0 ? (
        <h1
          title={hidden.map((responsible) => responsible.nome).join(", ")}
          className="text-foreground bg-secondary rounded-full px-1.5 py-0.5 text-[0.6rem] font-medium"
        >
          +{hidden.length}
        </h1>
      ) : null}
    </div>
  );
}

export default ServiceOrderResponsibles;
