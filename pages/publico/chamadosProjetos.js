import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import { projetistas, projetosSolicitations } from "../../utils/constants";
import axios from "axios";
import Link from "next/link";
function ChamadosPPS() {
  const [responsavel, setResponsavel] = useState("A DEFINIR");
  const [projeto, setProjeto] = useState("");
  const [tipoDoChamado, setTipoDoChamado] = useState(projetosSolicitations[0]);
  const [observacoes, setObservacoes] = useState("");
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
    setResponsavel("A DEFINIR");
    setProjeto("");
    setTipoDoChamado(projetosSolicitations[0]);
    setObservacoes("");
  }
  async function handleOpenCall() {
    let obj = {
      responsavel: responsavel,
      projeto: projeto,
      observacoes: observacoes,
      tipoDoChamado: tipoDoChamado,
    };
    axios.post("/api/calls/projetos/mainData", obj).then((res) => {
      setCreatedMessage(res.data);
      resetFields();
    });
  }
  console.log(responsavel, projeto, observacoes, tipoDoChamado);
  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#15599a]">
      <div className="flex flex-col bg-[#fff] p-4 rounded">
        <Link href="/calls/chamadosProjetos">
          <div className="flex self-center items-center h-[80px] w-[80px]">
            <Image src={Logo} />
          </div>
        </Link>
        <h1 className="font-bold text-center font-raleway text-lg uppercase text-[#fead61]">
          ABERTURA DE CHAMADO
        </h1>
        <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">ANALISTA:</span>
          <select
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
          >
            {projetistas.map((projetista) => (
              <option key={projetista.nome} value={projetista.nome}>
                {projetista.label}
              </option>
            ))}
            <option value={"A DEFINIR"}>A DEFINIR</option>
          </select>
        </div>
        <div
          className={`flex flex-col  gap-x-2 border border-gray-200 p-2 mt-4`}
        >
          <span className="text-center font-bold">NOME DO PROJETO:</span>
          <input
            value={projeto}
            onChange={(e) => setProjeto(e.target.value)}
            placeholder={"Digite aqui o nome do projeto..."}
            className="outline-none text-sm text-center grow placeholder:italic"
            type="text"
          />
        </div>
        <div className="flex flex-col  gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">TIPO DE SOLICITAÇÃO</span>
          <select
            value={tipoDoChamado}
            onChange={(e) => setTipoDoChamado(e.target.value)}
            className="text-xs outline-none mt-2 lg:mt-0 text-center"
          >
            {projetosSolicitations.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div
          className={`flex flex-col gap-x-2 border  ${
            errorsMessage.errorDesc ? "border-red-400" : "border-gray-200"
          }  p-2 mt-4`}
        >
          <span className="font-bold text-center">OBSERVAÇÕES:</span>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder={"Observações sobre a solicitação"}
            className="outline-none placeholder:italic mt-1 rounded text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow"
          />
        </div>
        {callCreatedMessage && (
          <p className="italic font-bold text-green-500 text-center mt-2">
            {callCreatedMessage}
          </p>
        )}
        <div className="text-center">
          <button
            onClick={handleOpenCall}
            className="mt-2 bg-[#15599a] hover:bg-[#fead61] hover:text-[#15599a] text-white font-bold uppercase w-fit p-2 rounded"
          >
            Enviar chamado
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChamadosPPS;
