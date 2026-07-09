import React from "react";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { MdCategory, MdOutlineAddCircle } from "react-icons/md";
import { formatToMoney } from "../../../utils/constants";

function ApportionmentItem({ apportionment, openEditModal }) {
  return (
    <div className="border-border flex w-full flex-col rounded border p-2">
      <h1 className="text-center font-bold">{apportionment.nome}</h1>

      <div className="mt-2 flex w-full">
        <div className="flex w-1/3 items-center justify-start gap-1">
          <BsFillPiggyBankFill color="#15599a" />
          <p className="font-raleway text-foreground text-xs font-light tracking-tight">
            {apportionment.orcamento ? formatToMoney(apportionment.orcamento) : "N/A"}
          </p>
        </div>
        <div className="flex w-1/3 items-center justify-center gap-1">
          <MdCategory color="#15599a" />
          <p className="font-raleway text-foreground text-xs font-light tracking-tight">
            {apportionment.categorias ? apportionment.categorias.length : `0`} CATEGORIAS
          </p>
        </div>
        <div className="flex w-1/3 items-center justify-end gap-1">
          <button
            onClick={() => openEditModal(apportionment._id)}
            className="flex w-fit items-center justify-center gap-1 rounded border border-[#fead41] p-1 text-[#fead41] duration-300 ease-in-out hover:bg-[#fead41] hover:text-white"
          >
            <AiFillEdit />
            <p className="font-raleway text-xs font-light tracking-tight">EDITAR</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApportionmentItem;
