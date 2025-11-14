import DateInput from "@/components/inputs/Date";
import TextInput from "@/components/inputs/Text";
import { formatDate, GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TProjectDTO } from "@/utils/schemas/projects";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BsCalendarCheck, BsCheck2All } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { TbAlertOctagon } from "react-icons/tb";

type MaintenanceCardProps = {
	maintenance: TProjectDTO["manutencoes"][number];
	handleRemove: () => void;
	handleUpdate: (info: TProjectDTO["manutencoes"][number]) => void;
};
function MaintenanceCard({ maintenance, handleRemove, handleUpdate }: MaintenanceCardProps) {
	const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
	const [itemHolder, setItemHolder] = useState<TProjectDTO["manutencoes"][number]>(maintenance);

	return (
		<AnimatePresence>
			<div className="border-primary/60 flex w-full flex-col gap-2 rounded border p-2 lg:w-[400px]">
				<div className="flex w-full items-center justify-between">
					<h1 className="text-xs leading-none font-black tracking-tight lg:text-sm">{maintenance.titulo}</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={() => handleUpdate({ ...maintenance, dataEfetivacao: new Date().toISOString() })}
							className="flex items-center justify-center rounded border border-green-500 bg-green-50 p-1 text-green-500 duration-300 ease-in-out hover:border-green-700 hover:text-green-700"
						>
							<BsCheck2All size={10} />
						</button>
						<button
							onClick={() => setEditMenuIsOpen((prev) => !prev)}
							className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
						>
							<MdEdit size={10} />
						</button>
						<button
							onClick={() => handleRemove()}
							className="flex items-center justify-center rounded border border-red-500 bg-red-50 p-1 text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
						>
							<MdDelete size={10} />
						</button>
					</div>
				</div>
				<div className="flex items-center justify-center gap-1">
					{maintenance.dataEfetivacao ? (
						<>
							<BsCalendarCheck color="rgb(22,163,74)" />{" "}
							<p className="text-xs font-medium tracking-tight">{formatDateAsLocale(maintenance.dataEfetivacao)}</p>
						</>
					) : (
						<>
							<TbAlertOctagon color="rgb(234,88,12)" />
							<p className="text-xs font-medium tracking-tight">PENDENTE</p>
						</>
					)}
				</div>
				{editMenuIsOpen ? (
					<motion.div
						variants={GeneralVisibleHiddenExitMotionVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="flex w-full flex-col gap-1 p-3"
					>
						<TextInput
							label="TÍTULO DA MANUTENÇÃO"
							placeholder="Preencha aqui um título para a manutenção..."
							value={itemHolder.titulo}
							handleChange={(value) => setItemHolder((prev) => ({ ...prev, titulo: value }))}
							width="100%"
						/>

						<DateInput
							label="DATA"
							value={itemHolder.dataEfetivacao ? formatDate(itemHolder.dataEfetivacao) : undefined}
							handleChange={(value) => {
								setItemHolder((prev) => ({ ...prev, dataEfetivacao: formatDateInputChange(value) }));
							}}
							width="100%"
						/>

						<button
							onClick={() => {
								handleUpdate(itemHolder);
								setEditMenuIsOpen(false);
							}}
							className="disabled:bg-primary/60 self-center rounded bg-blue-800 px-4 py-1 text-xs font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-blue-700 enabled:hover:text-white disabled:text-white"
						>
							ATUALIZAR
						</button>
					</motion.div>
				) : null}
			</div>
		</AnimatePresence>
	);
}

export default MaintenanceCard;
