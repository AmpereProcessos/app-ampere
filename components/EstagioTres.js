import React from "react";
import { FaMoneyBillWaveAlt, FaSolarPanel, FaPiggyBank } from "react-icons/fa";
import { WiSolarEclipse } from "react-icons/wi";
import { ImPower } from "react-icons/im";
import Image from "next/image";
import Logo from "../utils/whitelogo.png";
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
    <div className="flex flex-col bg-[#fff] p-4 rounded">
      <div className="flex justify-center">
        <div className="w-[80px] h-[80px]">
          <Image src={Logo} />
        </div>
      </div>

      <h1 className="text-center uppercase text-[#fead61] font-bold text-xl">
        Calculadora Solar
      </h1>
      <div className="grid grid-cols-2 grid-rows-3 gap-x-10 mt-5 gap-y-2">
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">
              Economia mensal esperada
            </p>
            <FaMoneyBillWaveAlt style={{ fontSize: "30px", color: "green" }} />
          </div>
          <p className="bg-green-400 p-1 rounded-lg">R$ {necessaryEconomy}</p>
        </span>
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">
              Geração mensal necessária
            </p>
            <WiSolarEclipse style={{ fontSize: "45px", color: "yellow" }} />
          </div>
          <p className="bg-yellow-300 p-1 rounded-lg">
            {necessaryMonthlyEnergy.toFixed(2).replace(".", ",")}kWh
          </p>
        </span>
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">
              Potência do sistema
            </p>
            <ImPower style={{ fontSize: "30px", color: "blue" }} />
          </div>

          <p>{necessaryPeakPot.toFixed(2).replace(".", ",")} kWp</p>
        </span>
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">
              Número de módulos
            </p>
            <FaSolarPanel style={{ fontSize: "30px", color: "orange" }} />
          </div>
          <p>{necessaryModules} módulos</p>
        </span>
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">Área mínima</p>
            <IoIosResize style={{ fontSize: "30px", color: "red" }} />
          </div>
          <p>{necessaryArea} m²</p>
        </span>
        <span className="flex flex-col justify-between items-center font-bold p-1 border border-gray-200">
          <div className="flex flex-col items-center">
            <p className="uppercase text-center text-gray-500">
              Investimento esperado
            </p>
            <FaPiggyBank style={{ fontSize: "30px", color: "green" }} />
          </div>

          <p>R${necessaryInvestiment.replace(".", ",")}</p>
        </span>
      </div>
      <div className="flex mt-4 justify-around">
        <button
          className="bg-[#fead61] hover:bg-[#15599a] hover:text-white rounded px-3 py-2 uppercase font-bold"
          onClick={() => setCurrentEstagio(2)}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default EstagioTres;
