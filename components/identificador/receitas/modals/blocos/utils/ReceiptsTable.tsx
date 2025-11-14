import DateInput from "@/components/inputs/Date";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { formatDate, formatDecimalPlaces, formatToMoney, GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { updateRevenueReceipt } from "@/utils/methods/mutation/revenues";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TRevenue } from "@/utils/schemas/revenues";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BsCalendar, BsCalendarCheck, BsPatchCheck } from "react-icons/bs";
import { FaPercentage } from "react-icons/fa";
import { MdAttachMoney, MdDelete, MdEdit } from "react-icons/md";

type RevenueReceiptsTableProps = {
	revenueId?: string;
	revenueTotal: number;
	receipts: TRevenue["fracionamento"];
	updateReceipt: (info: { index: number; item: Partial<TRevenue["fracionamento"][number]> }) => void;
	removeReceipt: (index: number) => void;
};
function RevenueReceiptsTable({ revenueId, revenueTotal, receipts, updateReceipt, removeReceipt }: RevenueReceiptsTableProps) {
	const receiptsTotal = receipts.reduce((acc, current) => acc + (current.valor || 0), 0);

	return (
		<div className="border-primary/80 flex w-full flex-col rounded border-0 lg:border">
			<div className="bg-primary/80 hidden w-full items-center gap-2 rounded rounded-br-none rounded-bl-none p-1 lg:flex">
				<h1 className="w-[40%] text-center text-sm font-bold text-white">TÍTULO</h1>
				<h1 className="w-[20%] text-center text-sm font-bold text-white">VALOR</h1>
				<h1 className="w-[20%] text-center text-sm font-bold text-white">PREV. DE RECEBIMENTO</h1>
				<h1 className="w-[20%] text-center text-sm font-bold text-white">DATA DE RECEBIMENTO</h1>
			</div>
			<div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
				{receipts.length > 0 ? (
					receipts.map((item, index) => (
						<ReceiptTableItem
							key={`${item.titulo}-${index}`}
							item={item}
							itemIndex={index}
							revenueId={revenueId}
							revenueTotal={revenueTotal}
							handleRemove={() => removeReceipt(index)}
							handleUpdate={(info) => updateReceipt({ index, item: info })}
						/>
					))
				) : (
					<p className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Não há registros de recebimentos da receita.</p>
				)}
				{receiptsTotal > revenueTotal ? (
					<p className="w-full rounded border border-orange-400 bg-orange-50 p-1 text-center text-xs tracking-tight text-orange-400 italic">
						Por favor, ajuste os valores dos recebimentos. A somatória dos recebimentos atuais excede o valor total estabelecido para a receita.
					</p>
				) : null}
			</div>
		</div>
	);
}

export default RevenueReceiptsTable;

