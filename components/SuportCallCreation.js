import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { cities } from "../utils/constants";
import axios from "axios";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  minWidth: "40%",
  height: "87%",
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
function CreateModal({ setModalIsOpen }) {
  const [callInfo, setCallInfo] = useState({
    clientName: "",
    nomeUsina: "",
    clientCity: cities[0].name,
    responsavel: "A DEFINIR",
    demanda: "INTERNA",
    problemType: "OUTROS",
    problemDesc: "",
  });
  const [message, setMessage] = useState("");
  function createCall() {
    axios.post("/api/calls/suporte/mainData", callInfo).then((res) => {
      setMessage("CHAMADO ABERTO");
      setCallInfo({
        clientName: "",
        nomeUsina: "",
        clientCity: cities[0].name,
        responsavel: "A DEFINIR",
        demanda: "INTERNA",
        problemType: "OUTROS",
        problemDesc: "",
      });
      console.log(res.data);
    });
  }
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6 uppercase font-bold">
                ABERTURA DE CHAMADO
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setMessage("");
                    setModalIsOpen(false);
                  }}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex flex-col overflow-y-auto">
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  Nome do cliente
                </span>
                <input
                  value={callInfo.clientName}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, clientName: e.target.value })
                  }
                  className="outline-none text-sm text-center grow placeholder:italic"
                  type="text"
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  Nome da usina
                </span>
                <input
                  value={callInfo.nomeUsina}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, nomeUsina: e.target.value })
                  }
                  className="outline-none text-sm text-center grow placeholder:italic"
                  type="text"
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">Cidade</span>
                <select
                  value={callInfo.clientCity}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, cidade: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  Responsável
                </span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, responsavel: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"GABRIEL MARTINS"}>GABRIEL MARTINS</option>
                  <option value={"LUCAS FERNANDES"}>LUCAS FERNANDES</option>
                  <option value={"LUIS EDUARDO"}>LUIS EDUARDO</option>
                </select>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">Demanda</span>
                <select
                  value={callInfo.demanda}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, demanda: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"INTERNA"}>INTERNA</option>
                  <option value={"EXTERNA"}>EXTERNA</option>
                </select>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  TIPO DE CHAMADO
                </span>
                <select
                  value={callInfo.problemType}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, problemType: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"CONTA DE LUZ ALTA"}>CONTA DE LUZ ALTA</option>
                  <option value={"APP OFFLINE"}>APP OFFLINE</option>
                  <option value={"INVERSOR NÃO CONFIGURADO"}>
                    INVERSOR NÃO CONFIGURADO
                  </option>
                  <option value={"SISTEMA SEM GERAÇÃO"}>
                    SISTEMA SEM GERAÇÃO
                  </option>
                  <option value={"ATUALIZAÇÃO DE FIRMWARE"}>
                    ATUALIZAÇÃO DE FIRMWARE
                  </option>
                  <option value={"PROBLEMA NO DISJUNTOR CA"}>
                    PROBLEMA NO DISJUNTOR CA
                  </option>
                  <option value={"GOTEIRA"}>GOTEIRA</option>
                  <option value={"MEDIDOR TRAVADO"}>MEDIDOR TRAVADO</option>
                  <option value={"ERRO DE LEITURA"}>ERRO DE LEITURA</option>
                  <option value={"RETRABALHO EM ESTRUTURA"}>
                    RETRABALHO EM ESTRUTURA
                  </option>
                  <option value={"PROBLEMA COM PLACA"}>
                    PROBLEMA COM PLACA
                  </option>
                  <option value={"PROBLEMA COM DATALOGGER/DTU"}>
                    PROBLEMA COM DATALOGGER/DTU
                  </option>
                  <option value={"DISTRIBUIÇÃO DE CRÉDITOS"}>
                    DISTRIBUIÇÃO DE CRÉDITOS
                  </option>
                  <option value={"SISTEMA COM BAIXA GERAÇÃO"}>
                    SISTEMA COM BAIXA GERAÇÃO
                  </option>
                  <option value={"INVERSOR/MICRO COM ERRO"}>
                    INVERSOR/MICRO COM ERRO
                  </option>
                  <option value={"MANUTENÇÃO PREVENTIVA"}>
                    MANUTENÇÃO PREVENTIVA
                  </option>
                  <option value={"OUTROS"}>OUTROS</option>
                </select>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  DESCRIÇÃO DO CHAMADO
                </span>
                <textarea
                  value={callInfo.problemDesc}
                  onChange={(e) =>
                    setCallInfo({
                      ...callInfo,
                      problemDesc: e.target.value,
                    })
                  }
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-200 min-h-[100px] h-fit text-center grow"
                />
              </div>
              <button
                onClick={createCall}
                className="bg-blue-600 mt-1 hover:text-white font-bold hover:bg-[#15599a] p-2"
              >
                CRIAR CHAMADO
              </button>
              {message && (
                <p className="text-green-400 text-center text-sm">{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateModal;
