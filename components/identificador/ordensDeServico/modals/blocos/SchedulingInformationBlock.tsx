"use client";

import CheckboxInput from "@/components/inputs/Checkbox";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import useCalendars from "@/utils/methods/query/calendars";
import { formatDateAsLocale, formatDateTimeForInput } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import GoogleLogo from "@/utils/svgs/google-logo.svg";
import { TServiceOrder } from "@/utils/schemas/service-order";
import { CheckCheck, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ServiceOrderSchedulingProps = {
  infoHolder: TServiceOrder;
  updateInfoHolder: (data: Partial<TServiceOrder>) => void;
};

function hasAgendamentoData(agendamento: TServiceOrder["agendamento"] | null | undefined) {
  return Boolean(agendamento?.inicio || agendamento?.fim);
}

function hasSchedulingUsage(infoHolder: TServiceOrder) {
  return (
    hasAgendamentoData(infoHolder.agendamento) ||
    Boolean(infoHolder.calendarioId) ||
    Boolean(infoHolder.googleCalendarEventId)
  );
}

function ServiceOrderScheduling({ infoHolder, updateInfoHolder }: ServiceOrderSchedulingProps) {
  const { data: calendars } = useCalendars();
  const scheduleLocked = Boolean(infoHolder.googleCalendarEventId);
  const [schedulingEnabled, setSchedulingEnabled] = useState(() => hasSchedulingUsage(infoHolder));

  useEffect(() => {
    if (hasSchedulingUsage(infoHolder)) {
      setSchedulingEnabled(true);
    }
  }, [
    infoHolder.agendamento?.inicio,
    infoHolder.agendamento?.fim,
    infoHolder.calendarioId,
    infoHolder.googleCalendarEventId,
  ]);

  function handleCalendarSelect(value: string | undefined) {
    if (!value) return updateInfoHolder({ calendarioId: null, googleCalendarId: null });
    const calendar = calendars?.find((item) => item._id === value);
    updateInfoHolder({ calendarioId: value, googleCalendarId: calendar?.googleCalendarId });
  }

  function handleSchedulingToggle(enabled: boolean) {
    if (scheduleLocked) return;
    setSchedulingEnabled(enabled);
    if (!enabled) {
      updateInfoHolder({
        agendamento: {
          ...(infoHolder.agendamento || {}),
          inicio: null,
          fim: null,
        },
        calendarioId: null,
        googleCalendarId: null,
      });
    }
  }

  const scheduleSummary = getScheduleSummary(infoHolder.agendamento);

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="AGENDAMENTO"
      sectionTitleIcon={<LayoutGrid size={15} />}
    >
      <div className="flex w-full flex-col gap-2">
        <CheckboxInput
          checked={schedulingEnabled}
          labelFalse="DEFINIR DATA E HORÁRIO DE AGENDAMENTO"
          labelTrue="AGENDAMENTO DEFINIDO"
          handleChange={handleSchedulingToggle}
          editable={!scheduleLocked}
          justify="justify-start"
          padding="0"
        />
        {!schedulingEnabled ? (
          <p className="text-muted-foreground w-full text-center text-xs font-light tracking-tight">
            Ative a opção acima para informar datas previstas e, se desejar, vincular ao Google Calendar.
          </p>
        ) : null}
        {schedulingEnabled ? (
          <>
            <p className="my-1 w-full text-center text-sm font-light tracking-tighter text-foreground">
              Defina o período previsto da ordem de serviço e o calendário do Google, quando aplicável.
            </p>

            <div className="border-border flex w-full flex-col gap-2 rounded-md border border-dashed p-3">
              <div className="flex w-fit items-center gap-2">
                <Image src={GoogleLogo} alt="Google Logo" width={15} height={15} />
                <p className="text-[0.65rem] font-bold uppercase tracking-tight text-foreground">
                  Google Calendar
                </p>
              </div>
              <p className="text-muted-foreground w-full text-center text-xs font-light tracking-tight">
                Calendário usado para criar o evento deste agendamento.
              </p>
              <SelectInput
                label="CALENDÁRIO"
                value={infoHolder.calendarioId}
                options={
                  calendars?.map((calendar) => ({
                    id: calendar._id,
                    value: calendar._id,
                    label: calendar.nome,
                  })) || []
                }
                handleChange={(value) => handleCalendarSelect(value)}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => updateInfoHolder({ calendarioId: null, googleCalendarId: null })}
                editable={!scheduleLocked}
                width="100%"
              />
              {infoHolder.googleCalendarEventId ? (
                <div className="flex w-fit items-center gap-4 self-center rounded border border-green-500 bg-green-200 px-2 py-1">
                  <p className="text-[0.6rem] font-medium leading-none tracking-tight">
                    EVENTO DEFINIDO COM SUCESSO
                  </p>
                  <CheckCheck size={15} color="#22c55e" />
                </div>
              ) : null}
            </div>

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
                    editable={!scheduleLocked}
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
                    editable={!scheduleLocked}
                  />
                </div>
              </div>
            </div>
            {scheduleSummary ? (
              <p className="text-muted-foreground w-full text-center text-[0.65rem] font-medium tracking-tight">
                {scheduleSummary}
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </ResponsiveDialogDrawerSection>
  );
}

function getScheduleSummary(agendamento: TServiceOrder["agendamento"] | null | undefined) {
  if (!agendamento?.inicio && !agendamento?.fim) return null;
  const inicio = agendamento.inicio ? formatDateAsLocale(agendamento.inicio, true) : "—";
  const fim = agendamento.fim ? formatDateAsLocale(agendamento.fim, true) : "—";
  return `${inicio} → ${fim}`;
}

export default ServiceOrderScheduling;
