import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import Avatar from "@/components/utils/Avatar";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { updateMaterial } from "@/utils/methods/mutation/materials";
import type { TMaterialDTO } from "@/utils/schemas/materials";
import { units } from "@/utils/select-options";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";

function renderStatus({ qty, minQty, maxQty }: { qty: number; minQty: number; maxQty: number }) {
	if (qty < minQty)
		return <h1 className="min-w-fit rounded-full bg-red-600 px-2 py-1 text-[0.58rem] font-medium text-white lg:text-xs">ABAIXO DO MÍNIMO</h1>;

	if (maxQty && qty > maxQty)
		return <h1 className="min-w-fit rounded-full bg-red-600 px-2 py-1 text-[0.58rem] font-medium text-white lg:text-xs">ACIMA DO MÁXIMO</h1>;

	if (qty < 10)
		return <h1 className="min-w-fit rounded-full bg-orange-600 px-2 py-1 text-[0.58rem] font-medium text-white lg:text-xs">BAIXA QUANTIDADE</h1>;

	return null;
}
type MaterialBlockProps = {
	material: TMaterialDTO;
};
function MaterialBlock({ material }: MaterialBlockProps) {
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState(material);

	const { mutate: handleUpdateMaterial } = useMutationWithFeedback({
		mutationKey: ["edit-material", material._id],
		mutationFn: updateMaterial,
		queryClient: queryClient,
		affectedQueryKey: ["materials"],
		callbackFn: () => console.log(),
	});
	return (
		<div className="border-primary/20 flex w-full flex-col rounded-md border p-3">
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex w-full items-center justify-between gap-2">
					<h1 className="cursor-pointer text-xs leading-none font-black tracking-tight hover:text-cyan-500 lg:text-sm">{material.nome || "SEM NOME"}</h1>
				</div>
				{renderStatus({ qty: infoHolder.qtde, minQty: infoHolder.qtdeMinima || 0, maxQty: infoHolder.qtdeMaxima || 0 })}
			</div>
			<p className="text-primary/60 w-full text-start text-xs font-medium tracking-tight">{material.nomeTecnico || "NOME TÉCNICO NÃO DEFINIDO"}</p>
			<div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
				<div className="w-full lg:w-1/4">
					<TextInput
						label="NOME CONVECIONAL"
						placeholder="Preencha o nome do convencional do item..."
						labelClassName="font-sans text-xs text-primary text-start"
						value={infoHolder.nome || ""}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<SelectInput
						label="GRANDEZA"
						labelClassName="font-sans text-xs text-primary text-start"
						value={infoHolder.grandeza}
						options={units}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grandeza: value }))}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => setInfoHolder((prev) => ({ ...prev, grandeza: null }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<NumberInput
						label="QUANTIDADE"
						labelClassName="font-sans text-xs text-primary text-start"
						placeholder="Preencha aqui a quantidade do item..."
						value={infoHolder.qtde}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtde: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<NumberInput
						label="PREÇO UNITÁRIO"
						labelClassName="font-sans text-xs text-primary text-start"
						placeholder="Preencha aqui o preço do item..."
						value={infoHolder.preco}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, preco: value }))}
						width="100%"
					/>
				</div>
			</div>
			<div className="mt-2 flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
				<div className="w-full lg:w-1/4">
					<TextInput
						label="NOME TÉCNICO"
						placeholder="Preencha o nome do técnico do item..."
						labelClassName="font-sans text-xs text-primary text-start"
						value={infoHolder.nomeTecnico || ""}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeTecnico: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<TextInput
						label="LOCALIZAÇÃO"
						labelClassName="font-sans text-xs text-primary text-start"
						placeholder="Preencha aqui a localização do item..."
						value={infoHolder.localizacao || ""}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<NumberInput
						label="QUANTIDADE MÁXIMA"
						labelClassName="font-sans text-xs text-primary text-start"
						placeholder="Preencha aqui a quantidade máxima do item..."
						value={infoHolder.qtdeMaxima || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMaxima: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<NumberInput
						label="QUANTIDADE MÍNIMO"
						labelClassName="font-sans text-xs text-primary text-start"
						placeholder="Preencha aqui a quantidade mínima do item..."
						value={infoHolder.qtdeMinima || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeMinima: value }))}
						width="100%"
					/>
				</div>
			</div>

			<div className="mt-2 flex w-full items-center justify-end gap-4">
				{material.alteracao ? (
					<div className="flex items-center gap-2">
						<div className={"flex items-center gap-1"}>
							<BsCalendarPlus />
							<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(material.alteracao?.dataAlteracao, true) || "N/A"}</p>
						</div>
						<div className={"flex items-center gap-1"}>
							<Avatar url={material.alteracao.avatar_url || undefined} width={25} height={25} fallback={formatNameAsInitials(material.alteracao.nome)} />

							<p className="text-primary/60 text-xs font-medium">Atualizado por: {material.alteracao.nome}</p>
						</div>
					</div>
				) : null}
				<button
					type="button"
					// @ts-ignore
					onClick={() => handleUpdateMaterial({ id: material._id, changes: infoHolder })}
					className='enabled:hover:text-white" disabled:bg-primary/60 enabled:hover:bg-primary/80 rounded bg-gray-900 px-4 py-1 text-sm font-medium whitespace-nowrap text-white shadow-sm disabled:text-white'
				>
					SALVAR
				</button>
			</div>
		</div>
	);
}

export default MaterialBlock;
