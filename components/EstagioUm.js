import React from "react";

function EstagioUm({
  clientCurrentEnergyBill,
  setBillPrice,
  setCurrentEstagio,
}) {
  return (
    <div className="flex flex-col bg-[#fff] p-4 rounded">
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
          className="outline-none mt-2 text-center border border-gray-200 p-2"
        />
        <button
          onClick={() => setCurrentEstagio(2)}
          className="p-2 rounded mt-5 bg-[#fead61] font-bold hover:bg-[#15599a] hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default EstagioUm;
