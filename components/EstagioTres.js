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
function EstagioTres({ infoHolder, setInfoHolder, submitLoading, submitErr }) {
  // const router = useRouter();

  // function validateFields() {
  //   if (infoHolder.nome.trim().length < 2) {
  //     setsubmitErr({
  //       field: "NOME",
  //       text: "Por favor, preencha um nome válido.",
  //     });
  //     return false;
  //   }
  //   if (infoHolder.email.trim().length < 11) {
  //     setsubmitErr({
  //       field: "EMAIL",
  //       text: "Por favor, preencha um email válido.",
  //     });
  //     return false;
  //   }
  //   if (infoHolder.telefone.trim().length < 9) {
  //     setsubmitErr({
  //       field: "TELEFONE",
  //       text: "Por favor, preencha um telefone válido.",
  //     });
  //     return false;
  //   }
  //   setsubmitErr({ field: "", text: "" });
  //   return true;
  // }
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
  // async function createSimulation() {
  //   setLoading(true);
  //   if (validateFields()) {
  //     let response = await axios.post("/api/insideSales/newLead", obj);
  //     console.log(response);
  //     if (response.status == 200) {
  //       let id = response.data.insertedId;
  //       router.push(`/publico/calculadora-solar/resultado/${id}`);
  //     } else {
  //       setLoading(false);
  //     }
  //   }
  // }
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
                submitErr.field == "NOME"
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
              name="email"
              type={"email"}
              value={infoHolder.email}
              onChange={(e) =>
                setInfoHolder({ ...infoHolder, email: e.target.value })
              }
              className={`flex-1 ${
                submitErr.field == "EMAIL"
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
                submitErr.field == "TELEFONE"
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
        {submitErr.text ? (
          <p className="text-center italic text-red-500">{submitErr.text}</p>
        ) : null}
        <div className="w-full">
          {submitLoading ? (
            <div className="flex w-[350px] justify-center items-center self-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="flex-1 w-[350px] cursor-pointer flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] hover:scale-[1.02] duration-300"
            >
              <p className="w-full m-0 text-[19px] leading-[1.2]">
                Visualizar simulação
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EstagioTres;