type ReceiptTableItemProps = {
	revenueId?: string;
	item: TRevenue["fracionamento"][number];
	itemIndex: number;
	revenueTotal: number;
	handleUpdate: (item: TRevenue["fracionamento"][number]) => void;
	handleRemove: () => void;
};
function ReceiptTableItem({ revenueId, item, itemIndex, revenueTotal, handleUpdate, handleRemove }: ReceiptTableItemProps) {
	const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
	const [itemHolder, setItemHolder] = useState<TRevenue["fracionamento"][number]>(item);

	return (
		<>
			<AnimatePresence>
				<div className="bg-background hidden w-full flex-col gap-1 lg:flex dark:bg-[#121212]">
					<div className="flex w-full items-center gap-2 p-1">
						<div className="flex w-[40%] items-start gap-1">
							<div className="flex flex-col">
								<h1 className="text-xs tracking-tight">{item.titulo}</h1>
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1">
										<FaPercentage size={10} />
										<p className="text-primary/80 text-[0.65rem] leading-none font-light tracking-tight italic">
											{formatDecimalPlaces(((item.valor || 0) / revenueTotal) * 100)}%
										</p>
									</div>
								</div>
								{/* <p className="text-[0.65rem] font-light italic leading-none tracking-tight text-primary/60">{item.categoria}</p> */}
							</div>
							<button
								type="button"
								onClick={() => setEditMenuIsOpen((prev) => !prev)}
								className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
							>
								<MdEdit size={10} />
							</button>
							<button
								type="button"
								onClick={() => handleRemove()}
								className="flex items-center justify-center rounded border border-red-500 bg-red-50 p-1 text-red-500 duration-300 ease-in-out hover:border-red-700 hover:text-red-700"
							>
								<MdDelete size={10} />
							</button>
						</div>
						<h1 className="w-[20%] text-center text-xs tracking-tight">{formatToMoney(item.valor || 0)}</h1>
						<h1 className="w-[20%] text-center text-xs tracking-tight">{formatDateAsLocale(item.dataPrevisaoRecebimento || undefined) || "-"}</h1>
						<h1 className="w-[20%] text-center text-xs tracking-tight">{formatDateAsLocale(item.dataRecebimento || undefined) || "-"}</h1>
					</div>
				</div>
				<div className="border-primary bg-background flex w-full flex-col rounded-md border p-2 lg:hidden dark:bg-[#121212]">
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex items-center gap-1">
							<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black p-1 text-[20px]">
								<MdAttachMoney size={15} />
							</div>
							{item.titulo ? (
								<p className="text-sm leading-none font-bold tracking-tight">{item.titulo}</p>
							) : (
								<p className="text-sm leading-none font-bold tracking-tight">
									RECEBIMENTO DE <strong className="text-[#FF9B50]">{formatDecimalPlaces(((item.valor || 0) / revenueTotal) * 100)}%</strong>
								</p>
							)}
						</div>
						{!!item.valor && item.valor > 0 ? (
							<div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
								<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(item.valor)}</h1>
							</div>
						) : null}
					</div>
					<div className="flex w-full items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<button
								onClick={() => setEditMenuIsOpen((prev) => !prev)}
								type="button"
								className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-orange-200"
							>
								<MdEdit style={{ color: "orange" }} size={15} />
							</button>
							<button
								onClick={() => handleRemove()}
								type="button"
								className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
							>
								<MdDelete style={{ color: "red" }} size={15} />
							</button>
						</div>
						<div className="flex items-center gap-2">
							{item.dataRecebimento ? (
								<div className="flex items-center gap-1">
									<BsPatchCheck color="rgb(34,197,94)" />
									<p className="text-primary/80 text-[0.6rem] lg:text-xs">RECEBIDO</p>
								</div>
							) : null}
							<div className="flex items-center gap-1">
								<BsCalendar />
								<p className="text-primary/80 text-[0.6rem] lg:text-xs">{formatDateAsLocale(item.dataPrevisaoRecebimento || undefined)}</p>
							</div>
							{item.dataRecebimento ? (
								<div className="flex items-center gap-1">
									<BsCalendarCheck color="#22c55e " />
									<p className="text-primary/80 text-[0.6rem] lg:text-xs">{formatDateAsLocale(item.dataRecebimento || undefined)}</p>
								</div>
							) : null}
						</div>
					</div>
				</div>
				{editMenuIsOpen ? (
					<motion.div
						variants={GeneralVisibleHiddenExitMotionVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="flex w-full flex-col gap-1 p-3"
					>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-[30%]">
								<TextInput
									label="TÍTULO"
									labelClassName="text-xs tracking-tight"
									value={itemHolder.titulo}
									placeholder="Preencha aqui um titulo para o recebimento..."
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, titulo: value }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<NumberInput
									label="VALOR"
									labelClassName="text-xs tracking-tight"
									placeholder="Preencha aqui o valor do fracionamento..."
									value={itemHolder.valor || null}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, valor: value, porcentagem: (value / revenueTotal) * 100 }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[10%]">
								<NumberInput
									label="PORCENTAGEM"
									labelClassName="text-xs tracking-tight"
									placeholder="Preencha aqui a porcentagem do fracionamento..."
									value={itemHolder.porcentagem}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, porcentagem: value, valor: (value * revenueTotal) / 100 }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<DateInput
									label="PREV. DE RECEBIMENTO"
									labelClassName="text-xs tracking-tight"
									value={itemHolder.dataPrevisaoRecebimento ? formatDate(itemHolder.dataPrevisaoRecebimento) : undefined}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, dataPrevisaoRecebimento: formatDateInputChange(value, "string") as string }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<DateInput
									label="DATA DE RECEBIMENTO"
									labelClassName="text-xs tracking-tight"
									value={itemHolder.dataRecebimento ? formatDate(itemHolder.dataRecebimento) : undefined}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, dataRecebimento: formatDateInputChange(value, "string") as string }))}
									width="100%"
								/>
							</div>
						</div>
						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => {
									setEditMenuIsOpen(false);
								}}
								className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
							>
								FECHAR
							</button>
							<button
								type="button"
								onClick={() => handleUpdate(itemHolder)}
								className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
							>
								ATUALIZAR ITEM
							</button>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}
