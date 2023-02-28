import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { TbExternalLink, TbCheckbox } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import ModalBancoOS from "./ModalBancoOS";
import dayjs from "dayjs";
function OSBlock({
  order,
  clientName,
  index,
  open,
  categories,
  projectID,
  getOSS,
}) {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState();
  console.log(index);
  // Utils
  function validateVisibility({ categories, openOnly, closingDate }) {
    if (openOnly) {
      if (closingDate != undefined) return "hidden";
      else return "";
    } else if (categories.length > 0) {
      if (!categories.includes(order.categoria)) return "hidden";
      else return "";
    } else {
      return "";
    }
  }
  async function closeOS() {
    let { data } = await axios
      .post(`/api/projects/update/${projectID}`, {
        [`ordensDeServico.${index}.dataDeFechamento`]: new Date().toISOString(),
      })
      .catch((err) => alert("Houve um erro na comunicação com o servidor."));
    if (data) {
      setMsg({ text: "Alterações feitas", color: "text-green-500" });
      setTimeout(() => {
        getOSS();
      }, 1000);
    }
  }
  function handleOpenModal(order) {
    setModalInfo(order);
    setModalIsOpen(true);
  }
  return (
    <div className="flex flex-col">
      <div
        className={`grid items-center grid-cols-6  border-b border-gray-200 py-2 ${validateVisibility(
          {
            categories,
            open,
            closingDate: order.dataDeFechamento,
          }
        )}`}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-xs">EMISSOR</p>
          <p className="text-gray-700 text-xs font-bold uppercase">
            {order.usuarioEmissor}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-xs">CATEGORIA</p>
          <p className="text-gray-700 text-xs font-bold">{order.categoria}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-xs">SERVIÇO</p>
          <p className="text-gray-700 text-xs font-bold">
            {order.servicoExecutado}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Link href={`/ordemDeServico/pdf/${projectID}?index=${index}`}>
            <button className="p-1 rounded h-[30px] font-bold text-[#fead61] border border-[#fead61] hover:text-black hover:bg-[#fead61]">
              <TbExternalLink />
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          {order.dataDeFechamento ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-500 text-xs">DATA DE FECHAMENTO</p>
              <p className="text-gray-700 text-xs font-bold">
                {dayjs(order.dataDeFechamento)
                  .add(4, "hour")
                  .format("DD/MM/YYYY")}
              </p>
            </div>
          ) : (
            <button
              onClick={closeOS}
              className="p-1 rounded h-[30px] font-bold text-green-500 border border-green-500 hover:text-white hover:bg-green-500"
            >
              <TbCheckbox />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => handleOpenModal(order)}
            className="p-1 rounded h-[30px] font-bold text-[#15599a] border border-[#15599a] hover:text-white hover:bg-[#15599a]"
          >
            <FiEdit />
          </button>
        </div>
      </div>
      {msg.text && (
        <p className={`text-center italic text-xs ${msg.color}`}>{msg.text}</p>
      )}
      {modalIsOpen && (
        <ModalBancoOS
          info={modalInfo}
          index={index}
          clientName={clientName}
          projectID={projectID}
          setModalIsOpen={() => setModalIsOpen(false)}
        />
      )}
    </div>
  );
}

export default OSBlock;
