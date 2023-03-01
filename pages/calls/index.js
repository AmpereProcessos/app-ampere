import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../../context/AppContext";
function Calls() {
  const { credentials } = useContext(AppContext);
  const router = useRouter();
  return (
    <div className="flex flex-col bg-gray-100 grow p-6 w-full">
      <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
        Tipos de chamados
      </h1>
      <div className="flex gap-4 mt-5 flex-wrap w-full">
        {credentials.accessibleRoutes.includes("PPS") ||
        credentials.visualizacao == "REGIONAL" ? (
          <Link href="/calls/chamadosPPS">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Suporte PPS
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {(credentials?.accessibleRoutes?.includes("O&M") ||
          credentials?.accessibleRoutes?.includes("Pós-Venda")) &&
        credentials.visualizacao == undefined ? (
          <Link href="/calls/chamadosSuporte">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Suporte
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes.includes("Projetos") &&
        credentials.visualizacao == undefined ? (
          <Link href="/calls/chamadosProjetos">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Projetos
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes.includes("ADM") &&
        credentials.visualizacao == undefined ? (
          <Link href="/calls/chamadosADM">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados ADM
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes.includes("Suprimentos") &&
        credentials.visualizacao == undefined ? (
          <Link href="/calls/chamadosSuprimentos">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[600px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Suprimentos
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
      </div>
    </div>
  );
}

export default Calls;
