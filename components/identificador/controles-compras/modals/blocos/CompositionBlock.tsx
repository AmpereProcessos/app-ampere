import NumberInput from "@/components/inputs/Number";

import React, { type Dispatch, useState, type SetStateAction } from "react";
import PurchaseControlCompositionBlockTable from "./utils/CompositionTable";
import type { TPurchaseControl, TPurchaseControlCompositionKitDTO } from "@/utils/schemas/purchases";
import toast from "react-hot-toast";
import { BsCart } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import PurchaseNewCompositionItem from "./utils/NewCompositionItem";
import { usePurchaseControlCompositionKits } from "@/utils/methods/query/purchase-controls";
import { Package } from "lucide-react";
import NewPurchaseControlCompositionKit from "../../kits-composicao/NewPurchaseControlCompositionKit";
import type { Session } from "next-auth";

type PurchaseControlCompositionBlockProps = {
	session: Session;
	infoHolder: TPurchaseControl;
	setInfoHolder: Dispatch<SetStateAction<TPurchaseControl>>;
};
function PurchaseControlCompositionBlock({ session, infoHolder, setInfoHolder }: PurchaseControlCompositionBlockProps) {
	const { data: purchaseControlCompositionKits } = usePurchaseControlCompositionKits();
	const [newCompositionKitModalIsOpen, setNewCompositionKitModalIsOpen] = useState<boolean>(false);
	const [newCompositionItemMenuIsOpen, setNewCompositionItemMenuIsOpen] = useState<boolean>(false);

	function addCompositionItem(item: TPurchaseControl["composicao"][number]) {
		setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, item] }));
	}

	function removeCompositionItem(index: number) {
		setInfoHolder((prev) => ({ ...prev, composicao: prev.composicao.filter((c, cIndex) => cIndex !== index) }));
	}
	function updateCompositionItem(info: { index: number; item: Partial<TPurchaseControl["composicao"][number]> }) {
		setInfoHolder((prev) => ({
			...prev,
			composicao: prev.composicao.map((cItem, cIndex) => (cIndex !== info.index ? cItem : { ...cItem, ...info.item })),
		}));
	}

	function handleAddItemsFromKit(itens: TPurchaseControlCompositionKitDTO["itens"]) {
		const newItems: TPurchaseControl["composicao"] = itens.map((item) => ({
			materialId: item.materialId,
			categoria: item.categoria,
			descricao: item.descricao,
			qtde: item.qtde,
			unidade: item.unidade,
			valor: 0,
		}));
		setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, ...newItems] }));
		toast.success("Itens do kit adicionados à composição da compra.");
	}
	const compositionItemsTotal = infoHolder.composicao.reduce((acc, current) => acc + current.qtde * current.valor, 0);

	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">COMPOSIÇÃO DA COMPRA</h1>
			<div className="flex w-full grow flex-col gap-2">
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
						onClick={() => setNewCompositionKitModalIsOpen((prev) => !prev)}
						className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
							"bg-gray-300  hover:bg-red-300": newCompositionKitModalIsOpen,
							"bg-green-300  hover:bg-green-400": !newCompositionKitModalIsOpen,
						})}
					>
						<Package className="w-4 h-4" />
						<h1 className="text-xs font-medium tracking-tight">{!newCompositionKitModalIsOpen ? "ABRIR MENU DE NOVO KIT" : "FECHAR MENU DE NOVO KIT"}</h1>
					</button>
					<button
						type="button"
						onClick={() => setNewCompositionItemMenuIsOpen((prev) => !prev)}
						className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
							"bg-gray-300  hover:bg-red-300": newCompositionItemMenuIsOpen,
							"bg-green-300  hover:bg-green-400": !newCompositionItemMenuIsOpen,
						})}
					>
						<BsCart />
						<h1 className="text-xs font-medium tracking-tight">{!newCompositionItemMenuIsOpen ? "ABRIR MENU DE NOVO ITEM" : "FECHAR MENU DE NOVO ITEM"}</h1>
					</button>
				</div>
				<AnimatePresence>{newCompositionItemMenuIsOpen ? <PurchaseNewCompositionItem addCompositionItem={addCompositionItem} /> : null}</AnimatePresence>
				<PurchaseControlCompositionBlockTable composition={infoHolder.composicao} removeCompositionItem={removeCompositionItem} updateCompositionItem={updateCompositionItem} />
				{compositionItemsTotal > infoHolder.total ? (
					<p className="w-full rounded border border-orange-400 bg-orange-50 p-1 text-center text-xs italic tracking-tight text-orange-400">
						Por favor, ajuste os valores dos itens da composição. A somatória dos itens atuais excede o valor total estabelecido para a compra.
					</p>
				) : null}
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="TOTAL PREVISTO PARA A COMPRA"
							placeholder="Preencha o valor previsto para a compra..."
							value={infoHolder.totalPrevisto || null}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, totalPrevisto: value }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="TOTAL DA COMPRA"
							placeholder="Preencha o valor total da compra..."
							value={infoHolder.total}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
							width="100%"
						/>
					</div>
				</div>
			</div>
			{newCompositionKitModalIsOpen ? (
				<NewPurchaseControlCompositionKit session={session} affectedQueryKey={["purchase-control-composition-kits"]} closeModal={() => setNewCompositionKitModalIsOpen(false)} />
			) : null}
		</div>
	);
}

export default PurchaseControlCompositionBlock;
