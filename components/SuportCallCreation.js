import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import Select from "react-select";
import { cidadesAtendidas, cities, tiposChamadosSuporte } from "../utils/constants";
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
function CreateModal({ setModalIsOpen, getCalls }) {
  const [clientes, setClientes] = useState([]);
  const [callInfo, setCallInfo] = useState({
    nomeCliente: "",
    nomeUsina: "",
    cidade: cidadesAtendidas[0],
    responsavel: "A DEFINIR",
    demanda: "NÃO DEFINIDO",
    tipoChamado: "OUTROS",
    descricaoProblema: "",
  });
  const [message, setMessage] = useState({ text: "", color: "" });
  function validateFields() {
    if (callInfo.nomeCliente.trim().length == 0) {
      setMessage({
        text: "Por favor, preencha o cliente.",
        color: "text-red-500",
      });
      return false;
    }
    if (callInfo.demanda == "NÃO DEFINIDO") {
      setMessage({
        text: "Por favor, preencha o canal de demanda",
        color: "text-red-500",
      });
      return false;
    }
    if (
      ![
        "PROBLEMAS COM CONCESSIONÁRIA",
        "GOTEIRA",
        "DISTRIBUIÇÃO DE CRÉDITOS",
        "RETRABALHO EM ESTRUTURA",
      ].includes(callInfo.tipoChamado) &&
      !callInfo.linkMonitoramento
    ) {
      setMessage({
        text: "Por favor, preencha o link monitoramento",
        color: "text-red-500",
      });
      return false;
    }
    if (callInfo.tipoChamado == "DEFEITOS E GARANTIA" && !callInfo.equipamento) {
      setMessage({
        text: "Por favor, preencha o equipamento defeituoso.",
        color: "text-red-500",
      });
      return false;
    }
    if (callInfo.descricaoProblema.trim().length < 5) {
      setMessage({
        text: "Por favor, preencha uma descrição válida.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  function createCall() {
    if (validateFields()) {
      axios
        .post("/api/chamados/suporte/mainData", {
          ...callInfo,
          abertura: new Date(),
        })
        .then((res) => {
          setMessage({ text: "CHAMADO ABERTO", color: "text-green-500" });
          setCallInfo({
            nomeCliente: "",
            nomeUsina: "",
            cidade: cidadesAtendidas[0],
            responsavel: "A DEFINIR",
            demanda: "INTERNA",
            tipoChamado: "OUTROS",
            descricaoProblema: "",
            linkMonitoramento: "",
          });
          getCalls();
        });
    }
  }
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
          <div className="flex h-full flex-col">
            <div className="border-border flex justify-between border-b px-2 pb-2 text-lg">
              <h1 className="pl-6 font-bold text-[#15599a] uppercase">ABERTURA DE CHAMADO</h1>
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
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row lg:items-center">
                <span className="text-center font-bold uppercase">Nome do cliente</span>
                <div className={"grow"}>
                  <Select
                    isMulti={false}
                    placeholder="NOME DO CLIENTE"
                    onChange={(e) =>
                      setCallInfo({
                        ...callInfo,
                        nomeCliente: e.value.nome,
                        idPai: e.value.id,
                        plano: e.value.plano,
                        cidade: e.value.cidade,
                        oemConcluido: e.value.oemConcluido,
                        equipeResp: e.value.equipeResp,
                      })
                    }
                    options={clientes.map((cliente) => {
                      return {
                        label: cliente.nomeDoContrato,
                        value: {
                          id: cliente._id,
                          nome: cliente.nomeDoContrato,
                          cidade: cliente.cidade,
                          plano: cliente.oem?.plano,
                          oemConcluido: cliente.oem?.oemConcluido,
                          equipeResp: cliente.obra.equipeResp,
                        },
                      };
                    })}
                  />
                </div>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">Nome da usina</span>
                <input
                  value={callInfo.nomeUsina}
                  onChange={(e) => setCallInfo({ ...callInfo, nomeUsina: e.target.value })}
                  className="grow text-center text-sm outline-hidden placeholder:italic"
                  type="text"
                />
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">EQUIPE RESPONSÁVEL</span>
                <p className="grow text-center text-sm">
                  {callInfo.equipeResp ? callInfo.equipeResp : "-"}
                </p>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">Cidade</span>
                <select
                  value={callInfo.cidade}
                  onChange={(e) => setCallInfo({ ...callInfo, cidade: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                >
                  {cidadesAtendidas.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">Responsável</span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) => setCallInfo({ ...callInfo, responsavel: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                >
                  <option value={"A DEFINIR"}>A DEFINIR</option>
                  <option value={"SUPORTE"}>SUPORTE</option>
                  <option value={"PÓS-VENDA"}>PÓS-VENDA</option>
                </select>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">Demanda</span>
                <select
                  value={callInfo.demanda}
                  onChange={(e) => setCallInfo({ ...callInfo, demanda: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                >
                  <option value={"INTERNA"}>INTERNA</option>
                  <option value={"EXTERNA"}>EXTERNA</option>
                  <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2">
                <span className="text-center font-bold uppercase">TIPO DE CHAMADO</span>
                <select
                  value={callInfo.tipoChamado}
                  onChange={(e) => setCallInfo({ ...callInfo, tipoChamado: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                >
                  {tiposChamadosSuporte.map((chamado) => (
                    <option key={chamado.tipo} value={chamado.tipo}>
                      {chamado.tipo}
                    </option>
                  ))}
                </select>
              </div>
              {callInfo.tipoChamado == "DEFEITOS E GARANTIA" && (
                <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                  <span className="text-center font-bold uppercase">EQUIPAMENTO DEFEITUOSO</span>
                  <select
                    value={callInfo.equipamento ? callInfo.equipamento : "NÃO DEFINIDO"}
                    onChange={(e) =>
                      setCallInfo({
                        ...callInfo,
                        equipamento: e.target.value,
                      })
                    }
                    className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
                  >
                    <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
                    <option value={"PLACA"}>PLACA</option>
                    <option value={"INVERSOR/MICRO"}>INVERSOR/MICRO</option>
                    <option value={"COMUNICADOR"}>COMUNICADOR</option>
                  </select>
                </div>
              )}
              {![
                "PROBLEMAS COM CONCESSIONÁRIA",
                "GOTEIRA",
                "DISTRIBUIÇÃO DE CRÉDITOS",
                "RETRABALHO EM ESTRUTURA",
              ].includes(callInfo.tipoChamado) && (
                <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
                  <span className="text-center font-bold uppercase">LINK DA PLANTA</span>
                  <input
                    value={callInfo.linkMonitoramento}
                    onChange={(e) =>
                      setCallInfo({
                        ...callInfo,
                        linkMonitoramento: e.target.value,
                      })
                    }
                    className="grow text-center text-sm outline-hidden placeholder:italic"
                    type="text"
                  />
                </div>
              )}
              <div className="border-border mt-4 flex flex-col gap-x-2 border p-2">
                <span className="font-raleway text-center font-bold">DESCRIÇÃO DO CHAMADO</span>
                <textarea
                  value={callInfo.descricaoProblema}
                  onChange={(e) =>
                    setCallInfo({
                      ...callInfo,
                      descricaoProblema: e.target.value,
                    })
                  }
                  placeholder="Digite aqui as anotações do chamado"
                  className="mt-1 h-fit min-h-[100px] grow resize-none rounded bg-gray-200 p-3 text-center text-sm outline-hidden placeholder:italic"
                />
              </div>
              <button
                onClick={createCall}
                className="mt-1 bg-blue-600 p-2 font-bold hover:bg-[#15599a] hover:text-white"
              >
                CRIAR CHAMADO
              </button>
              {message.text && (
                <p className={`${message.color} text-center text-sm`}>{message.text}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateModal;
