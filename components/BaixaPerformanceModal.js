import React, { useState, useEffect } from "react";
import Select from "react-select";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import axios from "axios";
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
  function createCall() {
    axios.post("/api/o&m/monitoramento", infoHolder).then((res) => {
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
              <div className="flex gap-x-2">
                <button className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm">
                  <p>Salvar alterações</p>
                  <FaSave />
                </button>
                <button>
                  <VscChromeClose
                    onClick={() => setModalIsOpen(false)}
                    style={{ color: "red" }}
                  />
                </button>
              </div>
            </div>
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
                <button
                  onClick={saveChanges}
                  className="p-2 bg-[#fead49] text-[#15599a] rounded hover:bg-[#15599a] hover:text-white font-bold"
                >
                  SALVAR
                </button>
              ) : (
                <button
                  onClick={createCall}
                  className="p-2 bg-green-300 rounded font-bold hover:bg-green-500 hover:text-white"
                >
                  CRIAR CHAMADO DE MONITORAMENTO
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BaixaPerformanceModal;
