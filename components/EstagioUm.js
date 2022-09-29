import React, { useState } from "react";
import Image from "next/image";
import Logo from "../utils/whitelogo.png";
function EstagioUm({
  clientCurrentEnergyBill,
  setBillPrice,
  setCurrentEstagio,
}) {
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
    <div className="flex flex-col bg-[#fff] max-w-[350px] p-4 rounded">
      <div className="flex w-full justify-center">
        <div className="w-[80px] h-[80px]">
          <Image src={Logo} />
        </div>
      </div>
      <h1 className="text-center uppercase text-[#fead61] font-bold text-xl">
        Calculadora Solar
      </h1>
      <div className="flex flex-col">
        <h1 className="text-[#15599a] mt-2 font-bold">
          Quanto você paga hoje em energia ?
        </h1>
        <input
          value={clientCurrentEnergyBill}
          onChange={(e) => setBillPrice(e.target.value)}
          type="number"
          placeholder="Digite aqui o valor da sua fatura..."
          className={`outline-none mt-2 text-center border ${
            errMessage ? "border-red-400" : "border-gray-200"
          }  p-2`}
        />
        {errMessage && (
          <p className="text-sm text-center text-red-600">{errMessage}</p>
        )}
        <button
          onClick={checkFields}
          className="p-2 rounded mt-5 bg-[#fead61] font-bold hover:bg-[#15599a] hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default EstagioUm;
