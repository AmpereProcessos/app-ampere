import ExecutionHistorySpreadsheet from "./ExecutionHistorySpreadsheet";
import { TServiceOrder } from "@/utils/schemas/service-order";

type ServiceOrderExecutionPeriodRegistryProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
	editable?: boolean;
};

export function ServiceOrderExecutionPeriodRegistry({
	infoHolder,
	updateInfoHolder,
	editable = true,
}: ServiceOrderExecutionPeriodRegistryProps) {
	const historico = infoHolder.periodo?.historico ?? [];

	function handlePeriodoCommit(changes: Partial<TServiceOrder["periodo"]>) {
		updateInfoHolder({
			periodo: {
				...infoHolder.periodo,
				...changes,
			},
		});
	}

	return (
		<ExecutionHistorySpreadsheet
			historico={historico}
			periodoInicio={infoHolder.periodo?.inicio}
			periodoFim={infoHolder.periodo?.fim}
			editable={editable}
			onPeriodoCommit={handlePeriodoCommit}
		/>
	);
}
