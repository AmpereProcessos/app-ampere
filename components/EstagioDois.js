import React, { useState } from "react";
import { FaMoneyBillWaveAlt, FaSolarPanel, FaPiggyBank } from "react-icons/fa";
import { WiSolarEclipse } from "react-icons/wi";
import { ImPower } from "react-icons/im";
import { IoIosResize } from "react-icons/io";
import InputMask from "react-input-mask";
import { cities } from "../utils/constants";
function EstagioDois({ setCurrentEstagio, name, email, phone, city }) {
  const [cellPhoneMask, setCellPhoneMask] = useState("(99) 99999-9999");
  return (
    <div className="flex flex-col bg-[#fff] p-4 rounded">
      <h1 className="text-center uppercase text-[#fead61] font-bold text-xl">
        Calculadora Solar
      </h1>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-center font-raleway font-bold">
          Antes de simular, precisamos de mais algumas informações, por favor
          preencha abaixo...
        </h1>
        <div className="flex items-center w-full gap-x-2">
          <span className="uppercase text-gray-600 font-bold">O seu nome</span>
          <input
            value={name.clientName}
            onChange={(e) => name.setClientName(e.target.value)}
            type="text"
            className="outline-none p-2 border border-gray-200 grow"
          />
        </div>
        <div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-x-2">
          <div className="flex items-center w-full gap-x-2">
            <span className="uppercase text-gray-600 font-bold">
              O seu email
            </span>
            <input
              value={email.clientEmail}
              onChange={(e) => email.setClientEmail(e.target.value)}
              type="email"
              placeholder="email@exemplo.com"
              className="outline-none p-2 border border-gray-200 grow"
            />
          </div>
          <div className="flex items-center w-full gap-x-2">
            <span className="uppercase text-gray-600 font-bold">
              O seu telefone
            </span>
            <InputMask
              type="text"
              mask={cellPhoneMask}
              maskChar=""
              value={phone.clientPhone}
              className="outline-none p-2 border text-center border-gray-200 grow"
              onBlur={(e) => {
                if (e.target.value.length === 14) {
                  setCellPhoneMask("(99) 9999-9999");
                }
              }}
              onFocus={(e) => {
                if (e.target.value.length === 14) {
                  setCellPhoneMask("(99) 99999-9999");
                }
              }}
              onChange={(e) => {
                phone.setClientPhone(e.target.value);
              }}
            ></InputMask>
          </div>
        </div>
        <div className="flex items-center w-full gap-x-2">
          <span className="uppercase text-gray-600 font-bold">Sua cidade</span>
          <select
            value={name.clientCity}
            onChange={(e) => city.setClientCity(e.target.value)}
            className="outline-none text-center p-2 border border-gray-200 grow"
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-around">
          <button
            className="bg-[#fead61] hover:bg-[#15599a] hover:text-white rounded px-3 py-2 uppercase font-bold"
            onClick={() => setCurrentEstagio(1)}
          >
            Voltar
          </button>
          <button
            className="bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black rounded px-3 py-2 uppercase font-bold"
            onClick={() => setCurrentEstagio(3)}
          >
            Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstagioDois;
