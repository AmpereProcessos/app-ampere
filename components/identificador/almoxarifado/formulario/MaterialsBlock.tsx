import NumberInput from "@/components/inputs/Number";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import { useMaterials } from "@/utils/methods/query/materials";
import type { TTransactionalWarehouseFormulary } from "@/utils/schemas/warehouse-formularies";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import MaterialListItem from "./MaterialListItem";

import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { useQueryClient } from "@tanstack/react-query";
import { Package, Plus } from "lucide-react";

type MaterialsBlockProps = {
	formularyId?: string;
	formHolder: TTransactionalWarehouseFormulary;
	setFormHolder: React.Dispatch<React.SetStateAction<TTransactionalWarehouseFormulary>>;
	blockTakeAway?: boolean;
	blockDevolution?: boolean;
	allowPostFinishEditing?: boolean;
};
function MaterialsBlock({
	formularyId,
	formHolder,
	setFormHolder,
	blockTakeAway = false,
	blockDevolution = true,
	allowPostFinishEditing = false,
}: MaterialsBlockProps) {
	const queryClient = useQueryClient();
	const { data: materials, isLoading: materialsLoading, isFetching: materialsFetching } = useMaterials();
	const [materialHolder, setMaterialHolder] = useState<{ id: string | null; qtde: number | null }>({ id: null, qtde: null });
	async function addMaterial({ id, qtde }: { id: string; qtde: number }) {
		// Checking for positive numbers only
		if (qtde <= 0) return toast.error("Por favor, preencha uma quantidade válida de retirada.");
		// Getting the equivalent material based on the id selected
		const equivalent = materials?.find((client) => client._id === id);
		if (!equivalent) return;
		const { nome, preco, grandeza, qtde: currentQty } = equivalent;
		// Validating if choosen qty exceeds the qty in stock
		if (qtde > currentQty) return toast.error(`Quantidade excede o estoque atual contabilizado de ${currentQty}`);

		// If validations were passed, handling the addition of the material to list

		const materialsList = [...formHolder.materiais];
		// Validating existence of material in the list already
		const materialInList = materialsList.find((mat) => mat.id === id);
		const materialInListIndex = materialsList.findIndex((obj) => !!obj.id && obj.id === id);
		// In case it isnt in the list, pushing it to the list holder
		if (!materialInList) materialsList.push({ id, nome, preco, grandeza: grandeza || "UN", qtdeRetirada: qtde, qtdeDevolucao: 0 });

		if (materialInListIndex !== -1) materialsList[materialInListIndex].qtdeRetirada += qtde;

		toast.success(`Material ${nome} adicionado com sucesso`);
		return setFormHolder((prev) => ({ ...prev, materiais: materialsList }));
	}
	async function removeMaterial({ id, index }: { id?: string | null; index: number }) {
		// Getting current list of materials in the holder
		const materialsList = [...formHolder.materiais];
		// Getting info from the removed material
		const materialRemoved = { ...materialsList[index] };
		// Removing material in the current list holder
		materialsList.splice(index, 1);

		return setFormHolder((prev) => ({ ...prev, materiais: materialsList }));
	}

	const isFormularyFinished = !!formHolder.dataEfetivacao;
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="MATERIAIS" sectionTitleIcon={<Package className="h-4 w-4 min-h-4 min-w-4" />}>
			{!isFormularyFinished ? (
				<div className="flex w-full flex-col gap-1 p-2 rounded-md border border-primary/20 bg-card">
					<h1 className="text-xs font-bold">MENU DE NOVOS MATERIAIS</h1>
					<div className="flex w-full items-center gap-2">
						<div className="w-full lg:w-3/4">
							<SelectVirtualizedInput
								label="MATERIAL"
								options={
									materials?.map((material) => ({
										id: material._id,
										label: `${material.nome} (${material.qtde} ${material.grandeza || "UN"} restantes)`,
										value: material._id,
									})) || []
								}
								value={materialHolder.id}
								handleChange={(value) => {
									setMaterialHolder((prev) => ({ ...prev, id: value }));
								}}
								selectedItemLabel="NÃO DEFINIDO"
								onReset={() => setMaterialHolder((prev) => ({ ...prev, id: null, qtde: null }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<NumberInput
								label="QUANTIDADE"
								placeholder="Preencha aqui a quantidade de saída..."
								value={materialHolder.qtde}
								handleChange={(value) => setMaterialHolder((prev) => ({ ...prev, qtde: value }))}
								width="100%"
							/>
						</div>
					</div>
					<div className="flex w-full items-center justify-end">
						<Button
							size={"sm"}
							variant={"ghost"}
							onClick={() => {
								// @ts-ignore
								addMaterial({ id: materialHolder.id, qtde: materialHolder.qtde });
							}}
							className="flex items-center gap-1"
						>
							<Plus className="h-4 w-4 min-h-4 min-w-4" />
							ADICIONAR MATERIAL
						</Button>
					</div>
				</div>
			) : null}

			{formHolder.materiais.length > 0 ? (
				<div className="flex w-full flex-col gap-1">
					<div className="bg-primary/80 text-primary-foreground flex w-full items-center gap-1">
						<h1 className="w-[40%] text-center font-bold">MATERIAL</h1>
						<h1 className="w-[30%] text-center font-bold">RETIRADO</h1>
						<h1 className="w-[30%] text-center font-bold">DEVOLVIDO</h1>
					</div>
					{formHolder.materiais.map((material, index) => (
						<MaterialListItem
							key={material.id}
							formularyId={formularyId}
							allowPostFinishEditing={allowPostFinishEditing}
							material={material}
							index={index}
							removeMaterial={({ id, index }) => removeMaterial({ id, index })}
							formHolder={formHolder}
							setFormHolder={setFormHolder}
							blockTakeAway={blockTakeAway}
							blockDevolution={blockDevolution}
						/>
					))}
				</div>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

export default MaterialsBlock;
