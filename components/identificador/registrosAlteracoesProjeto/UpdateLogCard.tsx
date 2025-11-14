import Avatar from "@/components/utils/Avatar";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getUpdateLogFormatted } from "@/utils/project-fields-labelling";
import { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import React from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

type UpdateLogCardProps = {
	log: TProjectUpdateLogDTO;
	relatedFields: string[];
};
function UpdateLogCard({ log, relatedFields }: UpdateLogCardProps) {
	return (
		<div className="border-primary/20 flex w-full flex-col gap-1 rounded border p-3">
			<div className="flex w-full items-center justify-between gap-2">
				<h1 className="text-sm leading-none font-black tracking-tight">ALTERAÇÕES</h1>
				<div className="flex items-center justify-end gap-4">
					<div className={`flex items-center gap-1`}>
						<BsCalendarPlus />
						<p className="text-[0.6rem] font-medium">{formatDateAsLocale(log.dataAlteracao, true)}</p>
					</div>
					<div className="flex items-center gap-1">
						<Avatar fallback={"R"} url={log.autor.avatar_url} height={20} width={20} />
						<p className="text-[0.6rem] font-medium">{log.autor.nome}</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-wrap items-center justify-start gap-2">
				{Object.entries(log.alteracoes).map(([field, value]) => {
					const updateLog = getUpdateLogFormatted({ field, value });
					if (!relatedFields.includes(field)) return null;
					if (!updateLog) return null;
					return (
						<div className="border-primary/60 flex w-fit items-center gap-1 rounded-lg border px-2 py-1">
							<div className="flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] items-center justify-center rounded-full border border-black p-1">
								<MdEdit size={10} />
							</div>
							<h1 className="text-primary/60 text-[0.6rem] tracking-tight">
								<strong className="text-orange-500">{updateLog.label}</strong> ALTERADO(A) PARA:{" "}
							</h1>
							<h1 className="text-[0.6rem] font-bold tracking-tight text-cyan-600">{updateLog.valueFormatted}</h1>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default UpdateLogCard;
