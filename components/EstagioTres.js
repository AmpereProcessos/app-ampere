import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";

const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function EstagioTres({ infoHolder, setInfoHolder }) {
  const router = useRouter();
  const [err, setErr] = useState({ field: null, text: "" });
  function validateFields() {
    if (infoHolder.nome.trim().length < 2) {
      setErr({ field: "NOME", text: "Por favor, preencha um nome válido." });
      return false;
    }
    if (infoHolder.email.trim().length < 11) {
      setErr({ field: "EMAIL", text: "Por favor, preencha um email válido." });
      return false;
    }
    if (infoHolder.telefone.trim().length < 9) {
      setErr({
        field: "TELEFONE",
        text: "Por favor, preencha um telefone válido.",
      });
      return false;
    }
    setErr({ field: "", text: "" });
    return true;
  }
  let obj = {
    telefone: infoHolder.telefone,
    nome: infoHolder.nome,
    responsavel: "NÃO DEFINIDO",
    cidade: infoHolder.cidade,
    canal: "CALCULADORA SOLAR",
    campanha: "",
    dataDeAquisicao: new Date(),
    consumo: infoHolder.valorFatura,
    vendedor: "NÃO DEFINIDO",
    dataDeEnvio: new Date(),
    codigoSVB: 0,
    nicho: "NÃO DEFINIDO",
    leadscoreProduto: "NÃO DEFINIDO",
    leadscoreBranding: "NÃO DEFINIDO",
  };
  async function createSimulation() {
    if (validateFields()) {
      let response = await axios.post("/api/insideSales/newLead", obj);
      console.log(response);
      if (response.status == 200) {
        let id = response.data.insertedId;
        router.push(`/publico/calculadora-solar/resultado/${id}`);
      }
    }
  }
  return (
    <div className="flex flex-col h-[400px] w-full">
      <div className="w-full flex-1 gap-3 flex flex-col justify-center items-center flex-grow self-stretch font-normal text-[rgba(79,88,96,1)] h-[300px]">
        <div className="gap-1 flex flex-col justify-center items-center text-left w-[350px]">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Seu nome
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              value={infoHolder.nome}
              onChange={(e) =>
                setInfoHolder({
                  ...infoHolder,
                  nome: e.target.value.toUpperCase(),
                })
              }
              type={"text"}
              className={`flex-1 ${
                err.field == "NOME"
                  ? "bg-red-200 border border-red-500"
                  : "bg-white"
              } outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-full">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Seu melhor e-mail
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              type={"text"}
              value={infoHolder.email}
              onChange={(e) =>
                setInfoHolder({ ...infoHolder, email: e.target.value })
              }
              className={`flex-1 ${
                err.field == "EMAIL"
                  ? "bg-red-200 border border-red-500"
                  : "bg-white"
              } outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-full">
          <div className="w-[300px] lg:w-[350px]">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Telefone
              </p>
            </div>
          </div>
          <div className="w-[300px] lg:w-[350px]">
            <input
              value={infoHolder.telefone}
              onChange={(e) =>
                setInfoHolder({
                  ...infoHolder,
                  telefone: phoneMask(e.target.value),
                })
              }
              type={"text"}
              className={`flex-1 ${
                err.field == "TELEFONE"
                  ? "bg-red-200 border border-red-500"
                  : "bg-white"
              } outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
            />
          </div>
        </div>
        <div className="gap-1 text-center w-[350px]">
          <div className="px-6 w-full h-10 flex flex-col justify-center items-center self-stretch">
            <p className="w-full text-xs m-0 leading-[1.2]">
              Fique tranquilo. Pedimos essas informações para desenvolver uma
              simulação mais exata para você!
            </p>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        {err.text ? (
          <p className="text-center italic text-red-500">{err.text}</p>
        ) : null}
        <div className="w-full">
          <div
            onClick={createSimulation}
            className="flex-1 cursor-pointer flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] hover:scale-[1.02] duration-300"
          >
            <p className="w-full m-0 text-[19px] leading-[1.2]">
              Visualizar simulação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstagioTres;
