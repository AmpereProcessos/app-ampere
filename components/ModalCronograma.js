import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
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
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] font-bold">
                {info.nomeDoContrato} ({info.qtde})
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col h-full justify-around">
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-md text-center text-[#15599a] font-bold">
                  CIDADE
                </p>
                <p className="text-md text-center text-gray-600">
                  {info.cidade}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-md text-center text-[#15599a] font-bold">
                  BAIRRO
                </p>
                <p className="text-md text-center text-gray-600">
                  {info.bairro}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-md text-center text-[#15599a] font-bold">
                  LOGRAOURO
                </p>
                <p className="text-md text-center text-gray-600">
                  {info.logradouro}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-md text-center text-[#15599a] font-bold">
                  Nº
                </p>
                <p className="text-md text-center text-gray-600">
                  {info.numeroResidencia}
                </p>
              </div>
              <div className="mt-4 grid grid-rows-2 grid-cols-1  lg:grid-cols-2 md:grid-rows-1">
                <p className="text-md text-center text-[#15599a] font-bold">
                  EQUIPE RESPONSÁVEL
                </p>
                <p className="text-md text-center text-gray-600">
                  {info.equipe}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalCronograma;
