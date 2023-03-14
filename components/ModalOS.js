import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import ConferenciaManPreventivaOS from "./ConferenciaManPreventivaOS";
import ConferenciaMontagemOS from "./ConferenciaMontagemOS";
import ConferenciaOutrasCategorias from "./ConferenciaOutrasCategorias";
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
function ModalOS({ info, setModalIsOpen, getOSs }) {
  // const [holder, setHolder] = useState(info);
  // const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function saveChanges(changes) {
    try {
      let { data, statusCode } = await axios.post(
        `/api/projects/update/${info.id}`,
        changes
      );
      setMsg({ text: "Ordem de serviço finalizada.", color: "text-green-500" });
      getOSs();
      return { success: true };
    } catch (error) {
      setMsg({
        text: "Erro ao finalizar baixa na OS. Por favor, tente novamente.",
        color: "text-red-500",
      });
      return { success: false };
    }
  }
  console.log(info);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] p-0 lg:pl-6 text-center font-bold">
                {info.nomeDoContrato}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-r border-gray-300 p-3">
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  CATEGORIA
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.categoria}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  SERVIÇO
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.servicoExecutado}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  ABERTURA
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.dataDeAbertura
                    ? dayjs(info.dataDeAbertura)
                        .add(4, "hours")
                        .format("DD/MM/YYYY")
                    : "-"}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  CIDADE
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.cidade}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  BAIRRO
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.bairro}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  LOGRADOURO
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.logradouro}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  NÚMERO DA RESIDÊNCIA
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.numeroResidencia}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  TOPOLOGIA
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.topologia}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  QUANTIDADE DE MÓDULOS
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.qtdeModulos}
                </h1>
              </div>
              <div className="grid grid-cols-3 items-center shadow-sm p-2">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                  POTÊNCIA DOS MÓDULOS
                </h1>
                <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                  {info.potModulos} W
                </h1>
              </div>
              {info.categoria == "MANUTENÇÃO PREVENTIVA" && (
                <>
                  <div className="grid grid-cols-3 items-center shadow-sm p-2">
                    <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                      INVERSOR
                    </h1>
                    <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                      {info.inversor ? info.inversor : "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-3 items-center shadow-sm p-2">
                    <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                      SENHA DO WI-FI
                    </h1>
                    <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                      {info.senhaDoWifi ? info.senhaDoWifi : "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-3 items-center shadow-sm p-2">
                    <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                      PONTO DE ÁGUA
                    </h1>
                    <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                      {info.pontoDeAgua ? info.pontoDeAgua : "-"}
                    </h1>
                  </div>
                  <div className="grid grid-cols-3 items-center shadow-sm p-2">
                    <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
                      CONFIGURAR ?
                    </h1>
                    <h1 className="font-bold text-center col-span-2 text-xs lg:text-base">
                      {info.configurar ? "SIM" : "NÃO"}
                    </h1>
                  </div>
                </>
              )}

              <div className="flex flex-col items-center shadow-sm p-2 ">
                <h1 className="font-bold text-center md:text-start text-[#15599a] text-xs">
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
                  info={info}
                  cliente={info.cliente}
                  index={info.index}
                  saveChanges={saveChanges}
                />
              )}
              {info.categoria == "MANUTENÇÃO PREVENTIVA" && (
                <ConferenciaManPreventivaOS
                  info={info}
                  cliente={info.cliente}
                  index={info.index}
                  saveChanges={saveChanges}
                />
              )}
              {info.categoria == "MONTAGEM" && (
                <ConferenciaMontagemOS
                  info={info}
                  cliente={info.cliente}
                  index={info.index}
                  saveChanges={saveChanges}
                  getOSs={getOSs}
                />
              )}
              {!["MONTAGEM", "MANUTENÇÃO PREVENTIVA", "PADRÃO"].includes(
                info.categoria
              ) ? (
                <ConferenciaOutrasCategorias
                  saveChanges={saveChanges}
                  index={info.index}
                />
              ) : null}
              {msg.text ? (
                <div className={`text-center italic ${msg.color} text-sm`}>
                  {msg.text}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalOS;
