import React from "react";

function ChamadoSuporte() {
  return (
    <section className="h-screen flex items-center justify-center bg-[#15599a]">
      <div className="flex flex-col bg-[#fff] p-4 rounded">
        <h1 className="font-bold text-center font-raleway text-lg uppercase text-[#fead61]">
          ABERTURA DE CHAMADO
        </h1>
        <div className="flex gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="font-bold">CPF/CNPJ:</span>
          <input
            className="outline-none text-sm text-center grow"
            type="text"
          />
        </div>
        <div className="flex gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="font-bold">TIPO DE PROBLEMA</span>
          <select className="text-xs">
            <option>PROBLEMA COM GERAÇÃO</option>
            <option>PROBLEMA COM PLACA</option>
            <option>PROBLEMA COM INVERSOR/MICRO</option>
          </select>
        </div>
        <div className="flex flex-col gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="font-bold text-center">DESCRIÇÃO DO PROBLEMA:</span>
          <textarea className="outline-none mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow" />
        </div>
        <div className="text-center">
          <button className="mt-2 bg-[#15599a] hover:bg-[#fead61] hover:text-[#15599a] text-white font-bold uppercase w-fit p-2 rounded">
            Enviar chamado
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChamadoSuporte;
