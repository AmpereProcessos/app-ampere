import React, { useState } from "react";
import InputMask from "react-input-mask";
import Image from "next/image";
import Logo from "../utils/whitelogo.png";
import { cities } from "../utils/constants";
function EstagioDois({ setCurrentEstagio, name, email, phone, city }) {
  const [errMessage, setErrMessage] = useState({
    message: "",
    incorrectFields: [],
  });
  const [cellPhoneMask, setCellPhoneMask] = useState("(99) 99999-9999");
  function checkFields() {
    if (name.clientName.trim().length == 0) {
      setErrMessage({
        ...errMessage,
        message:
          "Oops. Alguns campos foram preenchidos incorretamente. Por favor, preencha novamente.",
        incorrectFields: [...errMessage.incorrectFields, "Nome"],
      });
    } else if (
      email.clientEmail.trim().length == 0 &&
      phone.clientPhone.trim().length < 14
    ) {
      setErrMessage({ ...errMessage, incorrectFields: [] });
      let emailIncompleted =
        email.clientEmail.trim().length == 0 ? "Email" : null;
      let phoneIncompleted =
        phone.clientPhone.trim().length < 14 ? "Telefone" : null;
      setErrMessage({
        ...errMessage,
        message:
          "Oops. Alguns campos foram preenchidos incorretamente. Por favor, preencha novamente.",
        incorrectFields: [
          ...errMessage.incorrectFields,
          emailIncompleted,
          phoneIncompleted,
        ],
      });
    } else {
      console.log(phone.clientPhone.length);
      setCurrentEstagio(3);
    }
  }
  return (
    <div className="flex flex-col bg-[#fff] p-4 rounded">
      <div className="flex w-full justify-center">
        <div className="w-[80px] h-[80px]">
          <Image src={Logo} />
        </div>
      </div>
      <h1 className="text-center uppercase text-[#fead61] font-bold text-xl">
        Calculadora Solar
      </h1>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-center mt-2 font-raleway font-bold">
          Antes de simularmos um orçamento, precisamos de mais algumas
          informações suas, por favor, preencha os campos abaixo...
        </h1>
        <div className="flex items-center w-full gap-x-2">
          <span className="uppercase text-gray-600 font-bold">O seu nome</span>
          <input
            value={name.clientName}
            onChange={(e) => name.setClientName(e.target.value)}
            type="text"
            className={`outline-none text-center p-2 border ${
              errMessage.incorrectFields.includes("Nome")
                ? "border-red-400"
                : "border-gray-200"
            }  grow`}
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
              className={`outline-none text-center p-2 border ${
                errMessage.incorrectFields.includes("Email")
                  ? "border-red-400"
                  : "border-gray-200"
              }  grow`}
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
              className={`outline-none text-center p-2 border ${
                errMessage.incorrectFields.includes("Telefone")
                  ? "border-red-400"
                  : "border-gray-200"
              }  grow`}
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
        {errMessage.message && (
          <p className="text-sm text-center text-red-600">
            {errMessage.message}
          </p>
        )}
        <div className="flex justify-around">
          <button
            className="bg-[#fead61] hover:bg-[#15599a] hover:text-white rounded px-3 py-2 uppercase font-bold"
            onClick={() => setCurrentEstagio(1)}
          >
            Voltar
          </button>
          <button
            className="bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black rounded px-3 py-2 uppercase font-bold"
            onClick={checkFields}
          >
            Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstagioDois;
