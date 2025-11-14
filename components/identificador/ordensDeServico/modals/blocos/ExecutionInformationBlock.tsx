import DateTimeInput from "@/components/inputs/DateTimeInput";
import { formatDateTimeForInput } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TServiceOrder } from "@/utils/schemas/service-order";
import React from "react";
import ServiceOrderObservationsBlock from "./utils/Observations";
import { TProject } from "@/utils/schemas/projects";
import { getServiceObservationsFromObras } from "@/utils/methods/util/service-order";
import { toast } from "react-hot-toast";
import ServiceOrderHistoryBlock from "./utils/History";

type ServiceOrderExecutionInformationBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
	projectObservations?: TProject["obra"]["observacoes"];
};
function ServiceOrderExecutionInformationBlock({ infoHolder, updateInfoHolder, projectObservations }: ServiceOrderExecutionInformationBlockProps) {
	function useObservationsFromProject() {
		if (!projectObservations) return;
		const observationsGrouped = getServiceObservationsFromObras(projectObservations);
		updateInfoHolder({ observacoes: observationsGrouped });
		toast.success("Observações da obra foram adicionadas à OS.");
	}
	return (
		<div className="flex w-full flex-col items-center gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES DE EXECUÇÃO</h1>
			<p className="my-1 w-full text-center text-sm font-light tracking-tighter text-primary/80">
				Defina aqui, uma vez iniciada (ou concluída), o período de execução do serviço.
			</p>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<DateTimeInput
							label="DATA-HORÁRIO DE INÍCIO"
							value={formatDateTimeForInput(infoHolder.periodo?.inicio)}
							handleChange={(value) =>
								updateInfoHolder({ periodo: { ...infoHolder.periodo, inicio: formatDateInputChange(value, "string", false) as string } })
							}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<DateTimeInput
							label="DATA-HORÁRIO DE CONCLUSÃO"
							value={formatDateTimeForInput(infoHolder.periodo?.fim)}
							handleChange={(value) =>
								updateInfoHolder({ periodo: { ...infoHolder.periodo, fim: formatDateInputChange(value, "string", false) as string } })
							}
							width="100%"
						/>
					</div>
				</div>
				<ServiceOrderObservationsBlock
					infoHolder={infoHolder}
					updateInfoHolder={updateInfoHolder}
					useObservationsFromProject={projectObservations ? useObservationsFromProject : undefined}
				/>
			</div>
			<ServiceOrderHistoryBlock infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}

export default ServiceOrderExecutionInformationBlock;
