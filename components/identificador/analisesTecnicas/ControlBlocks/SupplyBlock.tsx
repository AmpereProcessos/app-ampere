import NumberInput from "@/components/inputs/Number";

import { formatToMoney, GeneralVisibleHiddenExitMotionVariants, SlideMotionVariants } from "@/utils/constants";
import type { TTechnicalAnalysisDTO } from "@/utils/schemas/technical-analysis";
import { PurchaseCompositionItemCategories, supplyOptions } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";

import { MdDelete, MdEdit } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import MaterialSelector from "../../almoxarifado/estoque/MaterialVinculatorSelector";
import { Button } from "@/components/ui/button";
import { BsCart } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { BadgeDollarSign, DollarSign, Package, Pencil } from "lucide-react";
import { usePurchaseControlCompositionKits } from "@/utils/methods/query/purchase-controls";
import SelectInput from "@/components/inputs/Select";
import type { TPurchaseControlCompositionKitDTO } from "@/utils/schemas/purchases";

type SupplyBlockProps = {
	infoHolder: TTechnicalAnalysisDTO;
	setInfoHolder: Dispatch<SetStateAction<TTechnicalAnalysisDTO>>;
	changes: object;
	setChanges: Dispatch<SetStateAction<object>>;
};
function SupplyBlock({ infoHolder, setInfoHolder, changes, setChanges }: SupplyBlockProps) {
	const { data: purchaseControlCompositionKits } = usePurchaseControlCompositionKits();

	const [newSupplyItemMenuIsOpen, setNewSupplyItemMenuIsOpen] = useState(false);

	function handleAddItemsFromKit(itens: TPurchaseControlCompositionKitDTO["itens"]) {
		const newItems: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"] = itens.map((item) => ({
			idMaterial: item.materialId,
			descricao: item.descricao,
			qtde: item.qtde,
			tipo: "",
			grandeza: item.unidade || "UN",
			preco: 0,
			categoria: item.categoria,
		}));
		const newItemsList = infoHolder.suprimentos?.itens ? [...infoHolder.suprimentos.itens, ...newItems] : [...newItems];
		setInfoHolder((prev) => ({
			...prev,
			suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: newItemsList } : { observacoes: "", itens: newItemsList },
		}));
		setChanges((prev) => ({ ...prev, "suprimentos.itens": newItemsList }));
		return toast.success("Itens do kit adicionados aos suprimentos.");
	}
	function addSupplyItem(newItem: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]) {
		const newItemsList = infoHolder.suprimentos?.itens ? [...infoHolder.suprimentos.itens, newItem] : [newItem];
		setInfoHolder((prev) => ({
			...prev,
			suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: newItemsList } : { observacoes: "", itens: newItemsList },
		}));
		setChanges((prev) => ({ ...prev, "suprimentos.itens": newItemsList }));

		return toast.success("Item adicionado com sucesso.");
	}
	function removeSupplyItem(index: number) {
		const newItemsList = infoHolder.suprimentos?.itens ? infoHolder.suprimentos.itens.filter((_, i) => i !== index) : [];
		setInfoHolder((prev) => ({
			...prev,
			suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: newItemsList } : { observacoes: "", itens: newItemsList },
		}));
		setChanges((prev) => ({ ...prev, "suprimentos.itens": newItemsList }));
		return toast.success("Item removido com sucesso.");
	}
	function updateSupplyItem(index: number, item: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]) {
		const newItemsList = infoHolder.suprimentos?.itens ? infoHolder.suprimentos.itens.map((_, i) => (i === index ? item : _)) : [];
		setInfoHolder((prev) => ({
			...prev,
			suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: newItemsList } : { observacoes: "", itens: newItemsList },
		}));
	}
	return (
		<div className="mt-4 flex w-full flex-col">
			<div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
				<h1 className="font-bold text-white">SUPRIMENTOS</h1>
			</div>
			<div className="mt-2 flex w-full flex-col gap-2">
				<div className="flex w-full flex-col">
					<h1 className="w-full rounded-tl-sm rounded-tr-sm bg-gray-500 p-1 text-center font-bold text-white">OBSERVAÇÕES</h1>
					<textarea
						placeholder="SEM OBSERVAÇÕES PREENCHIDAS..."
						value={infoHolder.suprimentos?.observacoes || ""}
						onChange={(e) => {
							setInfoHolder((prev) => ({
								...prev,
								suprimentos: prev.suprimentos ? { ...prev.suprimentos, observacoes: e.target.value } : { observacoes: e.target.value, itens: [] },
							}));
							setChanges((prev) => ({ ...prev, "suprimentos.observacoes": e.target.value }));
						}}
						className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
					/>
				</div>
				<div className="flex w-full items-center justify-end flex-wrap gap-2">
					{purchaseControlCompositionKits?.map((compositionKit) => (
						<button
							key={compositionKit._id}
							type="button"
							onClick={() => handleAddItemsFromKit(compositionKit.itens)}
							className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out bg-cyan-300 hover:bg-cyan-400")}
						>
							<Package className="w-4 h-4" />
							<h1 className="text-xs font-medium tracking-tight">+ {compositionKit.titulo}</h1>
						</button>
					))}
					<button
						type="button"
						onClick={() => setNewSupplyItemMenuIsOpen((prev) => !prev)}
						className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
							"bg-gray-300  hover:bg-red-300": newSupplyItemMenuIsOpen,
							"bg-green-300  hover:bg-green-400": !newSupplyItemMenuIsOpen,
						})}
					>
						<BsCart />
						<h1 className="text-xs font-medium tracking-tight">{!newSupplyItemMenuIsOpen ? "ABRIR MENU DE NOVO ITEM DE SUPRIMENTO" : "FECHAR MENU DE NOVO ITEM DE SUPRIMENTO"}</h1>
					</button>
				</div>
				<AnimatePresence>{newSupplyItemMenuIsOpen && <NewSupplyItemMenu addSupplyItem={addSupplyItem} />}</AnimatePresence>
				<div className="flex w-full flex-col gap-2">
					{!!infoHolder.suprimentos?.itens && infoHolder.suprimentos?.itens.length > 0 ? (
						infoHolder.suprimentos?.itens.map((item, index) => (
							<SupplyItemCard
								key={`${item.idMaterial}-${index}`}
								item={item}
								handleUpdate={(newItem) => {
									updateSupplyItem(index, newItem);
								}}
								handleRemove={() => removeSupplyItem(index)}
							/>
						))
					) : (
						<p className="w-full text-center text-xs font-medium italic text-gray-500">Nenhum item adicionado.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default SupplyBlock;

type NewSupplyItemMenuProps = {
	addSupplyItem: (info: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]) => void;
};
function NewSupplyItemMenu({ addSupplyItem }: NewSupplyItemMenuProps) {
	const [itemHolder, setItemHolder] = useState<Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]>({
		idMaterial: null,
		descricao: "",
		qtde: 0,
		tipo: "",
		grandeza: "UN",
		preco: null,
	});

	function handleAddNewSupplyItem(info: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]) {
		if (!info.idMaterial) return toast.error("Informe um material válido.");
		if (info.qtde <= 0) return toast.error("Informe uma quantidade válida.");
		addSupplyItem(info);
	}
	return (
		<motion.div
			key={"menu-open"}
			variants={GeneralVisibleHiddenExitMotionVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="flex w-full flex-col gap-2 rounded border border-green-600 bg-[#fff] shadow-sm dark:bg-[#121212]"
		>
			<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO ITEM DE SUPRIMENTO</h1>
			<div className="flex w-full grow flex-col gap-2 p-3">
				<MaterialSelector
					initialMaterialState={{ materialId: itemHolder.idMaterial || null, materialName: itemHolder.descricao }}
					vinculateMaterial={(material) =>
						setItemHolder((prev) => ({
							...prev,
							idMaterial: material._id,
							descricao: material.nome,
							grandeza: material.grandeza || "UN",
							preco: material.preco,
						}))
					}
					unvinculateMaterial={() =>
						setItemHolder((prev) => ({
							...prev,
							idMaterial: null,
							descricao: "",
							grandeza: "UN",
							preco: null,
						}))
					}
				/>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<SelectInput
							label="CATEGORIA"
							selectedItemLabel="NÃO DEFINIDO"
							options={PurchaseCompositionItemCategories}
							value={itemHolder.categoria}
							handleChange={(value) =>
								setItemHolder((prev) => ({
									...prev,
									categoria: value,
								}))
							}
							onReset={() => {
								setItemHolder((prev) => ({
									...prev,
									categoria: "OUTROS",
								}));
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="QUANTIDADE"
							placeholder="Preencha aqui a quantidade de itens..."
							value={itemHolder.qtde}
							handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
							width="100%"
						/>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button onClick={() => handleAddNewSupplyItem(itemHolder)} size={"sm"} type="button">
						ADICIONAR ITEM
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

type SupplyItemCardProps = {
	item: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number];
	handleUpdate: (info: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]) => void;
	handleRemove: () => void;
};
function SupplyItemCard({ item, handleUpdate, handleRemove }: SupplyItemCardProps) {
	const [itemHolder, setItemHolder] = useState<Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number]>(item);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);
	return (
		<>
			<AnimatePresence>
				<div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
					<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
						<p className="text-sm font-bold leading-none tracking-tight">
							{item.descricao}
							{item.tipo ? `(${item.tipo})` : null}
						</p>
						<div className="flex items-center gap-1">
							<BadgeDollarSign className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{formatToMoney(item.qtde * (item.preco || 0))}</h1>
						</div>
					</div>
					<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
						<div className="flex flex-wrap items-center gap-2">
							<div className="flex items-center gap-1">
								<Package className="w-4 h-4 min-w-4 min-h-4" />
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
									{item.qtde} ({item.grandeza})
								</h1>
							</div>
							<div className="flex items-center gap-1">
								<DollarSign className="w-4 h-4 min-w-4 min-h-4" />
								<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
									{formatToMoney(item.preco || 0)}/{item.grandeza}
								</h1>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setEditMenuIsOpen((prev) => !prev)}
								className="flex items-center gap-1 rounded-lg bg-orange-600 px-2 py-1 text-[0.6rem] text-white hover:bg-orange-500"
							>
								<MdEdit width={10} height={10} />
								<p>EDITAR</p>
							</button>
							<button type="button" onClick={() => handleRemove()} className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white hover:bg-red-500">
								<MdDelete width={10} height={10} />
								<p>REMOVER</p>
							</button>
						</div>
					</div>
				</div>
				{editMenuIsOpen ? (
					<motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="flex w-full flex-col gap-1 p-3">
						<div className="flex w-full flex-col items-center gap-2">
							<MaterialSelector
								initialMaterialState={{ materialId: itemHolder.idMaterial || null, materialName: itemHolder.descricao }}
								vinculateMaterial={(material) =>
									setItemHolder((prev) => ({
										...prev,
										idMaterial: material._id,
										descricao: material.nome,
										grandeza: material.grandeza || "UN",
										preco: material.preco,
									}))
								}
								unvinculateMaterial={() =>
									setItemHolder((prev) => ({
										...prev,
										idMaterial: null,
										descricao: "",
										grandeza: "UN",
										preco: null,
									}))
								}
							/>
							<NumberInput
								label="QUANTIDADE"
								placeholder="Preencha aqui a quantidade de itens..."
								labelClassName="text-[0.6rem]"
								holderClassName="text-xs p-2 min-h-[34px]"
								value={itemHolder.qtde}
								handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
								width="100%"
							/>
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
