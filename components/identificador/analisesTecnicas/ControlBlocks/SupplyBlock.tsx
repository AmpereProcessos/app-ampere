import NumberInput from "@/components/inputs/Number";

import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import type { TTechnicalAnalysisDTO } from "@/utils/schemas/technical-analysis";
import { supplyOptions } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";

import { MdDelete } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import MaterialSelector from "../../almoxarifado/estoque/MaterialVinculatorSelector";
import { Button } from "@/components/ui/button";
import { BsCart } from "react-icons/bs";
import { cn } from "@/lib/utils";

type SupplyBlockProps = {
	infoHolder: TTechnicalAnalysisDTO;
	setInfoHolder: Dispatch<SetStateAction<TTechnicalAnalysisDTO>>;
	changes: object;
	setChanges: Dispatch<SetStateAction<object>>;
};
function SupplyBlock({ infoHolder, setInfoHolder, changes, setChanges }: SupplyBlockProps) {
	const firstOption = Object.keys(supplyOptions)[0];
	const [newSupplyItemMenuIsOpen, setNewSupplyItemMenuIsOpen] = useState(false);
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
		const itemsList = infoHolder.suprimentos?.itens ? [...infoHolder.suprimentos.itens] : [];
		itemsList.splice(index, 1);
		setInfoHolder((prev) => ({
			...prev,
			suprimentos: prev.suprimentos ? { ...prev.suprimentos, itens: itemsList } : { observacoes: "", itens: itemsList },
		}));
		setChanges((prev) => ({ ...prev, "suprimentos.itens": itemsList }));
		return toast.success("Item removido com sucesso.");
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
				<div className="flex w-full items-center justify-end">
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
				<div className="flex w-full flex-wrap items-center justify-around gap-2">
					{infoHolder.suprimentos?.itens?.map((item, index) => (
						<div key={`${item.idMaterial}-${index}`} className="flex w-full  items-center justify-between rounded-md border border-cyan-500 p-2 shadow-sm lg:w-[350px]">
							<div className="flex flex-col">
								<h1 className="text-sm font-medium text-gray-500">
									<strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
								</h1>
								<div className="flex items-center gap-1">
									<TbRulerMeasure />
									<p className="text-xs italic text-gray-500">{item.grandeza}</p>
								</div>
							</div>
							<div className="flex items-center justify-end gap-1">
								<button
									type="button"
									onClick={() => removeSupplyItem(index)}
									className="w-fit cursor-pointer text-[20px] text-red-500 opacity-40 duration-300 ease-in hover:scale-110 hover:text-red-500 hover:opacity-100"
								>
									<MdDelete />
								</button>
							</div>
						</div>
					)) || <p className="w-full text-center text-xs font-medium italic text-gray-500">Nenhum item adicionado.</p>}
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
				<NumberInput
					label="QUANTIDADE"
					placeholder="Preencha aqui a quantidade de itens..."
					value={itemHolder.qtde}
					handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
					width="100%"
				/>
				<div className="flex items-center justify-end">
					<Button onClick={() => handleAddNewSupplyItem(itemHolder)} size={"sm"} type="button">
						ADICIONAR ITEM
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

// function SupplyItemCard({ item }: { item: Exclude<TTechnicalAnalysisDTO["suprimentos"], undefined | null>["itens"][number] }) {
// 	return <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]"></div>;
// }
