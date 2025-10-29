import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { Route } from "lucide-react";
import Link from "next/link";
import React, { type SetStateAction, type Dispatch } from "react";
import CheckboxInput from "../inputs/Checkbox";

type InfoJornadaBlockProps = {
	editor: boolean;
	infoHolder: TProjectDTO;
	setInfo: Dispatch<SetStateAction<TProjectDTO>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
	updateLogs: TProjectUpdateLogDTO[];
};
function InfoJornadaBlock({ editor, infoHolder, setInfo, changes, setChanges, updateLogs = [] }: InfoJornadaBlockProps) {
	return (
		<div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
				<Route className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">JORNADA DO CLIENTE</h1>
			</div>
			<div className="flex w-full px-2">
				<div className="flex w-full flex-col items-center justify-around gap-3 rounded border border-cyan-500 p-2">
					<div className="flex w-full items-center justify-between gap-2">
						<h1 className="text-start text-xs font-bold leading-none tracking-tight text-cyan-500">JORNADA DO CLIENTE</h1>
						<div className="flex items-center gap-1 rounded-full border border-blue-500 px-2 py-1 text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white">
							<Link href={`/publico/jornada-do-cliente/${infoHolder._id}`}>
								<div className="text-[0.65rem] font-bold">LINK DA JORNADA</div>
							</Link>
						</div>
					</div>
					<div className="flex w-full flex-wrap justify-around gap-3">
						{infoHolder.jornada.estagios.map((stage, index) => (
							<div key={stage.ordem} className="w-fit">
								<CheckboxInput
									editable={editor}
									labelFalse={stage.titulo}
									labelTrue={stage.titulo}
									checked={!!stage.concluido}
									handleChange={(value) => {
										const updatedStages = infoHolder.jornada.estagios.map((s, i) =>
											i === index ? { ...s, concluido: value, dataConclusao: value ? new Date().toISOString() : null } : s,
										);
										setInfo((prev) => ({
											...prev,
											jornada: { ...prev.jornada, estagios: updatedStages },
										}));
										setChanges((prev) => ({ ...prev, "jornada.estagios": updatedStages }));
									}}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default InfoJornadaBlock;
