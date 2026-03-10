import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { useAllocators } from "@/utils/methods/query/allocators";
import type { TPurchaseControl } from "@/utils/schemas/purchases";

import { PurchaseCompositionItemCategories, units } from "@/utils/select-options";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import MaterialSelector from "@/components/identificador/almoxarifado/estoque/MaterialVinculatorSelector";
import { cn } from "@/lib/utils";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
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
		if (!compositionItemHolder.qtde || compositionItemHolder.qtde <= 0)
			return toast.error("Não foi possível adicionar o item. Quantidade não informada.");
		addCompositionItem(compositionItemHolder);
	}
	return (
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
				<MaterialSelector
					initialMaterialState={{ materialId: compositionItemHolder.materialId || null, materialName: compositionItemHolder.descricao }}
					vinculateMaterial={(m) =>
						updateCompositionItemHolder({
							materialId: m._id,
							descricao: m.nome,
							materialImagemUrl: m.imagemUrl,
							unidade: m.grandeza || "UN",
						})
					}
					unvinculateMaterial={() => updateCompositionItemHolder({ materialId: null, descricao: "", valor: 0, materialImagemUrl: null })}
				/>
				<div className="flex w-full flex-wrap items-center justify-center gap-2">
					{PurchaseCompositionItemCategories.map((category) => (
						<button
							key={category.id}
							type="button"
							className={cn("flex h-14 w-20 flex-col items-center justify-center rounded-lg border border-cyan-500 p-2 text-cyan-500", {
								"bg-cyan-500 text-white": compositionItemHolder.categoria === category.value,
								"bg-transparent text-cyan-500": compositionItemHolder.categoria !== category.value,
							})}
							onClick={() =>
								updateCompositionItemHolder({ categoria: category.value as "MÓDULO" | "INVERSOR" | "INSUMO" | "ESTRUTURA" | "PADRÃO" | "OUTROS" })
							}
						>
							{renderIconWithClassNames(category.icon, "w-5 h-5")}
							<p className="text-[0.65rem] font-medium">{category.label}</p>
						</button>
					))}
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="UNIDADE DE FATURAMENTO"
							selectedItemLabel="NÃO DEFINIDO"
							options={units}
							value={compositionItemHolder.unidadeFaturamento}
							handleChange={(value) => updateCompositionItemHolder({ unidadeFaturamento: value })}
							onReset={() => {
								updateCompositionItemHolder({
									unidadeFaturamento: null,
								});
							}}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							label="QUANTIDADE DE FATURAMENTO"
							value={compositionItemHolder.qtdeFaturamento || null}
							handleChange={(value) => updateCompositionItemHolder({ qtdeFaturamento: value, qtde: value * (compositionItemHolder.fatorConversao || 1) })}
							placeholder="Preencha aqui a quantidade de faturamento."
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							label="VALOR DE FATURAMENTO"
							value={compositionItemHolder.valorFaturamento || null}
							handleChange={(value) => updateCompositionItemHolder({ valorFaturamento: value, valor: value / (compositionItemHolder.fatorConversao || 1) })}
							placeholder="Preencha aqui o valor de faturamento."
							width="100%"
						/>
					</div>
				</div>
				<div className="flex w-full items-center justify-center">
					<NumberInput
						label="FATOR DE CONVERSÃO"
						value={compositionItemHolder.fatorConversao || null}
						handleChange={(value) =>
							updateCompositionItemHolder({
								fatorConversao: value,
								qtde: value * (compositionItemHolder.qtdeFaturamento || 1),
								valor: (compositionItemHolder.valorFaturamento || 1) / value,
							})
						}
						placeholder="Preencha aqui o fator de conversão."
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						width="100%"
					/>
				</div>
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							label="UNIDADE"
							selectedItemLabel="NÃO DEFINIDO"
							options={units}
							value={compositionItemHolder.unidade}
							handleChange={(value) =>
								updateCompositionItemHolder({
									unidade: value,
								})
							}
							onReset={() => {
								updateCompositionItemHolder({
									unidade: "UN",
								});
							}}
							editable={false}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							value={compositionItemHolder.qtde}
							handleChange={(value) =>
								updateCompositionItemHolder({
									qtde: value,
									fatorConversao: value / (compositionItemHolder.qtdeFaturamento || 1),
									valorFaturamento: (compositionItemHolder.valor * value) / (compositionItemHolder.qtdeFaturamento || 1),
								})
							}
							label="QUANTIDADE"
							placeholder="Preencha aqui a quantidade."
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<NumberInput
							value={compositionItemHolder.valor}
							handleChange={(value) => {
								const newFactor = (compositionItemHolder.valorFaturamento || 1) / value;
								updateCompositionItemHolder({
									valor: value,
									fatorConversao: newFactor,
									qtdeFaturamento: compositionItemHolder.qtde / newFactor,
								});
							}}
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
