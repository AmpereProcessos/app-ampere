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
          <div className="flex h-full flex-col">
            <div className="border-border flex items-center justify-between border-b pb-2">
              <h1 className="pl-6 font-bold text-[#15599a]">{info.nomeUsina}</h1>
              <button>
                <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: "red" }} />
              </button>
            </div>
            <div className="my-2 flex flex-wrap items-center justify-center gap-2">
              {infoHolder.created ? (
                infoHolder.status == "RESOLVIDO" ? (
                  <h1
                    className={`rounded border border-green-400 p-2 text-xs font-bold text-green-400`}
                  >
                    RESOLVIDO
                  </h1>
                ) : (
                  <>
                    <h1
                      onClick={() => setInfo({ ...infoHolder, status: "PENDENTE" })}
                      className={`cursor-pointer rounded border border-red-400 p-2 text-xs font-bold text-red-400 transition duration-300 ease-in-out hover:scale-105 ${
                        infoHolder.status == "PENDENTE" ? "" : "opacity-30"
                      }`}
                    >
                      PENDENTE
                    </h1>
                    <h1
                      onClick={() => setInfo({ ...infoHolder, status: "EM ANDAMENTO" })}
                      className={`cursor-pointer rounded border border-[#15599a] p-2 text-xs font-bold text-[#15599a] transition duration-300 ease-in-out hover:scale-105 ${
                        infoHolder.status == "EM ANDAMENTO" ? "" : "opacity-30"
                      }`}
                    >
                      EM ANDAMENTO
                    </h1>
                    <h1
                      onClick={() => setInfo({ ...infoHolder, status: "EXECUTADO" })}
                      className={`cursor-pointer rounded border border-yellow-500 p-2 text-xs font-bold text-yellow-500 transition duration-300 ease-in-out hover:scale-105 ${
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
            <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 flex flex-col overflow-y-auto">
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row lg:items-center">
                <span className="text-center font-bold uppercase">Nome do cliente</span>
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
                    <p className="text-foreground text-center uppercase">{info.nomeCliente}</p>
                  )}
                </div>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">CÓDIGO DO PROJETO</span>
                <p className="grow text-center text-sm">
                  {infoHolder.codProjeto ? infoHolder.codProjeto : "-"}
                </p>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold">PROBLEMA</span>
                <select
                  value={infoHolder.problema ? infoHolder.problema : "NÃO DEFINIDO"}
                  onChange={(e) => setInfo({ ...infoHolder, problema: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                >
                  <option value={"PLANO EXPIRADO"}>PLANO EXPIRADO</option>
                  <option value={"PROBLEMA COM GERAÇÃO"}>PROBLEMA COM GERAÇÃO</option>
                  <option value={"PROBLEMA COM CONEXÃO"}>PROBLEMA COM CONEXÃO</option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2">
                <span className="font-raleway text-center font-bold">OBSERVAÇÕES</span>
                <textarea
                  value={infoHolder.observacoes}
                  onChange={(e) =>
                    setInfo({
                      ...infoHolder,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Digite aqui as anotações do chamado"
                  className="mt-1 h-fit min-h-[100px] grow resize-none rounded bg-gray-200 p-3 text-center text-sm outline-hidden placeholder:italic"
                />
              </div>
              {msg.text && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
              <div className="mt-4 flex w-full items-center justify-center">
                {info.created ? (
                  <div className="flex flex-col gap-2">
                    <SaveButton text={"SALVAR"} icon={<FaSave />} handleClick={saveChanges} />
                    <button
                      onClick={closeCall}
                      className="rounded bg-green-300 p-2 font-bold transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
                    >
                      FINALIZAR CHAMADO
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={createCall}
                    className="rounded bg-green-300 p-2 font-bold transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500 hover:text-white"
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
