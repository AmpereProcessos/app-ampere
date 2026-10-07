"use client";

import WorkObservationsSpreadsheet from "@/components/identificador/obras/WorkObservationsSpreadsheet";
import { cn } from "@/lib/utils";
import { TServiceOrder } from "@/utils/schemas/service-order";
import { MdContentCopy } from "react-icons/md";

type ServiceOrderExecutionObservationsProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (info: Partial<TServiceOrder>) => void;
	useObservationsFromProject?: () => void;
	editable?: boolean;
};

function ServiceOrderExecutionObservations({
	infoHolder,
	updateInfoHolder,
	useObservationsFromProject,
	editable = true,
}: ServiceOrderExecutionObservationsProps) {
	const observations = infoHolder.observacoes ?? [];

	function applyObservations(updater: (current: TServiceOrder["observacoes"]) => TServiceOrder["observacoes"]) {
		updateInfoHolder({ observacoes: updater(observations) });
	}

	const observationTexts = observations.map((item) => item.descricao);

	return (
		<div className="flex w-full min-w-0 flex-col gap-2">
			{useObservationsFromProject ? (
				<div className="flex w-full justify-end">
					<button
						type="button"
						onClick={() => useObservationsFromProject()}
						className={cn(
							"flex items-center gap-1 rounded-lg bg-cyan-300 px-2 py-1 text-black duration-300 ease-in-out hover:bg-cyan-400",
						)}
					>
						<MdContentCopy size={12} />
						<span className="text-[0.65rem] font-medium tracking-tight">UTILIZAR OBSERVAÇÕES DO PROJETO</span>
					</button>
				</div>
			) : null}
			<WorkObservationsSpreadsheet
				observations={observationTexts}
				editable={editable}
				onAdd={(descricao) =>
					applyObservations((current) => [...current, { topico: "GERAL", descricao }])
				}
				onUpdate={(index, descricao) =>
					applyObservations((current) =>
						current.map((item, i) => (i === index ? { ...item, descricao } : item)),
					)
				}
				onRemove={(index) => applyObservations((current) => current.filter((_, i) => i !== index))}
			/>
		</div>
	);
}

export default ServiceOrderExecutionObservations;
