import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { getServiceObservationsFromObras } from "@/utils/methods/util/service-order";
import { TProject } from "@/utils/schemas/projects";
import { TServiceOrder } from "@/utils/schemas/service-order";
import { BsCalendar } from "react-icons/bs";
import { ClipboardList, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";
import ServiceOrderExecutionObservations from "./utils/Observations";
import { ServiceOrderExecutionPeriodRegistry } from "./utils/History";

type ServiceOrderExecutionInformationBlockProps = {
  infoHolder: TServiceOrder;
  updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
  projectObservations?: TProject["obra"]["observacoes"];
};

function ServiceOrderExecutionInformationBlock({
  infoHolder,
  updateInfoHolder,
  projectObservations,
}: ServiceOrderExecutionInformationBlockProps) {
  function useObservationsFromProject() {
    if (!projectObservations) return;
    const observationsGrouped = getServiceObservationsFromObras(projectObservations);
    updateInfoHolder({ observacoes: observationsGrouped });
    toast.success("Observações da obra foram adicionadas à OS.");
  }

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES DE EXECUÇÃO"
      sectionTitleIcon={<LayoutGrid size={15} />}
    >
      <p className="text-muted-foreground my-1 w-full text-center text-xs font-light tracking-tight">
        Registre períodos de trabalho (pausas em linhas separadas), ajuste início/fim gerais no rodapé da
        planilha e inclua instruções para a equipe.
      </p>

      <div className="flex w-full flex-col gap-3">
        <ExecutionSubsection title="Registro de períodos" icon={<BsCalendar size={14} />} />
        <ServiceOrderExecutionPeriodRegistry infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />

        <ExecutionSubsection title="Instruções para execução" icon={<ClipboardList className="h-3.5 w-3.5" />} />
        <ServiceOrderExecutionObservations
          infoHolder={infoHolder}
          updateInfoHolder={updateInfoHolder}
          useObservationsFromProject={projectObservations ? useObservationsFromProject : undefined}
        />
      </div>
    </ResponsiveDialogDrawerSection>
  );
}

function ExecutionSubsection({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="flex w-fit items-center gap-2 rounded bg-primary/20 px-2 py-1">
      {icon}
      <h3 className="text-xs font-medium tracking-tight">{title.toUpperCase()}</h3>
    </div>
  );
}

export default ServiceOrderExecutionInformationBlock;
