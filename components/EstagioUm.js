import React, { useState } from "react";
import Image from "next/image";
import LogoSemTexto from "../utils/logoBrancoSemTexto.png";
import Logo from "../utils/logoBranco.png";

function EstagioUm({ next }) {
  const [errMessage, setErrMessage] = useState("");
  function checkFields() {
    if (clientCurrentEnergyBill < 30) {
      setErrMessage("Oops, número inválido. Por favor, preencha novamente.");
    } else {
      setErrMessage("");
      setCurrentEstagio(2);
    }
  }
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-col justify-center items-center w-[300px] lg:w-[350px] h-[146px]">
          <div className="w-full leading-none relative">
            <p className="font-normal inline m-0 text-[19px] leading-[1.2] text-[rgba(79,88,96,1)]">
              Simule a economia que você terá com um{" "}
              <strong className="font-black inline m-0 text-[19px] leading-[1.2] text-[rgba(21,89,154,1)]">
                Sistema Ampère de Energia Solar
              </strong>
              !
            </p>
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center font-normal w-[300px] lg:w-[350px] h-[146px]">
          <div className="w-full flex items-center text-[rgba(79,88,96,1)] ">
            <p className="m-0 w-[365px] text-[15px] leading-[1.2]">
              Qual o valor da sua conta de energia?
            </p>
          </div>
          <div className="w-full text-[rgba(3,11,19,1)]">
            <div className="bg-white flex items-center rounded-lg p-3 shadow-sm">
              <p className="m-0 text-[19px] leading-[1.2]">R$</p>
              <input
                type={"number"}
                className="bg-transparent outline-none flex-grow text-center"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 bg-[rgba(21,89,154,1)] hover:bg-[rgba(254,173,97,1)] hover:text-black">
            <p
              onClick={() => next()}
              className="w-full m-0 text-[19px] leading-[1.2] cursor-pointer"
            >
              Próximo
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EstagioUm;
