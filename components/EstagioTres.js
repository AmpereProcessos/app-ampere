import React from "react";
import { FaMoneyBillWaveAlt, FaSolarPanel, FaPiggyBank } from "react-icons/fa";
import { WiSolarEclipse } from "react-icons/wi";
import { ImPower } from "react-icons/im";
import Image from "next/image";
import LogoSemTexto from "../utils/logoBrancoSemTexto.png";
import Logo from "../utils/logoBranco.png";
import { IoIosResize } from "react-icons/io";
function EstagioTres({
  setCurrentEstagio,
  necessaryEconomy,
  necessaryMonthlyEnergy,
  necessaryPeakPot,
  necessaryModules,
  necessaryArea,
  necessaryInvestiment,
}) {
  return (
    <>
      <div className="w-full flex-1 gap-3 flex flex-col justify-center items-center flex-grow self-stretch font-normal text-[rgba(79,88,96,1)]">
        <div className="gap-1 flex flex-col justify-center items-center text-left w-[353px]">
          <div className="w-full flex items-start self-stretch">
            <div>
              <p className="m-0 w-[365px] text-[15px] leading-[1.2]">
                Seu nome
              </p>
            </div>
          </div>
          <div className="w-full">
            <input
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-[353px]">
          <div className="w-full flex items-start self-stretch">
            <div>
              <p className="m-0 w-[365px] text-[15px] leading-[1.2]">
                Seu melhor e-mail
              </p>
            </div>
          </div>
          <div className="w-full">
            <input
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center text-left w-[353px]">
          <div className="w-full flex items-start self-stretch">
            <div>
              <p className="m-0 w-[365px] text-[15px] leading-[1.2]">
                Telefone
              </p>
            </div>
          </div>
          <div className="w-full">
            <input
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 text-center w-[353px]">
          <div className="px-6 w-full h-10 flex flex-col justify-center items-center self-stretch">
            <p className="w-full text-xs m-0 leading-[1.2]">
              Fique tranquilo. Pedimos essas informações para desenvolver uma
              simulação mais exata para você!
            </p>
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 cursor-pointer bg-[rgba(21,89,154,1)] hover:bg-[rgba(254,173,97,1)] hover:text-black">
            <p className="w-full m-0 text-[19px] leading-[1.2]">
              Visualizar simulação
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EstagioTres;
