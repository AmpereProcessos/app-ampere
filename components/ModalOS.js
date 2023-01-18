import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import ConferenciaPadraoOS from "./ConferenciaPadraoOS";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "93%",
  height: "98%",
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
function ModalOS({ info, setModalIsOpen }) {
  // const [holder, setHolder] = useState(info);
  // const [changes, setChanges] = useState({});
  function saveChanges(changes) {
    console.log(changes);
    axios
      .post(`/api/projects/update/${info.id}`, changes)
      .then((res) => {
        alert("OS finalizada com sucesso!");
        location.reload();
      })
      .catch((err) =>
        alert("Erro ao finalizar baixa na OS. Por favor, tente novamente.")
      );
  }
  console.log(info);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 text-center font-bold">
                {info.nomeDoContrato}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300">
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  CATEGORIA
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.categoria}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  SERVIÇO
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.servicoExecutado}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  ABERTURA
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.dataDeAbertura
                    ? dayjs(info.dataDeAbertura)
                        .add(4, "hours")
                        .format("DD/MM/YYYY")
                    : "-"}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  CIDADE
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.cidade}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  BAIRRO
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.bairro}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  LOGRADOURO
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.logradouro}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  NÚMERO DA RESIDÊNCIA
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.numeroResidencia}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  TOPOLOGIA
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.topologia}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  QUANTIDADE DE MÓDULOS
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.qtdeModulos}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center border border-gray-200 p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  POTÊNCIA DOS MÓDULOS
                </h1>
                <h1 className="font-bold text-center col-span-2">
                  {info.potModulos} W
                </h1>
              </div>
              <div className="flex flex-col items-center border border-gray-200 p-2 ">
                <h1 className="font-bold text-center md:text-start text-[#15599a]">
                  OBSERVAÇÕES DA OS
                </h1>
                <div className="flex flex-col justify-center border border-gray-600 bg-gray-100 h-[300px] w-full lg:w-[600px] items-center overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {info.observacoes ? (
                    <div className={`text-xs px-2 my-2 font-bold text-center`}>
                      {info.observacoes
                        ? info.observacoes
                            .split("/")
                            .map((string, index) => (
                              <li key={index}>{string}</li>
                            ))
                        : false}
                    </div>
                  ) : (
                    <p className="my-2">SEM OBSERVAÇÕES DE OS</p>
                  )}
                </div>
              </div>
              {info.categoria == "PADRÃO" && (
                <ConferenciaPadraoOS
                  conferencias={info.conferencias}
                  cliente={info.cliente}
                  index={info.index}
                  saveChanges={saveChanges}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalOS;
