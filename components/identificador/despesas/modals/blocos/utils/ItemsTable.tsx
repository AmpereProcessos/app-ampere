import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { formatToMoney, GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { renderUnitLabel } from "@/utils/methods/rendering";
import { TExpense } from "@/utils/schemas/expenses";
import { units } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";

type ExpenseItemsTableProps = {
	expenseTotal: number;
	composition: TExpense["itens"];
	updateCompositionItem: (info: { index: number; item: Partial<TExpense["itens"][number]> }) => void;
	removeCompositionItem: (info: number) => void;
	updateExpenseTotal: (info: { newTotal: number; updateItemsProportionally: boolean }) => void;
};

function ExpenseItemsTable({ expenseTotal, composition, updateCompositionItem, removeCompositionItem, updateExpenseTotal }: ExpenseItemsTableProps) {
	return (
		<div className="border-primary/80 flex w-full flex-col rounded border-0 lg:border">
			<div className="bg-primary/80 hidden w-full items-center gap-2 rounded rounded-br-none rounded-bl-none p-1 lg:flex">
				<h1 className="text-secondary w-[30%] text-center text-sm font-bold">ITEM</h1>
				<h1 className="text-secondary w-[15%] text-center text-sm font-bold">UNIDADE</h1>
				<h1 className="text-secondary w-[15%] text-center text-sm font-bold">QTDE</h1>
				<h1 className="text-secondary w-[20%] text-center text-sm font-bold">VALOR</h1>
				<h1 className="text-secondary w-[20%] text-center text-sm font-bold">TOTAL</h1>
			</div>
			<div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
				{composition.length > 0 ? (
					composition.map((item, index) => (
						<CompositionTableItem
							key={index}
							item={{ ...item }}
							handleUpdate={(item) => updateCompositionItem({ item, index })}
							handleRemove={() => removeCompositionItem(index)}
						/>
					))
				) : (
					<p className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Não há itens de composição da receita.</p>
				)}
			</div>
			<ExpenseTotalMenu expenseTotal={expenseTotal} handleUpdate={(info) => updateExpenseTotal(info)} />
		</div>
	);
}

export default ExpenseItemsTable;

type CompositionTableItemProps = {
	item: TExpense["itens"][number];
	handleUpdate: (item: TExpense["itens"][number]) => void;
	handleRemove: () => void;
};
function CompositionTableItem({ item, handleUpdate, handleRemove }: CompositionTableItemProps) {
	const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
	const [itemHolder, setItemHolder] = useState<TExpense["itens"][number]>(item);
	return (
		<>
			<AnimatePresence>
				<div className="bg-background hidden w-full flex-col gap-1 lg:flex dark:bg-[#121212]">
					<div className="flex w-full items-center gap-2 p-1">
						<div className="flex w-[30%] items-start gap-1">
							<div className="flex flex-col">
								<h1 className="text-xs tracking-tight">{item.descricao}</h1>
								{/* <p className="text-[0.65rem] font-light italic leading-none tracking-tight text-primary/60">{item.categoria}</p> */}
							</div>
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
						<h1 className="w-[15%] text-center text-xs tracking-tight">{item.unidade}</h1>
						<h1 className="w-[15%] text-center text-xs tracking-tight">{item.qtde}</h1>
						<h1 className="w-[20%] text-center text-xs tracking-tight">{item.preco ? formatToMoney(item.preco) : "-"}</h1>
						<h1 className="w-[20%] text-center text-xs tracking-tight">{item.preco ? formatToMoney(item.qtde * item.preco) : "-"}</h1>
					</div>
				</div>
				<div className="border-primary bg-background flex w-full flex-col rounded-md border p-2 lg:hidden dark:bg-[#121212]">
					<div className="flex w-full flex-col items-start justify-between gap-2">
						<div className="flex w-full items-center justify-between gap-2">
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-1">
									<p className="text-sm leading-none font-bold tracking-tight">
										<strong className="text-[#FF9B50]">{item.qtde}</strong> x {item.descricao}
									</p>
								</div>
							</div>

							{item.preco > 0 ? (
								<div className="bg-primary/80 flex min-w-fit items-center gap-2 rounded-full px-2 py-1">
									<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(item.qtde * item.preco)}</h1>
								</div>
							) : null}
						</div>
						<div className="flex w-full items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1">
									<TbRulerMeasure />
									<p className="text-primary/60 text-[0.6rem] italic lg:text-xs">{renderUnitLabel(item.unidade)}</p>
								</div>
								{item.preco > 0 ? (
									<div className="flex items-center gap-1">
										<FaDollarSign />
										<p className="text-primary/60 text-[0.6rem] italic lg:text-xs">
											{formatToMoney(item.preco)}/{item.unidade}
										</p>
									</div>
								) : null}
							</div>
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
						</div>
					</div>
				</div>
				{editMenuIsOpen ? (
					<motion.div
						key={"item-table-edit-menu"}
						variants={GeneralVisibleHiddenExitMotionVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="flex w-full flex-col gap-1 p-3"
					>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-[40%]">
								<TextInput
									label="DESCRIÇÃO"
									placeholder="Preencha a descrição do item..."
									value={itemHolder.descricao}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, descricao: value }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<SelectInput
									label="UNIDADE"
									selectedItemLabel="NÃO DEFINIDO"
									options={units}
									value={itemHolder.unidade}
									handleChange={(value) =>
										setItemHolder((prev) => ({
											...prev,
											unidade: value,
										}))
									}
									onReset={() => {
										setItemHolder((prev) => ({
											...prev,
											unidade: "UN",
										}));
									}}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<NumberInput
									label="QTDE"
									value={itemHolder.qtde}
									handleChange={(value) =>
										setItemHolder((prev) => ({
											...prev,
											qtde: value,
										}))
									}
									placeholder="Preencha a quantidade do item..."
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-[20%]">
								<NumberInput
									label="VALOR UNITÁRIO"
									value={itemHolder.preco}
									handleChange={(value) =>
										setItemHolder((prev) => ({
											...prev,
											preco: value,
										}))
									}
									placeholder="Preencha o valor unitário do item..."
									width="100%"
								/>
							</div>
						</div>
						<div className="flex items-center justify-end gap-2">
							<button
								onClick={() => {
									setEditMenuIsOpen(false);
								}}
								className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
							>
								FECHAR
							</button>
							<button
								onClick={() => {
									handleUpdate(itemHolder);
									setEditMenuIsOpen(false);
								}}
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

type ExpenseTotalMenuProps = {
	expenseTotal: number;
	handleUpdate: (info: { newTotal: number; updateItemsProportionally: boolean }) => void;
};
function ExpenseTotalMenu({ expenseTotal, handleUpdate }: ExpenseTotalMenuProps) {
	const [totalHolder, setTotalHolder] = useState(expenseTotal);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
	return (
		<>
			<AnimatePresence>
				<div className="flex w-full flex-col">
					<h1 className="bg-primary/80 text-secondary w-full p-1 text-center text-sm font-bold">TOTAL</h1>
					<div className="flex w-full items-center justify-center gap-2 p-2">
						<h1 className="text-lg font-bold tracking-tight">{formatToMoney(expenseTotal)}</h1>
						<button
							onClick={() => setEditMenuIsOpen((prev) => !prev)}
							className="flex items-center justify-center rounded border border-orange-500 bg-orange-50 p-1 text-orange-500 duration-300 ease-in-out hover:border-orange-700 hover:text-orange-700"
						>
							<MdEdit size={10} />
						</button>
					</div>
				</div>
				{editMenuIsOpen ? (
					<motion.div
						key={"expense-total-menu"}
						variants={GeneralVisibleHiddenExitMotionVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="flex w-full flex-col gap-1 p-3"
					>
						<NumberInput
							label="NOVO TOTAL"
							placeholder="Preencha aqui o novo total..."
							value={totalHolder}
							handleChange={(value) => setTotalHolder(value)}
							width="100%"
						/>

						<div className="flex items-center justify-end gap-2">
							<button
								onClick={() => {
									setEditMenuIsOpen(false);
								}}
								className="rounded bg-red-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-red-700"
							>
								FECHAR
							</button>
							<button
								onClick={() => {
									handleUpdate({ newTotal: totalHolder, updateItemsProportionally: false });
									setEditMenuIsOpen(false);
								}}
								className="bg-primary/80 hover:bg-primary/70 rounded p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out"
							>
								ATUALIZAR SOMENTE TOTAL
							</button>
							<button
								onClick={() => {
									handleUpdate({ newTotal: totalHolder, updateItemsProportionally: true });
									setEditMenuIsOpen(false);
								}}
								className="rounded bg-blue-800 p-1 px-4 text-[0.6rem] font-medium text-white duration-300 ease-in-out hover:bg-blue-700"
							>
								ATUALIZAR TOTAL + ITENS
							</button>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}
