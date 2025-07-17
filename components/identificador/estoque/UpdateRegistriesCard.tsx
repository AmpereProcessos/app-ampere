import Avatar from "@/components/utils/Avatar";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { TMaterialUpdateRegistryDTO } from "@/utils/schemas/material-updates-registry";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsCalendarPlus, BsCartPlusFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";
import { ImArrowDown, ImArrowUp } from "react-icons/im";

type UpdateRegistriesCardProps = {
	registry: TMaterialUpdateRegistryDTO;
	showMaterialName?: boolean;
};
function UpdateRegistriesCard({ registry, showMaterialName = false }: UpdateRegistriesCardProps) {
	return (
		<div className="flex w-full flex-col rounded-md border border-gray-300 p-4 lg:w-[300px]">
			<div className="flex w-full items-center justify-between gap-2">
				<h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">{registry.tipo}</h1>
				<div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 text-white">
					{registry.tipo == "ENTRADA" ? <BsCartPlusFill size={12} /> : null}
					{registry.tipo == "RETIRADA" ? <ImArrowUp size={12} /> : null}
					{registry.tipo == "DEVOLUÇÃO" ? <ImArrowDown size={12} /> : null}
					{registry.tipo == "ALTERAÇÃO MANUAL" ? <AiFillEdit size={12} /> : null}
				</div>
			</div>
			{showMaterialName ? <h1 className="my-2 w-full text-center text-[0.65rem] font-medium tracking-tight text-blue-500">{registry.material.nome}</h1> : null}
			{(registry.qtdeAnterior && registry.qtdeNovo) || registry.alteracao ? (
				<div className="flex w-full flex-col">
					<h1 className="text-start text-[0.6rem] tracking-tight text-gray-500">ALTERAÇÃO DE QUANTIDADE</h1>
					<div className="flex w-full items-center gap-2">
						{registry.qtdeAnterior && registry.qtdeNovo ? (
							<>
								<h1 className="w-1/3 text-end text-lg text-gray-600">{formatDecimalPlaces(registry.qtdeAnterior)}</h1>
								<div className="flex w-1/3 items-center justify-center">
									<FaLongArrowAltRight />
								</div>
								<h1 className="w-1/3 text-start text-lg text-gray-600">{formatDecimalPlaces(registry.qtdeNovo)}</h1>
							</>
						) : (
							<div className="flex w-full items-center justify-center">{formatDecimalPlaces(registry.alteracao)}</div>
						)}
					</div>
				</div>
			) : null}
			{registry.precoAnterior && registry.precoNovo ? (
				<div className="flex w-full flex-col">
					<h1 className="text-start text-[0.6rem] tracking-tight text-gray-500">ALTERAÇÃO DE PREÇO</h1>
					<div className="flex w-full items-center gap-2">
						<h1 className="w-1/3 text-end text-lg text-gray-600">{formatToMoney(registry.precoAnterior)}</h1>
						<div className="flex w-1/3 items-center justify-center">
							<FaLongArrowAltRight />
						</div>
						<h1 className="w-1/3 text-start text-lg text-gray-600">{formatToMoney(registry.precoNovo)}</h1>
					</div>
				</div>
			) : null}
			<div className="mt-2 flex w-full items-center justify-between">
				<div className={`flex items-center gap-2`}>
					<BsCalendarPlus />
					<p className="text-xs font-medium text-gray-500">{formatDateAsLocale(registry.dataInsercao, true)}</p>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Avatar fallback={"U"} height={25} width={25} url={registry.autor?.avatar_url || undefined} />
					<p className="text-xs font-medium text-gray-500">{registry.autor?.nome}</p>
				</div>
			</div>
		</div>
	);
}

export default UpdateRegistriesCard;
