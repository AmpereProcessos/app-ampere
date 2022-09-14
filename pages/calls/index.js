import Link from "next/link";
import React from "react";

function Calls() {
  return (
    <div className="flex flex-col bg-gray-100 grow p-6 w-full">
      <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
        Tipos de chamados
      </h1>
      <div className="flex gap-4 mt-5 flex-wrap w-full">
        <Link href="/calls/chamadosPPS">
          <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <h1 className="text-center uppercase font-raleway">Chamados PPS</h1>
          </div>
        </Link>
        <Link href="/calls/chamadosSuporte">
          <div className="flex flex-col justify-center cursor-pointer grow min-w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
            <h1 className="text-center uppercase font-raleway">
              Chamados Suporte
            </h1>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Calls;
