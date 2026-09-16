import type { TProjectDTO } from "@/utils/schemas/projects";
import { ClipboardList } from "lucide-react";
import type React from "react";
import WorkObservationsSpreadsheet, { getObservationsAsList, joinObservations } from "./WorkObservationsSpreadsheet";

type ObservationsBlockProps = {
	infoHolder: TProjectDTO;
	setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	editable?: boolean;
};

function ObservationsBlock({ infoHolder, setInfo, setChanges, editable = true }: ObservationsBlockProps) {
	const observations = getObservationsAsList(infoHolder.obra?.observacoes || "");

	function applyObservations(updater: (current: string[]) => string[]) {
		setInfo((prev) => {
			const current = getObservationsAsList(prev.obra?.observacoes || "");
			const observacoes = joinObservations(updater(current));
			setChanges((changesPrev) => ({ ...changesPrev, "obra.observacoes": observacoes }));
			return { ...prev, obra: { ...prev.obra, observacoes } };
		});
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-2 self-stretch px-2">
			<div className="flex items-center gap-2 rounded bg-primary/20 px-2 py-1 w-fit">
				<ClipboardList className="h-4 w-4 min-h-4 min-w-4" />
				<h2 className="text-xs font-medium tracking-tight">OBSERVAÇÕES DE OBRA</h2>
			</div>
			<WorkObservationsSpreadsheet
				observations={observations}
				editable={editable}
				onAdd={(observation) => applyObservations((current) => [...current, observation])}
				onUpdate={(index, observation) =>
					applyObservations((current) => current.map((item, i) => (i === index ? observation : item)))
				}
				onRemove={(index) => applyObservations((current) => current.filter((_, i) => i !== index))}
			/>
		</div>
	);
}

export default ObservationsBlock;
