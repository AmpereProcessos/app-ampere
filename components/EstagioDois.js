import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import LogoSemTexto from "../utils/logoBrancoSemTexto.png";
import Logo from "../utils/logoBranco.png";

function EstagioDois({ next, infoHolder, setInfoHolder }) {
  const [err, setErr] = useState({ field: null, text: "" });
  function validateFields() {
    if (infoHolder.uf?.trim().length < 2) {
      setErr({
        field: "UF",
        text: "Oops, o Estado preenchido é inválido. Por favor, preencha um Estado ou UF válido.",
      });
      return false;
    }
    if (infoHolder.cidade?.trim().length < 4) {
      setErr({
        field: "CIDADE",
        text: "Oops, a cidade preenchida é inválida. Por favor, preencha uma cidade válida.",
      });
      return false;
    } else {
      setErr({
        field: null,
        text: "",
      });
      return true;
    }
  }
  function goNext() {
    if (validateFields()) {
      next();
    }
  }
  return (
    <div className="flex flex-col h-[600px] w-full">
      <div className="w-full flex-1 gap-3 flex flex-col justify-center items-center flex-grow self-stretch text-left font-normal text-[rgba(79,88,96,1)] h-[500px]">
        <div className="flex flex-col h-[300px]">
          <div className="gap-1 flex flex-col justify-center items-center w-[300px] lg:w-[350px]">
            <div className="w-full flex items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                  Selecione seu estado
                </p>
              </div>
            </div>
            <div className="w-full">
              <input
                type={"text"}
                value={infoHolder.uf}
                onChange={(e) =>
                  setInfoHolder({
                    ...infoHolder,
                    uf: e.target.value.toUpperCase(),
                  })
                }
                className={`flex-1 ${
                  err.field == "UF"
                    ? "bg-red-200 border border-red-500"
                    : "bg-white"
                }  outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
              />
            </div>
          </div>
          <div className="gap-1 flex flex-col justify-center items-center w-[300px] lg:w-[350px]">
            <div className="w-full flex items-start self-stretch">
              <div>
                <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                  Selecione sua cidade
                </p>
              </div>
            </div>
            <div className="w-full">
              <input
                value={infoHolder.cidade}
                onChange={(e) =>
                  setInfoHolder({
                    ...infoHolder,
                    cidade: e.target.value.toUpperCase(),
                  })
                }
                className={`flex-1 ${
                  err.field == "CIDADE"
                    ? "bg-red-200 border border-red-500"
                    : "bg-white"
                } outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        {err.text ? (
          <p className="text-center italic text-red-500">{err.text}</p>
        ) : null}
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-gradient-to-l from-[rgba(13,53,92,1)] to-[rgba(21,89,154,1)] hover:scale-[1.02] duration-300">
            <p
              onClick={() => goNext()}
              className="w-full m-0 text-[19px] leading-[1.2] cursor-pointer"
            >
              Próximo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstagioDois;
