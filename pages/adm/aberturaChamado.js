import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "../../utils/whitelogoHD.png";
import Select from "react-select";
import axios from "axios";
function AberturaChamadoADM({ credentials, setCredentials }) {
  const [clients, setClients] = useState([]);
  const [callInfo, setCallInfo] = useState({
    nomeCliente: null,
    codigoProjeto: null,
    demanda: "NÃO DEFINIDO",
    servico: "",
    observacoes: "",
    valor: null,
  });
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function getClients() {
    axios.get("/api/projects/todos").then((res) => setClients(res.data));
  }
  useEffect(() => {
    getClients();
  }, []);
  function getText(value) {
    if (value == "PAGAMENTO") {
      return "VALOR A SER PAGO";
    } else if (value == "COBRANÇA") {
      return "VALOR A COBRAR";
    } else {
      return "VALOR";
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      getClients();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        getClients();
      }
    }
  }, []);
  function resetState() {}
  function createCall() {
    if (validateInputs()) {
      axios
        .post("/api/calls/adm/mainData", {
          ...callInfo,
          usuarioEmissor: credentials.nome,
        })
        .then((res) => {
          setCallInfo({
            ...callInfo,
            demanda: "NÃO DEFINIDO",
            servico: "",
            observacoes: "",
            valor: 0,
          });
          setMsg({ text: "Chamado criado", color: "text-green-500" });
        });
    }
  }
  function validateInputs() {
    if (!callInfo.nomeCliente) {
      setMsg({
        text: "Por favor, preencha o nome do cliente",
        color: "text-red-500",
      });
      return false;
    }
    if (callInfo.demanda == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de demanda",
        color: "text-red-500",
      });
      return false;
    }
    if (!callInfo.valor) {
      setMsg({ text: "Por favor, preencha o valor", color: "text-red-500" });
      return false;
    }
    if (callInfo.servico.trim().length < 4) {
      setMsg({
        text: "Por favor, preencha o serviço prestado",
        color: "text-red-500",
      });
      return false;
    }
    if (
      callInfo.demanda == "PAGAMENTO" &&
      callInfo.nomeRecebedor.trim().length < 3
    ) {
      setMsg({
        text: "Por favor, preencha o nome do recebedor",
        color: "text-red-500",
      });
    }
    return true;
  }
  console.log(callInfo);
  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#fff]">
      <div className="flex flex-col bg-[#fff] p-4 rounded items-center w-[40%] border border-[#15599a]">
        <h1 className="text-[#15599a] font-bold text-center mt-2">
          ABERTURA DE CHAMADOS - FINANCEIRO
        </h1>
        <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 items-center mt-2 w-full">
          <span className="font-bold">NOME DO CLIENTE</span>
          <div className={"grow"}>
            <Select
              isMulti={false}
              placeholder="NOME DO CLIENTE"
              onChange={(e) =>
                setCallInfo({
                  ...callInfo,
                  nomeCliente: e.value.nome,
                  codigoProjeto: e.value.qtde,
                })
              }
              options={clients.map((cliente) => {
                return {
                  label: cliente.nomeDoContrato,
                  value: {
                    qtde: cliente.qtde,
                    nome: cliente.nomeDoContrato,
                  },
                };
              })}
            />
          </div>
        </div>
        <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 items-center mt-2 w-full">
          <span className="font-bold">DEMANDA</span>
          <select
            value={callInfo.demanda}
            onChange={(e) =>
              setCallInfo({ ...callInfo, demanda: e.target.value })
            }
            className="outline-none grow border border-gray-200 h-[36px] text-center"
          >
            <option>PAGAMENTO</option>
            <option>COBRANÇA</option>
            <option>NÃO DEFINIDO</option>
          </select>
        </div>
        <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 items-center mt-2 w-full">
          <span className="font-bold">SERVIÇO</span>
          <input
            value={callInfo.servico}
            onChange={(e) =>
              setCallInfo({
                ...callInfo,
                servico: e.target.value.toUpperCase(),
              })
            }
            className="outline-none h-[36px] font-sm border border-gray-200 p-2 text-center"
          />
        </div>
        <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 items-center mt-2 w-full">
          <span className="font-bold">{getText(callInfo.demanda)}</span>
          <input
            type={"number"}
            value={callInfo.valor}
            onChange={(e) =>
              setCallInfo({
                ...callInfo,
                valor: Number(e.target.value),
              })
            }
            className="outline-none h-[36px] font-sm border border-gray-200 p-2 text-center"
          />
        </div>
        {callInfo.demanda == "PAGAMENTO" && (
          <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 items-center mt-2 w-full">
            <span className="font-bold">NOME DO RECEBEDOR</span>
            <input
              value={callInfo.nomeRecebedor ? callInfo.nomeRecebedor : ""}
              onChange={(e) =>
                setCallInfo({
                  ...callInfo,
                  nomeRecebedor: e.target.value.toUpperCase(),
                })
              }
              className="outline-none h-[36px] font-sm border border-gray-200 p-2 text-center"
            />
          </div>
        )}
        <div className="grid grid-rows-2 grid-cols-1 items-center mt-1 w-full">
          <span className="font-bold text-center">OBSERVAÇÕES</span>
          <textarea
            value={callInfo.observacoes}
            placeholder={"OBSERVAÇÕES ADICIONAIS AQUI..."}
            onChange={(e) =>
              setCallInfo({
                ...callInfo,
                observacoes: e.target.value.toUpperCase(),
              })
            }
            className="outline-none resize-none font-sm bg-gray-100 p-2 text-center border border-gray-200"
          />
        </div>
        {msg.text && <p className={`${msg.color} my-1 italic`}>{msg.text}</p>}
        <div className="flex justify-center mt-2">
          <button
            onClick={createCall}
            className="bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded"
          >
            ABRIR CHAMADO
          </button>
        </div>
      </div>
    </section>
  );
}

export default AberturaChamadoADM;
