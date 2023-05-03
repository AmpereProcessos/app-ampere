import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaCity, FaUser } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi";
import { IoIosSend } from "react-icons/io";
import { MdAttachMoney, MdOutlineCategory } from "react-icons/md";
import ListLeadCard from "./ListLeadCard";
import axios from "axios";

function ListLeads({ leads, title, listId, fetchLeads }) {
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [searchPropostas, setSearch] = useState("");
  async function handleDrop(itemId, listId) {
    console.log(itemId, listId);

    try {
      await axios.put("/api/insideSales", {
        id: itemId,
        changes: {
          estagioFunil: listId,
        },
      });
      fetchLeads();
    } catch (error) {
      alert(
        "Erro ao atualizar estágio do lead. Por favor, tente novamente mais tarde."
      );
    }
  }

  function handleSearchFilter(value) {
    setSearch(value);
    if (value != "" || value != " ") {
      let newArr = leads.filter((lead) =>
        lead.nome.toUpperCase().includes(value.toUpperCase())
      );
      console.log(newArr);
      setFilteredLeads(newArr);
    } else {
      setFilteredLeads(leads);
    }
  }
  async function moveStage() {}
  const [, dropRef] = useDrop({
    accept: "CARD",

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId);
    },
  });
  useEffect(() => {
    setFilteredLeads(leads);
  }, [leads]);
  return (
    <div
      ref={dropRef}
      id={listId}
      className="flex flex-col min-w-[400px] w-[400px]  max-h-[750px] py-2 items-center pt-2 px-1 grow bg-white h-full rounded border border-gray-200 shadow-lg"
    >
      <div className="border-b pb-2 h-fit w-full text-center border-blue-300 text-xl font-bold">
        <h1>{title}</h1>
        <div className="flex justify-center gap-x-2">
          <p className="text-xs text-gray-500">
            {filteredLeads.length} lead(s)
          </p>
          {/* <p className="text-xs text-gray-500">
            {getListCumulativePeakPot()} kWp
          </p> */}
        </div>
        <input
          value={searchPropostas}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className={
            "outline-none border border-gray-200 p-1 w-full mt-2 text-sm text-gray-600 text-center font-semibold"
          }
          placeholder={"Digite aqui o nome da proposta..."}
        />
      </div>
      <div className="flex gap-2 flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-2 w-full min-h-[450px]">
        {filteredLeads &&
          filteredLeads?.map((lead, index) => (
            <ListLeadCard key={lead._id} lead={lead} fetchLeads={fetchLeads} />
          ))}
      </div>
    </div>
  );
}

export default ListLeads;
