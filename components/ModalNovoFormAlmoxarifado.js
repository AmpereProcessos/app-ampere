import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import Select from "react-select";
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
function NovoFormulario({ setModalIsOpen }) {
  const [clientes, setClientes] = useState([]);
  const [callInfo, setCallInfo] = useState({
    nomeDoContrato: "",
    responsavel: "A DEFINIR",
    servico: "NÃO DEFINIDO",
  });
  const [message, setMessage] = useState("");
  function getClients() {
    axios.get("/api/projects/todos").then((res) => setClientes(res.data));
  }
  useEffect(() => {
    getClients();
  }, []);
  console.log(callInfo);
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
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CLIENTE</span>
                <div className={"grow"}>
                  <Select
                    isMulti={false}
                    placeholder="NOME DO CLIENTE"
                    onChange={(e) =>
                      setCallInfo({
                        ...callInfo,
                        nomeDoContrato: e.value.nome,
                        idPai: e.value.id,
                      })
                    }
                    options={clientes.map((cliente) => {
                      return {
                        label: cliente.nomeDoContrato,
                        value: {
                          id: cliente._id,
                          nome: cliente.nomeDoContrato,
                        },
                      };
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">
                  RESPONSÁVEL
                </span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, responsavel: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"GABRIEL STEFANO"}>GABRIEL STEFANO</option>
                  <option value={"MATHEUS OLIVEIRA"}>MATHEUS OLIVEIRA</option>
                  <option value={"DIOGO PAULINO"}>DIOGO PAULINO</option>
                </select>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <select
                  value={callInfo.servico}
                  onChange={(e) =>
                    setCallInfo({ ...callInfo, servico: e.target.value })
                  }
                  className="text-xs grow text-center outline-none mt-2 lg:mt-0"
                >
                  <option value={"PADRÃO"}>PADRÃO</option>
                  <option value={"ESTRUTURA"}>ESTRUTURA</option>
                  <option value={"MONTAGEM"}>MONTAGEM</option>
                  <option value={"MANUTENÇÃO CORRETIVA"}>
                    MANUTENÇÃO CORRETIVA
                  </option>
                  <option value={"MANUTENÇÃO PREVENTIVA"}>
                    MANUTENÇÃO PREVENTIVA
                  </option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <button className="bg-blue-600 mt-1 hover:text-white font-bold hover:bg-[#15599a] p-2">
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

export default NovoFormulario;
