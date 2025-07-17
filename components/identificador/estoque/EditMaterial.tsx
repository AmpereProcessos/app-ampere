import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createMaterial, updateMaterial } from "@/utils/methods/mutation/materials";
import { useMaterialById } from "@/utils/methods/query/materials";
import { TMaterial, TMaterialDTO } from "@/utils/schemas/materials";
import { units } from "@/utils/select-options";
import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useQueryClient } from "@tanstack/react-query";
import UpdateRegistries from "./UpdateRegistriesBlock";

type EditMaterialProps = {
	materialId: string;
	closeModal: () => void;
};
function EditMaterial({ materialId, closeModal }: EditMaterialProps) {
	const queryClient = useQueryClient();
	const { data: material } = useMaterialById({ id: materialId });
	const [infoHolder, setInfoHolder] = useState<TMaterialDTO>({
		_id: "holder",
		nome: "",
		nomeTecnico: "",
		preco: 0,
		qtde: 0,
		dataInsercao: new Date().toISOString(),
	});

	const { mutate: handleMaterialUpdate, isPending } = useMutationWithFeedback({
		mutationKey: ["update-material", materialId],
		mutationFn: updateMaterial,
		queryClient: queryClient,
		affectedQueryKey: ["materials"],
		callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ["material-update-registries", materialId] }),
	});

	useEffect(() => {
		if (material) setInfoHolder(material);
	}, [material]);
	return (
		<div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<div className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%]  translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:h-[60%] lg:w-[60%]">
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg lg:flex-row">
						<div className="flex flex-col">
							<h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR MATERIAL</h3>
							<p className="text-[0.65rem] italic text-gray-500">#{materialId}</p>
						</div>
						<button onClick={() => closeModal()} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					<div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<TextInput
									label={"NOME DO MATERIAL"}
									value={infoHolder.nome}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
									placeholder="Preencha o nome do material..."
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									label={"NOME TÉCNICO DO MATERIAL"}
									value={infoHolder.nomeTecnico || ""}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeTecnico: value }))}
									placeholder="Preencha o nome técnico do material..."
									width="100%"
								/>
							</div>
						</div>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<NumberInput
									label={"PREÇO UNITÁRIO DO ITEM"}
									value={infoHolder.preco}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, preco: value }))}
									placeholder="Preencha o preço unitário do material..."
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<NumberInput
									label={"QUANTIDADE DO ITEM"}
									value={infoHolder.qtde}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtde: value }))}
									placeholder="Preencha o preço unitário do material..."
									width="100%"
								/>
							</div>
						</div>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<SelectInput
									label={"GRANDEZA"}
									value={infoHolder.grandeza}
									options={units}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grandeza: value }))}
									selectedItemLabel="NÃO DEFINIDO"
									onReset={() => setInfoHolder((prev) => ({ ...prev, grandeza: null }))}
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									label={"LOCALIZAÇÃO DO MATERIAL"}
									value={infoHolder.localizacao || ""}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: value }))}
									placeholder="Preencha a localização do material..."
									width="100%"
								/>
							</div>
						</div>
						<h1 className="my-2 w-full text-center text-sm leading-none tracking-tight">INFORMAÇÕES DE CONTROLE DE QUANTIDADE</h1>
						<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<NumberInput
									label={"QUANTIDADE MÁXIMA"}
									value={infoHolder.qtdeMaxima || null}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMaxima: value }))}
									placeholder="Preencha a quantidade máxima do material..."
									width="100%"
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<NumberInput
									label={"QUANTIDADE MÍNIMA"}
									value={infoHolder.qtdeMinima || null}
									handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMinima: value }))}
									placeholder="Preencha a quantidade mínima do material..."
									width="100%"
								/>
							</div>
						</div>
						<div className="flex w-full flex-col">
							<h1 className="w-full rounded-tr-sm rounded-tl-sm bg-gray-500 p-1 text-center font-bold text-white">COMENTÁRIOS DO REQUERENTE</h1>
							<textarea
								placeholder="SEM COMENTÁRIOS PREENCHIDOS..."
								value={infoHolder.anotacoes || ""}
								readOnly={true}
								onChange={(e) => {
									setInfoHolder((prev) => ({
										...prev,
										anotacoes: e.target.value,
									}));
								}}
								className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
							/>
						</div>
						<UpdateRegistries materialId={materialId} />
					</div>
					<div className="my-1 flex w-full items-center justify-end">
						<button
							disabled={isPending}
							// @ts-ignore
							onClick={() => handleMaterialUpdate({ id: materialId, changes: infoHolder })}
							className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
						>
							ATUALIZAR MATERIAL
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditMaterial;
