import { TPropertyDTO } from "@/utils/schemas/properties";
import React from "react";
import { BsCode } from "react-icons/bs";

type PropertyCardProps = {
	property: TPropertyDTO;
	openModal: (id: string) => void;
};
function PropertyCard({ property, openModal }: PropertyCardProps) {
	return (
		<div className="flex w-full flex-col rounded-md border border-gray-300 p-4 lg:w-[450px]">
			<div className="flex w-full items-center justify-between gap-2">
				<h1 onClick={() => openModal(property._id)} className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm">
					{property.nome}
				</h1>
				<div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
					<h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{property.quantidade > 0 ? `${property.quantidade} ITENS` : `${property.quantidade} ITEM`}</h1>
				</div>
			</div>
			<div className="flex w-full flex-wrap items-center justify-between">
				<div className="flex items-center gap-1">
					<BsCode size={"20px"} color="rgb(31,41,55)" />
					<p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{property.identificador}</p>
				</div>
			</div>
			<h1 className="mt-1 text-[0.55rem] font-medium leading-none tracking-tight text-gray-500 lg:text-[0.65rem]">TAGS</h1>
			<div className="mt-1 flex w-full flex-wrap items-start justify-start gap-2">
				{property.tags.map((tag, index) => (
					<div key={index} className="flex items-center justify-center rounded-xl bg-[#15599a] px-2 py-1">
						<h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-white lg:text-xs">{tag}</h1>
					</div>
				))}
			</div>
			<h1 className="mt-1 text-[0.55rem] font-medium leading-none tracking-tight text-gray-500 lg:text-[0.65rem]">RESPONSÁVEIS</h1>
			<div className="mt-1 flex w-full flex-wrap items-start justify-start gap-2">
				{property.responsaveis.map((responsible, index) => (
					<div key={index} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-2 py-1">
						<h1 className="text-[0.65rem] font-bold uppercase leading-none tracking-tight text-black lg:text-xs">{responsible.nome}</h1>
						<h1 className="text-[0.65rem] font-black leading-none tracking-tight text-white lg:text-xs">{responsible.quantidade} ITENS</h1>
					</div>
				))}
			</div>
		</div>
	);
}

export default PropertyCard;
