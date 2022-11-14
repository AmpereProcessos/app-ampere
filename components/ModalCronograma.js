import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { equipesTecnicas } from "../utils/constants";
import axios from "axios";
import Link from "next/link";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "30%",
  height: "60%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
const statusStyles = {
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  "AGUARDANDO VENDEDOR": {
    textColor: "text-orange-400",
    borderColor: "border-orange-400",
  },
  REALIZADO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
};
function ModalCronograma({ setModalIsOpen, info }) {
  const [equipe, setEquipe] = useState(info.equipe);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  console.log(info);
  function handleEquipeChange(value) {
    setEquipe(value);
    axios
      .post(`/api/projects/update/${info.id}`, {
        [`ordensDeServico.${info.index}.equipe`]: value,
      })
      .then((res) =>
        setMsg({ text: "Alterações feitas", color: "text-green-500" })
      )
      .catch((res) =>
        setMsg({ text: "Ocorreu um erro.", color: "text-red-500" })
      );
  }
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] font-bold">
                {info.nomeDoContrato} ({info.qtde})
              </h1>
              {msg.text && <p className={`text-xs ${msg.color}`}>{msg.text}</p>}
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col grow gap-y-2 py-2 overflow-y-auto overscroll-y-auto">
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  CATEGORIA
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.categoria}
                </p>
              </div>
              <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  SERVIÇO EXECUTADO
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.servicoExecutado}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  CIDADE
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.cidade}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  BAIRRO
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.bairro}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  LOGRAOURO
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.logradouro}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  Nº
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.numeroResidencia}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  EQUIPE RESPONSÁVEL
                </p>
                <select
                  value={equipe}
                  onChange={(e) => handleEquipeChange(e.target.value)}
                  className="outline-none text-xs text-gray-600"
                >
                  {equipesTecnicas.map((equipe) => (
                    <option value={equipe.value}>{equipe.label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  NºMÓDULOS
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.qtdeModulos}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  TOPOLOGIA
                </p>
                <p className="text-xs text-center text-gray-600">
                  {info.topologia}
                </p>
              </div>
              <div className="mt-4 flex flex-col justify-center items-center gap-2">
                <p className="text-xs text-center text-[#15599a] font-bold">
                  ORDEM DE SERVIÇO
                </p>
                <Link
                  href={`/ordemDeServico/pdf/${info.id}?index=${info.index}`}
                >
                  <div className="p-2 cursor-pointer w-fit bg-[#fead61] rounded font-bold">
                    VER OS
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCronograma;
