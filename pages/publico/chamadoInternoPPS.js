import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Select from "react-select";
import { cities, ppsSolicitations, sellers, vendedores } from "../../utils/constants";
import Logo from "../../utils/images/logo-texto-azul-vertical.png";
function ChamadosPPS() {
  const [vendedorName, setVendedorName] = useState(vendedores[0].nome);
  const [svbCode, setSvbCode] = useState(0);
  const [solicitationType, setSolicitationType] = useState(ppsSolicitations[0]);
  const [solicitationDesc, setSolicitationDesc] = useState("");
  const [callCreatedMessage, setCreatedMessage] = useState("");
  const [errorsMessage, setErrorMessage] = useState({
    errorSvbCode: "",
    errorDesc: "",
  });
  function checkObligatoryFields() {
    if (svbCode == 0) {
      setErrorMessage({ ...errorsMessage, errorSvbCode: "NÚMERO INVÁLIDO" });
    } else if (solicitationDesc.trim().length == 0) {
      setSolicitationDesc({
        ...errorsMessage,
        errorsMessage: "Por favor, descreva a solicitações com mais palavras.",
      });
    } else {
      return true;
    }
  }
  function resetFields() {
    setSolicitationType(ppsSolicitations[0]);
    setSvbCode(0);
    setSolicitationDesc("");
  }
  async function handleOpenCall() {
    const obj = {
      status: "PENDENTE",
      vendedor: vendedorName,
      codigoDoProjeto: svbCode,
      observacoes: solicitationDesc,
      tipoDeSolicitacao: solicitationType,
      responsavel: "A DEFINIR",
    };
    if (checkObligatoryFields()) {
      axios.post("/api/chamados/pps/mainData", obj).then((res) => {
        setCreatedMessage(res.data);
        resetFields();
      });
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#15599a]">
      <div className="bg-background flex flex-col rounded p-4">
        <Link href="/chamados/chamadosPPS">
          <div className="flex h-[80px] w-[80px] items-center self-center">
            <Image src={Logo} />
          </div>
        </Link>
        <h1 className="font-raleway text-center text-lg font-bold text-[#fead61] uppercase">
          ABERTURA DE CHAMADO
        </h1>
        <div className="border-border mt-4 flex flex-col items-center gap-x-2 border p-2 lg:flex-row">
          <span className="text-center font-bold">VENDEDOR:</span>
          <div className="grow">
            <Select
              isMulti={false}
              placeholder="NOME DO CLIENTE"
              onChange={(e) => setVendedorName(e.value)}
              options={vendedores.map((vendedor) => {
                return {
                  label: vendedor.nome,
                  value: vendedor.nome,
                };
              })}
            />
          </div>
          {/**           <select
            value={vendedorName ? vendedorName : "NÃO DEFINIDO"}
            onChange={(e) => setVendedorName(e.target.value)}
            className="text-xs grow outline-hidden mt-2 lg:mt-0 text-center"
          >
            {vendedores.map((vendedor) => (
              <option value={vendedor.nome} key={vendedor.nome}>
                {vendedor.nome}
              </option>
            ))}
            <option value={"SETOR O&M"}>SETOR O&M</option>
            <option value={"SETOR PROJETOS"}>SETOR PROJETOS</option>
          </select>*/}
        </div>
        <div
          className={`flex flex-col gap-x-2 border lg:flex-row ${errorsMessage.errorSvbCode ? "border-red-400" : "border-border"} mt-4 p-2`}
        >
          <span className="text-center font-bold">CÓDIGO SVB:</span>
          <input
            value={svbCode}
            onChange={(e) => setSvbCode(e.target.value)}
            className="grow text-center text-sm outline-hidden placeholder:italic"
            type="number"
          />
        </div>
        <div className="border-border mt-4 flex flex-col gap-x-2 border p-2">
          <span className="text-center font-bold">TIPO DE SOLICITAÇÃO</span>
          <select
            value={solicitationType}
            onChange={(e) => setSolicitationType(e.target.value)}
            className="mt-2 text-center text-xs outline-hidden lg:mt-0"
          >
            {ppsSolicitations.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div
          className={`flex flex-col gap-x-2 border ${errorsMessage.errorDesc ? "border-red-400" : "border-border"} mt-4 p-2`}
        >
          <span className="text-center font-bold">OBSERVAÇÕES:</span>
          <textarea
            value={solicitationDesc}
            onChange={(e) => setSolicitationDesc(e.target.value)}
            placeholder={"Observações sobre a solicitação"}
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

export default ChamadosPPS;
