import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
function Calls({ credentials, setCredentials }) {
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      }
    }
  }, []);
  return (
    <div className="flex flex-col bg-gray-100 grow p-6 w-full">
      <h1 className="text-center text-[#15599a] text-xl font-bold uppercase font-ralewayBlack">
        Tipos de chamados
      </h1>
      <div className="flex gap-4 mt-5 flex-wrap w-full">
        {credentials.accessibleRoutes != undefined &&
        credentials.accessibleRoutes.includes("PPS") ? (
          <Link href="/calls/chamadosPPS">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[300px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Suporte PPS
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes != undefined &&
        credentials.accessibleRoutes.includes("O&M") ? (
          <Link href="/calls/chamadosSuporte">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[300px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Suporte
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes != undefined &&
        credentials.accessibleRoutes.includes("Projetos") ? (
          <Link href="/calls/chamadosProjetos">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[300px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados Projetos
              </h1>
            </div>
          </Link>
        ) : (
          false
        )}
        {credentials.accessibleRoutes != undefined &&
        credentials.accessibleRoutes.includes("ADM") ? (
          <Link href="/calls/chamadosADM">
            <div className="flex flex-col justify-center cursor-pointer grow w-full lg:w-[300px] p-4 h-[250px] border border-gray-200 bg-[#fff] shadow-xl">
              <h1 className="text-center uppercase font-raleway">
                Chamados adm
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
