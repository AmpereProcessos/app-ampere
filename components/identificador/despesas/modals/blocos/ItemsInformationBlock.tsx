import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { TExpense } from "@/utils/schemas/expenses";
import { units } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdAddBox } from "react-icons/md";
import ExpenseItemsTable from "./utils/ItemsTable";

type ExpenseItemsInformationBlockProps = {
	infoHolder: TExpense;
	setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>;
};
function ExpenseItemsInformationBlock({ infoHolder, setInfoHolder }: ExpenseItemsInformationBlockProps) {
	const [newCompositionItemMenuIsOpen, setNewCompositionItemMenuIsOpen] = useState<boolean>(false);

	function addCompositionItem(info: TExpense["itens"][number]) {
		if (info.qtde <= 0) return toast.error("Preencha uma quantidade válida.");
		if (info.preco <= 0) return toast.error("Preencha um preço válido.");
		setInfoHolder((prev) => ({ ...prev, itens: [...prev.itens, info] }));
	}
	function updateCompositionItem(info: { index: number; item: Partial<TExpense["itens"][number]> }) {
		setInfoHolder((prev) => ({
			...prev,
			itens: prev.itens.map((item, index) => (index === info.index ? { ...item, ...info.item } : item)),
		}));
	}
	function removeCompositionItem(index: number) {
		setInfoHolder((prev) => ({ ...prev, itens: prev.itens.filter((f, i) => i !== index) }));
	}

	function updateExpenseTotal({ newTotal, updateItemsProportionally }: { newTotal: number; updateItemsProportionally: boolean }) {
		if (!updateItemsProportionally) setInfoHolder((prev) => ({ ...prev, total: newTotal }));
		setInfoHolder((prev) => ({
			...prev,
			total: newTotal,
			itens: prev.itens.map((item) => {
				const previousTotal = prev.total;
				const proportion = newTotal / previousTotal;
				return { ...item, preco: item.preco * proportion };
			}),
		}));
	}
	const compositionItemsTotal = infoHolder.itens.reduce((acc, current) => acc + current.qtde * current.preco, 0);

	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">COMPOSIÇÃO DA DESPESA</h1>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full items-center justify-end">
					<button
						onClick={() => setNewCompositionItemMenuIsOpen((prev) => !prev)}
						className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
							"bg-primary/20 hover:bg-red-300": newCompositionItemMenuIsOpen,
							"bg-green-300 hover:bg-green-400": !newCompositionItemMenuIsOpen,
						})}
					>
						<MdAddBox />
						<h1 className="text-xs font-medium tracking-tight">{!newCompositionItemMenuIsOpen ? "ABRIR MENU DE NOVO ITEM" : "FECHAR MENU DE NOVO ITEM"}</h1>
					</button>
				</div>
				{newCompositionItemMenuIsOpen ? <NewCompositionItemMenu addCompositionItem={addCompositionItem} /> : null}
				<ExpenseItemsTable
					expenseTotal={infoHolder.total}
					composition={infoHolder.itens}
					updateCompositionItem={updateCompositionItem}
					removeCompositionItem={removeCompositionItem}
					updateExpenseTotal={updateExpenseTotal}
				/>

				{compositionItemsTotal > infoHolder.total ? (
					<p className="w-full rounded border border-orange-400 bg-orange-50 p-1 text-center text-xs tracking-tight text-orange-400 italic">
						Por favor, ajuste os valores dos itens da composição. A somatória dos itens atuais excede o valor total estabelecido para a despesa.
					</p>
				) : null}
			</div>
		</div>
	);
}

export default ExpenseItemsInformationBlock;

type NewCompositionItemMenuProps = {
	addCompositionItem: (info: TExpense["itens"][number]) => void;
};
function NewCompositionItemMenu({ addCompositionItem }: NewCompositionItemMenuProps) {
	const [compositionItemHolder, setCompositionItemHolder] = useState<TExpense["itens"][number]>({
		descricao: "",
		preco: 0,
		qtde: 0,
		unidade: "UN",
	});

	return (
		<AnimatePresence>
			<motion.div
				key={"menu-open"}
				variants={GeneralVisibleHiddenExitMotionVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
			>
				<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO ITEM</h1>
				<div className="flex w-full grow flex-col gap-2 p-3">
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-[40%]">
							<TextInput
								label="DESCRIÇÃO"
								placeholder="Preencha a descrição do item..."
								value={compositionItemHolder.descricao}
								handleChange={(value) => setCompositionItemHolder((prev) => ({ ...prev, descricao: value }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-[20%]">
							<SelectInput
								label="UNIDADE"
								selectedItemLabel="NÃO DEFINIDO"
								options={units}
								value={compositionItemHolder.unidade}
								handleChange={(value) =>
									setCompositionItemHolder((prev) => ({
										...prev,
										unidade: value,
									}))
								}
								onReset={() => {
									setCompositionItemHolder((prev) => ({
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
								value={compositionItemHolder.qtde}
								handleChange={(value) =>
									setCompositionItemHolder((prev) => ({
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
								value={compositionItemHolder.preco}
								handleChange={(value) =>
									setCompositionItemHolder((prev) => ({
										...prev,
										preco: value,
									}))
								}
								placeholder="Preencha o valor unitário do item..."
								width="100%"
							/>
						</div>
					</div>
					<div className="flex items-center justify-end">
						<Button onClick={() => addCompositionItem(compositionItemHolder)} size={"xs"} type="button">
							ADICIONAR ITEM
						</Button>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
