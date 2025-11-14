import { cn } from "@/lib/utils";
import type { TPurchaseControlCompositionKit } from "@/utils/schemas/purchases";
import { use, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { SlideMotionVariants } from "@/utils/constants";
import MaterialSelector from "../../almoxarifado/estoque/MaterialVinculatorSelector";
import NumberInput from "@/components/inputs/Number";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import SelectInput from "@/components/inputs/Select";
import { PurchaseCompositionItemCategories } from "@/utils/select-options";
import { MdDelete, MdEdit } from "react-icons/md";
import { renderProductCategoryIcon, renderUnitLabel } from "@/utils/methods/rendering";
import { TbRulerMeasure } from "react-icons/tb";

type PurchaseControlCompositionKitItemBlockProps = {
	items: TPurchaseControlCompositionKit["itens"];
	addItem: (item: TPurchaseControlCompositionKit["itens"][number]) => void;
	updateItem: (info: { index: number; changes: Partial<TPurchaseControlCompositionKit["itens"][number]> }) => void;
	removeItem: (index: number) => void;
};
function PurchaseControlCompositionKitItemBlock({ items, addItem, updateItem, removeItem }: PurchaseControlCompositionKitItemBlockProps) {
	const [newItemMenuIsOpen, setNewItemMenuIsOpen] = useState<boolean>(false);
	return (
		<div className="flex w-full flex-col gap-3">
			<h1 className="w-full text-start text-sm tracking-tight">ITENS</h1>
			<div className="flex w-full items-center justify-end">
				<button
					type="button"
					onClick={() => setNewItemMenuIsOpen((prev) => !prev)}
					className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
						"bg-primary/20 hover:bg-red-300": newItemMenuIsOpen,
						"bg-green-300 hover:bg-green-400": !newItemMenuIsOpen,
					})}
				>
					<BsCart />
					<h1 className="text-xs font-medium tracking-tight">{!newItemMenuIsOpen ? "ABRIR MENU DE NOVO ITEM" : "FECHAR MENU DE NOVO ITEM"}</h1>
				</button>
			</div>
			<AnimatePresence>{newItemMenuIsOpen ? <NewItemMenu addItem={addItem} /> : null}</AnimatePresence>
			<div className="border-primary/80 flex w-full flex-col rounded border-0 lg:border">
				<div className="bg-primary/80 hidden w-full items-center gap-2 rounded rounded-br-none rounded-bl-none p-1 lg:flex">
					<h1 className="w-[50%] text-center text-sm font-bold text-white">ITEM</h1>
					<h1 className="w-[25%] text-center text-sm font-bold text-white">UNIDADE</h1>
					<h1 className="w-[25%] text-center text-sm font-bold text-white">QTDE</h1>
				</div>
				<div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
					{items.length > 0 ? (
						items.map((item, index) => (
							<ItemCard
								key={`${item.materialId}-${index}`}
								item={{ ...item }}
								handleUpdate={(item) => updateItem({ changes: item, index })}
								handleRemove={() => removeItem(index)}
							/>
						))
					) : (
						<p className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Não há itens de composição definidos.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default PurchaseControlCompositionKitItemBlock;
type NewItemMenuProps = {
	addItem: (item: TPurchaseControlCompositionKit["itens"][number]) => void;
};

function NewItemMenu({ addItem }: NewItemMenuProps) {
	const [itemHolder, setItemHolder] = useState<TPurchaseControlCompositionKit["itens"][number]>({
		categoria: "OUTROS",
		descricao: "",
		qtde: 1,
		unidade: "UN",
	});
	function handleAddItem(item: TPurchaseControlCompositionKit["itens"][number]) {
		if (!item.materialId) return toast.error("Selecione um material para adicionar ao kit.");
		if (item.qtde <= 0) return toast.error("A quantidade deve ser maior que zero.");
		addItem(item);
		setItemHolder({
			categoria: "OUTROS",
			descricao: "",
			qtde: 1,
			unidade: "UN",
		});
	}
	return (
		<motion.div
			key={"menu-open"}
			variants={SlideMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
		>
			<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO ITEM</h1>
			<div className="flex w-full grow flex-col gap-2 p-3">
				<MaterialSelector
					initialMaterialState={{ materialId: itemHolder.materialId || null, materialName: itemHolder.descricao }}
					vinculateMaterial={(m) =>
						setItemHolder((prev) => ({
							...prev,
							materialId: m._id,
							descricao: m.nome,
							unidade: m.grandeza || "UN",
						}))
					}
					unvinculateMaterial={() => setItemHolder((prev) => ({ ...prev, materialId: null, descricao: "", valor: 0 }))}
				/>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<SelectInput
							label="CATEGORIA"
							selectedItemLabel="NÃO DEFINIDO"
							options={PurchaseCompositionItemCategories}
							value={itemHolder.categoria}
							handleChange={(value) => setItemHolder((prev) => ({ ...prev, categoria: value }))}
							onReset={() => {
								setItemHolder((prev) => ({ ...prev, categoria: "OUTROS" }));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							value={itemHolder.qtde}
							handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
							label="QUANTIDADE"
							placeholder="Preencha aqui a quantidade."
							width={"100%"}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button onClick={() => handleAddItem(itemHolder)} size={"xs"} type="button">
						ADICIONAR ITEM
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

type ItemCardProps = {
	item: TPurchaseControlCompositionKit["itens"][number];
	handleUpdate: (item: TPurchaseControlCompositionKit["itens"][number]) => void;
	handleRemove: () => void;
};
function ItemCard({ item, handleUpdate, handleRemove }: ItemCardProps) {
	const [itemHolder, setItemHolder] = useState<TPurchaseControlCompositionKit["itens"][number]>(item);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState<boolean>(false);
	return (
		<>
			<AnimatePresence>
				<div className="bg-background hidden w-full flex-col gap-1 lg:flex dark:bg-[#121212]">
					<div className="flex w-full items-center gap-2 p-1">
						<div className="flex w-[50%] items-center gap-1">
							<div className="flex flex-col">
								<h1 className="text-xs tracking-tight">{item.descricao}</h1>
								<p className="text-primary/80 text-[0.65rem] leading-none font-light tracking-tight italic">{item.categoria}</p>
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
						<h1 className="w-[25%] text-center text-xs tracking-tight">{item.unidade}</h1>
						<h1 className="w-[25%] text-center text-xs tracking-tight">{item.qtde}</h1>
					</div>
				</div>
				<div className="border-primary bg-background flex w-full flex-col rounded-md border p-2 lg:hidden dark:bg-[#121212]">
					<div className="flex w-full flex-col items-start justify-between gap-2">
						<div className="flex w-full items-center justify-between gap-2">
							<div className="flex items-center gap-1">
								<div className="flex h-[20x] w-[20x] items-center justify-center rounded-full border border-black p-1 text-[15px]">
									{renderProductCategoryIcon(item.categoria, 15)}
								</div>
								<p className="text-xs leading-none font-bold tracking-tight lg:text-sm">
									<strong className="text-[#FF9B50]">{item.qtde}</strong> x {item.descricao}
								</p>
							</div>
						</div>
						<div className="flex w-full items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1">
									<TbRulerMeasure />
									<p className="text-primary/80 text-[0.6rem] italic lg:text-xs">{renderUnitLabel(item.unidade)}</p>
								</div>
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
					<motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="flex w-full flex-col gap-1 p-3">
						<MaterialSelector
							initialMaterialState={{ materialId: itemHolder.materialId || null, materialName: itemHolder.descricao }}
							vinculateMaterial={(m) =>
								setItemHolder((prev) => ({
									...prev,
									materialId: m._id,
									descricao: m.nome,
									unidade: m.grandeza || "UN",
								}))
							}
							unvinculateMaterial={() => setItemHolder((prev) => ({ ...prev, materialId: null, descricao: "", valor: 0 }))}
						/>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<SelectInput
									label="CATEGORIA"
									labelClassName="text-[0.6rem]"
									holderClassName="text-xs p-2 min-h-[34px]"
									selectedItemLabel="NÃO DEFINIDO"
									options={PurchaseCompositionItemCategories}
									value={itemHolder.categoria}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, categoria: value }))}
									onReset={() => {
										setItemHolder((prev) => ({ ...prev, categoria: "OUTROS" }));
									}}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<NumberInput
									label="QUANTIDADE"
									labelClassName="text-[0.6rem]"
									holderClassName="text-xs p-2 min-h-[34px]"
									value={itemHolder.qtde}
									handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
									placeholder="Preencha aqui a quantidade."
									width={"100%"}
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
