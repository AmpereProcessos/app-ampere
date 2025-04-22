import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { useAllocators } from "@/utils/methods/query/allocators";
import type { TPurchaseControl } from "@/utils/schemas/purchases";

import { PurchaseCompositionItemCategories } from "@/utils/select-options";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
type PurchaseNewCompositionItemProps = {
	addCompositionItem: (item: TPurchaseControl["composicao"][number]) => void;
};
function PurchaseNewCompositionItem({ addCompositionItem }: PurchaseNewCompositionItemProps) {
	const [compositionItemHolder, setCompositionItemHolder] = useState<TPurchaseControl["composicao"][number]>({
		categoria: "OUTROS",
		descricao: "",
		qtde: 1,
		unidade: "UN",
		valor: 0,
	});
	function updateCompositionItemHolder(holder: Partial<TPurchaseControl["composicao"][number]>) {
		setCompositionItemHolder((prev) => ({ ...prev, ...holder }));
	}

	function handleAddCompositionItem() {
		if (!compositionItemHolder.materialId) return toast.error("Não foi possível adicionar o item. Material não selecionado.");
		if (!compositionItemHolder.qtde || compositionItemHolder.qtde <= 0) return toast.error("Não foi possível adicionar o item. Quantidade não informada.");
		addCompositionItem(compositionItemHolder);
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
			<h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVO ITEM</h1>
			<div className="flex w-full grow flex-col gap-2 p-3">
				<MaterialSelector
					initialMaterialState={{ materialId: compositionItemHolder.materialId || null, materialName: compositionItemHolder.descricao }}
					vinculateMaterial={(m) =>
						updateCompositionItemHolder({
							materialId: m._id,
							descricao: m.nome,
							valor: m.preco,
							unidade: m.grandeza || "UN",
						})
					}
					unvinculateMaterial={() => updateCompositionItemHolder({ materialId: null, descricao: "", valor: 0 })}
				/>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="lg:w-1/3 w-full">
						<SelectInput
							label="CATEGORIA"
							selectedItemLabel="NÃO DEFINIDO"
							options={PurchaseCompositionItemCategories}
							value={compositionItemHolder.categoria}
							handleChange={(value) =>
								updateCompositionItemHolder({
									categoria: value,
								})
							}
							onReset={() => {
								updateCompositionItemHolder({
									categoria: "OUTROS",
								});
							}}
							width="100%"
						/>
					</div>
					<div className="lg:w-1/3 w-full">
						<NumberInput
							value={compositionItemHolder.qtde}
							handleChange={(value) => updateCompositionItemHolder({ qtde: value })}
							label="QUANTIDADE"
							placeholder="Preencha aqui a quantidade."
							width={"100%"}
						/>
					</div>
					<div className="lg:w-1/3 w-full">
						<NumberInput
							value={compositionItemHolder.valor}
							handleChange={(value) => updateCompositionItemHolder({ valor: value })}
							label="VALOR UNITÁRIO"
							placeholder="Preencha aqui o valor unitário."
							width={"100%"}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button onClick={handleAddCompositionItem} size={"sm"} type="button">
						ADICIONAR ITEM
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

export default PurchaseNewCompositionItem;
