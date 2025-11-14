import React from "react";
import GoogleLogo from "@/utils/svgs/google-logo.svg";
import Image from "next/image";
import { CheckCheck } from "lucide-react";
import useCalendars from "@/utils/methods/query/calendars";
import { TServiceOrder } from "@/utils/schemas/service-order";
import SelectInput from "@/components/inputs/Select";
type ServiceOrderCalendarIntegrationProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (data: Partial<TServiceOrder>) => void;
};
function ServiceOrderCalendarIntegration({ infoHolder, updateInfoHolder }: ServiceOrderCalendarIntegrationProps) {
	const { data: calendars } = useCalendars();

	function handleCalendarSelect(value: string | undefined) {
		if (!value) return updateInfoHolder({ calendarioId: null, googleCalendarId: null });
		const calendar = calendars?.find((calendar) => calendar._id === value);
		updateInfoHolder({ calendarioId: value, googleCalendarId: calendar?.googleCalendarId });
	}
	return (
		<div className="flex w-full grow flex-col gap-4">
			<div className="flex w-full items-center justify-center gap-2 rounded bg-primary p-1">
				<Image src={GoogleLogo} alt="Google Logo" width={15} height={15} />
				<h1 className="text-center font-bold text-primary-foreground">INTEGRAÇÃO COM GOOGLE CALENDAR</h1>
			</div>
			<p className="my-1 w-full text-center text-sm font-light tracking-tighter text-primary/80">
				Defina aqui o calendário que será utilizado para agendar o serviço no Google Calendar.
			</p>
			<div className="flex w-full grow flex-col gap-2">
				<SelectInput
					label="CALENDÁRIO"
					value={infoHolder.calendarioId}
					options={calendars?.map((calendar) => ({ id: calendar._id, value: calendar._id, label: calendar.nome })) || []}
					handleChange={(value) => handleCalendarSelect(value)}
					selectedItemLabel="NÃO DEFINIDO"
					onReset={() => updateInfoHolder({ calendarioId: null, googleCalendarId: null })}
					editable={!infoHolder.googleCalendarEventId}
					width="100%"
				/>

				{infoHolder.googleCalendarEventId ? (
					<div className="flex w-fit items-center gap-4 self-center rounded border border-green-500 bg-green-200 px-2 py-1">
						<div className="flex items-center gap-1">
							<p className="text-[0.6rem] font-medium leading-none tracking-tight">EVENTO DEFINIDO COM SUCESSO</p>
						</div>
						<CheckCheck size={15} color="#22c55e" />
					</div>
				) : null}
			</div>
		</div>
	);
}

export default ServiceOrderCalendarIntegration;
