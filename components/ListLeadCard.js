import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaCity, FaHandshake, FaUser, FaUserTie } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { CgCode } from "react-icons/cg";
import { MdAttachMoney, MdOutlineCategory } from "react-icons/md";
import { RiUser2Fill } from "react-icons/ri";
import { VscChromeClose } from "react-icons/vsc";

function ListLeadCard({ lead, fetchLeads }) {
  const [loseLeadInfo, setLoseLeadInfo] = useState({
    open: false,
    justification: "",
    msg: "",
    msgColor: "",
  });
  const [{ isDragging, targetId }, dragRef] = useDrag({
    type: "CARD",
    item: { id: lead._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      targetId: monitor.getTargetIds(),
    }),
  });

  async function moveStage(listId) {
    try {
      await axios.put("/api/insideSales", {
        id: lead._id,
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
  async function setAsLost(leadId) {
    if (loseLeadInfo.justification.trim().length < 5) {
      setLoseLeadInfo((prev) => ({
        ...prev,
        msg: "Por favor, preencha o motido da perda do lead.",
        msgColor: "text-red-500",
      }));
      return false;
    }
    try {
      await axios.put("/api/insideSales", {
        id: leadId,
        changes: {
          perdido: true,
          motivoPerda: loseLeadInfo.justification.toUpperCase(),
        },
      });
      setLoseLeadInfo((prev) => ({
        ...prev,
        msg: "Lead marcado como perdido.",
        msgColor: "text-green-500",
      }));
      setTimeout(() => {
        setLoseLeadInfo({
          open: false,
          justification: "",
          msg: "",
          msgColor: "",
        });
        fetchLeads();
      }, 2000);
    } catch (error) {
      alert("Erro ao atualizar lead. Por favor, tente novamente mais tarde.");
    }
  }
  const conditionalProp = { ref: dragRef };

  return (
    <div
      {...conditionalProp}
      key={lead._id}
      className={`flex gap-3 flex-col p-3 w-full min-h-[190px] h-[190px] ${
        lead.perdido ? "bg-red-100" : "bg-[#fff]"
      } border border-gray-200 shadow-md`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-start gap-1 text-gray-700 text-xs grow">
          <CgCode style={{ color: "#003d5b", fontSize: "20px" }} />
          <h1 className="font-medium">{lead.codigoSVB}</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-700 text-xs grow-2">
          <FaUserTie style={{ color: "#003d5b", fontSize: "20px" }} />
          <h1 className="font-medium">{lead.vendedor}</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <HiIdentification style={{ color: "#15599a" }} />
          <h1 className="font-medium text-xs">{lead.nome}</h1>
        </div>
        <div className="flex gap-2 items-center">
          {lead.contratoSolicitado ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <BsPatchCheckFill />
            </div>
          ) : null}
          {lead.contratoAssinado ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <FaHandshake style={{ fontSize: "20px" }} />
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <FaCity style={{ color: "#fead61" }} />
          <h1 className="font-medium text-xs">{lead.cidade}</h1>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <FaUser style={{ color: "#003d5b" }} />
          <h1 className="font-medium text-xs">{lead.responsavel}</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <IoIosSend style={{ color: "#16B010" }} />
          <h1 className="font-medium text-xs">
            {lead.dataDeEnvio
              ? dayjs(lead.dataDeEnvio).add(4, "hour").format("DD/MM/YYYY")
              : "-"}
          </h1>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start text-gray-700">
          <h1 className="text-xxs font-medium">CONSUMO</h1>
          <h1 className="font-medium text-xs">
            R${" "}
            {lead.consumo
              ? Number(lead.consumo).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })
              : "-"}
          </h1>
        </div>
        <div className="flex flex-col items-end text-gray-700">
          <h1 className="text-xxs font-medium">NICHO</h1>
          <h1 className="font-medium text-xs">
            {lead.nicho ? lead.nicho : "-"}
          </h1>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 items-center  px-0 lg:px-4">
        {lead.estagioFunil > 1 ? (
          <div
            onClick={() => moveStage(lead.estagioFunil - 1)}
            className="flex items-center justify-start cursor-pointer"
          >
            <AiOutlineArrowLeft />
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex items-start justify-center relative">
          {!lead.perdido ? (
            loseLeadInfo.open ? (
              <div className="p-2 absolute w-[200%] h-[150px] bg-[#fff] shadow-lg border border-gray-200 flex flex-col">
                <div className="w-full flex items-center justify-between text-xs border-b border-gray-200 pb-1">
                  <h1 className="font-medium">PERDA DE LEAD</h1>
                  <button>
                    <VscChromeClose
                      onClick={() =>
                        setLoseLeadInfo((prev) => ({ ...prev, open: false }))
                      }
                      style={{ color: "red" }}
                    />
                  </button>
                </div>
                <textarea
                  value={loseLeadInfo.justification}
                  onChange={(e) =>
                    setLoseLeadInfo((prev) => ({
                      ...prev,
                      justification: e.target.value,
                    }))
                  }
                  placeholder="Motivo da perda do lead, ex: cliente optou por outra empresa, o preço estava alto, etc..."
                  className="grow text-xs w-full bg-gray-100 resize-none outline-none p-1"
                />
                <div className="w-full flex items-center justify-between mt-1">
                  {loseLeadInfo.msg ? (
                    <p className={`text-xs ${loseLeadInfo.msgColor} italic`}>
                      {loseLeadInfo.msg}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <button
                    onClick={() => setAsLost(lead._id)}
                    className="bg-red-300 text-xs text-white hover:bg-red-500 font-medium p-1 rounded"
                  >
                    PERDER
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() =>
                  setLoseLeadInfo((prev) => ({ ...prev, open: true }))
                }
                className="flex items-center gap-1 p-1 cursor-pointer rounded border border-red-300 text-red-300 hover:border-red-500 hover:text-red-500 hover:scale-105 duration-300"
              >
                <p className="text-xs">PERDER</p>
                <IoMdClose />
              </div>
            )
          ) : (
            <div>
              <p className="text-xs text-red-500">PERDIDO</p>
            </div>
          )}
        </div>
        {lead.estagioFunil < 3 || !lead.estagioFunil ? (
          <div
            onClick={() =>
              moveStage(lead.estagioFunil ? lead.estagioFunil + 1 : 2)
            }
            className="flex items-center justify-end cursor-pointer"
          >
            <AiOutlineArrowRight />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default ListLeadCard;
