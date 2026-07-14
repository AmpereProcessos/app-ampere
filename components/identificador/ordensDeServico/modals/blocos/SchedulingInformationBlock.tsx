import DateTimeInput from "@/components/inputs/DateTimeInput";
import { formatDateTimeForInput } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TServiceOrder } from "@/utils/schemas/service-order";
import React from "react";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { LayoutGrid } from "lucide-react";

type ServiceOrderSchedulingProps = {
  infoHolder: TServiceOrder;
  updateInfoHolder: (data: Partial<TServiceOrder>) => void;
};
function ServiceOrderScheduling({ infoHolder, updateInfoHolder }: ServiceOrderSchedulingProps) {
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="AGENDAMENTO"
      sectionTitleIcon={<LayoutGrid size={15} />}
    >
      <p className="my-1 w-full text-center text-sm font-light tracking-tighter text-foreground">
        Defina aqui, se desejar, uma data e horário para agendar o início e a conclusão da ordem de
        serviço.
      </p>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <DateTimeInput
              label="DATA-HORÁRIO DE INÍCIO"
              value={formatDateTimeForInput(infoHolder.agendamento?.inicio)}
              handleChange={(value) =>
                updateInfoHolder({
                  agendamento: {
                    ...(infoHolder.agendamento || {}),
                    inicio: formatDateInputChange(value, "date", false) as Date,
                  },
                })
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <DateTimeInput
              label="DATA-HORÁRIO DE CONCLUSÃO"
              value={formatDateTimeForInput(infoHolder.agendamento?.fim)}
              handleChange={(value) =>
                updateInfoHolder({
                  agendamento: {
                    ...(infoHolder.agendamento || {}),
                    fim: formatDateInputChange(value, "date", false) as Date,
                  },
                })
              }
              width="100%"
            />
          </div>
        </div>
      </div>
    </ResponsiveDialogDrawerSection>
  );
}

export default ServiceOrderScheduling;
