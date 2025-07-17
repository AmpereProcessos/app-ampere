import React from "react";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { MdCategory, MdOutlineAddCircle } from "react-icons/md";
import { formatToMoney } from "../../../utils/constants";

function ApportionmentItem({ apportionment, openEditModal }) {
	return (
		<div className="p-2 rounded border border-gray-300 flex flex-col w-full">
			<h1 className="text-center font-bold">{apportionment.nome}</h1>

			<div className="flex w-full  mt-2">
				<div className="flex items-center justify-start gap-1 w-1/3">
					<BsFillPiggyBankFill color="#15599a" />
					<p className="text-gray-500 font-raleway text-xs font-light tracking-tight">{apportionment.orcamento ? formatToMoney(apportionment.orcamento) : "N/A"}</p>
				</div>
				<div className="flex items-center justify-center gap-1 w-1/3">
					<MdCategory color="#15599a" />
					<p className="text-gray-500 font-raleway text-xs font-light tracking-tight">{apportionment.categorias ? apportionment.categorias.length : `0`} CATEGORIAS</p>
				</div>
				<div className="flex items-center  gap-1 w-1/3 justify-end">
					<button
						onClick={() => openEditModal(apportionment._id)}
						className="flex items-center justify-center gap-1  border border-[#fead41] text-[#fead41] hover:bg-[#fead41] hover:text-white duration-300 ease-in-out rounded p-1 w-fit"
					>
						<AiFillEdit />
						<p className="font-raleway font-light text-xs tracking-tight">EDITAR</p>
					</button>
				</div>
			</div>
		</div>
	);
}

export default ApportionmentItem;
