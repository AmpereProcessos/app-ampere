import type { TPropertyDTO } from "@/utils/schemas/properties";
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
				<button type="button" onClick={() => openModal(property._id)} className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm">
					{property.nome}
				</button>
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
					<div key={tag} className="flex items-center justify-center rounded-xl bg-[#15599a] px-2 py-1">
						<h1 className="text-[0.65rem] font-bold leading-none tracking-tight text-white lg:text-xs">{tag}</h1>
					</div>
				))}
			</div>
		</div>
	);
}

export default PropertyCard;
