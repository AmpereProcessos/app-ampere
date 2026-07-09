import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/images/logo-texto-azul-vertical.png";
import { cities } from "../../utils/constants";
import axios from "axios";
function ChamadoSuporte() {
  const [clientName, setClientName] = useState("");
  const [clientCity, setClientCity] = useState(cities[0].name);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [problemType, setProblemType] = useState("DÚVIDA COM GERAÇÃO");
  const [problemDesc, setProblemDesc] = useState("");
  const [errorsMessage, setErrorsMessage] = useState({
    clientNameMessage: "",
    cpfCnpjMessage: "",
    problemDescMessage: "",
  });
  const [callCreatedMessage, setCreatedMessage] = useState("");
  function resetFields() {
    setClientName("");
    setClientCity(cities[0].name);
    setCpfCnpj("");
    setProblemType("DÚVIDA COM GERAÇÃO");
    setProblemDesc("");
  }
  function checkObligatoryFields() {
    if (clientName.trim().length == 0) {
      setErrorsMessage({
        ...errorsMessage,
        clientNameMessage: "PREENCHIMENTO OBRIGATÓRIO",
      });
      setClientName("");
    } else if (cpfCnpj.trim().length < 11) {
      setErrorsMessage({
        ...errorsMessage,
        cpfCnpjMessage: "PREENCHIMENTO INVÁLIDO",
      });
      setCpfCnpj("");
    } else if (problemDesc.trim().length == 0) {
      setErrorsMessage({
        ...errorsMessage,
        problemDescMessage: "PREENCHIMENTO OBRIGATÓRIO.",
      });
      setProblemDesc("");
    } else {
      return true;
    }
  }
  async function handleOpenCall() {
    if (checkObligatoryFields()) {
      axios
        .post("/api/chamados/suporte/mainData", {
          clientName: clientName,
          clientCity: clientCity,
          cpfCnpj: cpfCnpj,
          problemType: problemType,
          problemDesc: problemDesc,
          demanda: "EXTERNA",
        })
        .then((res) => console.log(res.data));
      setErrorsMessage({
        clientNameMessage: "",
        cpfCnpjMessage: "",
        problemDescMessage: "",
      });
      resetFields();
      setCreatedMessage("CHAMADO CRIADO!");
    }
  }
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#15599a]">
      <div className="bg-background flex flex-col rounded p-4">
        <div className="flex h-[80px] w-[80px] items-center self-center">
          <Image src={Logo} />
        </div>
        <h1 className="font-raleway text-center text-lg font-bold text-[#fead61] uppercase">
          ABERTURA DE CHAMADO
        </h1>
        <div
          className={`flex flex-col gap-x-2 border lg:flex-row ${errorsMessage.clientNameMessage ? "border-red-400" : "border-border"} mt-4 p-2`}
        >
          <span className="text-center font-bold">NOME:</span>
          <input
            className="grow text-center text-sm outline-hidden placeholder:italic"
            type="text"
            value={clientName}
            placeholder={
              errorsMessage.clientNameMessage
                ? errorsMessage.clientNameMessage
                : "Nome do titular do contrato"
            }
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
          <span className="text-center font-bold">CIDADE:</span>
          <select
            value={clientCity}
            onChange={(e) => setClientCity(e.target.value)}
            className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className={`flex flex-col gap-x-2 border lg:flex-row ${errorsMessage.cpfCnpjMessage ? "border-red-400" : "border-border"} mt-4 p-2`}
        >
          <span className="text-center font-bold">CPF/CNPJ:</span>
          <input
            className="grow text-center text-sm outline-hidden placeholder:italic"
            type="text"
            value={cpfCnpj}
            placeholder={
              errorsMessage.cpfCnpjMessage
                ? errorsMessage.cpfCnpjMessage
                : "CPF/CNPJ do titular do contrato"
            }
            onChange={(e) => setCpfCnpj(e.target.value)}
          />
        </div>
        <div className="border-border mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
          <span className="text-center font-bold">TIPO DE PROBLEMA</span>
          <select
            value={problemType}
            onChange={(e) => setProblemType(e.target.value)}
            className="mt-2 text-center text-xs outline-hidden lg:mt-0"
          >
            <option value={"DÚVIDA COM GERAÇÃO"}>DÚVIDA COM GERAÇÃO</option>
            <option value={"DÚVIDA COM APLICATIVO"}>DÚVIDA COM APLICATIVO</option>
            <option value={"DÚVIDA COM CONTA DE ENERGIA"}>DÚVIDA COM CONTA DE ENERGIA</option>
            <option value={"PROBLEMA COM PLACA"}>PROBLEMA COM PLACA</option>
            <option value={"PROBLEMA COM INVERSOR/MICRO"}>PROBLEMA COM INVERSOR/MICRO</option>
            <option value={"OUTROS"}>OUTROS</option>
          </select>
        </div>
        <div
          className={`flex flex-col gap-x-2 ${errorsMessage.problemDescMessage ? "border border-red-400" : "border-border border"} mt-4 p-2`}
        >
          <span className="text-center font-bold">DESCRIÇÃO DO PROBLEMA:</span>
          <textarea
            value={problemDesc}
            onChange={(e) => setProblemDesc(e.target.value)}
            placeholder={
              errorsMessage.problemDescMessage
                ? errorsMessage.problemDescMessage
                : "Descrição da situação problema"
            }
            className="bg-primary/20 mt-1 h-fit min-h-[100px] grow resize-none rounded p-3 text-center text-sm outline-hidden placeholder:italic"
          />
        </div>
        {callCreatedMessage && (
          <p className="mt-2 text-center font-bold text-green-500 italic">{callCreatedMessage}</p>
        )}
        <div className="text-center">
          <button
            onClick={handleOpenCall}
            className="mt-2 w-fit rounded bg-[#15599a] p-2 font-bold text-white uppercase hover:bg-[#fead61] hover:text-[#15599a]"
          >
            Enviar chamado
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChamadoSuporte;
