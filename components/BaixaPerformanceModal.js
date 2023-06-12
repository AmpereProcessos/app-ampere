import React, { useState, useEffect } from "react";
import Select from "react-select";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "30%",
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
  PENDENTE: {
    textColor: "text-red-400",
    borderColor: "border-red-400",
  },
  "EM ANDAMENTO": {
    textColor: "text-[#15599a]",
    borderColor: "border-[#15599a]",
  },
  RESOLVIDO: {
    textColor: "text-green-400",
    borderColor: "border-green-400",
  },
};
function BaixaPerformanceModal({ info, setModalIsOpen, handleUpdates }) {
  const [infoHolder, setInfo] = useState(info);
  const [clientes, setClientes] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "" });
  function getClients() {
    axios.get("/api/projects/todos").then((res) => setClientes(res.data));
  }
  function saveChanges() {
    axios.put("/api/o&m/monitoramento", infoHolder).then((res) => {
      setMsg({ text: "Alterações feitas!", color: "text-green-500" });
      handleUpdates();
    });
  }
  function closeCall() {
    setInfo({ ...infoHolder, status: "RESOLVIDO" });
    axios
      .put("/api/o&m/monitoramento", {
        ...infoHolder,
        fechamento: new Date(),
        status: "RESOLVIDO",
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas!", color: "text-green-500" });
        handleUpdates();
      });
  }
  function createCall() {
    axios
      .post("/api/o&m/monitoramento", {
        ...infoHolder,
        status: "PENDENTE",
        abertura: new Date(),
      })
      .then((res) => {
        setMsg({ text: "Chamado criado!", color: "text-green-500" });
        handleUpdates();
      });
  }
  useEffect(() => {
    getClients();
  }, []);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {info.nomeUsina}
              </h1>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap my-2">
              {infoHolder.created ? (
                infoHolder.status == "RESOLVIDO" ? (
                  <h1
                    className={`p-2 rounded   text-xs border border-green-400 text-green-400 font-bold`}
                  >
                    RESOLVIDO
                  </h1>
                ) : (
                  <>
                    <h1
                      onClick={() =>
                        setInfo({ ...infoHolder, status: "PENDENTE" })
                      }
                      className={`p-2 rounded cursor-pointer transition duration-300 ease-in-out hover:scale-105 text-xs border border-red-400 text-red-400 font-bold ${
                        infoHolder.status == "PENDENTE" ? "" : "opacity-30"
                      }`}
                    >
                      PENDENTE
                    </h1>
                    <h1
                      onClick={() =>
                        setInfo({ ...infoHolder, status: "EM ANDAMENTO" })
                      }
                      className={`p-2 rounded cursor-pointer transition duration-300 ease-in-out hover:scale-105 text-xs border border-[#15599a] text-[#15599a] font-bold ${
                        infoHolder.status == "EM ANDAMENTO" ? "" : "opacity-30"
                      }`}
                    >
                      EM ANDAMENTO
                    </h1>
                    <h1
                      onClick={() =>
                        setInfo({ ...infoHolder, status: "EXECUTADO" })
                      }
                      className={`p-2 rounded cursor-pointer transition duration-300 ease-in-out hover:scale-105 text-xs border border-yellow-500 text-yellow-500 font-bold ${
                        infoHolder.status == "EXECUTADO" ? "" : "opacity-30"
                      }`}
                    >
                      EXECUTADO
                    </h1>
                  </>
                )
              ) : (
                false
              )}
            </div>
            <div className="flex flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  Nome do cliente
                </span>
                <div className={"grow"}>
                  {!info.created ? (
                    <Select
                      isMulti={false}
                      placeholder="NOME DO CLIENTE"
                      onChange={(e) =>
                        setInfo({
                          ...infoHolder,
                          idPai: e.value.id,
                          nomeCliente: e.value.nome,
                          cidade: e.value.cidade,
                          codProjeto: e.value.codProjeto,
                        })
                      }
                      options={clientes.map((cliente) => {
                        return {
                          label: cliente.nomeDoContrato,
                          value: {
                            id: cliente._id,
                            nome: cliente.nomeDoContrato,
                            cidade: cliente.cidade,
                            codProjeto: cliente.qtde,
                          },
                        };
                      })}
                    />
                  ) : (
                    <p className="text-gray-700 uppercase text-center">
                      {info.nomeCliente}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  CÓDIGO DO PROJETO
                </span>
                <p className="text-sm text-center grow">
                  {infoHolder.codProjeto ? infoHolder.codProjeto : "-"}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center font-bold">PROBLEMA</span>
                <select
                  value={
                    infoHolder.problema ? infoHolder.problema : "NÃO DEFINIDO"
                  }
                  onChange={(e) =>
                    setInfo({ ...infoHolder, problema: e.target.value })
                  }
                  className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
                >
                  <option value={"PLANO EXPIRADO"}>PLANO EXPIRADO</option>
                  <option value={"PROBLEMA COM GERAÇÃO"}>
                    PROBLEMA COM GERAÇÃO
                  </option>
                  <option value={"PROBLEMA COM CONEXÃO"}>
                    PROBLEMA COM CONEXÃO
                  </option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="font-bold text-center font-raleway">
                  OBSERVAÇÕES
                </span>
                <textarea
                  value={infoHolder.observacoes}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Digite aqui as anotações do chamado"
                  className="outline-none placeholder:italic mt-1 rounded text-sm p-3 resize-none bg-gray-200 min-h-[100px] h-fit text-center grow"
                />
              </div>
              {msg.text && (
                <p className={`text-center italic ${msg.color}`}>{msg.text}</p>
              )}
              <div className="flex items-center justify-center w-full mt-4">
                {info.created ? (
                  <div className="flex flex-col gap-2">
                    <SaveButton
                      text={"SALVAR"}
                      icon={<FaSave />}
                      handleClick={saveChanges}
                    />
                    <button
                      onClick={closeCall}
                      className="p-2 bg-green-300 rounded font-bold hover:bg-green-500 hover:text-white transition duration-300 ease-in-out hover:scale-105"
                    >
                      FINALIZAR CHAMADO
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={createCall}
                    className="p-2 bg-green-300 rounded font-bold hover:bg-green-500 hover:text-white transition duration-300 ease-in-out hover:scale-105"
                  >
                    CRIAR CHAMADO DE MONITORAMENTO
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BaixaPerformanceModal;
